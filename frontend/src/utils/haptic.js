/**
 * Haptic Feedback Utility
 * Handles device vibration for tactile feedback
 */

class HapticManager {
  constructor() {
    this.isSupported = false;
    this.isEnabled = true;
    this.initialize();
  }

  /**
   * Initialize and check support
   */
  initialize() {
    this.isSupported = "vibrate" in navigator;
    if (this.isSupported) {
      console.log("[Haptic] Vibration supported");
    }
  }

  /**
   * Light tap feedback
   */
  light() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate(10);
  }

  /**
   * Medium tap feedback
   */
  medium() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate(20);
  }

  /**
   * Heavy tap feedback
   */
  heavy() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate(30);
  }

  /**
   * Success feedback (double tap)
   */
  success() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate([50, 50, 50]);
  }

  /**
   * Error feedback (strong vibration)
   */
  error() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate([100, 50, 100]);
  }

  /**
   * Warning feedback
   */
  warning() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate([50, 100, 50]);
  }

  /**
   * Selection feedback
   */
  selection() {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate(5);
  }

  /**
   * Custom pattern
   * @param {number[]} pattern - Vibration pattern
   */
  custom(pattern) {
    if (!this.isSupported || !this.isEnabled) return;
    navigator.vibrate(pattern);
  }

  /**
   * Toggle haptic feedback
   */
  toggle() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }
}

// Export singleton instance
export const hapticManager = new HapticManager();

export default hapticManager;
