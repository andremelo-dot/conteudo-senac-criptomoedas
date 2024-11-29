// Importação dos estilos.
import './styles.css';

export const setInteractive = function () {
  $('.interactive .interactive-open').on('click', function () {
    let currentInteractive = $(this).closest('.interactive');
    let currentButton = $(this);
    let currentContent = currentInteractive.find(`.interactive-content[id="${currentButton.attr('id')}"]`);

    // Verificando se o parametro data-multiple existe. O padrão é true.
    let multiple = currentInteractive.data('multiple') !== undefined ? currentInteractive.data('multiple') : true;

    if (!multiple) {
      currentInteractive.find('.interactive-open, .interactive-content').removeClass('is-active');
    }

    currentButton.toggleClass('is-active');
    currentContent.toggleClass('is-active');

    checkInteractiveStatus(currentInteractive);
  });

  $('.interactive .interactive-close').on('click', function () {
    let currentInteractive = $(this).closest('.interactive');
    let currentButtonClose = $(this);
    let currentContent = currentButtonClose.closest('.interactive-content');
    let currentButton = currentInteractive.find('.interactive-open').filter(`#${currentContent.attr('id')}`);

    currentButton.removeClass('is-active');
    currentContent.removeClass('is-active');

    checkInteractiveStatus(currentInteractive);
  });
};

const checkInteractiveStatus = function (interactive) {
  let activeContent = interactive.find('.interactive-content.is-active').length;

  if (activeContent) {
    interactive.addClass('is-active');
  } else {
    interactive.removeClass('is-active');
  }
};
