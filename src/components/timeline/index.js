// Importação do CSS.
import './styles.css';

export const setTimeline = function () {
  $('.timeline .timeline-title').on('click', function () {
    let currentDetails = $(this);
    let currentTimeline = currentDetails.closest('.timeline');

    currentTimeline.find('.timeline-item').removeClass('is-active');
    currentDetails.closest('.timeline-item').addClass('is-active');

    currentTimeline.find('.timeline-item[open]').not(currentDetails).removeAttr('open');

    setTimeout(() => {
      let timelineHeight = currentTimeline[0].getBoundingClientRect().height;
      let distance = currentDetails.offset().top - currentTimeline.offset().top;

      let percent = `${parseInt((distance * 100) / timelineHeight)}%`;

      currentTimeline[0].style.setProperty('--timeline-progress', percent);
    }, 100);
  });
};
