import { options } from '../../scripts/framework';
import { getQuestionTypeId, saveQuestion } from '../questions';

export const setQuestionMinmax = function () {
  let question = $('.question[data-type="minmax"]');

  // Resgate das informações.
  if (options.actv) {
    let minmaxQuestions = options.actv.filter(question => question.type === 5); // 1 -> Questão minmax.

    if (minmaxQuestions.length) {
      minmaxQuestions.forEach(question => {
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

        // Preenche o input.
        answers.forEach(ans => {
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

  // Verificação dos inputs para liberar salvamento.
  question.find('.question-input').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let alternativeTotal = currentQuestion.find('.question-alternative').length;
    let inputChecked = currentQuestion.find('.question-input:checked').length;

    if (alternativeTotal === inputChecked) {
      currentQuestion.find('.question-btn[data-type="save"]').removeClass('disabled');
    }
  });

  // Salvamento das informações.
  question.find('.question-btn[data-type="save"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let alternativeTotal = currentQuestion.find('.question-alternative').length;
    let inputChecked = currentQuestion.find('.question-input:checked');
    let inputIds = jQuery.makeArray(inputChecked).map(input => input.getAttribute('id'));
    let inputValues = jQuery.makeArray(inputChecked).map(input => parseInt(input.getAttribute('data-score')));
    let score = inputValues.reduce((accumulator, value) => accumulator + value, 0);
    let feed = '';

    $(this).addClass('disabled');

    currentQuestion.find('.question-input').attr('disabled', true);
    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');

    //  Extração dos atributos da questão.
    let { id, type, attempts } = currentQuestion.data();

    currentQuestion.attr('data-progress', alternativeTotal === inputChecked.length ? 1 : 0);
    currentQuestion.attr('data-status', alternativeTotal === inputChecked.length ? 1 : 0);

    // Set Feedback
    currentQuestion.find('.question-feedback').each(function () {
      let currentFeedback = $(this);
      let scoreMin = currentFeedback.data('score-min');
      let scoreMax = currentFeedback.data('score-max');

      if (score >= scoreMin && score <= scoreMax) {
        feed = currentFeedback.attr('data-id');
      }
    });

    currentQuestion.find(`.question-feedback[data-id="${feed}"]`).addClass('is-active');

    let alternativesArray = jQuery.makeArray(currentQuestion.find('.question-alternative'));

    let final = alternativesArray
      .map(alternative => {
        let inputsArray = jQuery.makeArray($(alternative).find('.question-input'));

        return Math.max(...inputsArray.map(input => parseInt(input.getAttribute('data-score'))));
      })
      .reduce((acc, value) => acc + value, 0);

    let questionData = {
      id,
      type: getQuestionTypeId(type),
      atpt: [1, attempts],
      stat: [alternativeTotal === inputChecked.length ? 1 : 0, alternativeTotal === inputChecked.length ? 1 : 0],
      ans: [inputIds, feed],
      scor: [score, final, (score * 100) / final],
    };

    saveQuestion(questionData);
  });
};
