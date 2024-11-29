// Importação do CSS do Componente.
// import './styles.css';

export const setCard = function () {
  $('.card .card-btn').on('click', function () {
    let currentCard = $(this).closest('.card');

    currentCard.toggleClass('is-active');
  });
};
