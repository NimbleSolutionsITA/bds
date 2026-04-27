# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`bottega-di-sguardi` is a Next.js 14 (Pages Router) + TypeScript headless storefront for an Italian eyewear / niche-fragrance e-commerce. The backend is a WordPress + WooCommerce instance reached over REST and GraphQL — this app does not own product/order data, it renders and proxies it. Default locale is `it`, with `en` as the secondary locale (configured in `next-i18next.config.js`).

## Commands

```bash
npm run dev        # next dev — local HTTP dev server on $PORT (default 3000)
npm run build      # next build (postbuild auto-runs next-sitemap)
npm run start      # dotenv -c -- next start (loads .env via dotenv-cli, NOT Next's built-in)
npm run lint       # next lint (extends next/core-web-vitals)
npm run https      # node server.js — custom HTTPS server on :443 using ./localhost-key.pem and ./localhost.pem
```

There is no test runner configured.

Production is run via PM2 in cluster mode (`ecosystem.config.js`, app name `BDG`, `instances: 'max'`).

## Environment

Copy `.env.example` to `.env` before running. The app **throws at startup in `next.config.js`** if `NEXT_PUBLIC_WP_SUBDOMAIN`, `NEXT_PUBLIC_SITE_PROTOCOL`, or `NEXT_PUBLIC_DOMAIN` are missing — these are used to build the WordPress origin (`<protocol>://<wp_subdomain>.<domain>`) that drives both the API endpoints and the `next/image` `remotePatterns` allowlist.

Other required groups: WooCommerce REST (`WC_CONSUMER_KEY/SECRET`, `WC_VERSION`), Mailchimp (`MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`), PayPal (`PAYPAL_CLIENT_SECRET`, `PAYPAL_API_URL`), Google (`GOOGLE_API_KEY`, `NEXT_PUBLIC_GOOGLE_PLACE_ID*`, GA/GTM IDs), and `WORDPRESS_AUTH_REFRESH_TOKEN` / `WORDPRESS_PREVIEW_SECRET` for authenticated WP calls and preview mode.

`DISABLE_DYNAMIC_BUILD=true` toggles the in-memory cache in `src/utils/cache.ts` (see "Caching" below).

## Architecture

### Routing layout (Pages Router)

- `pages/` — top-level Next pages and `pages/api/*` route handlers. Public-facing routes mostly use Italian slugs (`occhiali-da-sole`, `occhiali-da-vista`, `negozi-ottica-firenze`, `nostra-produzione`, `eyewear-designers`, `fragranze`). The `/en` prefix is handled by Next's built-in i18n routing.
- `pages/[page]/...` and `pages/products/[slug].tsx` — catch-alls hydrated from WordPress pages and WooCommerce products. ID lists come from `getAllPagesIds`, `getAllProductsIds`, `getAllPostIds` in `src/utils/wordpress_api.ts`.
- `src/pages/` — **page-level UI components** (one folder per route family: `home`, `shop`, `product`, `checkout`, `my-area`, `dentro-diaries`, `designers`, `store`, `search`, `cookie-settings`). The `pages/*.tsx` files are thin and delegate rendering here.
- `src/components/`, `src/layout/` — shared UI. `src/layout/Layout.tsx` wraps every page; nav/cart/drawers (login, signup, search modal, in-stock notifier, newsletter) live under `src/layout/`.

### Data layer

There are **three** ways data is fetched, and which one to use depends on the call site:

1. **REST helpers in `pages/api/**`** — these files double as both Next API routes (HTTP entry points) and exported functions (`getProducts`, `getProductCategories`, `getProductTags`, `getAttributes`, `getShippingInfo`, `getProductCategory`, `googlePlaces`, …). They are imported directly during SSR/SSG, e.g. `src/utils/wordpress_api.ts` calls `getProductCategory` from `pages/api/products/categories`. Don't add a network hop where a direct import works.
2. **`src/utils/wordpress_api.ts`** — higher-level page-prop builders (`getLayoutProps`, `getShopPageProps`, `getCheckoutPageProps`, `getCategoryPageProps`, `getPageProps`, `getPosts`, `getProduct`, …). These compose the API helpers above and shape data for `getServerSideProps`/`getStaticProps`. Most return `{ layout, ... }` so the consuming page can spread it into the `<Layout>` wrapper.
3. **Apollo GraphQL client** (`src/utils/apolloClient.ts`) — points at `${WORDPRESS_SITE_URL}/graphql` with `credentials: 'include'`. Used for the few flows that need the WP GraphQL endpoint (the `<ApolloProvider>` is wired in `pages/_app.tsx`).

There's also a **custom WP plugin endpoint namespace** `/wp-json/nimble/v1/` (`getProducts` and `getProduct` hit `/nimble/v1/products` and `/nimble/v1/product`) — this is server-side code in WordPress, not in this repo. If you change query params here, the WP plugin needs to support them.

### Caching

