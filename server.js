const { WebSocketServer } = require('ws');
const ytDlpExec = require('yt-dlp-exec');
const http = require('http');
const express = require('express');
const path = require('path');

const port = 8443; // which port to host the server at?
const webServer = 'true'; // also host web server?

let server;

if (webServer) {
    const app = express();
    server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

    console.log('express server enabled');
} else {
    server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ws running, no web server is configured.');
    });
    console.log('this server has no web server configured.');
}

const wss = new WebSocketServer({ server });

console.log('websocket is online. hosted at ', port);

wss.on('connection', (ws) => {
 //   console.log('someone here');

    ws.on('message', async (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            console.error('Invalid JSON received:', message);
            ws.send(JSON.stringify({ error: 'client sent invalid req.' }));
            return;
        }

        const videoUrl = parsedMessage.url;

        if (!videoUrl || typeof videoUrl !== 'string') {
            ws.send(JSON.stringify({ error: 'no url provided.' }));
            return;
        }

        const urlRegex = /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        if (!urlRegex.test(videoUrl)) {
            ws.send(JSON.stringify({ error: 'invalid url format.' }));
            return;
        }

  //      console.log(`im fetching: ${videoUrl}`);

        try {
            const videoInfo = await ytDlpExec(videoUrl, {
                dumpJson: true
            });

            ws.send(JSON.stringify({
                success: true,
                title: videoInfo.title,
                thumbnail: videoInfo.thumbnail,
                formats: videoInfo.formats
            }));

        } catch (error) {
            console.error(`yt-dlp-exec error: ${error.message}`);
            ws.send(JSON.stringify({
                error: 'failed to fetch. perhaps invalid url, network error or unsupported type.'
            }));
        }
    });

    ws.on('close', () => {
 //       console.log('someone quit');
    });

    ws.on('error', (error) => {
//        console.error('websocket error:', error);
    });
});

server.listen(port, () => {
    console.log(`webserver online. hosted at ${port}`);
});
