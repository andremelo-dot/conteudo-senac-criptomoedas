import { options } from '../../scripts/framework';
import { handleLockedContent } from '../../scripts/utils';
import { getQuestionTypeId, saveQuestion } from '../questions';

// Importação do CSS do Componente.

export const setQuestionObjective = function () {
  let question = $('.question[data-type="objective"]');

  // Resgate das informações em caso de existirem questões já respondidas.
  if (options.actv) {
    let objetiveQuestions = options.actv.filter(question => question.type === 2); // 1 -> Questão objetiva.

    if (objetiveQuestions.length) {
      objetiveQuestions.forEach(question => {
        let {
          id,
          atpt: [attemptsCount, attemptsTotal],
          stat: [progress, status],
          ans: [answer, feedback],
        } = question;

        let currentQuestion = $(`.question[data-id="${id}"]`);

        // Seta os atributos da questão.
        currentQuestion.attr('data-progress', progress);
        currentQuestion.attr('data-status', status);

        currentQuestion.find('.question-input').prop('disabled', true);

        // Preenche o input.
        currentQuestion.find(`#${answer}`).prop('checked', true);

        // Ativar os botões necessários.
        if (progress !== 1 && attemptsCount < attemptsTotal) {
          currentQuestion.find('.question-btn[data-type="try"]').removeClass('disabled');
        }

        currentQuestion.find('.question-btn[data-type="reset"]').removeClass('disabled');

        // Ativa o respectivo feedback.
        currentQuestion.find(`.question-feedback[data-id="${feedback}"]`).addClass('is-active');
      });
    }
  }

  // Monitoramento do textarea para liberar o salvamento das informações.
  $('.question[data-type="objective"] .question-input').on('click', function () {
    let currentQuestion = $(this).closest('.question');

    currentQuestion.find('.question-btn[data-type="save"]').removeClass('disabled');
  });

  // Salvar
  question.find('.question-btn[data-type="save"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let checkedInput = currentQuestion.find('.question-input:checked');

    let { score, feed } = checkedInput.data();

    $(this).addClass('disabled');

    currentQuestion.find('.question-input').attr('disabled', true);
    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');

    currentQuestion.find(`.question-feedback[data-id="${feed}"]`).addClass('is-active');

    //  Extração dos atributos da questão.
    let { id, type, attempts } = currentQuestion.data();

    let progress = score === 1 ? 1 : 0;
    let status = score === 1 ? 1 : 0;

    currentQuestion.attr('data-status', status);

    let questionData = {
      id,
      type: getQuestionTypeId(type),
      atpt: [1, attempts],
      stat: [progress, status],
      ans: [checkedInput.attr('id'), feed],
      scor: [score, 1, score ? 100 : 0],
    };

    if (score === 1) {
      currentQuestion.find('.question-btn[data-type="try"]').addClass('disabled');
    }

    saveQuestion(questionData);

    // **************** CASO PRECISE DE TRAVA, DESCOMENTAR O CÓDIGO ABAIXO ****************
    // const questProgress = +$(this).closest('.question').attr('data-progress');

    // if (questProgress === 1) {
    //   const component = $(this).closest('[data-component]');
    //   const buttons = component.find('[data-type="save"]');
    //   $(this).addClass('clicked');
    //   handleLockedContent(component, buttons);
    // }
  });
};
