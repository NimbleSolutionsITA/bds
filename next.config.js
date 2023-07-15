const { i18n } = require('./next-i18next.config')

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
            'www.wpbds.nimble-lab.com',
            'wpbds.nimble-lab.com',
        ],
        loader: 'default',
    },
    i18n,
    async redirects() {
        return [
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
                source: '/:slug',
                destination: '/blog/:slug',
                permanent: true,
            },
            {
                source: '/:slug',
                has: [{ type: 'query', key: 'lang', value: 'en' }],
                destination: '/en/blog/:slug',
                permanent: true,
            },
        ]
    },
}
