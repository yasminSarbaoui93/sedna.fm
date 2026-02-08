// Media Coordinator for Sedna FM
// Ensures only one media source plays at a time (radio, mood, daily fact, YouTube)

let ytPlayer = null;
const pauseFns = {};

/**
 * Register a pause function for a named source
 * @param {string} name - Source name (e.g. 'radio', 'mood', 'dailyFact')
 * @param {Function} pauseFn - Function that pauses that source
 */
export function registerSource(name, pauseFn) {
  pauseFns[name] = pauseFn;
}

/**
 * Set the YouTube player reference (YT.Player instance)
 * @param {Object} player - YT.Player instance
 */
export function setYouTubePlayer(player) {
  ytPlayer = player;
}

/**
 * Called when any source starts playing.
 * Pauses all other sources including YouTube.
 * @param {string} activeName - The name of the source that just started playing
 */
export function notifyPlay(activeName) {
  // Pause all SoundCloud sources except the active one
  for (const [name, pauseFn] of Object.entries(pauseFns)) {
    if (name !== activeName) {
      try { pauseFn(); } catch (e) { /* ignore */ }
    }
  }

  // Pause YouTube if a non-YouTube source started
  if (activeName !== 'youtube' && ytPlayer) {
    try {
      ytPlayer.pauseVideo();
    } catch (e) { /* iframe may not be ready */ }
  }
}

/**
 * Pause YouTube video (convenience export)
 */
export function pauseYouTube() {
  if (ytPlayer) {
    try { ytPlayer.pauseVideo(); } catch (e) { /* ignore */ }
  }
}
