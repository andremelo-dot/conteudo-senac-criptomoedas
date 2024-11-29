// Importação do CSS do Componente.
// import './styles.css';

export const setDropContent = function () {
  $('.drop-content .drop-btn').on('click', function () {
    const orientation = $(this).closest('.drop-content').data('orientation');
    const dropContent = $(this).closest('.drop-content');
    const content = $(this).closest('.drop-content').find('.content');

    dropContent.find('.content').toggleClass('is-active');

    const properties = orientation === 'horizontal' ? { width: 'toggle' } : { height: 'toggle' };

    // content.animate(properties);
  });
};
