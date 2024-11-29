// Importação de JS (Componentes, Funções e Utilidades).
import { jsPDF } from 'jspdf';
import { options } from '../../scripts/framework';
// import { setDebounce } from '../../scripts/utils';
import { getQuestionTypeId, saveQuestion } from '../questions';

async function generatePDF(answer) {
  // Get the text from the textarea
  const text = answer;

  // Create an instance of jsPDF
  const pdf = new jsPDF();

  // Define the maximum width for the text
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  const maxWidth = pageWidth - margin * 2;

  // Split the text into lines that fit the maximum width
  const lines = pdf.splitTextToSize(text, maxWidth);

  // Position control variables
  let x = margin;
  let y = 10 + margin;

  // Line height (adjust as needed)
  const lineHeight = 8;

  pdf.text('Atividade Discursiva', 10, 10);

  // Add lines to the PDF, creating new pages as necessary
  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(lines[i], x, y);
    y += lineHeight;
  }

  // Save the PDF with the name "document.pdf"
  pdf.save('atividade.pdf');
}

export const setQuestionDiscursive = function () {
  let questionsDiscursive = $('.question').filter('[data-type="discursive"]');

  // Resgate das informações em caso de existirem questões já respondidas.
  if (options.actv) {
    let discursiveQuestions = options.actv.filter(question => question.type === 1); // 1 -> Questão discursiva.

    if (discursiveQuestions.length) {
      discursiveQuestions.forEach(question => {
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

        // Preenche o(s) textarea(s).
        currentQuestion.find('.question-input').each(function (index) {
          $(this).val(answers[index]);
          $(this).attr({
            readonly: true,
            disabled: true,
          });
        });

        // Ativar os botões necessários.
        if (attemptsCount < attemptsTotal) {
          currentQuestion.find('.question-btn[data-type="try"]').removeClass('disabled');
        }

        currentQuestion.find('.question-btn[data-type="reset"]').removeClass('disabled');

        // Ativa o respectivo feedback.
        currentQuestion.find(`.question-feedback[data-id="${feedback}"]`).addClass('is-active');

        // Verifica se a questão precisa gerar PDF
        const isQuestionPDF = currentQuestion.hasClass('question-pdf');

        if (isQuestionPDF) {
          currentQuestion.find('.question-btn[data-type="pdf"]').removeClass('disabled');
        }
      });
    }
  }

  // Monitoramento do textarea para liberar o salvamento das informações.
  // questionsDiscursive.find('.question-input').on('keyup', setDebounce(checkTextarea));
  questionsDiscursive.find('.question-input').on('keyup', checkTextarea);

  // Salvar
  questionsDiscursive.find('.question-btn[data-type="save"]').on('click', function () {
    let currentButton = $(this);
    let currentQuestion = currentButton.closest('.question');
    let currentTextarea = currentQuestion.find('.question-input');
    let currentFeedback = currentQuestion.find('.question-feedback');

    currentButton.addClass('disabled');

    currentQuestion.attr('data-progress', 1);
    currentQuestion.attr('data-status', 1);

    currentTextarea.attr('readonly', true);
    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');

    currentFeedback.addClass('is-active');

    //  Extração dos atributos da questão.
    let { id, type, attempts, progress, status } = currentQuestion.data();

    if (options) {
      let answers = currentTextarea.length > 1 ? jQuery.makeArray(currentTextarea).map((ans, index) => ans.value) : [currentTextarea.val()];

      let questionData = {
        id,
        type: getQuestionTypeId(type),
        atpt: [1, attempts],
        stat: [progress, status],
        ans: [answers, 'A'],
        scor: [1, 1, 100],
      };

      saveQuestion(questionData);

      const isQuestionPDF = currentQuestion.hasClass('question-pdf');

      if (isQuestionPDF) {
        currentButton.closest('.question').find('.question-btn[data-type="pdf"]').removeClass('disabled');
      }
    }
  });

  questionsDiscursive.find('.question-btn[data-type="try"]').on('click', function () {
    const currentButton = $(this);
    const currentQuestion = currentButton.closest('.question');
    const pdfButton = currentQuestion.find('.question-btn[data-type="pdf"]');

    pdfButton.addClass('disabled');
  });

  questionsDiscursive.find('.question-btn[data-type="pdf"]').on('click', function () {
    const answer = $(this).closest('.question').find('.question-input').val();
    generatePDF(answer);
  });
};

// Função para verificar os status dos textareas. Se forem válidos, libera o botão de salvar.
const checkTextarea = function () {
  const currentQuestion = $(this).closest('.question');
  const currentButtonSave = currentQuestion.find('.question-btn[data-type="save"]');
  const textarea = currentQuestion.find('.question-input');
  const textAreaValue = textarea.val();
  const textAreaLength = textAreaValue.length;
  const isTextAreaFulfilled = textAreaLength > 0;

  return isTextAreaFulfilled ? currentButtonSave.removeClass('disabled') : currentButtonSave.addClass('disabled');
};
