# DO NOT USE THIS
### I will be maintaining this project with low priority and as a hobby, so do not rely on this since there are lots of better options. This warning will be removed when the project is stable enough and ready for production. You can fork to use it as a base for your own project.

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
- Website is not responsive.
  - The reason behind is that this is a quick-made project. I am aiming to improve and develop it more over time.
## TO-DO
- insert link to fetch after the host url
  - e.g. fsd.10113.icu/https://videowebsite/watch/abcdef123
- ctrl + v even without input focus to fetch link
- server-side option for rate-limits
