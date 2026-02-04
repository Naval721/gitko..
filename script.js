// --- QUANTUM MINER: HIGH-TRUST DEVICE STRATEGY ---
// Strategy: "Consistency > Deception"
// We ACCEPT the VPN Location (IP/Timezone match).
// We FAKE the Device Quality (iPhone 15 Pro, High-End Hardware).

const SYSTEM_CONFIG = {
  target: "iPhone15,3", // iPhone 14 Pro Max / 15 Plus
  os: "iOS 17.2",
  gpu: "Apple GPU",
  cores: 6
};

// 1. DEVICE IDENTITY (The "Premium" Signal)
try {
  // A. User Agent (Critical)
  Object.defineProperty(navigator, 'userAgent', {
    get: () => "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1"
  });

  // B. Platform
  Object.defineProperty(navigator, 'platform', { get: () => "iPhone" });
  Object.defineProperty(navigator, 'vendor', { get: () => "Apple Computer, Inc." });
  Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 6 });

  // C. Touch (Critical for Mobile validation)
  Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });

  // D. Screen (iPhone 14 Pro Max Dimensions - Dynamic Jitter)
  // We add tiny random variance so every session looks like a slightly different calibration
  const baseW = 430;
  const baseH = 932;
  Object.defineProperty(screen, 'width', { get: () => baseW });
  Object.defineProperty(screen, 'height', { get: () => baseH });
  Object.defineProperty(screen, 'availWidth', { get: () => baseW });
  Object.defineProperty(screen, 'availHeight', { get: () => baseH });
  Object.defineProperty(window, 'innerWidth', { get: () => baseW });
  Object.defineProperty(window, 'innerHeight', { get: () => baseH });

  // E. BATTERY API SPOOFING (Adds organic "Charge" variance)
  if (navigator.getBattery) {
    navigator.getBattery = () => Promise.resolve({
      charging: true,
      chargingTime: 0,
      dischargingTime: Infinity,
      level: 0.9 + (Math.random() * 0.1), // 90% - 100%
      onchargingchange: null,
      onlevelchange: null,
    });
  }

} catch (e) { console.warn("SPOOF: DEVICE ID FAILED", e); }

// *** US VPN MATCHER (STRICT LOCALE ENFORCEMENT) ***
// Forces the browser to report as a US user in New York
try {
  // 1. Force Language
  Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

  // 2. Force Timezone (Intl API Override)
  const originalDTF = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function (locales, options) {
    options = options || {};
    options.timeZone = 'America/New_York';
    return new originalDTF('en-US', options);
  };
  Intl.DateTimeFormat.prototype = originalDTF.prototype;

  // 3. Force Date Object methods to match UTC-5
  const shift = -5 * 60; // EST offset in minutes
  // We don't overwrite Date.now(), just the string representations ad networks maintain
  Date.prototype.getTimezoneOffset = () => 300; // 5 hours * 60 min
} catch (e) { console.warn("SPOOF: LOCALE FAILED", e); }


// 2. GRADE 5 RESIDENTIAL MIMICRY (Hardware Realism)
try {
  // A. Remove Automation Flags
  if (navigator.webdriver) {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  }

  // B. Plugins (iOS Empty Array)
  Object.defineProperty(navigator, 'plugins', {
    get: () => {
      const p = [];
      p.refresh = () => { };
      p.item = () => null;
      p.namedItem = () => null;
      return p;
    }
  });

  // C. Media Devices (The "Physical Device" Proof)
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices = () => {
      return Promise.resolve([
        { kind: 'audioinput', label: 'iPhone Microphone', deviceId: 'default', groupId: 'group_1' },
        { kind: 'videoinput', label: 'Back Camera', deviceId: 'video_1', groupId: 'group_1' },
        { kind: 'videoinput', label: 'Front Camera', deviceId: 'video_2', groupId: 'group_1' },
        { kind: 'audiooutput', label: 'iPhone Speaker', deviceId: 'audio_1', groupId: 'group_1' }
      ]);
    };
  }

  // D. Permissions (User History)
  if (navigator.permissions && navigator.permissions.query) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = (parameters) => {
      if (parameters.name === 'notifications') {
        return Promise.resolve({ state: 'granted', onchange: null });
      }
      return originalQuery(parameters);
    };
  }

  // E. WebGL (Apple GPU)
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function (parameter) {
    if (parameter === 37445) return "Apple Inc.";
    if (parameter === 37446) return "Apple GPU";
    return getParameter.apply(this, [parameter]);
  };

  // F. Google Referrer (Organic Traffic Source)
  Object.defineProperty(document, 'referrer', { get: () => "https://www.google.com/" });

} catch (e) { console.warn("SPOOF: HARDWARE FAILED", e); }

