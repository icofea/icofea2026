(() => {
  const video = document.getElementById('landing-video');
  const soundToggle = document.getElementById('sound-toggle');
  if (!video || !soundToggle) return;

  // Autoplay is most reliable when muted.
  video.muted = true;

  soundToggle.addEventListener('click', async () => {
    video.muted = !video.muted;
    soundToggle.textContent = video.muted ? 'Sound on' : 'Mute sound';
    soundToggle.setAttribute('aria-pressed', String(!video.muted));

    if (video.paused) {
      try { await video.play(); } catch (_) {}
    }
  });

  // Retry autoplay if a browser initially pauses it.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && video.paused) {
      video.play().catch(() => {});
    }
  });
})();
