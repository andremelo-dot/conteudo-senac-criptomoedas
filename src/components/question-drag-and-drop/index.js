import { options } from '../../scripts/framework';
import { getQuestionTypeId, saveQuestion } from '../questions';

export const setQuestionDragAndDrop = function () {
  let question = $('.question[data-type="drag-and-drop"]');

  // Resgate das informações em caso de existirem questões já respondidas.
  if (options.actv) {
    let dragQuestions = options.actv.filter(question => question.type === 7); // 1 -> Questão Drag and drop.

    if (dragQuestions.length) {
      dragQuestions.forEach(question => {
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

        currentQuestion.find('.draggable').addClass('disabled');

        // Preenche o input.
        answers.forEach(ans => {
          let [droppableId, droppedId] = ans;

          let currentDroppable = currentQuestion.find(`.droppable[data-id="${droppableId}"]`);
          let clone = currentQuestion.find(`.draggable[data-id="${droppedId}"]`).clone(true);

          if (!currentDroppable.children().length) {
            currentDroppable.empty();
          }

          clone.removeClass('draggable').addClass('dropped');
          clone.prop('draggable', false);
          clone.appendTo(currentDroppable);
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

  // Salvar
  question.find('.question-btn[data-type="save"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');
    let draggableLength = currentQuestion.find('.draggable').length;
    let score = 0;
    let answers = [];
    let feed = '';

    $(this).addClass('disabled');

    currentQuestion.find('.question-btn').not('[data-type="save"]').removeClass('disabled');

    currentQuestion.find('.dropped').each(function () {
      let { id: droppableId, accept } = $(this).closest('.droppable').data();
      let { id: droppedId, value } = $(this).data();

      if (accept === value) {
        $(this).addClass('is-valid');

        score += 1;
      } else {
        $(this).addClass('is-invalid');
      }

      answers = [...answers, [droppableId, droppedId]];
    });

    //  Extração dos atributos da questão.
    let { id, type, attempts } = currentQuestion.data();
    let percent = (score * 100) / draggableLength;

    currentQuestion.attr('data-progress', score === draggableLength ? 1 : 0);
    currentQuestion.attr('data-status', score === draggableLength ? 1 : 0);

    if (score === draggableLength) {
      currentQuestion.find('.question-btn[data-type="try"]').addClass('disabled');

      feed = 'A';
    } else {
      feed = 'B';
    }

    currentQuestion.find(`.question-feedback[data-id="${feed}"]`).addClass('is-active');

    let questionData = {
      id,
      type: getQuestionTypeId(type),
      atpt: [1, attempts],
      stat: [score === draggableLength ? 1 : 0, score === draggableLength ? 1 : 0],
      ans: [answers, feed],
      scor: [score, draggableLength, percent],
    };

    saveQuestion(questionData);
  });

  // Reset e tente novamente.
  question.find('.question-btn[data-type="try"], .question-btn[data-type="reset"]').on('click', function () {
    let currentQuestion = $(this).closest('.question');

    currentQuestion.find('.draggable').removeClass('disabled');
    currentQuestion.find('.droppable').empty();
    currentQuestion.find('.question-btn[data-type="save"]').addClass('disabled');
  });

  // Monitoramento dos eventos.
  question.find('.draggable').on('dragstart', function (event) {
    handleDragStart(event);
  });

  question.find('.draggable').on('dragend', handleDragEnd);
  question.find('.droppable').on('dragenter', handleDragEnter);
  question.find('.droppable').on('dragleave', handleDragLeave);
  question.find('.droppable').on('dragover', event => event.preventDefault());
  question.find('.droppable').on('drop', handleDrop);

  // let originalPosition;

  question.find('.draggable').on('touchstart', function (event) {
    const dragged = $(this);
    // originalPosition = dragged.offset(); // Salva a posição original
    handleDragStart(event, event.handleObj.type);
  });

  question.find('.draggable').on('touchmove', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do toque
    // DESCOMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
    // let touch = event.originalEvent.touches[0];

    // DESCOMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
    // dragged.offset({
    //   top: touch.pageY - dragged.outerHeight() / 2,
    //   left: touch.pageX - dragged.outerWidth() / 2,
    // });
  });

  // DESCOMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
  // const sobreposicaoMinima = 0.5; // Ajuste este valor conforme necessário

  // DESCOMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
  // question.find('.draggable').on('touchend', function (event) {
  //   const dragged = $(this);
  //   const boudingRectDragged = dragged[0].getBoundingClientRect();
  //   const drop = $(`.droppable`);
  //   $('.draggable').removeClass('is-dragging');

  //   drop.each(function (index, area) {
  //     const boundingRect = $(this)[0].getBoundingClientRect();

  //     // Calcula a sobreposição nas duas direções (horizontal e vertical)
  //     const sobreposicaoHorizontal = Math.max(
  //       0,
  //       Math.min(boundingRect.right, boudingRectDragged.right) - Math.max(boundingRect.left, boudingRectDragged.left)
  //     );
  //     const sobreposicaoVertical = Math.max(
  //       0,
  //       Math.min(boundingRect.bottom, boudingRectDragged.bottom) - Math.max(boundingRect.top, boudingRectDragged.top)
  //     );

  //     const areaSobreposta =
  //       (sobreposicaoHorizontal * sobreposicaoVertical) / (boudingRectDragged.width * boudingRectDragged.height);

  //     if (areaSobreposta > sobreposicaoMinima) {
  //       // O elemento foi solto na área de destino (mesmo que parcialmente)
  //       handleDrop(event, event.handleObj.type, this);
  //       console.log('Elemento solto na área correta:', this);
  //     }
  //   });

  //   dragged.offset(originalPosition);
  // });

  question.find('.droppable').on('touchend', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do toque
    handleDragEnd(event, event.handleObj.type);
  });

  question.find('.droppable').on('touchmove', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do toque
    // handleDragStart(event, event.handleObj.type);
  });
};

let dragged = null;

// Verifica se todos os itens já foram arrastados para liberar o botão de salvamento das informações.
const checkRequirements = function (question) {
  let draggableLength = question.find('.draggable-content .draggable').length;
  let droppedLength = question.find('.dropped').length;

  if (draggableLength === droppedLength) {
    question.find('.question-btn[data-type="save"]').removeClass('disabled');
  }
};

// Lida com o elemento a partir do momento que se inicia o evento de arrastar.
const handleDragStart = (event, eventType) => {
  // let target = $(event.currentTarget);

  let target;
  // console.log(event);

  if (eventType === 'touchstart') {
    // Se for um evento de toque, use event.target para obter o primeiro toque
    target = $(event.target);
  } else {
    // Se for um evento de arrastar padrão, use event.currentTarget
    target = $(event.currentTarget);
  }

  dragged = target;

  $('.draggable').removeClass('is-dragging');
  target.addClass('is-dragging');
};

// Lida com o element a partir do momento em que o evento de arrastar termina.
const handleDragEnd = (event, eventType) => {
  // let target = $(event.currentTarget);
  let target;

  if (eventType === 'touchend') {
    // Se for um evento de toque, use event.target para obter o primeiro toque
    target = $(event.target);
    handleDragLeave(event, eventType);
  } else {
    // Se for um evento de arrastar padrão, use event.currentTarget
    target = $(event.currentTarget);
  }

  target.removeClass('is-dragging');
};

// Lida com um elemento "droppable" quando um item "draggable" está entrando de sua área.
const handleDragEnter = (event, eventType) => {
  // let target = $(event.currentTarget);
  let target;

  if (eventType === 'touchstart') {
    // Se for um evento de toque, use event.target para obter o primeiro toque
    target = $(event.target);
  } else {
    // Se for um evento de arrastar padrão, use event.currentTarget
    target = $(event.currentTarget);
  }

  target.addClass('in-dropzone');
};

// Lida com um elemento "droppable" quando um item "draggable" está saindo de sua área.
const handleDragLeave = (event, eventType) => {
  // let target = $(event.currentTarget);
  let target;

  if (eventType === 'touchend') {
    // Se for um evento de toque, use event.touches para obter o primeiro toque
    target = $(event.target);
    handleDrop(event, eventType);
  } else {
    // Se for um evento de arrastar padrão, use event.currentTarget
    target = $(event.currentTarget);
  }

  target.removeClass('in-dropzone');
};

// Lida o processo de soltar o item arrastável.
const handleDrop = (event, eventType, droppableElement) => {
  let element;

  if (eventType === 'touchend') {
    // Se for um evento de toque, use event.touches para obter o primeiro toque
    // DESCOMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
    // element = droppableElement;

    // COMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
    element = $(event.target);
  } else {
    // Se for um evento de arrastar padrão, use event.currentTarget
    element = $(event.currentTarget);
  }

  let currentQuestion = $(element).closest('.question');
  let currentDroppable = $(element);
  let currentDraggable = $(dragged);
  let droppedLength = $(currentDroppable).find('.dropped').length;

  // Extraindo os dados dos atributos.
  let { limit } = $(currentDroppable).data();

  if (droppedLength < limit) {
    // DESCOMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
    // let clone = currentDraggable.clone(true).css('inset', 'unset');

    // COMENTAR AQUI CASO QUEIRA DRAG NO MOBILE
    let clone = currentDraggable.clone(true);

    if (!$(currentDroppable).children().length) {
      $(currentDroppable).empty();
    }

    if (!clone.hasClass('disabled')) {
      clone.removeClass('draggable is-dragging').addClass('dropped');
      clone.off('touchstart touchend touchmove click');
      clone.prop('draggable', false);
      clone.appendTo($(currentDroppable));
    }

    $(currentDroppable).removeClass('in-dropzone');
    currentDraggable.addClass('disabled').removeClass('is-dragging');
  }

  checkRequirements(currentQuestion);
};
