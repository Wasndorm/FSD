# FuckingSimpleDownloader
A Node.js &amp; HTML-based video scraper that uses yt-dlp to download videos from any website.

Visit the official website [here](https://fsd.10113.icu/).

## Features
- drag & drop url instantly fetch the link
- text input to insert the link
  - enter to fetch or click onto "fetch" button
- get thumbnail and title of the video
- download video and audio directly from the origin server 
## Self-Hosting
```bash
git clone https://github.com/Wasndorm/FSD.git
cd FSD
npm i
npm run
```
The port is set to **8443** and web-server is **enabled** by default.


Can be changed by editing `port` and `webServer` variables.
## Known Bugs
- Animations should be improved.
- Sometimes YouTube formats are not provided from the server correctly.
  - (e.g. options other than 360p is not available, etc.)
## TO-DO
- insert link to fetch after the host url
  - e.g. fsd.10113.icu/https://videowebsite/watch/abcdef123
- ctrl + v even without input focus to fetch link
- server-side option for rate-limits
