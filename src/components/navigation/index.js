import { options, saveOptions, checkScormRule } from '../../scripts/framework';

import './styles.css';

export const setNavigation = function () {
  if (options) {
    let sectionsLength = $('.section').length;
    let initialProgress = sectionsLength ? parseInt((1 * 100) / sectionsLength) : 0;

    options.nvgt = options.nvgt || { current: 1, last: 1, total: sectionsLength, progress: initialProgress };

    $(`.navigation-id[data-id="${options.nvgt.current || 1}"]`).addClass('is-active');
    $(`.section[data-section-id="${options.nvgt.current}"]`).addClass('is-active');

    setPercent(options.nvgt.progress);
  }

  $('.navigation-button').on('click', function () {
    let currentSection = $('.section.is-active');
    let currentNavigationButton = $(this);

    currentSection.removeClass('is-active');

    if (currentNavigationButton.hasClass('navigation-next')) {
      currentSection.next('.section').addClass('is-active');
    }

    if (currentNavigationButton.hasClass('navigation-prev')) {
      currentSection.prev('.section').addClass('is-active');
    }

    if (currentNavigationButton.hasClass('navigation-id')) {
      let { id } = currentNavigationButton.data();

      $('.navigation-id').removeClass('is-active');
      currentNavigationButton.addClass('is-active');
      $(`.section[data-section-id="${id}"]`).addClass('is-active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (options.nvgt) {
      let { last, total, progress } = options.nvgt;

      let currentSectionId = $('.section.is-active').data('section-id');
      let lastSectionId = currentSectionId > last ? currentSectionId : last;
      let currentProgress = parseInt((currentSectionId * 100) / total) > progress ? parseInt((currentSectionId * 100) / total) : progress;

      options.nvgt = { current: currentSectionId, last: lastSectionId, total, progress: currentProgress };

      setPercent(currentProgress);
    }

    saveOptions();
    checkScormRule();
  });
};

const setPercent = percent => $('.progress-bar').val(percent);
