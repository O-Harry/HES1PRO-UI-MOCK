/* ============================================
   HES 1 PRO — Mouse-Only Operation Mockup
   Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Page Navigation ---
  const pages = document.querySelectorAll('.page');
  const tabs = document.querySelectorAll('.nav-tab');

  function switchPage(pageName) {
    pages.forEach(p => p.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    const target = document.getElementById(`page-${pageName}`);
    const targetTab = document.querySelector(`.nav-tab[data-page="${pageName}"]`);

    if (target) target.classList.add('active');
    if (targetTab) targetTab.classList.add('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPage(tab.dataset.page);
    });
  });

  // --- FAB Buttons ---
  const fabLive = document.getElementById('fab-live');
  const fabPalette = document.getElementById('fab-palette');
  const fabSettings = document.getElementById('fab-settings');

  // Live FAB → switch to Palette page
  if (fabLive) {
    fabLive.addEventListener('click', () => switchPage('palette'));
  }

  // Palette FAB → switch back to Live page
  if (fabPalette) {
    fabPalette.addEventListener('click', () => switchPage('live'));
  }

  // Settings FAB → switch to Palette page
  if (fabSettings) {
    fabSettings.addEventListener('click', () => switchPage('palette'));
  }

  // --- Palette Buttons (Visual Feedback) ---
  const paletteButtons = document.querySelectorAll('.palette-btn');

  paletteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const id = btn.id;

      // Toggle recording state
      if (id === 'btn-record') {
        const isRecording = btn.classList.toggle('recording');
        const subLabel = btn.querySelector('.btn-sub');
        const recIndicator = document.querySelector('#page-palette .rec-indicator');
        const recBadge = document.querySelector('#page-palette .fab-rec-badge');

        if (isRecording) {
          subLabel.textContent = '録画中';
          if (recIndicator) recIndicator.classList.add('visible');
          if (recBadge) { recBadge.classList.add('active'); recBadge.textContent = '● REC'; }
        } else {
          subLabel.textContent = '停止中';
          if (recIndicator) recIndicator.classList.remove('visible');
          if (recBadge) { recBadge.classList.remove('active'); recBadge.textContent = 'REC'; }
        }
      }

      // Toggle mask state
      if (id === 'btn-mask') {
        const isMask = btn.classList.toggle('mask-on');
        const subLabel = btn.querySelector('.btn-sub');
        const maskOverlay = document.getElementById('circle-mask');

        subLabel.textContent = isMask ? 'ON' : 'OFF';
        if (maskOverlay) {
          maskOverlay.classList.toggle('visible', isMask);
        }
      }

      // Snapshot click feedback
      if (id === 'btn-snapshot') {
        btn.style.background = 'rgba(255, 255, 255, 0.25)';
        setTimeout(() => { btn.style.background = ''; }, 200);
      }

      // Reconnect click feedback
      if (id === 'btn-reconnect') {
        const icon = btn.querySelector('.btn-icon');
        icon.style.transition = 'transform 0.5s ease';
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          icon.style.transition = 'none';
          icon.style.transform = 'rotate(0deg)';
        }, 600);
      }
    });
  });

  // --- Segment Controls ---
  document.querySelectorAll('.segment-control').forEach(control => {
    const buttons = control.querySelectorAll('.segment-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // --- Saturation Slider ---
  const satTrack = document.getElementById('sat-track');
  const satFill = document.getElementById('sat-fill');
  const satThumb = document.getElementById('sat-thumb');
  const satValue = document.getElementById('sat-value');

  if (satTrack && satThumb) {
    let isDragging = false;

    function updateSlider(clientX) {
      const rect = satTrack.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      const rounded = Math.round(pct);

      satFill.style.width = `${rounded}%`;
      satThumb.style.left = `${rounded}%`;
      satValue.textContent = rounded;
    }

    satThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    satTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // --- Crop Size Slider (linked to preview circle) ---
  const cropTrack = document.getElementById('crop-track');
  const cropFill = document.getElementById('crop-fill');
  const cropThumb = document.getElementById('crop-thumb');
  const cropValue = document.getElementById('crop-value');
  const cropCircle = document.getElementById('crop-circle');

  if (cropTrack && cropThumb) {
    let isCropDragging = false;

    // Map slider 0-100% → value 30-100, circle 204px-680px
    function updateCropSlider(clientX) {
      const rect = cropTrack.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      const rounded = Math.round(pct);
      const cropPct = Math.round(30 + (rounded / 100) * 70); // 30-100 range

      cropFill.style.width = `${rounded}%`;
      cropThumb.style.left = `${rounded}%`;
      cropValue.textContent = `${cropPct}%`;

      // Update preview circle diameter (204px at 30% → 680px at 100%)
      if (cropCircle) {
        const diameter = Math.round(204 + (rounded / 100) * (680 - 204));
        cropCircle.style.width = `${diameter}px`;
        cropCircle.style.height = `${diameter}px`;
      }
    }

    cropThumb.addEventListener('mousedown', (e) => {
      isCropDragging = true;
      e.preventDefault();
    });

    cropTrack.addEventListener('mousedown', (e) => {
      isCropDragging = true;
      updateCropSlider(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isCropDragging) updateCropSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isCropDragging = false;
    });
  }
});
