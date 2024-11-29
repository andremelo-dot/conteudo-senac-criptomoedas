// Importação do CSS do Componente.
import './styles.css';

export const setAccordion = function () {
  $('.accordion .accordion-summary').on('click', function (event) {
    let $currentAccordion = $(this).closest('.accordion');
    let { multiple } = $currentAccordion.data();

    // Adição da possibilidade de abrir somente um item por vez.
    if (multiple === false) {
      event.preventDefault();
      let $currentItem = $(this).closest('.accordion-item');
      $currentItem.addClass('clicked');
      $currentAccordion.find('.accordion-item').not($currentItem).removeAttr('open');
      $currentItem[0].toggleAttribute('open');
    }
  });
};
