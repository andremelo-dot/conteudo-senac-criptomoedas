import { options } from '../../scripts/framework';
import { setDebounce } from '../../scripts/utils';
import { getQuestionTypeId, saveQuestion } from '../questions';

export const setQuestionAssociative = function () {
  let question = $('.question[data-type="associative"]');

  // Resgate das informações.
  if (options.actv) {
    let associativeQuestions = options.actv.filter(question => question.type === 6);

    if (associativeQuestions.length) {
      associativeQuestions.forEach(question => {
        let {
          id,
          atpt: [attemptsCount, attemptsTotal],
          stat: [progress, status],
          ans: [answers, feedback],
        } = question;

        let currentQuestion = $(`.question[data-id="${id}"]`);

        currentQuestion.attr('data-progress', progress);
        currentQuestion.attr('data-status', status);

        currentQuestion.find('.question-input').attr('readonly', true);

        currentQuestion.find('.question-input').each(function (index) {
          let input = $(this);

          input.val(answers[index]);
        });

        if (progress !== 1 && attemptsCount < attemptsTotal) {
          currentQuestion.find('.question-btn[data-type="try"]').removeClass('disabled');
        }

        currentQuestion.find('.question-btn[data-type="reset"]').removeClass('disabled');
        currentQuestion.find(`.question-feedback[data-id="${feedback}"]`).addClass('is-active');
      });
    }
  }

  // Verificar os requisitos para liberar o salvamento.
  question.find('.question-input').on('keyup', setDebounce(checkInputs));

  // Salvamento das informações.
  question.find('.question-btn[data-type="save"]').on('click', function () {
    let currentButton = $(this);
    let currentQuestion = currentButton.closest('.question');
    let currentInputs = currentQuestion.find('.question-input');

    currentButton.addClass('disabled');

    currentInputs.attr('readonly', true);
    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');

    if (options) {
      let answers = jQuery.makeArray(currentInputs).map((ans, index) => ans.value.trim().toLowerCase());
      let correctAnswers = jQuery.makeArray(currentInputs).filter(element => element.value === element.getAttribute('data-target'));
      let percent = parseInt((correctAnswers.length * 100) / currentInputs.length);
      let feedback = percent === 100 ? 'A' : 'B';

      currentQuestion.attr('data-progress', percent === 100 ? 1 : 0);
      currentQuestion.attr('data-status', percent === 100 ? 1 : 0);

      currentQuestion.removeData('progress');
      currentQuestion.removeData('status');

      //  Extração dos atributos da questão.
      let { id, type, attempts } = currentQuestion.data();
      let progress = parseInt(currentQuestion.attr('data-progress'));
      let status = parseInt(currentQuestion.attr('data-status'));

      if (percent === 100) {
        currentQuestion.find('.question-btn[data-type="try"]').addClass('disabled');
      }

      currentQuestion.find(`.question-feedback[data-id="${feedback}"]`).addClass('is-active');

      let questionData = {
        id,
        type: getQuestionTypeId(type),
        atpt: [1, attempts],
        stat: [progress, status],
        ans: [answers, feedback],
        scor: [correctAnswers.length, currentInputs.length, percent],
      };

      saveQuestion(questionData);
    }
  });
};

const checkInputs = function () {
  let question = $(this).closest('.question');
  let inputs = question.find('.question-input');
  let inputsValid = question.find('.question-input:valid');
  let buttonSave = question.find('.question-btn[data-type="save"]');

  return inputs.length === inputsValid.length ? buttonSave.removeClass('disabled') : buttonSave.addClass('disabled');
};
