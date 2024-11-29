import { doLMSInitialize, doLMSGetValue, doLMSSetValue, doLMSCommit } from './api';
import { setDebounce } from './utils';

export let options = {};

export const getSuspendData = () => {
  doLMSInitialize('');

  let data = doLMSGetValue('cmi.suspend_data');
  options = !data ? {} : JSON.parse(data);
  options.sub = options.sub || 0;
  options.required = options.required || 0;
};

export const setScormStatus = (status, score) => {
  const formatScore = parseInt(score).toString();
  doLMSSetValue('cmi.core.lesson_status', status);
  doLMSSetValue('cmi.core.score.raw', formatScore);
  doLMSCommit('');
};

export const saveOptions = () => {
  doLMSSetValue('cmi.suspend_data', JSON.stringify(options));
  doLMSCommit('');
};

export const checkScormRule = () => {
  const body = document.querySelector('.body');
  const rule = body.getAttribute('data-scorm-rule') ? body.getAttribute('data-scorm-rule') : 'view';

  if (!options.rule) {
    options.rule = { name: rule, progress: 0 };

    saveOptions();
  }

  if (rule === 'activity') {
    checkActivityRule();
    return;
  }

  if (rule === 'view') {
    checkViewRule();
    return;
  }

  if (rule === 'triggered') {
    checkTriggeredRule();
    return;
  }

  if (rule === 'requirements') {
    checkRequirementsRule();
    return;
  }

  if (rule === 'steps') {
    checkStepsRule();
  }
};

const checkActivityRule = () => {
  const questionsLength = document.querySelectorAll('.question').length;
  const questionsCompleted = options.actv.reduce((acc, obj) => (obj.stat[0] === 1 ? acc + 1 : acc), 0);
  const questionsPercent = options.actv.reduce((acc, obj) => (obj.stat[1] === 1 ? acc + obj.scor[2] : acc), 0);
  const percent = parseInt(questionsPercent / questionsLength);

  options.rule = { ...options.rule, total: questionsLength, completed: questionsCompleted, progress: percent };
  saveOptions();

  const { scormPercent } = document.querySelector('.body').dataset;
  let scormStatus = 'incomplete';

  if (!scormPercent && options.rule.total === options.rule.completed) {
    scormStatus = 'completed';
  } else if (options.rule.progress >= +scormPercent) {
    scormStatus = 'completed';
  }

  setScormStatus(scormStatus, options.rule.progress);
};

const checkViewRule = () => {
  const { scormPercent } = document.querySelector('.body').dataset;

  if (!scormPercent) {
    options.rule.progress = 100;
    saveOptions();

    setScormStatus('completed', 100);
    return;
  }

  let previousScroll = 0;
  let maxScroll = 0;
  let maxProgress = options.rule.progress || 0;

  const checkScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > previousScroll) {
      maxScroll = Math.max(maxScroll, currentScroll);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = parseInt((maxScroll / totalHeight) * 100);
      maxProgress = maxProgress < progress ? progress : maxProgress;
    }

    previousScroll = currentScroll;

    if (maxProgress > options.rule.progress) {
      options.rule.progress = maxProgress;
      saveOptions();
    }

    if (options.rule.progress >= scormPercent) {
      setScormStatus('completed', options.rule.progress);
    } else {
      setScormStatus('incomplete', options.rule.progress);
    }
  };

  window.addEventListener('scroll', setDebounce(checkScroll));
};

const checkTriggeredRule = () => {
  const trigger = document.querySelector('.complete-trigger');

  if (!options.rule.progress) {
    options.rule.progress = 0;
    saveOptions();
  }

  trigger.addEventListener('click', () => {
    options.rule.progress = 100;
    saveOptions();

    setScormStatus('completed', 100);
  });
};

const checkRequirementsRule = () => {
  const requiredTriggers = document.querySelectorAll('.required');
  const totalRequirements = requiredTriggers.length;
  const scormPercent = document.querySelector('.body').dataset.scormPercent || 100;

  if (!options.rule.total) {
    options.rule = { ...options.rule, total: totalRequirements, completed: [] };

    saveOptions();
  }

  requiredTriggers.forEach((trigger, index) => {
    const atributeId = index + 1;

    trigger.setAttribute('data-id', atributeId);

    if (options.rule.completed.includes(atributeId.toString())) {
      trigger.classList.add('completed');
    }

    trigger.addEventListener('click', () => {
      const { id } = trigger.dataset;

      if (!options.rule.completed.includes(id)) {
        options.rule.completed = [...options.rule.completed, id];
        options.rule.progress = (options.rule.completed.length * 100) / options.rule.total;

        saveOptions();

        trigger.classList.add('completed');
      }

      const { progress } = options.rule;

      if (progress >= scormPercent) {
        setScormStatus('completed', progress);
      } else {
        setScormStatus('incomplete', progress);
      }
    });
  });
};

const checkStepsRule = () => {
  const percent = document.querySelector('.body').dataset.scormPercent || 100;
  const { progress } = options.nvgt;

  if (progress >= percent) {
    setScormStatus('completed', progress);
  } else {
    setScormStatus('incomplete', progress);
  }
};
