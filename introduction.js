const slides = [...document.querySelectorAll('.slide')];
const currentSlideLabel = document.getElementById('currentSlide');
const totalSlidesLabel = document.getElementById('totalSlides');
const progressBar = document.getElementById('progressBar');
let activeIndex = 0;

totalSlidesLabel.textContent = String(slides.length).padStart(2, '0');

const updateDeck = (index) => {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));
  currentSlideLabel.textContent = String(activeIndex + 1).padStart(2, '0');
  progressBar.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
  const slideId = slides[activeIndex].id;
  if (history.replaceState) history.replaceState(null, '', `#${slideId}`);
};

const goToSlide = (index) => {
  const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateDeck(targetIndex);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    updateDeck(slides.indexOf(entry.target));
  });
}, { threshold: 0.55 });

document.getElementById('previousSlide').addEventListener('click', () => goToSlide(activeIndex - 1));
document.getElementById('nextSlide').addEventListener('click', () => goToSlide(activeIndex + 1));
document.getElementById('toggleFullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goToSlide(activeIndex + 1);
  }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goToSlide(activeIndex - 1);
  }
  if (event.key === 'Home') goToSlide(0);
  if (event.key === 'End') goToSlide(slides.length - 1);
  if (event.key.toLowerCase() === 'f') document.getElementById('toggleFullscreen').click();
});

const initialIndex = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
if (initialIndex >= 0) {
  slides[initialIndex].scrollIntoView({ behavior: 'auto', block: 'start' });
}
updateDeck(initialIndex >= 0 ? initialIndex : 0);
slides.forEach((slide) => observer.observe(slide));
