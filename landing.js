(() => {
  const video = document.getElementById('landing-video');
  const soundToggle = document.getElementById('sound-toggle');

  if (!video || !soundToggle) return;

  const DESKTOP_VIDEO = 'assets/icofea-montage.mp4';
  const MOBILE_VIDEO = 'assets/icofea-montage-mobile.mp4';
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  let currentSource = '';


  function markVideoReady() {
    video.classList.add('is-ready');
  }

  function hideVideoUntilReady() {
    video.classList.remove('is-ready');
  }

  video.addEventListener('loadeddata', markVideoReady);
  video.addEventListener('canplay', markVideoReady);

  async function loadCorrectVideo() {
    const wantedSource = mobileQuery.matches ? MOBILE_VIDEO : DESKTOP_VIDEO;

    if (wantedSource === currentSource) return;

    const wasMuted = video.muted;
    currentSource = wantedSource;

    hideVideoUntilReady();
    video.pause();
    video.src = wantedSource;
    video.muted = wasMuted;
    video.load();

    try {
      await video.play();
    } catch (_) {
      // Autoplay can be blocked by some browsers. The visitor can still press play
      // through normal browser behaviour or interact with the sound control.
    }
  }

  // Muted autoplay is the most reliable behaviour across iOS, Android and desktop.
  video.muted = true;
  soundToggle.textContent = 'Sound on';
  soundToggle.setAttribute('aria-pressed', 'false');

  loadCorrectVideo();

  // If a tablet/phone rotates or a browser window crosses the breakpoint,
  // swap to the appropriate montage automatically.
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', loadCorrectVideo);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(loadCorrectVideo);
  }

  soundToggle.addEventListener('click', async () => {
    video.muted = !video.muted;
    soundToggle.textContent = video.muted ? 'Sound on' : 'Mute sound';
    soundToggle.setAttribute('aria-pressed', String(!video.muted));

    if (video.paused) {
      try { await video.play(); } catch (_) {}
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && video.paused) {
      video.play().catch(() => {});
    }
  });
})();