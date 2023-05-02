if (!process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL) {
    throw new Error(`
        Please provide a valid WordPress instance URL.
        Add to your environment variables WORDPRESS_API_URL.
  `)
}

module.exports =  {
  reactStrictMode: true,
  swcMinify: true,
  images: {
      domains: [
          process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/)[0],
      ],
  },
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it'
  }
}