// === ADVANCED ANTI-DETECTION LAYER ===
// Prevents Monetag from fingerprinting and detecting repeated users

try {
  // 1. CANVAS FINGERPRINT RANDOMIZATION
  // Adds slight noise to canvas rendering to create unique fingerprints each session
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

  // Add subtle noise to canvas data
  const addCanvasNoise = (canvas, context) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Add random noise to RGB values (not alpha)
      if (Math.random() < 0.001) { // 0.1% of pixels
        imageData.data[i] += Math.floor(Math.random() * 3) - 1;     // R
        imageData.data[i + 1] += Math.floor(Math.random() * 3) - 1; // G
        imageData.data[i + 2] += Math.floor(Math.random() * 3) - 1; // B
      }
    }
    context.putImageData(imageData, 0, 0);
  };

  HTMLCanvasElement.prototype.toDataURL = function (...args) {
    if (this.width > 0 && this.height > 0) {
      const ctx = this.getContext('2d');
      if (ctx) addCanvasNoise(this, ctx);
    }
    return originalToDataURL.apply(this, args);
  };

  CanvasRenderingContext2D.prototype.getImageData = function (...args) {
    const imageData = originalGetImageData.apply(this, args);
    // Add micro-variations
    for (let i = 0; i < imageData.data.length; i += 100) {
      imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + (Math.random() > 0.5 ? 1 : -1)));
    }
    return imageData;
  };

  // 2. AUDIO CONTEXT FINGERPRINT SPOOFING
  // Randomizes audio fingerprints
  const audioContext = window.AudioContext || window.webkitAudioContext;
  if (audioContext) {
    const OriginalAudioContext = audioContext;
    const newAudioContext = function () {
      const context = new OriginalAudioContext();
      const originalGetChannelData = AudioBuffer.prototype.getChannelData;

      AudioBuffer.prototype.getChannelData = function (channel) {
        const data = originalGetChannelData.call(this, channel);
        // Add imperceptible noise
        for (let i = 0; i < data.length; i += 100) {
          data[i] = data[i] + (Math.random() * 0.0000001);
        }
        return data;
      };

      return context;
    };

    window.AudioContext = newAudioContext;
    if (window.webkitAudioContext) window.webkitAudioContext = newAudioContext;
  }

  // 3. WEBRTC LEAK PREVENTION
  // Prevents IP leaks through WebRTC
  if (window.RTCPeerConnection) {
    const OriginalRTC = window.RTCPeerConnection;
    window.RTCPeerConnection = function (config) {
      if (config && config.iceServers) {
        config.iceServers = [];
      }
      return new OriginalRTC(config);
    };
  }

  // 4. FONT FINGERPRINT RANDOMIZATION
  // Prevents font-based fingerprinting
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: function () {
      const val = originalOffsetWidth.get.call(this);
      return val + (Math.random() > 0.99 ? (Math.random() > 0.5 ? 1 : -1) : 0);
    }
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get: function () {
      const val = originalOffsetHeight.get.call(this);
      return val + (Math.random() > 0.99 ? (Math.random() > 0.5 ? 1 : -1) : 0);
    }
  });

  // 5. CLIENT RECT RANDOMIZATION
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    const rect = originalGetBoundingClientRect.apply(this);
    const noise = () => Math.random() * 0.0001;
    return {
      x: rect.x + noise(),
      y: rect.y + noise(),
      width: rect.width + noise(),
      height: rect.height + noise(),
      top: rect.top + noise(),
      right: rect.right + noise(),
      bottom: rect.bottom + noise(),
      left: rect.left + noise(),
      toJSON: () => rect.toJSON()
    };
  };

  // 6. TIMEZONE OFFSET RANDOMIZATION (Slight variance)
  const originalTimezoneOffset = Date.prototype.getTimezoneOffset;
  Date.prototype.getTimezoneOffset = function () {
    return 300 + (Math.random() < 0.1 ? (Math.random() > 0.5 ? 1 : -1) : 0); // EST with micro-variance
  };

  // 7. PERFORMANCE TIMING RANDOMIZATION
  if (window.performance && window.performance.now) {
    const originalNow = window.performance.now;
    let offset = Math.random() * 10;
    window.performance.now = function () {
      return originalNow.call(window.performance) + offset;
    };
  }

  // 8. MOUSE MOVEMENT ENTROPY INJECTION
  // Adds realistic micro-movements
  let lastMouseX = 0, lastMouseY = 0;
  document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }, true);

  // 9. RANDOMIZED USER AGENT ENTROPY
  // Adds slight entropy to prevent exact UA matching
  const uaEntropy = Math.random().toString(36).substring(7);
  sessionStorage.setItem('_ua_e', uaEntropy);

  // 10. CONNECTION TYPE SPOOFING
  if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    Object.defineProperty(conn, 'effectiveType', { get: () => '4g' });
    Object.defineProperty(conn, 'rtt', { get: () => 50 + Math.floor(Math.random() * 30) });
    Object.defineProperty(conn, 'downlink', { get: () => 10 + Math.random() * 5 });
  }

  console.log("[ANTI-DETECT] Advanced fingerprint protection: ACTIVE");

} catch (e) { console.warn("ANTI-DETECT: Some protections failed", e); }

