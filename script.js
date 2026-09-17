// ---------------------------------------------------------
// 1. Circular staff in the hero, after "Inevitable Cosmos".
//    Four concentric staves; notes placed at random angles,
//    some filled, some hollow, often in small clusters.
// ---------------------------------------------------------
(function () {
  const canvas = document.getElementById('staff');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let notes = [];
  let frame = null;

  function colours() {
    const s = getComputedStyle(document.documentElement);
    return { ink: s.getPropertyValue('--ink').trim(), paper: s.getPropertyValue('--paper').trim() };
  }

  function makeNotes() {
    notes = [];
    const clusters = 9 + Math.floor(Math.random() * 6);
    for (let c = 0; c < clusters; c++) {
      const base = Math.random() * Math.PI * 2;
      const count = 1 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        notes.push({
          angle: base + (Math.random() - 0.5) * 0.45,
          ring: Math.floor(Math.random() * 4),
          filled: Math.random() < 0.42
        });
      }
    }
    notes.sort((a, b) => a.angle - b.angle);
  }

  function size() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    canvas.width = w * dpr;
    canvas.height = w * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return w;
  }

  function draw(progress) {
    const w = canvas.clientWidth;
    const { ink, paper } = colours();
    const c = w / 2;
    const outer = w * 0.47;
    const gap = w * 0.02;
    const r = Math.max(3, w * 0.013);
    ctx.clearRect(0, 0, w, w);
    ctx.lineWidth = 1;
    ctx.strokeStyle = ink;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(c, c, outer - i * gap, 0, Math.PI * 2);
      ctx.stroke();
    }
    const shown = Math.floor(notes.length * progress);
    for (let i = 0; i < shown; i++) {
      const n = notes[i];
      const rad = outer - n.ring * gap;
      const x = c + Math.cos(n.angle - Math.PI / 2) * rad;
      const y = c + Math.sin(n.angle - Math.PI / 2) * rad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.filled ? ink : paper;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function play() {
    cancelAnimationFrame(frame);
    makeNotes();
    size();
    if (reduce) { draw(1); return; }
    const start = performance.now();
    const duration = 2600;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      draw(p);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  document.getElementById('redraw').addEventListener('click', play);
  window.addEventListener('resize', () => { size(); draw(1); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => draw(1));
  play();
})();

// ---------------------------------------------------------
// 2. Record dialog. Without JavaScript the covers simply
//    link to Bandcamp.
// ---------------------------------------------------------
(function () {
  const dialog = document.getElementById('record-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const cover = document.getElementById('dialog-cover');
  const title = document.getElementById('dialog-title');
  const meta = document.getElementById('dialog-meta');
  const body = document.getElementById('dialog-body');
  const link = document.getElementById('dialog-link');
  let opener = null;

  document.querySelectorAll('.cover[data-record]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const notes = document.getElementById('record-' + a.dataset.record);
      if (!notes) return;
      e.preventDefault();
      opener = a;
      cover.src = a.querySelector('img').src;
      title.textContent = a.querySelector('.cover-title').textContent;
      meta.textContent = a.querySelector('.cover-meta').textContent;
      body.innerHTML = notes.innerHTML;
      link.href = a.href;
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });

  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  body.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
})();

// ---------------------------------------------------------
// 3. Videos. <div class="video" data-video="LINK"> becomes an
//    embedded player. Works with YouTube and Vimeo links.
//    An empty data-video shows a placeholder box.
// ---------------------------------------------------------
(function () {
  document.querySelectorAll('.video[data-video]').forEach((box) => {
    const link = box.dataset.video.trim();
    const yt = link.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/) || link.match(/^([\w-]{11})$/);
    const vimeo = link.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    let src = '';
    if (yt) src = 'https://www.youtube-nocookie.com/embed/' + yt[1];
    else if (vimeo) src = 'https://player.vimeo.com/video/' + vimeo[1];
    if (!src) { box.classList.add('missing'); return; }
    const frame = document.createElement('iframe');
    frame.src = src;
    frame.title = box.dataset.title || 'Video';
    frame.loading = 'lazy';
    frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    box.appendChild(frame);
  });
})();
