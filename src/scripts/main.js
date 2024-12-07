// Importação das funções necessárias para a inicialização dos componentes.
import { getSuspendData, checkScormRule } from './framework';

import { setAccordion } from '@components/accordion';
import { setAnimations } from '@components/animations';
import { setTabs } from '@components/tabs';
import { setCard } from '@components/card';
import { setTooltip } from '@components/tooltip';
import { setMedias, setCustomPlyr, handlePodcastSubtitles } from '@components/medias';
import { setInteractive } from '@components/interactive';
import { setPanel } from '@components/panel';
import { setDropContent } from '@components/drop-content';
import { setSlideshow } from '@components/slideshow';
import { setNavigation } from '@components/navigation';

import { setQuestions } from '@components/questions';
import { setQuestionDiscursive } from '@components/question-discursive';
import { setQuestionObjective } from '@components/question-objective';
import { setQuestionMultiple } from '@components/question-multiple';
import { setQuestionSelect } from '@components/question-select';
import { setQuestionMinmax } from '@components/question-minmax';
import { setQuestionAssociative } from '@components/question-associative';
import { setQuestionDragAndDrop } from '@components/question-drag-and-drop';
import { setVideoViewQuestion } from '@components/question-video-view';

import { handleMenu, handleMenuNav } from '@components/menu';
import { setTimelineCustom } from '@components/timeline-custom';

// Inicialização dos componentes.
const init = () => {
  getSuspendData();

  setTimeout(() => {
    setSlideshow();
  }, 1000);

  setAccordion();
  setAnimations();
  setTabs();
  setCard();
  setTooltip();
  setMedias();
  setCustomPlyr();
  setInteractive();
  setPanel();
  setDropContent();

  setNavigation();
  handleMenu();
  handleMenuNav();

  setQuestions();
  setQuestionDiscursive();
  setQuestionObjective();
  setQuestionMultiple();
  setQuestionSelect();
  setQuestionMinmax();
  setQuestionAssociative();
  setQuestionDragAndDrop();
  setVideoViewQuestion();
  handlePodcastSubtitles();
  setTimelineCustom();

  checkScormRule();
};

init();
