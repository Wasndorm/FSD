document.addEventListener('DOMContentLoaded', () => {

    let ws;
    const linkInput = document.getElementById('linkInput');
    const fetchBtn = document.getElementById('fetch');
    const pasteBtn = document.getElementById('paste');
    const ctr = document.querySelector('.ctr');
    const ldg = document.getElementById('ldg');
    const vidlink = document.getElementById('vidlink');
    const resultsContainer = document.getElementById('results-container');
    const loadingStatus = document.getElementById('loading-status');

    function resetUI() {

        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        loadingStatus.innerHTML = '';
        linkInput.value = ''; 

        ldg.style.opacity = 0;

        setTimeout(() => {
             if (ldg.style.opacity === '0') {
                ldg.style.display = 'none';
             }
        }, 500);

        ctr.style.display = 'flex';
        setTimeout(() => {
            ctr.style.transform = 'translateY(0)';
            ctr.style.opacity = '1';
            ctr.style.scale = 1;
            ctr.style.filter = "blur(0)";
        }, 20);
    }

    function connectWebSocket() {

        ws = new WebSocket('ws://localhost:8443');

        ws.onopen = () => {
            console.log('connected to ws.');
            loadingStatus.textContent = 'connected. sending link...';

            if (linkInput.value) {
                ws.send(JSON.stringify({ url: linkInput.value }));
            }
        };

        ws.onmessage = (event) => {

            const data = JSON.parse(event.data);

            if (data.error) {

                loadingStatus.textContent = `error: ${data.error} `;
                const retryButton = document.createElement('button');
                retryButton.textContent = 'Try Again';
                retryButton.className = 'format-button'; 
                retryButton.style.display = 'inline-block';
                retryButton.style.marginTop = '10px';
                retryButton.onclick = resetUI; 
                loadingStatus.appendChild(retryButton);
                return;
            }

            if (data.success) {

                ldg.style.display = 'none';
                displayResults(data);
            }
        };

        ws.onerror = (error) => {
            console.error('ws error:', error);
            loadingStatus.textContent = 'connection failed. is the server running?';
        };

        ws.onclose = () => {
            console.log('ws connection closed');
        };
    }

    function hereWeGo() {
        const url = linkInput.value.trim();
        if (!url) {
            return;
        }

        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';

        vidlink.textContent = url;

        ctr.style.transform = 'translateY(20px)';
        ctr.style.opacity = '0';
        ctr.style.scale = 0.9;
        ctr.style.filter = "blur(10px)";

        setTimeout(() => {
            ctr.style.display = 'none';
        }, 700);

        setTimeout(() => {
            ldg.style.display = 'flex';
            setTimeout(() => {
                ldg.style.opacity = 1;
                ldg.style.transform = "translateY(0px)";
                ldg.style.scale = 1;
                ldg.style.filter = "blur(0)";
                loadingStatus.textContent = 'connecting to server...';
                connectWebSocket();
            }, 20);
        }, 500);
    }

    function displayResults(data) {
        resultsContainer.innerHTML = ''; 

        const title = document.createElement('h2');
        title.textContent = data.title;
        resultsContainer.appendChild(title);

        const thumbnail = document.createElement('img');
        thumbnail.src = data.thumbnail;
        thumbnail.alt = 'Video Thumbnail';
        resultsContainer.appendChild(thumbnail);

        const formatsContainer = document.createElement('div');
        formatsContainer.className = 'formats-container';

        const videoFormatsDiv = document.createElement('div');
        videoFormatsDiv.className = 'format-list';
        videoFormatsDiv.innerHTML = '<h3>video & audio</h3>';

        const audioFormatsDiv = document.createElement('div');
        audioFormatsDiv.className = 'format-list';
        audioFormatsDiv.innerHTML = '<h3>audio</h3>';

        data.formats.forEach(format => {

            if (format.vcodec === 'none' && format.acodec !== 'none') {
                audioFormatsDiv.appendChild(createFormatButton(format, data.title));
            } else if (format.vcodec !== 'none' && format.acodec !== 'none') { 
                videoFormatsDiv.appendChild(createFormatButton(format, data.title));
            }
        });

        formatsContainer.appendChild(videoFormatsDiv);
        formatsContainer.appendChild(audioFormatsDiv);
        resultsContainer.appendChild(formatsContainer);
        resultsContainer.style.display = 'block';
    }

    function createFormatButton(format, title) {
        const a = document.createElement('a');
        const resolution = format.resolution ? format.resolution : 'audio';
        const filesize = format.filesize_approx ? `(${(format.filesize_approx / 1024 / 1024).toFixed(2)} MB)` : '';

        a.href = format.url;
        a.textContent = `${format.ext} - ${format.format_note || resolution} ${filesize}`;
        a.className = 'format-button';
        a.setAttribute('download', `${title}.${format.ext}`); 
        a.setAttribute('target', '_blank'); 
        a.setAttribute('rel', 'noopener noreferrer');
        return a;
    }

    fetchBtn.addEventListener('click', hereWeGo);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            hereWeGo();
        }
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            linkInput.value = text;
            linkInput.dispatchEvent(new Event('input'));
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    });

    document.body.addEventListener('dragover', (e) => {
        e.preventDefault(); 
    });

    document.body.addEventListener('drop', (e) => {
        e.preventDefault();
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
            linkInput.value = text;
            linkInput.dispatchEvent(new Event('input'));

            hereWeGo();
        }
    });

    linkInput.addEventListener('input', () => {
        if (linkInput.value.trim() !== '') {
            fetchBtn.style.display = 'flex';
            requestAnimationFrame(() => {
                fetchBtn.style.right = '68px';
                fetchBtn.style.opacity = '1';
            });
        } else {
            fetchBtn.style.right = '0';
            fetchBtn.style.opacity = '0';
            fetchBtn.addEventListener('transitionend', () => {
                if (linkInput.value.trim() === '') {
                    fetchBtn.style.display = 'none';
                }
            }, { once: true });
        }
    });

    const menu = document.getElementById('menu');
    const sidebar = document.querySelector('sidebar');
    const shit = document.querySelector('shit');
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.style.display = 'flex';
        setTimeout(() => {
            sidebar.style.opacity = '1';
            sidebar.style.transform = 'translateX(0)';
            sidebar.style.transition = 'cubic-bezier(.16,.91,0,1) 0.6s';
            shit.style.transition = 'cubic-bezier(.16,.91,0,1) 0.6s';
            shit.style.opacity = '1';
            shit.style.pointerEvents = 'auto';
        }, 10);
    });

    function closeSidebar() {
        sidebar.style.opacity = '0';
        sidebar.style.transform = 'translateX(40%)';
        sidebar.style.transition = '0.6s cubic-bezier(.76,.01,0,1)';
        shit.style.transition = '0.6s cubic-bezier(.76,.01,0,1)';
        shit.style.opacity = '0';
        shit.style.pointerEvents = 'none';
        sidebar.addEventListener('transitionend', function handler() {
            if (sidebar.style.opacity === '0') {
                sidebar.style.display = 'none';
            }
            sidebar.removeEventListener('transitionend', handler);
        });
    }

    shit.addEventListener('click', closeSidebar);
    sidebar.addEventListener('click', (e) => e.stopPropagation());

    let isDragging = false, startX, currentTranslateX;
    sidebar.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        sidebar.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diffX = e.clientX - startX;
        if (diffX > 0) {
            sidebar.style.transform = `translateX(${diffX}px)`;
        }
    });
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        sidebar.style.transition = 'cubic-bezier(.14,.82,0,.99) 1s';
        const threshold = sidebar.offsetWidth / 2.5;
        if (sidebar.style.transform && parseInt(sidebar.style.transform.split('(')[1]) > threshold) {
            closeSidebar();
        } else {
            sidebar.style.transform = 'translateX(0)';
        }
    });
});

function openUp(url) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
}