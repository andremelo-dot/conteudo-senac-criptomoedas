import { options } from '../../scripts/framework';
import { getQuestionTypeId, saveQuestion } from '../questions';

export const setQuestionMultiple = function () {
  let question = $('.question[data-type="multiple"]');

  // Resgate das informações em caso de existirem questões já respondidas.
  if (options.actv) {
    let multipleQuestions = options.actv.filter(question => question.type === 3); // 1 -> Questão múltipla.

    if (multipleQuestions.length) {
      multipleQuestions.forEach(question => {
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
        answer.forEach(ans => {
          currentQuestion.find(`#${ans}`).prop('checked', true);
        });

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
  $('.question[data-type="multiple"] .question-input').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let query = currentQuestion.find('.question-input').is(':checked');

    if (query) {
      currentQuestion.find('.question-btn[data-type="save"]').removeClass('disabled');
    } else {
      currentQuestion.find('.question-btn[data-type="save"]').addClass('disabled');
    }
  });

  // Salvar
  question.find('.question-btn[data-type="save"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let checkedInput = currentQuestion.find('.question-input:checked');
    let correctInput = currentQuestion.find('.question-input[data-score="1"]');

    let score = correctInput.filter(':checked').length;
    let percent = parseInt((score * 100) / checkedInput.length);
    let feed = '';

    $(this).addClass('disabled');

    currentQuestion.find('.question-input').attr('disabled', true);
    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');

    //  Extração dos atributos da questão.
    let { id, type, attempts } = currentQuestion.data();

    let questionCondition = score === correctInput.length && checkedInput.length === correctInput.length;

    currentQuestion.attr('data-progress', questionCondition ? 1 : 0);
    currentQuestion.attr('data-status', questionCondition ? 1 : 0);

    if (questionCondition) {
      currentQuestion.find('.question-btn[data-type="try"]').addClass('disabled');

      feed = 'A';
    } else {
      feed = 'B';
    }

    currentQuestion.find(`.question-feedback[data-id="${feed}"]`).addClass('is-active');

    let checkedAnswers = jQuery.makeArray(checkedInput).map((ans, index) => ans.getAttribute('id'));

    let questionData = {
      id,
      type: getQuestionTypeId(type),
      atpt: [1, attempts],
      stat: [questionCondition ? 1 : 0, questionCondition ? 1 : 0],
      ans: [checkedAnswers, feed],
      scor: [score, correctInput.length, percent],
    };

    saveQuestion(questionData);
  });
};
