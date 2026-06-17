/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://bottegadisguardi.com',
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    // File unico: niente indice + sitemap-0, ma un solo /sitemap.xml con tutti
    // gli URL (sotto sitemapSize) -> Google fa una sola richiesta.
    generateIndexSitemap: false,
    generateRobotsTxt: true,
    exclude: ['/my-area'],
    // Default transformation function
    transform: async (config, path) => {
        return {
            loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            alternateRefs: config.alternateRefs ?? [],
        }
    },
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ]
    },
}