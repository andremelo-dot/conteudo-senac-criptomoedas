// Importação da biblioteca do Plyr.
import Plyr from './vendor/plyr.min.mjs';

// Importação dos estilos.
import './vendor/plyr.css';
import './video/_video.scss';

export const setMedias = function () {
  // Instanciação do Plyr.
  const players = Plyr.setup('.media-player');

  if (players) {
    players.forEach(player => {
      let currentPlayer = player;

      // Definindo o volume em 50% em todos os players por padrão.
      currentPlayer.volume = 0.5;

      // Observando o evento de play para pausar todos os demais players de vídeo e áudio.
      currentPlayer.on('play', () => {
        let otherPlayers = players.filter(other => other !== player);

        otherPlayers.forEach(other => other.pause());
      });

      // Observando o evento "ended" para adicionar um marcador de finalização no vídeo/áudio.
      currentPlayer.on('ended', event => {
        let completedPlayer = event.target;

        completedPlayer.classList.add('is-completed');
      });
    });
  }
};



export const setCustomPlyr = function () {
  const settings = {
    storage: { enabled: false },
    speed: { selected: 1 },
    volume: 0.5
  }

  var nodePlayers = document.querySelectorAll('.media-player-view');

  let players = []
  if (nodePlayers.length) {
    const setPlayer = (playerWrapper, index) => {

      const isBunny = $(playerWrapper).data('plyr-provider') == "bunny";
      let player = null;
      if (isBunny) {
        let iframe = playerWrapper.querySelector('iframe');
        iframe.id = `bunny-stream-embed-${index}`
        player = new playerjs.Player(iframe)
      } else {
        player = new Plyr(playerWrapper, settings);
      }

      players.push(player)
      player.volume = 0.5;
      const handlePlay = function (e) {
        var others = players.filter(other => other != player)
        others.forEach(function (other) {
          other.pause();
        })
      }

      const handlePlayerTime = function(data){
        let target = data.target ? data.target : playerWrapper;
        let $closestQuestion = $(target).closest('.question');
        
        let viewPercent = $closestQuestion.attr('data-required-view') ?? 70;
        let currentTime = data.seconds || player.currentTime;
        let duration = data.duration || player.duration;
        let playerCurrentTimePercent = (currentTime / duration) * 100;
        console.log('playerCurrentTimePercent', data, playerCurrentTimePercent, viewPercent)
        if (playerCurrentTimePercent >= +viewPercent && !$closestQuestion.hasClass('viewed')) {
          $closestQuestion.addClass('viewed');
          $closestQuestion.trigger('answered');
          alert('finishou')
        }
      }

      player.on('ready', () => {
        player.on('timeupdate', handlePlayerTime);
      })

      player.on('play', handlePlay);
    }

    nodePlayers.forEach(setPlayer);
  }


};

export const handlePodcastSubtitles = function () {
  const button = $('.handle-transcription');

  button.on('click', function () {
    const subtitles = $(this).closest('[data-component]').find('.podcast-subtitles');

    button.toggleClass('is-active');
    subtitles.toggleClass('is-active');
  });
};
