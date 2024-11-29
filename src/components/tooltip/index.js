// Importação de bibliotecas.
import tippy from 'tippy.js';

// Importação de CSS.
import 'tippy.js/dist/tippy.css';
import './styles.scss';

export const setTooltip = function () {
  // Instanciação do plugin do Tippy.
  tippy('.tooltip-link', {
    role: 'tooltip',
    trigger: 'click',
    allowHTML: true,
    appendTo: document.body,
  });
};
