import { options, saveOptions } from './framework';

export const setDebounce = function (func, timeout = 300) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

// CASO O CURSO TENHA TRAVAS, USAR A FUNÇÃO ABAIXO
// CHAMAR A FUNÇÃO handleRequiredID NO MAIN.JS LOGO ABAIXO DO SUSPENDDATA.
// A FUNÇÃO handleLockedContent DEVE SER CHAMADA NO RECURSO QUE EXIGIR TRAVA.
// TAMBÉM SERÁ NECESSÁRIO, NO RECURSO QUE TERÁ TRAVA, USAR OS SEGUINTES ATRIBUTOS:
// data-required como 'true' E data-required-type como 'single' para interação única OU 'multiple' para vários elementos.
export function handleRequiredID() {
  const required = $('[data-required]');

  required.each(function (index, item) {
    $(item).attr('data-required-id', index + 1);
  });
}

export function handleLockedContent(component, buttons) {
  const body = $('body');

  if (body.attr('data-read') !== false) {
    // Verifica se o componente é obrigatório
    const isRequired = component.data('required') === true;

    // Se não for obrigatório, retorna sem fazer nada
    if (!isRequired) {
      return;
    }

    // Obtém o tipo de requisito do componente
    const requiredType = component.data('required-type');

    // Verifica se o tipo de requisito é 'single' ou se todos os botões foram clicados
    if (requiredType === 'single' || buttons.length === component.find('.clicked').length) {
      if (component.attr('data-required') == 'true') {
        setTimeout(() => {
          // Manipula o scroll automaticamente para o próximo componente
          // handleScrollAuto(component);
        }, 200);
      }

      component.attr('data-required', false);
      // Atualiza o valor de options.required para o máximo entre o valor atual e o ID do componente
      options.required = Math.max(options.required, +component.attr('data-required-id'));
    }

    // Salva as opções
    saveOptions();
  }
}

export function handleScrollTo(element) {
  $('html, body')
  .stop()
  .animate(
    {
      scrollTop: element.offset().top - 50,
    },
    300,
    'linear'
  );
}

export function handleScrollAuto(section) {
  $('html, body').animate(
    {
      scrollTop: section.next().offset().top - 100,
    },
    1000,
    'linear'
  );
}

export function handleLockedElements() {
  const lastRequired = options.required;
  const body = $('body');

  if (body.attr('data-read') !== 'false') {
    for (let i = 0; i <= lastRequired; i++) {
      $(`[data-required-id=${i}]`).attr('data-required', false);
    }
  }
}
