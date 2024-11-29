// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
import {handleScrollTo} from '../../scripts/utils';

// import styles bundle
import 'swiper/css/bundle';
// import './styles.scss';

function __handleChange(e) {
  if ($(window).width() < 817) {
    let target = e.target ? e.target : e.el;
    // let targetScroll = $(target).hasClass('swiper') ? $(target).find('.swiper-slide')
    // : ($(target).closest('.swiper:has(picture)').length > 0 ? $(target).closest('.swiper:has(picture)') : $(target).closest('.swiper').find('.swiper-slide'));
    let targetScroll = $(target).closest('.content-grid');
    if ( targetScroll ) handleScrollTo(targetScroll);
  }
}

const scrollOnButtonClick = () => {
  $('.slider, .swiper-button-next, .swiper-button-prev').on('click', __handleChange);
}

// scrollOnButtonClick();

export const setSlideshow = function () {
  let swipersEl = document.querySelectorAll('.swiper');

  let swipers = [];

  async function getOnType(data) {
    // Tentativa de converter para número
    if (!isNaN(Number(data))) {
      return Number(data);
    }

    // Verifica se é um JSON válido para array ou objeto
    try {
      return JSON.parse(data);
    } catch (e) {
      // Se houver erro no JSON.parse, apenas continua para verificar outros tipos
    }

    // Verifica se é uma string booleana e converte para boolean
    if (data === 'true') {
      return true;
    }
    if (data === 'false') {
      return false;
    }

    // Retorna a string original se nenhuma das condições anteriores for atendida
    return data;
  }

  async function getAttributesAsTypes(attrs) {
    const typedAttrs = {};
    for (const key in attrs) {
      if (Object.hasOwnProperty.call(attrs, key)) {
        typedAttrs[key] = await getOnType(attrs[key]);
      }
    }
    return typedAttrs;
  }

  async function setupSwipers(swipersEl) {
    for (const container of swipersEl) {
      let attrs = container.dataset;
      attrs = await getAttributesAsTypes(attrs);

      // Define propriedades padrões
      const defaultSettings = {
        observer: true,
        observeParents: true,
        spaceBetween: attrs.spaceBetween || 0,
        autoHeight: /true/.test(attrs.autoHeight) || false,
        pagination: {
          el: container.querySelector('.swiper-pagination'),
          clickable: true,
          type: attrs.paginationType || 'bullets',
        },
        navigation: {
          nextEl: container.querySelector('.swiper-button-next'),
          prevEl: container.querySelector('.swiper-button-prev'),
        },
        scrollbar: {
          el: container.querySelector('.swiper-scrollbar'),
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: attrs.type === 'card' ? 2 : 1,
          },
          817: {
            slidesPerView: attrs.slidesPerView || 1,
          },
        },
      };

      // Atualiza as configurações padrões com os atributos tipados
      const swiperSettings = { ...defaultSettings, ...attrs };

      // Atualiza os elementos do swiper se necessário
      updateSwiperElements(swiperSettings, container);

      // Inicializa o swiper
      const swiper = new Swiper(container, swiperSettings);

      // Remove atributos, se necessário
      if ($(container).data('hide-attrs')) {
        removeAttributes(container);
      }
      swiper.on('slideChange', __handleChange);
      swipers.push(swiper);
    }
  }

  function updateSwiperElements(settings, container) {
    const updateElements = ['navigation', 'pagination'];
    updateElements.forEach(prop => {
      if (settings[prop] && settings[prop].elRef) {
        const element = container.closest(`.${settings[prop].elRef}`);
        if (element) {
          if (prop === 'navigation') {
            settings[prop].nextEl = element.querySelector('.swiper-button-next');
            settings[prop].prevEl = element.querySelector('.swiper-button-prev');
          }
          if (prop === 'pagination') {
            settings[prop].el = element.querySelector('.swiper-pagination');
          }
          delete settings[prop].elRef; // Remove a referência depois de usá-la
        }
      }
    });
  }

  function removeAttributes(container) {
    Array.from(container.attributes).forEach(attr => {
      if (attr.name !== 'class') {
        container.removeAttribute(attr.name);
      }
    });
  }

  // Assume que swipersEl já está definido
  setupSwipers(swipersEl);

  // Disponibiliza todos os swipers para customizações futuras
  return swipers;
};
