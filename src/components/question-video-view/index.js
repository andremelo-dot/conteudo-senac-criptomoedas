import { options } from '../../scripts/framework';
import { getQuestionTypeId, saveQuestion } from '../questions';

// Importação do CSS do Componente.

export const setVideoViewQuestion = function () {
  let question = $('.question[data-type="video"]');

  // Resgate das informações em caso de existirem questões já respondidas.
  if (options.actv) {
    let objetiveQuestions = options.actv.filter(question => question.type === 8); // 8 -> Questão vídeo.
    if (objetiveQuestions.length) {
      objetiveQuestions.forEach(question => {
        let {
          id,
          stat: [progress, status],
        } = question;
        let currentQuestion = $(`.question[data-id="${id}"]`);
        // Seta os atributos da questão.
        currentQuestion.attr('data-progress', progress);
        currentQuestion.attr('data-status', status);
        currentQuestion.addClass('viewed');
      });
    }
  }


  // Salvar
  question.on('answered', function () {
    let currentQuestion = $(this).closest('.question');
    let { id, type } = currentQuestion.data();
    currentQuestion.attr('data-status', 1);
    let questionData = {
      id,
      type: getQuestionTypeId(type),
      stat: [1, 1],
      scor: [1, 1, 100],
    };
    saveQuestion(questionData);    
  });
};