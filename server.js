const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Read the certificate files
const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
    const NEXT_SITE_HOSTNAME = (process.env.NEXT_PUBLIC_SITE_SUBDOMAIN ?
        process.env.NEXT_PUBLIC_SITE_SUBDOMAIN + '.' : '') + process.env.NEXT_PUBLIC_DOMAIN;

    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);

        // Ensure the host header is set to the correct domain
        req.headers.host = NEXT_SITE_HOSTNAME;

        handle(req, res, parsedUrl);
    }).listen(443, err => {
        if (err) throw err;
        console.log(`> Ready on https://${NEXT_SITE_HOSTNAME}`);
    });
});
