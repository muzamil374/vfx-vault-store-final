const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Basic env parser helper
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
                if (key && !key.startsWith('#')) {
                    process.env[key] = val;
                }
            }
        });
    }
}
loadEnv();

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.mp4': 'video/mp4',
    '.ico': 'image/x-icon',
    '.zip': 'application/zip'
};

const server = http.createServer(async (req, res) => {
    // 1. API route matching Vercel create-order
    if (req.url === '/api/create-order' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { bundleId, amount } = JSON.parse(body);
                const appId = process.env.CASHFREE_APP_ID;
                const secretKey = process.env.CASHFREE_SECRET_KEY;
                const mode = process.env.CASHFREE_MODE || 'sandbox'; // sandbox / production

                if (!appId || !secretKey) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Missing CASHFREE_APP_ID or CASHFREE_SECRET_KEY environment variables in .env file." }));
                }

                const uniqueOrderId = `ORD_VFX_${bundleId}_TX_${Date.now()}`;
                const apiHost = mode === 'production' ? 'api.cashfree.com' : 'sandbox.cashfree.com';
                const apiPath = '/pg/orders';

                const postData = JSON.stringify({
                    order_id: uniqueOrderId,
                    order_amount: parseFloat(amount).toFixed(2),
                    order_currency: "INR",
                    customer_details: {
                        customer_id: `USER_${Date.now()}`,
                        customer_phone: "9999999999"
                    },
                    order_meta: {
                        return_url: `http://${req.headers.host}/success/unlocked.html?bundle_id=${bundleId}&order_id={order_id}`
                    }
                });

                const options = {
                    hostname: apiHost,
                    port: 443,
                    path: apiPath,
                    method: 'POST',
                    headers: {
                        'x-client-id': appId,
                        'x-client-secret': secretKey,
                        'x-api-version': '2023-08-01',
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    }
                };

                const apiReq = https.request(options, apiRes => {
                    let responseBody = '';
                    apiRes.on('data', d => { responseBody += d; });
                    apiRes.on('end', () => {
                        try {
                            const orderData = JSON.parse(responseBody);
                            if (orderData.payment_session_id) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ payment_session_id: orderData.payment_session_id }));
                            } else {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: "Failed order generation", details: orderData }));
                            }
                        } catch (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: "Error parsing API response", details: responseBody }));
                        }
                    });
                });

                apiReq.on('error', e => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "HTTPS request failed", details: e.message }));
                });

                apiReq.write(postData);
                apiReq.end();

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid request payload" }));
            }
        });
        return;
    }

    // 2. Static file serving
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    
    // Resolve clean URL routing if file not found with original path
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
        filePath += '.html';
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 File Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`500 Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n⚡ VFX Vault local dev server running on http://localhost:${PORT}`);
    console.log(`Make sure to configure your CASHFREE_APP_ID and CASHFREE_SECRET_KEY in a .env file\n`);
});