`src/utils/cache.ts` is a process-local in-memory cache (10-minute TTL) wrapping the page-prop builders (`cacheGetLayoutProps`, `cacheGetShopPageProps`, `cacheGetProducts`, `cacheGetMenu`, …). Behavior is gated by `DISABLE_DYNAMIC_BUILD`:

- If `DISABLE_DYNAMIC_BUILD` is **unset** and the call is not marked `force`, the cache is bypassed entirely (every call fetches fresh).
- If `DISABLE_DYNAMIC_BUILD=true` **or** the helper passes `force: true`, the result is cached for 10 minutes.

The `force` flag is used for layout-shaped data that's expensive and rarely changes (menus, layout props, shipping info, attributes). When adding a new page-prop builder, decide carefully whether to wrap it here — the cache is per-process, so it warms up after deploy and doesn't survive PM2 worker restarts.

### State management

Two parallel client-side stores, both wired in `pages/_app.tsx`:

- **Redux Toolkit** (`src/redux/store.ts`) with two slices: `cartSlice` (cart items, persisted via `storage-helper.ts`) and `layoutSlice` (drawer/modal open state — login, signup, cart, search, in-stock notifier, newsletter, forgot-password). Treat the layout slice as the single source of truth for "is this drawer open?" — components dispatch `closeLogInDrawer`-style actions rather than holding local state.
- **TanStack Query** (`@tanstack/react-query`) for server-state hooks, primarily inside `src/utils/useAuth.tsx` (`AuthProvider`) which exposes the logged-in customer, orders, newsletter status, and login/logout/update-customer mutations.

### i18n

`next-i18next.config.js` declares `defaultLocale: 'it'`, `locales: ['en', 'it']`. Translation files live at `public/locales/<locale>/common.json` (only the `common` namespace is loaded — see `getSSRTranslations` in `wordpress_api.ts`). Every page that uses translations must call `getSSRTranslations(locale)` (or one of the `getXxxPageProps` helpers that bundles it) inside `getServerSideProps`/`getStaticProps`.

### Redirects

`next.config.js` ships a **large** legacy redirect table (≈400 lines) — old WP permalinks → new Next routes, with separate entries for `/en/*` variants. When renaming a route, add the redirect here rather than relying on WP rewrites. The trailing rules also proxy `/wc-inv/*`, `/wp-admin/*`, `/wp-login/*` back to the WordPress origin.

### Checkout & payments

`pages/checkout/` + `src/pages/checkout/` cover the flow. Three payment paths are wired in: PayPal (`@paypal/react-paypal-js` + server SDK; providers in `src/components/PayPalProvider.tsx` and `PayPalCheckoutProvider.tsx`), Apple Pay (`src/components/ApplePayButton.tsx`, `src/types/apple-pay-session.ts`), and Google Pay (`@google-pay/button-react`). The order is created via `pages/api/orders/index.ts` and confirmed via `pages/api/orders/webhook.ts`.

### Observability

Sentry is wired at three layers: client (`instrumentation-client.ts`), edge (`sentry.edge.config.ts`), server (`sentry.server.config.ts`). `next.config.js` is wrapped with `withSentryConfig` (org `nimble-lab`, project `bottega-di-sguardi`, source maps uploaded in CI, `tunnelRoute: '/monitoring'` to bypass ad-blockers, automatic Vercel cron monitoring on). Browser requests to Sentry go through `/monitoring` — don't add middleware that intercepts that path.

### Theming / styling

MUI v6 + Emotion. Theme is in `src/theme/theme.ts` and the SSR Emotion cache is set up in `src/theme/createEmotionCache.ts` (used by `_document.tsx` and `_app.tsx`). Global CSS in `styles/globals.css`; `styles/wordpress.scss` reproduces enough of the WP block-library look so `dangerouslySetInnerHTML`'d post/page content renders consistently with the editor.

## Conventions worth knowing

- **WooCommerce category IDs are hard-coded per locale** in `src/utils/utils.ts` (`EYEWEAR_CATEGORY`, `SUNGLASSES_CATEGORY`, `OPTICAL_CATEGORY`, `FRAGRANCES_CATEGORY`, `BOTTEGA_DI_SGUARDI_CATEGORY`, `VIBES_365_CATEGORY`, `SHOP_CATEGORIES`, …). Italian and English versions are different IDs because WPML treats them as separate taxonomy terms. When adding a new category, update both locales here.
- **Italian-first slugs** — public URLs are mostly Italian. Don't translate slugs to English unless you also add a redirect in `next.config.js`.
- HTML coming from WordPress is sanitized via `sanitize()` in `src/utils/utils.ts` (sanitize-html with a custom allowlist that keeps `style`, `id`, anchor `target/href/title`, image attrs, and all classes). Use it before any `dangerouslySetInnerHTML`.
- `tsconfig.json` has `"strict": true` but `"target": "es5"` and `"allowJs": true` — there are JS config files (`next.config.js`, `server.js`, `ecosystem.config.js`, sitemap config) that are intentionally not migrated.
