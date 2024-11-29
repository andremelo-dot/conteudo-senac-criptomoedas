import 'vidstack/player/styles/default/theme.css';
// import "vidstack/styles/community-skin/video.css";
import 'vidstack/player/styles/default/layouts/video.css';

import { VidstackPlayer, VidstackPlayerLayout } from 'vidstack/global/player';

export const setVidstackMedias = function () {
  // async function setupPlayers() {
  //   const players = document.querySelectorAll('.vidstack-player');

  //   players.forEach(async player => {
  //     const provider = player.dataset.provider;
  //     const source = player.dataset.source;
  //     const poster = player.dataset.poster;

  //     const src =
  //       {
  //         vimeo: `vimeo/${source}`,
  //         youtube: `youtube/${source}`,
  //         embed: source,
  //       }[provider] || '';

  //     player = await VidstackPlayer.create({
  //       target: player,
  //       title: player.dataset.title,
  //       src: src,
  //       poster: poster,
  //       layout: new VidstackPlayerLayout({
  //         thumbnails: 'https://files.vidstack.io/sprite-fight/thumbnails.vtt',
  //       }),
  //     });
  //   });
  // }

  // setupPlayers();
};
