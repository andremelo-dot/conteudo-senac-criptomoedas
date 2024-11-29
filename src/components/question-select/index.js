import { options } from '../../scripts/framework';
import { getQuestionTypeId, saveQuestion } from '../questions';

export const setQuestionSelect = function () {
  let question = $('.question[data-type="select"]');

  // Resgate das informações.
  if (options.actv) {
    let selectQuestions = options.actv.filter(question => question.type === 4); // 4 - Questão Select.

    if (selectQuestions.length) {
      selectQuestions.forEach(question => {
        let {
          id,
          atpt: [attemptsCount, attemptsTotal],
          stat: [progress, status],
          ans: [answers, feedback],
        } = question;

        let currentQuestion = $(`.question[data-id="${id}"]`);

        // Seta os atributos da questão.
        currentQuestion.attr('data-progress', progress);
        currentQuestion.attr('data-status', status);

        currentQuestion.find('.question-input').prop('disabled', true);

        // Preenche o select option.
        currentQuestion.find('.question-input').each(function (index) {
          let currentSelect = $(this);

          currentSelect.find(`option[data-id="${answers[index]}"]`).prop('selected', true);
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

  // Monitoramento dos selects para liberar o botão de salvar.
  question.find('.question-input').on('change', function () {
    let currentQuestion = $(this).closest('.question');
    let selectTotal = currentQuestion.find('.question-input').length;
    let selectedOptions = currentQuestion.find('.question-input option:selected').not(':disabled');

    if (selectTotal === selectedOptions.length) {
      currentQuestion.find('.question-btn[data-type="save"]').removeClass('disabled');
    }
  });

  // Salvamento das informações.
  question.find('.question-btn[data-type="save"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let selectTotal = currentQuestion.find('.question-input').length;
    let selectedOptions = currentQuestion.find('.question-input option:selected');
    let selectCorrect = currentQuestion.find('.question-input [data-score="1"]:selected').length;
    let feed = '';

    $(this).addClass('disabled');

    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');
    currentQuestion.find('.question-input').attr('disabled', true);

    let { id, type, attempts } = currentQuestion.data();

    currentQuestion.attr('data-progress', selectTotal === selectCorrect ? 1 : 0);
    currentQuestion.attr('data-status', selectTotal === selectCorrect ? 1 : 0);

    if (selectTotal === selectCorrect) {
      currentQuestion.find('.question-btn[data-type="try"]').addClass('disabled');

      feed = 'A';
    } else {
      feed = 'B';
    }

    currentQuestion.find(`.question-feedback[data-id="${feed}"]`).addClass('is-active');

    let selectedAnswers = jQuery.makeArray(selectedOptions).map(opt => opt.getAttribute('data-id'));

    let questionData = {
      id,
      type: getQuestionTypeId(type),
      atpt: [1, attempts],
      stat: [selectTotal === selectCorrect ? 1 : 0, selectTotal === selectCorrect ? 1 : 0],
      ans: [selectedAnswers, feed],
      scor: [selectCorrect, selectTotal, (selectCorrect * 100) / selectTotal],
    };

    saveQuestion(questionData);
  });
};
