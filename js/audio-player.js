/* Audio Player Logic */
function initAudioPlayer() {
    const trackItems = document.querySelectorAll('.track-item');
    const mainAudio = new Audio();
    let currentBtn = null;
    let currentTrackTitle = "";

    // Master Player Elements
    const masterPlayBtn = document.getElementById('master-play-btn');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const masterTrackTitle = document.getElementById('master-track-title');
    const masterPlayer = document.querySelector('.master-player');

    // Helper: Format Time
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Helper: Reset Player UI
    function resetUI() {
        if (currentBtn) {
            currentBtn.textContent = '▶';
            currentBtn.classList.remove('playing');
            currentBtn.closest('.track-item').style.backgroundColor = '';
        }
        if (masterPlayBtn) masterPlayBtn.textContent = '▶';
    }

    // Helper: Update Master Player Info
    function updateMasterPlayer(title) {
        if (masterTrackTitle) masterTrackTitle.textContent = title || "Select a track...";
        if (seekBar) seekBar.value = 0;
        if (currentTimeEl) currentTimeEl.textContent = "0:00";
        if (durationEl) durationEl.textContent = "0:00";
    }

    // Function to play a specific source
    function playTrack(src, btn, title) {
        // If clicking the same playing track -> Pause
        if (currentBtn === btn && !mainAudio.paused) {
            mainAudio.pause();
            btn.textContent = '▶';
            btn.classList.remove('playing');
            if (masterPlayBtn) masterPlayBtn.textContent = '▶';
            return;
        }

        // If clicking the same paused track -> Resume
        if (currentBtn === btn && mainAudio.paused) {
            mainAudio.play();
            btn.textContent = '⏸';
            btn.classList.add('playing');
            if (masterPlayBtn) masterPlayBtn.textContent = '⏸';
            return;
        }

        // Changing track
        resetUI();

        if (src) {
            mainAudio.src = src;
            mainAudio.play();
            btn.textContent = '⏸';
            btn.classList.add('playing');
            currentBtn = btn;
            currentTrackTitle = title;
            updateMasterPlayer(title);

            // Visual highlight
            btn.closest('.track-item').style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            if (masterPlayBtn) masterPlayBtn.textContent = '⏸';

            // Reveal master player if hidden
            if (masterPlayer) masterPlayer.classList.remove('hidden-player');
        }
    }

    // LIST LISTENERS
    trackItems.forEach(item => {
        const btn = item.querySelector('.play-btn');
        const src = item.getAttribute('data-src');
        const title = item.querySelector('.track-title').textContent;

        btn.addEventListener('click', () => {
            playTrack(src, btn, title);
        });
    });

    // MASTER PLAYER LISTENERS
    if (masterPlayBtn) {
        masterPlayBtn.addEventListener('click', () => {
            if (mainAudio.src) {
                if (mainAudio.paused) {
                    mainAudio.play();
                    masterPlayBtn.textContent = '⏸';
                    if (currentBtn) {
                        currentBtn.textContent = '⏸';
                        currentBtn.classList.add('playing');
                    }
                } else {
                    mainAudio.pause();
                    masterPlayBtn.textContent = '▶';
                    if (currentBtn) {
                        currentBtn.textContent = '▶';
                        currentBtn.classList.remove('playing');
                    }
                }
            }
        });
    }

    // AUDIO EVENTS
    mainAudio.addEventListener('timeupdate', () => {
        if (mainAudio.duration) {
            const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
            if (seekBar) seekBar.value = progress;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(mainAudio.currentTime);
            if (durationEl) durationEl.textContent = formatTime(mainAudio.duration);
        }
    });

    mainAudio.addEventListener('loadedmetadata', () => {
        if (durationEl) durationEl.textContent = formatTime(mainAudio.duration);
    });

    mainAudio.addEventListener('ended', () => {
        resetUI();
        if (seekBar) seekBar.value = 0;
        if (currentTimeEl) currentTimeEl.textContent = "0:00";
    });

    // SEEK BAR
    if (seekBar) {
        seekBar.addEventListener('input', () => {
            if (mainAudio.duration) {
                const seekTime = (seekBar.value / 100) * mainAudio.duration;
                mainAudio.currentTime = seekTime;
            }
        });
    }
}
