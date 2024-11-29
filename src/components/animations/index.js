import { setDebounce } from '../../scripts/utils';
import './styles.css';

export const setAnimations = () => {

  let { animationSelector, animationType } = document.querySelector('body').dataset;
  const elementsToAnimate = document.querySelectorAll(animationSelector || '[data-animate]');
  const observerOptions = {
    root: null, // Viewport
    rootMargin: '-15% 0px -15%',
    threshold: 0.1 // Dispara quando 10% do elemento está visível
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observa todos os elementos com data-animate
  elementsToAnimate.forEach(element => {
    if ( animationSelector ) element.setAttribute('data-animate', animationType || 'fade-in');
    observer.observe(element);
  });
};