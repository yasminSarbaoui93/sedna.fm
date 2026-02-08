// Main entry point for Sedna FM (modularized)

import {
  playTrack,
  playRandomEpisode,
  togglePlayPause,
  playNextTrack,
  embedSoundCloud,
  handleChannelClick,
  widget
} from './modules/player.js';
import { updatePlayPauseIcon, setupArtworkListener, updateChannelHighlighting } from './modules/ui.js';
import { initSubscribe } from './modules/subscribe.js';
import { initScrollIndicators } from './modules/scroll.js';
import { initMoodSelector } from './modules/mood.js';
import { initDailyFact } from './modules/dailyFact.js';
import { setYouTubePlayer, notifyPlay } from './modules/mediaCoordinator.js';

// Patch embedSoundCloud to call setupArtworkListener after widget is created
const _origEmbedSoundCloud = embedSoundCloud;
function patchedEmbedSoundCloud(trackUrl) {
  _origEmbedSoundCloud(trackUrl);
  setTimeout(setupArtworkListener, 400);
}

// Attach click handlers and initialize UI
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('radio-play-btn').addEventListener('click', togglePlayPause);
  document.getElementById('radio-next-btn').addEventListener('click', playNextTrack);

  // Channel button click handlers
  document.querySelectorAll('.channel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const channelId = parseInt(btn.dataset.channel, 10);
      handleChannelClick(channelId);
    });
  });

  // Initialize play/pause icon on load
  updatePlayPauseIcon();
  
  // Initialize channel highlighting (no channel selected initially)
  updateChannelHighlighting(null);

  // Patch embedSoundCloud globally
  window.embedSoundCloud = patchedEmbedSoundCloud;

  // Initialize subscribe forms
  initSubscribe();

  // Initialize scroll indicators
  initScrollIndicators();

  // Initialize mood selector
  initMoodSelector();

  // Initialize daily fact feature
  initDailyFact();

  // Initialize YouTube player for media coordination
  // The YouTube IFrame API calls onYouTubeIframeAPIReady when ready
  function initYouTubePlayer() {
    if (typeof YT !== 'undefined' && YT.Player) {
      const player = new YT.Player('yt-latest-episode', {
        events: {
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING === 1
            if (event.data === 1) {
              notifyPlay('youtube');
            }
          }
        }
      });
      setYouTubePlayer(player);
    }
  }

  // YouTube API may already be loaded or will call onYouTubeIframeAPIReady
  if (typeof YT !== 'undefined' && YT.Player) {
    initYouTubePlayer();
  } else {
    window.onYouTubeIframeAPIReady = initYouTubePlayer;
  }
});
