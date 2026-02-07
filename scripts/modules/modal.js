// Modal logic for subscribe modal

export function initModal() {
  const subscribeLink = document.querySelector('.nav-left .subscribe-cta');
  const modalOverlay = document.getElementById('subscribe-modal-overlay');
  const modalClose = document.getElementById('subscribe-modal-close');

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  // Banner subscribe button
  const bannerBtn = document.getElementById('subscribe-banner-btn');
  if (bannerBtn) {
    bannerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  }

  if (subscribeLink && modalOverlay && modalClose) {
    // Open modal
    subscribeLink.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });

    // Close modal
    function closeModal() {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
    }
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (modalOverlay.classList.contains('active') && e.key === 'Escape') closeModal();
    });
  }
}