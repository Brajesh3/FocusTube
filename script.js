document.addEventListener('DOMContentLoaded', () => {
    const embedForm = document.getElementById('embedForm');
    const youtubeLinkInput = document.getElementById('youtubeLink');
    const errorMessage = document.getElementById('errorMessage');
    const resultSection = document.getElementById('resultSection');
    const videoContainer = document.getElementById('videoContainer');
    const iframeCodeDisplay = document.getElementById('iframeCodeDisplay');
    const copyButton = document.getElementById('copyButton');

    // Handle form submit
    embedForm.addEventListener('submit', (e) => {
        e.preventDefault();
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
            showError('Invalid YouTube link. Please check the URL and try again.');
            hideResult();
        }
    });

    // Copy to clipboard
    copyButton.addEventListener('click', async () => {
        const code = iframeCodeDisplay.textContent;
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            setCopySuccessState();
        } catch (err) {
            // Fallback for older browsers or permission issues
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
                console.error('Fallback copy failed', fallbackErr);
            }
            document.body.removeChild(textarea);
        }
    });

    // Helper: Parse YouTube URL for video ID, Shorts ID, or Playlist ID
    function parseYouTubeUrl(url) {
        const hasPlaylist = url.includes('list=');
        const hasVideo = url.match(/(?:v=|shorts\/|youtu\.be\/)/);

        // Explicit playlist page/URL
        if (url.includes('/playlist') || (hasPlaylist && !hasVideo)) {
            const playlistMatch = url.match(/[?&]list=([^#\&\?]+)/);
            if (playlistMatch) {
                return { type: 'playlist', id: playlistMatch[1] };
            }
        }

        // Standard video, short, or embed URL
        // Matches 11 character alphanumeric strings with dashes/underscores
        const videoRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const videoMatch = url.match(videoRegex);

        if (videoMatch) {
            return { type: 'video', id: videoMatch[1] };
        }

        // Fallback for mixed URLs with list parameter
        if (hasPlaylist) {
            const playlistMatch = url.match(/[?&]list=([^#\&\?]+)/);
            if (playlistMatch) {
                return { type: 'playlist', id: playlistMatch[1] };
            }
        }

        return null;
    }

    // Helper: Render iframe and display source code
    function renderEmbed({ type, id }) {
        let embedUrl = '';
        if (type === 'video') {
            embedUrl = `https://www.youtube.com/embed/${id}`;
        } else if (type === 'playlist') {
            embedUrl = `https://www.youtube.com/embed/videoseries?list=${id}`;
        }

        const iframeHtml = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        
        videoContainer.innerHTML = iframeHtml;
        iframeCodeDisplay.textContent = iframeHtml;
        
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Helper: Show error messages
    function showError(message) {
        errorMessage.textContent = message;
    }

    // Helper: Clear error messages
    function clearError() {
        errorMessage.textContent = '';
    }

    // Helper: Hide the output area
    function hideResult() {
        resultSection.classList.add('hidden');
        videoContainer.innerHTML = '';
        iframeCodeDisplay.textContent = '';
    }

    // Helper: Transition button to copied success state
    function setCopySuccessState() {
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copied');
        
        setTimeout(() => {
            copyButton.textContent = 'Copy Code';
            copyButton.classList.remove('copied');
        }, 2000);
    }
});