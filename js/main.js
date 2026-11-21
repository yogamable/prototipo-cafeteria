function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const btnNext = root.querySelector('.carousel-btn.next');
  const btnPrev = root.querySelector('.carousel-btn.prev');

  if (!track || !btnNext || !btnPrev) {
    console.error('Carrusel: falta algún elemento en', root);
    return;
  }

  const DURACION = 350;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  let animando = false;
  const cola = [];

  function getPaso() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return track.firstElementChild.getBoundingClientRect().width + gap;
  }

  function alTerminar(fn) {
    let hecho = false;
    const fin = () => {
      if (hecho) return;
      hecho = true;
      track.removeEventListener('transitionend', onEnd);
      clearTimeout(respaldo);
      fn();
    };
    const onEnd = (e) => {
      if (e.target === track && e.propertyName === 'transform') fin();
    };
    track.addEventListener('transitionend', onEnd);
    const respaldo = setTimeout(fin, DURACION + 100);
  }

  function liberar() {
    animando = false;
    if (cola.length) mover(cola.shift());
  }

  function mover(dir) {
    if (animando) {
      if (cola.length < 2) cola.push(dir);
      return;
    }
    animando = true;
    const paso = getPaso();

    if (dir === 'next') {
      track.style.transition = `transform ${DURACION}ms ${EASING}`;
      track.style.transform = `translate3d(-${paso}px, 0, 0)`;

      alTerminar(() => {
        track.style.transition = 'none';
        track.appendChild(track.firstElementChild);
        track.style.transform = 'translate3d(0, 0, 0)';
        track.offsetWidth;
        liberar();
      });
    } else {
      track.style.transition = 'none';
      track.prepend(track.lastElementChild);
      track.style.transform = `translate3d(-${paso}px, 0, 0)`;
      track.offsetWidth;

      track.style.transition = `transform ${DURACION}ms ${EASING}`;
      track.style.transform = 'translate3d(0, 0, 0)';

      alTerminar(liberar);
    }
  }

  btnNext.addEventListener('click', () => mover('next'));
  btnPrev.addEventListener('click', () => mover('prev'));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(initCarousel);
});