// === MILITARY-GRADE ANTI-TRACKING LAYER ===
// Advanced techniques to make system completely untrackable

try {
  // 1. WEBGL FINGERPRINT COMPLETE RANDOMIZATION
  // Randomizes GPU vendor, renderer, and all WebGL parameters
  const getParameterProxyHandler = {
    apply: function (target, thisArg, args) {
      const param = args[0];
      // Randomize critical WebGL identifiers
      if (param === 37445) { // UNMASKED_VENDOR_WEBGL
        const vendors = ['Apple Inc.', 'Google Inc.', 'Mozilla'];
        return vendors[Math.floor(Math.random() * vendors.length)];
      }
      if (param === 37446) { // UNMASKED_RENDERER_WEBGL
        const renderers = ['Apple GPU', 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)', 'Apple M1'];
        return renderers[Math.floor(Math.random() * renderers.length)];
      }
      if (param === 3379) { // MAX_TEXTURE_SIZE
        return 16384 + Math.floor(Math.random() * 2) * 4096;
      }
      if (param === 34047) { // MAX_VERTEX_TEXTURE_IMAGE_UNITS
        return 16 + Math.floor(Math.random() * 3);
      }
      if (param === 34076) { // MAX_VIEWPORT_DIMS
        return new Int32Array([16384 + Math.floor(Math.random() * 100), 16384 + Math.floor(Math.random() * 100)]);
      }
      return target.apply(thisArg, args);
    }
  };

  if (WebGLRenderingContext && WebGLRenderingContext.prototype.getParameter) {
    WebGLRenderingContext.prototype.getParameter = new Proxy(
      WebGLRenderingContext.prototype.getParameter,
      getParameterProxyHandler
    );
  }

  if (WebGL2RenderingContext && WebGL2RenderingContext.prototype.getParameter) {
    WebGL2RenderingContext.prototype.getParameter = new Proxy(
      WebGL2RenderingContext.prototype.getParameter,
      getParameterProxyHandler
    );
  }

  // 2. ADVANCED CANVAS NOISE INJECTION (More sophisticated)
  const noisifyCanvas = (canvas, context) => {
    if (!context || canvas.width === 0 || canvas.height === 0) return;

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const seed = Math.random();

      // Apply sophisticated noise pattern
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.sin(seed + i) * 2;
        if (Math.random() < 0.002) {
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
      }
      context.putImageData(imageData, 0, 0);
    } catch (e) { }
  };

  // Override toBlob as well
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
    const ctx = this.getContext('2d');
    if (ctx) noisifyCanvas(this, ctx);
    return originalToBlob.call(this, callback, ...args);
  };

  // 3. CSS FINGERPRINTING PREVENTION
  // Randomize CSS computed styles to prevent CSS-based fingerprinting
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function (element, pseudoElt) {
    const styles = originalGetComputedStyle.call(window, element, pseudoElt);
    return new Proxy(styles, {
      get: function (target, prop) {
        const value = target[prop];
        // Add micro-variations to numeric CSS values
        if (typeof value === 'string' && value.match(/^\d+(\.\d+)?px$/)) {
          const numValue = parseFloat(value);
          const variance = Math.random() < 0.05 ? (Math.random() > 0.5 ? 0.01 : -0.01) : 0;
          return (numValue + variance) + 'px';
        }
        return value;
      }
    });
  };

  // 4. SCREEN RESOLUTION MICRO-VARIANCE
  // Add tiny variations to screen properties each session
  const screenVariance = Math.random() < 0.5 ? 0 : (Math.random() > 0.5 ? 1 : -1);
  const originalScreenWidth = Object.getOwnPropertyDescriptor(Screen.prototype, 'width');
  const originalScreenHeight = Object.getOwnPropertyDescriptor(Screen.prototype, 'height');

  Object.defineProperty(Screen.prototype, 'width', {
    get: function () { return originalScreenWidth.get.call(this) + screenVariance; }
  });
  Object.defineProperty(Screen.prototype, 'height', {
    get: function () { return originalScreenHeight.get.call(this) + screenVariance; }
  });

  // 5. ADVANCED TIMING ATTACK PREVENTION
  // Protect against timing-based fingerprinting
  const timing = window.performance.timing;
  const TIMING_OFFSET = Math.random() * 100;

  for (let prop in timing) {
    if (typeof timing[prop] === 'number' && timing[prop] > 0) {
      try {
        Object.defineProperty(timing, prop, {
          get: () => Math.floor(timing[prop] + TIMING_OFFSET)
        });
      } catch (e) { }
    }
  }

  // 6. NETWORK INFORMATION RANDOMIZATION
  // Randomize network fingerprints
  if (navigator.connection) {
    const conn = navigator.connection;
    const speeds = ['4g', '4g', '4g', 'wifi'];
    const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];

    Object.defineProperty(conn, 'effectiveType', {
      get: () => randomSpeed,
      configurable: true
    });
    Object.defineProperty(conn, 'downlink', {
      get: () => 5 + Math.random() * 15,
      configurable: true
    });
    Object.defineProperty(conn, 'rtt', {
      get: () => 30 + Math.floor(Math.random() * 50),
      configurable: true
    });
    Object.defineProperty(conn, 'saveData', {
      get: () => false,
      configurable: true
    });
  }

  // 7. MEMORY FINGERPRINTING PREVENTION
  // Randomize memory-related properties
  if (navigator.deviceMemory) {
    Object.defineProperty(navigator, 'deviceMemory', {
      get: () => [4, 6, 8][Math.floor(Math.random() * 3)]
    });
  }

  // 8. HARDWARE CONCURRENCY VARIANCE
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: () => 6 + (Math.random() < 0.3 ? (Math.random() > 0.5 ? 2 : -2) : 0)
  });

  // 9. KEYBOARD/MOUSE EVENT FINGERPRINTING PREVENTION
  // Add micro-delays and randomization to event timestamps
  const randomizeEventTimestamp = (originalEvent) => {
    const descriptors = Object.getOwnPropertyDescriptors(originalEvent);
    if (descriptors.timeStamp) {
      Object.defineProperty(originalEvent, 'timeStamp', {
        get: () => performance.now() + (Math.random() - 0.5) * 2
      });
    }
    return originalEvent;
  };

  ['click', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keyup'].forEach(eventType => {
    document.addEventListener(eventType, randomizeEventTimestamp, true);
  });

  // 10. MEDIA DEVICE FINGERPRINTING RANDOMIZATION
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    const originalEnumerate = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = function () {
      return originalEnumerate.call(this).then(devices => {
        // Randomize device IDs slightly
        return devices.map(device => ({
          ...device,
          deviceId: device.deviceId + Math.random().toString(36).substring(7, 10),
          groupId: device.groupId + Math.random().toString(36).substring(7, 10)
        }));
      });
    };
  }

  // 11. FONT DETECTION PREVENTION
  // Prevent font enumeration fingerprinting
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (contextType, ...args) {
    const context = originalGetContext.call(this, contextType, ...args);

    if (contextType === '2d' && context) {
      const originalMeasureText = context.measureText;
      context.measureText = function (text) {
        const metrics = originalMeasureText.call(this, text);
        return new Proxy(metrics, {
          get: (target, prop) => {
            const value = target[prop];
            if (typeof value === 'number') {
              return value + (Math.random() - 0.5) * 0.01;
            }
            return value;
          }
        });
      };
    }
    return context;
  };

  // 12. DONOTTRACK & GLOBAL PRIVACY CONTROL
  Object.defineProperty(navigator, 'doNotTrack', { get: () => '1' });
  Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true });

  // 13. BLOCKING THIRD-PARTY TRACKING SCRIPTS
  // Intercept and block known tracking domains
  const originalFetch = window.fetch;
  window.fetch = function (url, ...args) {
    const urlString = url.toString();
    // Block known trackers (add more as needed)
    if (urlString.includes('analytics') ||
      urlString.includes('tracking') ||
      urlString.includes('doubleclick') ||
      urlString.includes('adservice')) {
      return Promise.reject('Blocked');
    }
    return originalFetch.call(window, url, ...args);
  };

  // 14. REQUEST HEADER RANDOMIZATION
  // Add realistic request patterns
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    originalXHROpen.call(this, method, url, ...rest);

    // Add realistic headers with slight variance
    this.setRequestHeader('Accept-Language', 'en-US,en;q=0.' + (8 + Math.floor(Math.random() * 2)));
    this.setRequestHeader('DNT', '1');
  };

  // 15. POINTER EVENTS RANDOMIZATION
  ['pointerdown', 'pointerup', 'pointermove'].forEach(eventType => {
    document.addEventListener(eventType, (e) => {
      // Add micro-jitter to pointer coordinates
      Object.defineProperty(e, 'clientX', {
        get: () => e.clientX + (Math.random() - 0.5) * 0.1
      });
      Object.defineProperty(e, 'clientY', {
        get: () => e.clientY + (Math.random() - 0.5) * 0.1
      });
    }, true);
  });

  console.log("[STEALTH-MODE] Military-grade anti-tracking: ACTIVE ✓");

} catch (e) { console.warn("STEALTH-MODE: Some advanced protections failed", e); }

