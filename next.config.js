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
  i18n
}
