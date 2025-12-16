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

            // Reveal master player if hidden (Sticky)
            if (masterPlayer) {
                masterPlayer.classList.remove('hidden-player');
                masterPlayer.classList.add('active'); // For sticky CSS
            }
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
            } else {
                // If no track selected, play first one
                const firstItem = trackItems[0];
                if (firstItem) {
                    const btn = firstItem.querySelector('.play-btn');
                    const src = firstItem.getAttribute('data-src');
                    const title = firstItem.querySelector('.track-title').textContent;
                    playTrack(src, btn, title);
                }
            }
        });
    }

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentBtn) {
                const currentItem = currentBtn.closest('.track-item');
                const nextItem = currentItem.nextElementSibling;
                if (nextItem) {
                    const btn = nextItem.querySelector('.play-btn');
                    const src = nextItem.getAttribute('data-src');
                    const title = nextItem.querySelector('.track-title').textContent;
                    playTrack(src, btn, title);
                } else {
                    // Loop to start?
                    const firstItem = trackItems[0];
                    const btn = firstItem.querySelector('.play-btn');
                    const src = firstItem.getAttribute('data-src');
                    const title = firstItem.querySelector('.track-title').textContent;
                    playTrack(src, btn, title);
                }
            } else {
                // Play first if nothing playing
                const firstItem = trackItems[0];
                if (firstItem) {
                    const btn = firstItem.querySelector('.play-btn');
                    const src = firstItem.getAttribute('data-src');
                    const title = firstItem.querySelector('.track-title').textContent;
                    playTrack(src, btn, title);
                }
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentBtn) {
                const currentItem = currentBtn.closest('.track-item');
                const prevItem = currentItem.previousElementSibling;
                if (prevItem) {
                    const btn = prevItem.querySelector('.play-btn');
                    const src = prevItem.getAttribute('data-src');
                    const title = prevItem.querySelector('.track-title').textContent;
                    playTrack(src, btn, title);
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

        // Auto-play next track
        if (currentBtn) {
            const currentItem = currentBtn.closest('.track-item');
            const nextItem = currentItem.nextElementSibling;

            if (nextItem) {
                const nextBtn = nextItem.querySelector('.play-btn');
                const nextSrc = nextItem.getAttribute('data-src');
                const nextTitle = nextItem.querySelector('.track-title').textContent;

                // Small delay for UX
                setTimeout(() => {
                    playTrack(nextSrc, nextBtn, nextTitle);
                }, 500);
            }
        }
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

    // Re-select master player since it might have moved in DOM updates (though we selected it at top)
    // Actually, we need to handle the specialized container now.
    // The master player is now the CONTAINER itself for the sticky effect.
    // We already selected .master-player which is the container.
    // However, we used to toggle .hidden-player on it.
    // Now we need to toggle .active on .audio-player-container if we used that class.
    // But in HTML we added class "audio-player-container master-player hidden-player".
    // So logic remains similar: removing 'hidden-player' (display:none) will show it.
    // But wait, css says: .audio-player-container { display: none; } .audio-player-container.active { display: block; }
    // Let's ensure we use the 'active' class for the sticky player visibility based on our new CSS.

    function showStickyPlayer() {
        const stickyContainer = document.querySelector('.audio-player-container');
        if (stickyContainer) {
            stickyContainer.classList.add('active');
            stickyContainer.classList.remove('hidden-player'); // Remove old class just in case
        }
    }

    // Update playTrack to call showStickyPlayer
    const originalPlayTrack = playTrack; // We can't easily hook into internal function without rewriting it.
    // I will rewrite the playTrack function call inside.

    // Actually, I am replacing the whole block, so let's just update the playTrack definition in this scope?
    // No, I am replacing lines 117-146 only. 
    // I need to update the playTrack function which is above this block.
    // Let's replace the whole file content to be safe and clean, or just the ENDED event logic.
    // The user asked for "Next track immediately".
    // I need to update the show/hide logic too.

    // Let's do a full file replace to ensure clean logic for "Next Track" + "Sticky Player".
}
