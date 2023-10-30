const { i18n } = require('./next-i18next.config')
const path = require('path')

if (!process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL) {
    throw new Error(`
        Please provide a valid WordPress instance URL.
        Add to your environment variables WORDPRESS_API_URL.
  `)
}

module.exports =  {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: [
            'www.wp.bottegadisguardi.com',
            'wp.bottegadisguardi.com',
        ],
        loader: 'default',
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    i18n,
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.bottegadisguardi.com' }],
                destination: 'https://bottegadisguardi.com/:path*',
                permanent: true
            },
            {
                source: '/shop/:mainCategory/:brand/:slug',
                destination: '/products/:slug',
                permanent: true,
            },
            {
                source: '/shop/:mainCategory/:brand/:slug',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/products/:slug',
                permanent: true,
            },
            {
                source: '/designers',
                destination: '/eyewear-designers',
                permanent: true,
            },
            {
                source: '/designers',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/eyewear-designers',
                permanent: true,
            },
            {
                source: '/eyewar-designers/bottega-di-sguardi',
                destination: '/nostra-produzione/bottega-di-sguardi',
                permanent: true,
            },
            {
                source: '/en/eyewar-designers/bottega-di-sguardi',
                destination: '/en/nostra-produzione/bottega-di-sguardi',
                permanent: true,
            },
            {
                source: '/eyewar-designers/bottega-di-sguardi-horn-collections',
                destination: '/nostra-produzione/bottega-di-sguardi-horn-collections',
                permanent: true,
            },
            {
                source: '/en/eyewar-designers/bottega-di-sguardi-horn-collections',
                destination: '/en/nostra-produzione/bottega-di-sguardi-horn-collections',
                permanent: true,
            },
            {
                source: '/eyewar-designers/vibes365',
                destination: '/nostra-produzione/vibes365',
                permanent: true,
            },
            {
                source: '/en/eyewar-designers/vibes365',
                destination: '/en/nostra-produzione/vibes365',
                permanent: true,
            },
            {
                source: '/category/eyewear/bottega-di-sguardi',
                destination: '/nostra-produzione/bottega-di-sguardi',
                permanent: true,
            },
            {
                source: '/category/eyewear/bottega-di-sguardi',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/nostra-produzione/bottega-di-sguardi',
                permanent: true,
            },
            {
                source: '/category/eyewear/bottega-di-sguardi-horn-collections',
                destination: '/nostra-produzione/bottega-di-sguardi-horn-collections',
                permanent: true,
            },
            {
                source: '/category/eyewear/bottega-di-sguardi-horn-collections',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/nostra-produzione/bottega-di-sguardi-horn-collections',
                permanent: true,
            },
            {
                source: '/category/eyewear/vibes365',
                destination: '/nostra-produzione/vibes365',
                permanent: true,
            },
            {
                source: '/category/eyewear/vibes365',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/nostra-produzione/vibes365',
                permanent: true,
            },
            {
                source: '/category/eyewear/:slug',
                destination: '/eyewear-designers/:slug',
                permanent: true,
            },
            {
                source: '/category/eyewear/:slug',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/eyewear-designers/:slug',
                permanent: true,
            },
            {
                source: '/category/profumum-roma',
                destination: '/profumum-roma',
                permanent: true,
            },
            {
                source: '/category/profumum-roma',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/profumum-roma',
                permanent: true,
            },
            {
                source: '/category/profumum-roma/:slug',
                destination: '/profumum-roma/:slug',
                permanent: true,
            },
            {
                source: '/category/profumum-roma/:slug',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/profumum-roma/:slug',
                permanent: true,
            },
            {
                source: '/category/liquides-imaginaires',
                destination: '/liquides-imaginaires',
                permanent: true,
            },
            {
                source: '/category/liquides-imaginaires',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/liquides-imaginaires',
                permanent: true,
            },
            {
                source: '/category/liquides-imaginaires/:slug',
                destination: '/liquides-imaginaires/:slug',
                permanent: true,
            },
            {
                source: '/category/liquides-imaginaires/:slug',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/liquides-imaginaires/:slug',
                permanent: true,
            },
            {
                source: '/store',
                destination: '/negozi-ottica-firenze',
                permanent: true,
            },
            {
                source: '/store',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/negozi-ottica-firenze',
                permanent: true,
            },
            {
                source: "/kool-with-a-k-projekt-produkt-3",
                destination: '/blog/kool-with-a-k-projekt-produkt-3',
                permanent: true,
            },
            {
                source: "/kool-with-a-k-projekt-produkt-2",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/kool-with-a-k-projekt-produkt-2',
                permanent: true,
            },
            {
                source: "/mothers-day-gift-guide",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/mothers-day-gift-guide',
                permanent: true,
            },
            {
                source: "/guida-ai-regali-per-la-festa-della-mamma",
                destination: '/blog/guida-ai-regali-per-la-festa-della-mamma',
                permanent: true,
            },
            {
                source: "/larte-delle-lenti-transition",
                destination: '/blog/larte-delle-lenti-transition',
                permanent: true,
            },
            {
                source:  "/the-art-of-transition",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/the-art-of-transition',
                permanent: true,
            },
            {
                source:  "/jacques-marie-mage-the-last-frontier",
                destination: '/blog/jacques-marie-mage-the-last-frontier',
                permanent: true,
            },
            {
                source: "/jacques-marie-mage-the-last-frontier",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/jacques-marie-mage-the-last-frontier',
                permanent: true,
            },
            {
                source: "/essilor-firenze-le-lenti-progressive-tecnologicamenteadvanced",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/essilor-firenze-le-lenti-progressive-tecnologicamenteadvanced',
                permanent: true,
            },
            {
                source: "/essilor-firenze-le-lenti-progressive-tecnologicamenteavanzate",
                destination: '/blog/essilor-firenze-le-lenti-progressive-tecnologicamenteavanzate',
                permanent: true,
            },
            {
                source: "/vi-presentiamo-gli-occhiali-valentino",
                destination: '/blog/vi-presentiamo-gli-occhiali-valentino',
                permanent: true,
            },
            {
                source: "/ottica-firenze-centro-scopri-un-centro-specializzatonelloftalmica",
                destination: '/blog/ottica-firenze-centro-scopri-un-centro-specializzatonelloftalmica',
                permanent: true,
            },
            {
                source: "/ottica-firenze-centro-scopri-un-centro-specializzatonelloftalmica",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/ottica-firenze-centro-scopri-un-centro-specializzatonelloftalmica',
                permanent: true,
            },
            {
                source: "/kool-with-a-k-projekt-produkt",
                destination: '/blog/kool-with-a-k-projekt-produkt',
                permanent: true,
            },
            {
                source: "/kool-with-a-k-projekt-produkt",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/blog/kool-with-a-k-projekt-produkt',
                permanent: true,
            },
            {
                source: "/all-eyes-on-balmain-eyewear",
                destination: '/blog/all-eyes-on-balmain-eyewear',
                permanent: true,
            },
            {
                source: "/all-eyes-on-balmain-eyewear",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/all-eyes-on-balmain-eyewear',
                permanent: true,
            },
            {
                source: "/fathers-day-gift-guide",
                destination: '/blog/fathers-day-gift-guide',
                permanent: true,
            },
            {
                source: "/fathers-day-gift-guide",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/fathers-day-gift-guide',
                permanent: true,
            },
            {
                source: "/occhiali-fellini",
                destination: '/blog/occhiali-fellini',
                permanent: true,
            },
            {
                source: "/occhiali-fellini",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/occhiali-fellini',
                permanent: true,
            },
            {
                source: "/iconic-eyewear-fashion-eyewear-between-vips-and-movies-famous",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/iconic-eyewear-fashion-eyewear-between-vips-and-movies-famous',
                permanent: true,
            },
            {
                source: "/occhiali-iconici-il-fashion-eyewear-tra-vip-e-filmfamosi",
                destination: '/blog/occhiali-iconici-il-fashion-eyewear-tra-vip-e-filmfamosi',
                permanent: true,
            },
            {
                source: "/limited-edition-sunglasses",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/limited-edition-sunglasses',
                permanent: true,
            },
            {
                source: "/occhiali-da-sole-limited-edition",
                destination: '/blog/occhiali-da-sole-limited-edition',
                permanent: true,
            },
            {
                source: "/japanese-glasses",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/japanese-glasses',
                permanent: true,
            },
            {
                source: "/occhiali-giapponesi",
                destination: '/blog/occhiali-giapponesi',
                permanent: true,
            },
            {
                source: "/italian-niche-perfumes-the-best-artisan-fragrances",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/italian-niche-perfumes-the-best-artisan-fragrances',
                permanent: true,
            },
            {
                source: "/profumi-nicchia-italiani",
                destination: '/blog/profumi-nicchia-italiani',
                permanent: true,
            },
            {
                source: "/progressive-lenses-in-florence",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/progressive-lenses-in-florence',
                permanent: true,
            },
            {
                source: "/lenti-progressive-firenze",
                destination: '/blog/lenti-progressive-firenze',
                permanent: true,
            },
            {
                source: "/blue-control-lenses-in-florence-what-they-are-and-where-to-find-them",
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/blue-control-lenses-in-florence-what-they-are-and-where-to-find-them',
                permanent: true,
            },
            {
                source: "/lenti-blue-control-firenze",
                destination: '/blog/lenti-blue-control-firenze',
                permanent: true,
            },
        ]
    },
}