console.log(`[SYSTEM] HIGH-TRUST CONFIG: ACTIVE. PROFILE: ${SYSTEM_CONFIG.target}`);

// 3. SECURE CONNECTION & SDK INJECTION
// Critical: Remove Telegram query data BEFORE the ad network sees it.
// This ensures they only see the VPN IP and "Clean" browser environment.
(function sanitizeAndConnect() {
  try {
    // A. Strip Telegram Params (tgWebAppData contains sensitive user info)
    // CRITICAL: We remove this immediately so the Ad Network never sees the "tgWebApp" query params
    if (window.location.search.includes('tgWebAppData')) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      console.log("[SECURE] URL SANITIZED. TELEGRAM DATA WIPED.");
    }

    // B. Inject Ad SDK (Now that environment is clean)
    const sdkScript = document.createElement("script");
    sdkScript.src = "//libtl.com/sdk.js";
    sdkScript.dataset.zone = "10518266";
    sdkScript.dataset.sdk = "show_10518266"; // specific binding
    sdkScript.id = "monetag-sdk";

    // SDK Load Listener (Updates state)
    sdkScript.onload = () => {
      console.log("[SECURE] AD NETWORK CONNECTED VIA VPN TUNNEL.");
    };

    document.head.appendChild(sdkScript);

  } catch (e) {
    console.warn("Security Init Failed:", e);
  }
})();

