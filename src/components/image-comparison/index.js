// Importação do CSS do Componente.
import './styles.scss';

export const setImageComparison = function () {
  setRangeVertical();

  $('.image-comparison .image-input').on('input', function (event) {
    let imageComparison = $(this).closest('.image-comparison');

    imageComparison[0].style.setProperty('--image-comparison-position', `${event.target.value}%`);
  });
};

const setRangeVertical = function () {
  if (matchMedia('(max-width: 580px)').matches) {
    $('.image-comparison .image-input').attr('orient', 'vertical');
  }
};
