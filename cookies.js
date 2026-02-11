// ===================================
// COOKIE CONSENT MANAGEMENT
// Dhanshuk Ltd
// ===================================

class CookieConsent {
  constructor() {
    this.cookieName = 'dhanshuk_cookie_consent';
    this.cookieExpiry = 365; // days
    this.init();
  }

  init() {
    // Check if user has already made a choice
    const consent = this.getCookie(this.cookieName);
    
    if (!consent) {
      // Show banner if no consent exists
      this.showBanner();
    } else {
      // Load cookies based on consent
      this.loadCookies(JSON.parse(consent));
    }
  }

  showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-banner">
        <div class="cookie-content">
          <div class="cookie-text">
            <h3>We value your privacy</h3>
            <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our <a href="/cookie-policy.html" target="_blank">Cookie Policy</a>.</p>
          </div>
          <div class="cookie-actions">
            <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Accept All</button>
            <button id="cookie-customize" class="cookie-btn cookie-btn-secondary">Customize</button>
            <button id="cookie-reject" class="cookie-btn cookie-btn-outline">Reject All</button>
          </div>
        </div>
      </div>
      
      <!-- Cookie Settings Modal -->
      <div id="cookie-settings-modal" class="cookie-modal" style="display: none;">
        <div class="cookie-modal-content">
          <div class="cookie-modal-header">
            <h2>Cookie Settings</h2>
            <button id="cookie-modal-close" class="cookie-modal-close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="cookie-modal-body">
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div class="cookie-category-info">
                  <h4>Essential Cookies</h4>
                  <span class="cookie-badge">Always Active</span>
                </div>
              </div>
              <p>These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions you take, such as setting privacy preferences or filling in forms.</p>
            </div>
            
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div class="cookie-category-info">
                  <h4>Analytics Cookies</h4>
                </div>
                <label class="cookie-toggle">
                  <input type="checkbox" id="cookie-analytics" checked>
                  <span class="cookie-slider"></span>
                </label>
              </div>
              <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's performance.</p>
            </div>
            
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div class="cookie-category-info">
                  <h4>Marketing Cookies</h4>
                </div>
                <label class="cookie-toggle">
                  <input type="checkbox" id="cookie-marketing">
                  <span class="cookie-slider"></span>
                </label>
              </div>
              <p>These cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an ad. They may be set by us or third-party providers.</p>
            </div>
            
            <div class="cookie-category">
              <div class="cookie-category-header">
                <div class="cookie-category-info">
                  <h4>Functional Cookies</h4>
                </div>
                <label class="cookie-toggle">
                  <input type="checkbox" id="cookie-functional" checked>
                  <span class="cookie-slider"></span>
                </label>
              </div>
              <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or third-party providers.</p>
            </div>
          </div>
          <div class="cookie-modal-footer">
            <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary">Save Preferences</button>
            <button id="cookie-accept-all-modal" class="cookie-btn cookie-btn-secondary">Accept All</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Accept All button
    document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
      this.acceptAll();
    });

    // Reject All button
    document.getElementById('cookie-reject')?.addEventListener('click', () => {
      this.rejectAll();
    });

    // Customize button
    document.getElementById('cookie-customize')?.addEventListener('click', () => {
      this.showSettings();
    });

    // Modal close button
    document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
      this.hideSettings();
    });

    // Save preferences button
    document.getElementById('cookie-save-preferences')?.addEventListener('click', () => {
      this.savePreferences();
    });

    // Accept all from modal
    document.getElementById('cookie-accept-all-modal')?.addEventListener('click', () => {
      this.acceptAll();
    });
  }

  acceptAll() {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString()
    };
    
    this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
    this.loadCookies(consent);
    this.hideBanner();
  }

  rejectAll() {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString()
    };
    
    this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
    this.loadCookies(consent);
    this.hideBanner();
  }

  showSettings() {
    document.getElementById('cookie-settings-modal').style.display = 'flex';
  }

  hideSettings() {
    document.getElementById('cookie-settings-modal').style.display = 'none';
  }

  savePreferences() {
    const consent = {
      essential: true,
      analytics: document.getElementById('cookie-analytics').checked,
      marketing: document.getElementById('cookie-marketing').checked,
      functional: document.getElementById('cookie-functional').checked,
      timestamp: new Date().toISOString()
    };
    
    this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
    this.loadCookies(consent);
    this.hideSettings();
    this.hideBanner();
  }

  loadCookies(consent) {
    // Load Google Analytics if analytics consent is given
    if (consent.analytics) {
      this.loadGoogleAnalytics();
    }

    // Load marketing scripts if marketing consent is given
    if (consent.marketing) {
      this.loadMarketingScripts();
    }

    // Load functional scripts if functional consent is given
    if (consent.functional) {
      this.loadFunctionalScripts();
    }

    // Log consent for debugging
    console.log('Cookie consent loaded:', consent);
  }

  loadGoogleAnalytics() {
    // Replace 'G-XXXXXXXXXX' with your actual Google Analytics ID
    const GA_ID = 'G-XXXXXXXXXX'; // TODO: Add your GA4 ID here
    
    // Check if already loaded
    if (window.gtag) return;

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID, {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure'
    });

    console.log('Google Analytics loaded');
  }

  loadMarketingScripts() {
    // Add your marketing scripts here (e.g., Facebook Pixel, LinkedIn Insight Tag)
    // Example:
    // const fbPixel = document.createElement('script');
    // fbPixel.innerHTML = `!function(f,b,e,v,n,t,s){...}`;
    // document.head.appendChild(fbPixel);
    
    console.log('Marketing cookies enabled');
  }

  loadFunctionalScripts() {
    // Add functional scripts here (e.g., chat widgets, preference storage)
    console.log('Functional cookies enabled');
  }

  hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 300);
    }
  }

  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}

// Initialize cookie consent when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
  });
} else {
  new CookieConsent();
}

// Export for cookie policy page
window.CookieConsent = CookieConsent;