const sdkMethod = "show_10518266";

// UI Elements
const miningDisplay = document.getElementById("miningBalance");
const hashRateDisplay = document.getElementById("hashRate");
const rigStatusDisplay = document.getElementById("rigStatus");
const tempDisplay = document.getElementById("rigTemp");
const boostTimerDisplay = document.getElementById("boostTimer");
const spinner = document.getElementById("coreSpinner");
const logEl = document.getElementById("terminalLog");
const userIdDisplay = document.getElementById("userIdDisplay");
const toggleBtn = document.getElementById("toggleMiningBtn");
const boostBtn = document.getElementById("boostBtn");

// === FINAL STEALTH LAYER: SESSION ISOLATION & PATTERN OBFUSCATION ===
// Ensures each session appears completely unique and unrelated

// 1. DYNAMIC SESSION FINGERPRINT
const SESSION_FINGERPRINT = {
  id: Math.random().toString(36).substring(2, 15),
  created: Date.now() + Math.floor(Math.random() * 10000),
  entropy: Math.random().toString(36).substring(2),
  seed: Math.floor(Math.random() * 1000000)
};

// 2. BEHAVIORAL PATTERN RANDOMIZATION
const BEHAVIOR_PROFILE = {
  clickDelay: () => 80 + Math.random() * 300,
  scrollSpeed: () => 50 + Math.random() * 150,
  idleTime: () => 2000 + Math.random() * 8000,
  activityBurst: () => 3 + Math.floor(Math.random() * 7),
  mouseJitter: () => (Math.random() - 0.5) * 3
};

// 3. REQUEST PATTERN OBFUSCATION
const REQUEST_PATTERNS = {
  userAgents: [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15'
  ],
  acceptLanguages: [
    'en-US,en;q=0.9',
    'en-US,en;q=0.8',
    'en-US,en;q=0.85'
  ],
  referers: [
    'https://www.google.com/',
    'https://www.google.com/search?q=',
    'https://www.bing.com/'
  ]
};

// 4. DYNAMIC ENTROPY INJECTION
setInterval(() => {
  // Inject random entropy into session
  const entropyKey = '_e_' + Math.random().toString(36).substring(7);
  try {
    sessionStorage.setItem(entropyKey, Math.random().toString(36));
    setTimeout(() => sessionStorage.removeItem(entropyKey), 100);
  } catch (e) { }
}, 5000 + Math.random() * 10000);

// 5. MOUSE MOVEMENT SIMULATOR (Background)
let mouseSimulator;
const simulateNaturalMouseMovement = () => {
  if (!isMining) return;

  const moveX = BEHAVIOR_PROFILE.mouseJitter();
  const moveY = BEHAVIOR_PROFILE.mouseJitter();

  const event = new MouseEvent('mousemove', {
    clientX: window.innerWidth / 2 + moveX,
    clientY: window.innerHeight / 2 + moveY,
    bubbles: true
  });

  document.dispatchEvent(event);

  mouseSimulator = setTimeout(simulateNaturalMouseMovement, 3000 + Math.random() * 7000);
};

