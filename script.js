document.addEventListener('DOMContentLoaded', () => {
    const embedForm = document.getElementById('embedForm');
    const youtubeLinkInput = document.getElementById('youtubeLink');
    const errorMessage = document.getElementById('errorMessage');
    const resultSection = document.getElementById('resultSection');
    const videoContainer = document.getElementById('videoContainer');
    const iframeCodeDisplay = document.getElementById('iframeCodeDisplay');
    const copyButton = document.getElementById('copyButton');
    const pasteButton = document.getElementById('pasteButton');
    const focusModeBtn = document.getElementById('focusModeBtn');
    const exitFocusBtn = document.getElementById('exitFocusBtn');
    
    const autoplayToggle = document.getElementById('autoplayToggle');
    const loopToggle = document.getElementById('loopToggle');

    // Handle form submit
    embedForm.addEventListener('submit', (e) => {
        e.preventDefault();
        triggerEmbed();
    });

    // Handle paste button action
    pasteButton.addEventListener('click', async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
                youtubeLinkInput.value = clipboardText.trim();
                triggerEmbed();
            }
        } catch (err) {
            showError('Unable to read clipboard. Please paste the link manually.');
        }
    });

    // Focus Mode toggles
    focusModeBtn.addEventListener('click', () => {
        document.body.classList.add('focus-active');
    });

    exitFocusBtn.addEventListener('click', () => {
        document.body.classList.remove('focus-active');
    });

    // Keyboard listener to escape focus mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('focus-active')) {
            document.body.classList.remove('focus-active');
        }
    });

    // Copy iframe code to clipboard
    copyButton.addEventListener('click', async () => {
        const code = iframeCodeDisplay.textContent;
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            setCopySuccessState();
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = code;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setCopySuccessState();
            } catch (fallbackErr) {
                console.error('Copy fallback failed', fallbackErr);
            }
            document.body.removeChild(textarea);
        }
    });

    // Auto-parse on page load if query parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const queryUrl = urlParams.get('url') || urlParams.get('v');
    if (queryUrl) {
        youtubeLinkInput.value = decodeURIComponent(queryUrl);
        triggerEmbed();
    }

    // Main embed logic controller
    function triggerEmbed() {
        const url = youtubeLinkInput.value.trim();
        
        if (!url) {
            showError('Please enter a YouTube link.');
            return;
        }

        const embedInfo = parseYouTubeUrl(url);
        
        if (embedInfo) {
            clearError();
            renderEmbed(embedInfo);
        } else {
            showError('Invalid YouTube URL. Please verify and try again.');
            hideResult();
        }
    }

    // Parse YouTube URL (Video, Shorts, Playlists)
    function parseYouTubeUrl(url) {
        const hasPlaylist = url.includes('list=');
        const hasVideo = url.match(/(?:v=|shorts\/|youtu\.be\/)/);

        // 1. Explicit playlist page or URL containing playlist ID without active video
        if (url.includes('/playlist') || (hasPlaylist && !hasVideo)) {
            const playlistMatch = url.match(/[?&]list=([^#\&\?]+)/);
            if (playlistMatch) {
                return { type: 'playlist', id: playlistMatch[1] };
            }
        }

        // 2. Standard video, shorts, or short link
        // Matches the 11 character alphanumeric video ID
        const videoRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const videoMatch = url.match(videoRegex);

        if (videoMatch) {
            return { type: 'video', id: videoMatch[1] };
        }

        // 3. Fallback for playlist URL with video details
        if (hasPlaylist) {
            const playlistMatch = url.match(/[?&]list=([^#\&\?]+)/);
            if (playlistMatch) {
                return { type: 'playlist', id: playlistMatch[1] };
            }
        }

        return null;
    }

    // Generate and render iframe code based on URL type and custom selections
    function renderEmbed({ type, id }) {
        const autoplay = autoplayToggle.checked;
        const loop = loopToggle.checked;
        
        // Base embed parameters for distraction-free watching:
        // rel=0: only show related videos from the same channel
        // iv_load_policy=3: hide annotations
        // modestbranding=1: hide logo
        let queryParams = `rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;
        
        if (autoplay) {
            queryParams += `&autoplay=1`;
        }
        
        if (type === 'video') {
            if (loop) {
                // Loop parameters for single videos require a playlist parameter referencing the video ID
                queryParams += `&loop=1&playlist=${id}`;
            }
            const embedUrl = `https://www.youtube.com/embed/${id}?${queryParams}`;
            generateIframe(embedUrl);
        } else if (type === 'playlist') {
            if (loop) {
                queryParams += `&loop=1`;
            }
            const embedUrl = `https://www.youtube.com/embed/videoseries?list=${id}&${queryParams}`;
            generateIframe(embedUrl);
        }
    }

    // Inject iframe element and display raw markup
    function generateIframe(url) {
        const iframeMarkup = `<iframe src="${url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        
        videoContainer.innerHTML = iframeMarkup;
        iframeCodeDisplay.textContent = iframeMarkup;
        
        resultSection.classList.remove('hidden');
        
        if (window.innerWidth <= 640) {
            document.body.classList.add('focus-active');
        } else {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
    }

    function clearError() {
        errorMessage.textContent = '';
    }

    function hideResult() {
        resultSection.classList.add('hidden');
        videoContainer.innerHTML = '';
        iframeCodeDisplay.textContent = '';
    }

    function setCopySuccessState() {
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
            copyButton.textContent = 'Copy Code';
            copyButton.classList.remove('copied');
        }, 2000);
    }
});