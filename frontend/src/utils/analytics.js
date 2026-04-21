/**
 * Analytics Utility
 * Simple analytics tracking for game events
 */

class Analytics {
  constructor() {
    this.enabled = true;
    this.events = [];
  }

  /**
   * Track an event
   */
  track(eventName, properties = {}) {
    if (!this.enabled) return;

    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.events.push(event);

    // Log locally in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", eventName, properties);
    }

    // In production, send to analytics service
    this.sendToServer(event);
  }

  /**
   * Send event to server
   */
  async sendToServer(event) {
    try {
      // In production, replace with actual analytics endpoint
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Silently fail - analytics should not break the app
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName) {
    this.track("page_view", { page: pageName });
  }

  /**
   * Track game action
   */
  trackGameAction(action, data) {
    this.track(`game_${action}`, data);
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName) {
    this.track("button_click", { button: buttonName });
  }

  /**
   * Track error
   */
  trackError(error, context = {}) {
    this.track("error", {
      message: error.message || error.toString(),
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Track bet placed
   */
  trackBetPlaced(amount, choice) {
    this.track("bet_placed", { amount, choice });
  }

  /**
   * Track game result
   */
  trackGameResult(amount, result, choice) {
    this.track("game_result", { amount, result, choice });
  }

  /**
   * Toggle analytics
   */
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Export singleton
export const analytics = new Analytics();

export default analytics;