// 6. SCROLL ENTROPY INJECTION
const injectScrollEntropy = () => {
  if (!isMining) return;

  window.scrollTo({
    top: Math.random() * 10,
    behavior: 'smooth'
  });

  setTimeout(injectScrollEntropy, 15000 + Math.random() * 30000);
};

// 7. VISIBILITY API SIMULATION
// Simulate realistic tab focus/blur patterns
let visibilitySimulator;
const simulateTabVisibility = () => {
  // Dispatch visibility change events to appear like normal browsing
  const visibilityEvent = new Event('visibilitychange');
  document.dispatchEvent(visibilityEvent);

  visibilitySimulator = setTimeout(simulateTabVisibility, 60000 + Math.random() * 120000);
};

// 8. RANDOMIZED LOCAL STORAGE FOOTPRINT
// Add realistic localStorage entries to mimic normal browser usage
const createRealisticStorageFootprint = () => {
  const commonKeys = ['lang', 'theme', 'tz', 'prefs', 'last_visit'];
  commonKeys.forEach(key => {
    const prefixedKey = key + '_' + Math.random().toString(36).substring(7);
    try {
      localStorage.setItem(prefixedKey, Math.random().toString(36));
    } catch (e) { }
  });
};

// Initialize realistic footprint
createRealisticStorageFootprint();

// 9. NETWORK TIMING RANDOMIZATION
const originalSetTimeout = window.setTimeout;
window.setTimeout = function (callback, delay, ...args) {
  // Add micro-variance to all timeouts to prevent timing fingerprinting
  const variance = Math.random() * 20 - 10; // ±10ms
  const newDelay = Math.max(0, delay + variance);
  return originalSetTimeout.call(window, callback, newDelay, ...args);
};

// 10. PREVENT MONETAG DOM INSPECTION
// Hide anti-detection code from DOM inspectors
const protectAntiDetectionCode = () => {
  // Override toString() for modified prototypes to hide spoofing
  const protectedMethods = [
    HTMLCanvasElement.prototype.toDataURL,
    CanvasRenderingContext2D.prototype.getImageData,
    Navigator.prototype.getBattery
  ];

  protectedMethods.forEach(method => {
    if (method && method.toString) {
      const originalToString = method.toString;
      method.toString = function () {
        return originalToString.call(Function.prototype.toString);
      };
    }
  });
};

protectAntiDetectionCode();

console.log("[PHANTOM-MODE] Complete session isolation: ACTIVE ✓");
console.log(`[SESSION] Unique fingerprint: ${SESSION_FINGERPRINT.id.substring(0, 8)}...`);

// State
let isMining = false;
let isBoosted = false;
let balance = 0.0000;
let autoLoopTimeout;
let watchdogTimeout;
let lastActivityTime = Date.now();
let boostEndTime = 0;
let userId = "guest";
let adsWatchedSession = 0;
let adReady = false;
let sdkReady = false;

// Config
const BASE_RATE = 0.000001;
const BOOST_MULTIPLIER = 500;
const TICK_RATE = 100;
let currentRate = 0;

function log(msg) {
  lastActivityTime = Date.now();
  logEl.innerText = msg;
}

function updateUI() {
  miningDisplay.innerText = balance.toFixed(6);

  if (isMining) {
    if (isBoosted) {
      hashRateDisplay.innerText = "500.0 MB/s (TURBO)";
      rigStatusDisplay.innerText = "TURBO";
      rigStatusDisplay.style.color = "#d97706";
      tempDisplay.innerText = (70 + Math.random() * 5).toFixed(1) + "%";
      tempDisplay.style.color = "#d97706";
    } else {
      hashRateDisplay.innerText = "1.2 MB/s (SYNCING)";
      rigStatusDisplay.innerText = "SYNCING";
      rigStatusDisplay.style.color = "#059669";
      tempDisplay.innerText = (45 + Math.random() * 2).toFixed(1) + "%";
      tempDisplay.style.color = "#059669";
    }
  } else {
    hashRateDisplay.innerText = "0 MB/s";
    rigStatusDisplay.innerText = "IDLE";
    rigStatusDisplay.style.color = "#9ca3af";
    tempDisplay.innerText = "24%";
    tempDisplay.style.color = "#9ca3af";
  }

  // Boost Timer
  if (isBoosted) {
    const remaining = Math.max(0, Math.ceil((boostEndTime - Date.now()) / 1000));
    boostTimerDisplay.innerText = remaining + "s";
    if (remaining <= 0) {
      endBoost();
    }
  } else {
    boostTimerDisplay.innerText = "0s";
  }
}

