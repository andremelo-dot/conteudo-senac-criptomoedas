import { checkScormRule, options, saveOptions } from '../../scripts/framework';

export const setQuestions = function () {
  if (options) {
    options.actv = options.actv || [];
  }

  // Generate auto ID's
  $('.question').each(function (questionIndex) {
    let questionId = questionIndex + 1;
    let currentQuestion = $(this);
    let alternatives = currentQuestion.find('.question-alternative');

    currentQuestion.attr('data-id', questionId);

    alternatives.each(function (alternativeIndex) {
      let alternativeId = `q${questionId}${alternativeIndex + 1}`;
      let currentInput = $(this).find('.question-input');
      let currentLabel = $(this).find('.question-label');

      currentLabel.attr('for', alternativeId);

      if (currentInput.length > 1) {
        currentInput.each(function (inputIndex) {
          let inputId = `${alternativeId}${inputIndex + 1}`;
          let input = $(this);

          input.attr({ name: alternativeId, id: inputId });
        });
      } else {
        currentInput.attr({ name: `q${questionIndex + 1}`, id: alternativeId });
      }
    });
  });

  // Tente novamente
  $('.question .question-btn[data-type="try"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');

    $(this).addClass('disabled'); // Desativa o botão try.

    currentQuestion.find('input, select, textarea').prop({ readonly: false, disabled: false }); // Reseta o estado dos inputs.
    currentQuestion.find('.question-btn[data-type="save"]').removeClass('disabled'); // Ativa o botão de salvar.
    currentQuestion.find('.question-feedback').removeClass('is-active'); // Desativa todos os feedbacks.
  });

  // Reset
  $('.question .question-btn[data-type="reset"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let { id } = currentQuestion.data();

    if (options.actv) {
      // Query que retorn true caso já exista uma questão com o mesmo ID no suspend_data.
      let query = options.actv.some(question => question.id === id);

      if (query) {
        // Query que retorna o index referente a questão.
        let index = options.actv.findIndex(question => question.id === id);

        options.actv.splice(index, 1);

        saveOptions();
      }
    }

    // Reseta os atributos da questão.
    currentQuestion.removeAttr('data-progress data-status');

    // Reseta todos os inputs da questão.
    currentQuestion.find('input, select, textarea').val('').prop({ checked: false, readonly: false, disabled: false });

    // Remove todas as classes is-active dos elementos da questão.
    currentQuestion.find('.is-active').removeClass('is-active');

    // Desabilita todos os botões de ação da questão.
    currentQuestion.find('.question-btn').not('[data-type="close"]').addClass('disabled');

    checkScormRule();
  });

  // Fechar feedback
  $('.question .question-btn[data-type="close"]').on('click', function () {
    let activeFeedback = $(this).closest('.question-feedback');

    activeFeedback.removeClass('is-active');
  });
};

// Get Question Type ID's
export const getQuestionTypeId = function (name) {
  switch (name) {
    case 'discursive':
      return 1;
    case 'objective':
      return 2;
    case 'multiple':
      return 3;
    case 'select':
      return 4;
    case 'minmax':
      return 5;
    case 'associative':
      return 6;
    case 'drag-and-drop':
      return 7;
    default:
      return null;
  }
};

export const saveQuestion = function (data) {
  let questionData = data;

  if (options) {
    // Query que retorna true caso já exista uma questão com o mesmo ID no suspend_data.
    let query = options.actv.some(question => question.id === questionData.id);

    // Query que retorna o index referente a questão.
    let index = null;

    // Se não existir, salva tudo.
    if (!query) {
      options.actv = [...options.actv, data];

      saveOptions();

      // Query que retorna o index referente a questão.
      index = options.actv.findIndex(element => element.id === questionData.id);
    } else {
      // Se existir, realiza a atualização.

      // Query que retorna o index referente a questão.
      index = options.actv.findIndex(element => element.id === questionData.id);
      console.log('options.actv', options.actv)
      // Extração dos dados atuais das tentativas.
      let [attemptsCount, attemptsTotal] = options.actv[index].atpt;
      let [progress] = options.actv[index].stat;

      // Previne a edição das informações apenas se a quantidade de tentativas for válida.
      if (attemptsCount + 1 <= attemptsTotal) {
        if (progress === 1 || attemptsCount + 1 === attemptsTotal) {
          $(`.question[data-id="${questionData.id}"]`).find('.question-btn[data-type="try"]').addClass('disabled');
        }

        progress = progress === 1 || attemptsCount + 1 === attemptsTotal ? 1 : 0;

        // Atualização do objeto.
        questionData = { ...questionData, atpt: [(attemptsCount += 1), attemptsTotal], stat: [progress, questionData.stat[1]] };

        // Sobrescrevendo o valor apenas da questão atual.
        options.actv[index] = questionData;

        saveOptions();
      }
    }

    let questionId = options.actv[index].id;
    let [progress] = options.actv[index].stat;

    $(`.question[data-id="${questionId}"]`).attr('data-progress', progress === 1 ? 1 : 0);

    checkScormRule();
  }
};
