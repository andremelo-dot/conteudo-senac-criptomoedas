import { options, saveOptions } from '@scripts/framework';

export function handleMenu() {
  const button = $('.open-menu');

  button.on('click', function () {
    const menu = $(this).closest('body').find('.menu');
    const content = menu.find('[class*="__content"]');
    const body = $('body, html');

    handleMenuButtonIconAndText();

    body.toggleClass('menu-open');
    menu.toggleClass('is-active');
    content.toggleClass('is-active');

    menu.find('.open-menu').toggleClass('open');
  });
}

export function handleMenuNav() {
  const topic = $('.menu .heading');
  const subheading = $('.menu .subheading');

  topic.on('click', function () {
    const topicData = $(this).closest('.topic').data('topic');
    handleMenuButtonIconAndText();
    handleTopic(topicData);
  });

  subheading.on('click', function () {
    const topicData = $(this).closest('.topic').data('topic');
    const sectionActive = $('.section.is-active[data-section-id]').data('section-id');
    const anchor = $(this).data('sub');
    const elementToScroll = $(`[data-section-id=${topic}]`).find(`[data-anchor=${anchor}]`);

    if (topic === sectionActive) {
      $('body, html').animate(
        {
          scrollTop: elementToScroll.offset().top - 120,
        },
        1000
      );

      $('.menu, .menu__content').removeClass('is-active');
      $('body, html').removeClass('menu-open');
      $('.menu .open-menu').removeClass('open');

      return;
    }

    handleMenuButtonIconAndText();
    handleTopic(topicData);

    setTimeout(() => {
      $('body, html').animate(
        {
          scrollTop: elementToScroll.offset().top - 120,
        },
        1000
      );
    }, 1000);
  });
}

export function handleAnchorsID() {
  const anchor = $('.anchor');

  anchor.each(function (index, item) {
    $(item).attr('data-anchor', index + 1);
  });
}

export function handleSubHeadingID() {
  const buttons = $('.menu .subheading');

  buttons.each(function (index, item) {
    $(item).attr('data-sub', index + 1);
  });

  for (let i = 1; i <= options.sub; i++) {
    $(`.menu [data-sub=${i}]`).removeClass('disabled');
  }
}

const subHeadingIntersect = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.dataset.anchor;

      $(`.menu [data-sub=${id}]`).removeClass('disabled');
      if (id > options.sub) {
        options.sub = +id;
        saveOptions();
      }
    }
  });
});

$('.anchor').each((index, item) => {
  subHeadingIntersect.observe(item);
});

function handleTopic(topic) {
  $('[data-section-id]').removeClass('is-active');
  $(`[data-section-id=${topic}]`).addClass('is-active');

  $('.menu, [class*="__content"]').removeClass('is-active');
  $('body, html').removeClass('menu-open');
  $('.menu .open-menu').removeClass('open');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleMenuButtonIconAndText() {
  const switchText = $('.open-menu').not('[class*="__content"] .open-menu').hasClass('open');
  const appendElement = `
  <img src="./assets/images/menu/${!switchText ? 'close' : 'open'}-menu.svg" alt="" />
    ${!switchText ? 'Fechar' : 'Abrir'} Menu
  `;

  $('.open-menu').not('[class*="__content"] .open-menu').empty().append(appendElement);
}