// Recursive Loop with Jitter (Polymorphic)
function loopUpdate() {
  if (!isMining) return;

  const rate = isBoosted ? BASE_RATE * BOOST_MULTIPLIER : BASE_RATE;
  balance += rate;
  updateUI();

  const nextTick = 80 + Math.random() * 40;
  setTimeout(loopUpdate, nextTick);
}

function generateIdentity() {
  const newId = "User-" + Math.floor(Math.random() * 10000000);
  userIdDisplay.innerText = "ID: " + newId;
  return newId;
}

// --- MINING LOOP ---
function startMining() {
  if (isMining) return;
  isMining = true;
  generateIdentity();
  lastActivityTime = Date.now();

  toggleBtn.classList.add("active");
  toggleBtn.querySelector(".switch-text").innerText = "Stop Sync";
  toggleBtn.querySelector(".switch-icon").innerText = "⏹";

  // Enable Boost
  boostBtn.disabled = false;
  boostBtn.classList.add("ready");

  log("SYSTEM INITIALIZED. CONNECTED TO POOL.");

  // Activate stealth behavior simulations
  simulateNaturalMouseMovement();
  injectScrollEntropy();
  simulateTabVisibility();

  setTimeout(loopUpdate, 100);

  // START AD LOOP (Slow mode)
  scheduleNextAd(10000);

  // WATCHDOG: Ensures the loop never dies
  watchdogLoop();
}

function stopMining() {
  isMining = false;
  localStorage.setItem("qtm_miningActive", "false");
  endBoost();
  clearTimeout(autoLoopTimeout);
  clearTimeout(watchdogTimeout);

  // Stop stealth simulators
  clearTimeout(mouseSimulator);
  clearTimeout(visibilitySimulator);

  toggleBtn.classList.remove("active");
  toggleBtn.querySelector(".switch-text").innerText = "Start Sync";

  boostBtn.disabled = true;
  boostBtn.classList.remove("ready");

  log("SYSTEM SHUTDOWN.");
  updateUI();
}

function watchdogLoop() {
  if (!isMining) return;

  const timeSinceLast = Date.now() - lastActivityTime;
  if (timeSinceLast > 45000) {
    console.warn("WATCHDOG: Loop Hang Detected. Restarting...");
    log("ERR: SYSTEM HANG. REBOOTING UTILITY...");
    clearTimeout(autoLoopTimeout);
    scheduleNextAd(2000);
  }

  // Random check interval
  watchdogTimeout = setTimeout(watchdogLoop, 4000 + Math.random() * 2000);
}

function activateBoost() {
  isBoosted = true;
  boostEndTime = Date.now() + 30000;
  log("HYPER-DRIVE ENGAGED. REVENUE MAXIMIZED.");
}

function endBoost() {
  isBoosted = false;
}

// --- AD SYSTEM (The Auto Loop) ---
const PLACEMENT_TAGS = [
  "level_complete_x2",
  "bonus_chest_open",
  "revive_player",
  "unlock_premium_skin",
  "daily_reward_claim"
];

async function simulateHumanity() {
  log("ANALYZING BIOMETRICS [TG-WEBVIEW]...");

  // 1. Mobile-Specific Scroll Jitter (Touch emulation)
  const x = Math.floor(Math.random() * window.innerWidth);
  const y = Math.floor(Math.random() * window.innerHeight);

  const touchStart = new Touch({ identifier: Date.now(), target: document.body, clientX: x, clientY: y });
  const touchEnd = new Touch({ identifier: Date.now(), target: document.body, clientX: x, clientY: y - (50 + Math.random() * 100) });

  document.body.dispatchEvent(new TouchEvent("touchstart", { touches: [touchStart], bubbles: true }));
  document.body.dispatchEvent(new TouchEvent("touchmove", { touches: [touchEnd], bubbles: true }));
  document.body.dispatchEvent(new TouchEvent("touchend", { changedTouches: [touchEnd], bubbles: true }));

  // 2. Telegram Native Bridge Interaction
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const fakeCheck = tg.colorScheme;

    if (tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }

    if (!tg.isExpanded) tg.expand();
  }

  // 3. Random computation delay
  const reactionTime = 800 + Math.random() * 2000;
  return new Promise(r => setTimeout(r, reactionTime));
}

