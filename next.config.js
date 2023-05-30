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
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'wpbdg.nimble-lab.com',
              port: '',
              pathname: '/wp-content/uploads/**',
          },
      ],
  },
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it'
  }
}
