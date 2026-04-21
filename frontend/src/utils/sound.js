/**
 * Sound Effects Utility
 * Handles game audio playback
 */

// Sound effects URLs (using base64 for offline support)
// In production, replace with actual audio files

class SoundManager {
  constructor() {
    this.isMuted = false;
    this.volume = 0.5;
    this.sounds = {};
    this.initialized = false;
  }

  /**
   * Initialize sound effects
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Create audio contexts
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      this.initialized = true;
      console.log("[Sound] Audio initialized");
    } catch (error) {
      console.warn("[Sound] Audio not supported:", error);
    }
  }

  /**
   * Play dice roll sound
   */
  async playDiceRoll() {
    if (this.isMuted || !this.initialized) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Dice roll sound - multiple short beeps
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        800,
        this.audioContext.currentTime + 0.1,
      );

      gainNode.gain.setValueAtTime(
        this.volume * 0.3,
        this.audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.15,
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);

      // Second beep
      setTimeout(() => {
        if (this.isMuted || !this.audioContext) return;
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(400, this.audioContext.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(
          1000,
          this.audioContext.currentTime + 0.1,
        );
        gain2.gain.setValueAtTime(
          this.volume * 0.3,
          this.audioContext.currentTime,
        );
        gain2.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + 0.15,
        );
        osc2.start();
        osc2.stop(this.audioContext.currentTime + 0.15);
      }, 100);
    } catch (error) {
      console.warn("[Sound] Error playing dice roll:", error);
    }
  }

  /**
   * Play win sound
   */
  async playWin() {
    if (this.isMuted || !this.initialized) return;

    try {
      // Victory fanfare - ascending notes
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        setTimeout(() => {
          if (this.isMuted || !this.audioContext) return;
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          osc.type = "triangle";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(
            this.volume * 0.3,
            this.audioContext.currentTime,
          );
          gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.3,
          );
          osc.start();
          osc.stop(this.audioContext.currentTime + 0.3);
        }, index * 100);
      });
    } catch (error) {
      console.warn("[Sound] Error playing win sound:", error);
    }
  }

  /**
   * Play lose sound
   */
  async playLose() {
    if (this.isMuted || !this.initialized) return;

    try {
      // Descending sad notes
      const notes = [392, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4

      notes.forEach((freq, index) => {
        setTimeout(() => {
          if (this.isMuted || !this.audioContext) return;
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.connect(gain);
          gain.connect(this.audioContext.destination);
          osc.type = "sawtooth";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(
            this.volume * 0.2,
            this.audioContext.currentTime,
          );
          gain.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + 0.25,
          );
          osc.start();
          osc.stop(this.audioContext.currentTime + 0.25);
        }, index * 120);
      });
    } catch (error) {
      console.warn("[Sound] Error playing lose sound:", error);
    }
  }

  /**
   * Play bet placed sound
   */
  async playBetPlaced() {
    if (this.isMuted || !this.initialized) return;

    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        800,
        this.audioContext.currentTime + 0.1,
      );
      gain.gain.setValueAtTime(
        this.volume * 0.2,
        this.audioContext.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.1,
      );
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn("[Sound] Error playing bet sound:", error);
    }
  }

  /**
   * Play button click sound
   */
  async playClick() {
    if (this.isMuted || !this.initialized) return;

    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.type = "sine";
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(
        this.volume * 0.1,
        this.audioContext.currentTime,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.05,
      );
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.warn("[Sound] Error playing click sound:", error);
    }
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

export default soundManager;
