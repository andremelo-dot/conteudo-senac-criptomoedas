import './styles.css';

export const setPanel = function () {
  $('.panel-open').on('click', function () {
    let currentButton = $(this);
    let { id } = currentButton.data();
    let currentPanel = $(`.panel[data-id="${id}"]`);

    currentPanel.toggleClass('is-active');
  });

  $('.panel-close').on('click', function () {
    let currentPanel = $(this).closest('.panel');

    currentPanel.removeClass('is-active');
  });
};