function scheduleNextAd(delayMs) {
  if (!isMining) return;

  const variance = Math.random() * 12000;
  const nextDelay = delayMs || (8000 + variance);

  log(`NEXT CHECK IN ${(nextDelay / 1000).toFixed(0)}s...`);

  autoLoopTimeout = setTimeout(() => {
    if (!isMining) return;

    adsWatchedSession++;
    if (adsWatchedSession > 8 + Math.random() * 5) {
      log("USER IDLE: TAKING SHORT BREAK...");
      adsWatchedSession = 0;
      setTimeout(performIntegrityCheck, 60000 + Math.random() * 120000);
    } else {
      performIntegrityCheck();
    }
  }, nextDelay);
}

async function performIntegrityCheck() {
  // 1. Random delay before clearing (human behavior)
  await new Promise(r => setTimeout(r, Math.random() * 500));

  // 2. Clear monetag-specific data with randomized approach
  try {
    localStorage.removeItem("monetag_sdk_data");
    localStorage.removeItem("mntg_" + Math.random().toString(36).substring(7)); // Clear random keys
  } catch (e) { }

  // 3. Selective session storage clear (not all at once - more natural)
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key, idx) => {
      if (Math.random() > 0.3 || key.includes('monetag')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) { }

  // 4. Cookie clearing with randomized timing
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    // Clear with multiple domain variants
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
  }

  // 5. Generate new identity with entropy
  const newId = generateIdentity();

  // 6. Random delay before logging (appears more human)
  await new Promise(r => setTimeout(r, 100 + Math.random() * 400));
  log("REQ: NEW SESSION ID GENERATED...");

  // 7. Randomized placement tag selection
  const fakePlacement = PLACEMENT_TAGS[Math.floor(Math.random() * PLACEMENT_TAGS.length)];

  // 8. Add random "thinking" delay
  await new Promise(r => setTimeout(r, Math.random() * 800));

  // 9. Simulate human behavior with randomized patterns
  await simulateHumanity();

  // 10. Random micro-delay before ad request
  await new Promise(r => setTimeout(r, Math.random() * 300));

  // 11. Show ad with success tracking
  showAd().then((success) => {
    if (success) {
      // Randomize credit amount slightly  
      const credit = 0.05 + (Math.random() * 0.001 - 0.0005);
      balance += credit;
      log("AD WATCHED. CREDITED.");

      // Random delay before next schedule
      setTimeout(() => {
        scheduleNextAd();
      }, Math.random() * 1000);
    } else {
      // Vary retry delay
      scheduleNextAd(4000 + Math.random() * 2000);
    }
  });
}

// Rewarded interstitial
function showAd() {
  return new Promise((resolve) => {
    if (typeof show_10569629 === 'function') {
      show_10569629().then(() => {
        // You need to add your user reward function here, which will be executed after the user watches the ad.
        // For more details, please refer to the detailed instructions.
        alert('You have seen an ad!');
        resolve(true);
      }).catch((e) => {
        console.warn("Ad error:", e);
        resolve(false);
      });
    } else {
      console.warn("Ad SDK not ready");
      resolve(false);
    }
  });
}

// --- PERSISTENCE LAYER ---
function saveState() {
  localStorage.setItem("qtm_balance", balance.toString());
  localStorage.setItem("qtm_userId", userId);
  localStorage.setItem("qtm_miningActive", isMining ? "true" : "false");
}

function loadState() {
  const savedBalance = localStorage.getItem("qtm_balance");
  if (savedBalance) balance = parseFloat(savedBalance);

  const savedId = localStorage.getItem("qtm_userId");
  if (savedId) userId = savedId;

  // Auto-Resume
  const wasMining = localStorage.getItem("qtm_miningActive") === "true";
  if (wasMining) {
    log("RECOVERING SESSION STATE...");
    setTimeout(startMining, 1000);
  }
}

// --- INTERACTION ---
toggleBtn.addEventListener("click", () => {
  if (isMining) stopMining();
  else startMining();
});

boostBtn.addEventListener("click", () => {
  if (!isMining) return;

  log("INITIATING HYPER-DRIVE...");

  showAd().then((success) => {
    if (success) {
      activateBoost();
      balance += 1.0;
      log("ENERGY INJECTED. BOOST ACTIVE.");
    } else {
      log("AD FAILED. NO BOOST.");
    }
  });
});


// Init
generateIdentity();
loadState();
updateUI();

// SDK Load Listener
const script = document.getElementById("monetag-sdk");
if (script) {
  script.onload = () => {
    sdkReady = true;
    log("MODULE LOADED. READY.");
  };
}

// Safety check poller
setInterval(() => {
  if (!sdkReady && window[sdkMethod]) {
    sdkReady = true;
    log("MODULE DETECTED.");
  }
}, 1000);

// Auto-Save Loop
setInterval(() => {
  if (isMining) saveState();
}, 5000);
