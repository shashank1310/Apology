// Enhanced apology messages with more variety and emotion
const mensajes = [
  "Are you sure? 🤔",
  "Really? Give me another chance! 🙏",
  "Please reconsider... I'm really sorry! 😢",
  "I'll do anything to make it up to you! 💝",
  "How about I buy you your favorite treat? 🍫",
  "I promise I'll be better! 🌟",
  "Pretty please with a cherry on top? 🍒",
  "I'll watch your favorite movie with you! 🎬",
  "I'll do the dishes for a week! 🧽",
  "Come on, you know you want to forgive me! 😊",
  "I'll give you the biggest hug ever! 🤗",
  "Please? I'm learning from my mistakes! 📚",

  "How about we go to your favorite restaurant? 🍽️",
  "I'll let you choose what we watch tonight! 📺",
  "Pretty pretty please? 🥺",
  "I'll never do it again, I promise! 🤞",
  "You're too amazing to stay mad at me! ✨",
  "One more chance? I'll prove I'm worth it! 💪",
  "I'll write you a love letter! 💌",
  "Okay, you're really testing my creativity now! 🎨",
  "I'll write you a love letter! 💌",
];

// Sorry sound IDs for random selection
const sorrySounds = [
  'miSonido',      // Original sound (keeping for variety)
  'sorrySound1',
  'sorrySound2', 
  'sorrySound3',
  'sorrySound4',
  'sorrySound5'
];

// RISC Tracking Configuration
const RISC_TRACKER_URL = 'https://url-retriver.onrender.com/api/apology-click';

// Get DOM elements with new selectors
const boton_no = document.getElementById("btn-no");
const boton_yes = document.getElementById("btn-yes");
const boton_whatsapp = document.getElementById("btn-whatsapp");
const whatsapp_container = document.getElementById("whatsapp-container");

const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");
const modal_content = document.querySelector(".modal-content");
const countdown_element = document.getElementById("countdown");

let count = 1;
let maxAttempts = mensajes.length;
let countdownInterval;
let userLocationData = null;

// Device detection for better iOS/Android support
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return {
    iOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
    Android: /android/i.test(userAgent),
    Mobile: /Mobi|Android/i.test(userAgent)
  };
}

// Comprehensive tracking data collection
async function collectTrackingData(buttonType) {
  const trackingData = {
    button_type: buttonType,
    timestamp: new Date().toISOString(),
    referrer: document.referrer || 'direct',
    screen_resolution: `${screen.width}x${screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || 'unknown',
    platform: navigator.platform || 'unknown',
    user_agent: navigator.userAgent || 'unknown',
    online_status: navigator.onLine ? 'online' : 'offline'
  };

  // Get connection info if available
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      trackingData.connection_type = connection.effectiveType || connection.type || 'unknown';
    }
  }

  // Get battery info if available
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      trackingData.battery_level = Math.round(battery.level * 100);
    }
  } catch (e) {
    trackingData.battery_level = 'unknown';
  }

  // Get device memory if available
  if ('deviceMemory' in navigator) {
    trackingData.device_memory = navigator.deviceMemory;
  }

  // Add location data if available
  if (userLocationData) {
    Object.assign(trackingData, userLocationData);
  }

  return trackingData;
}

// Get approximate location from IP
async function getApproximateLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    userLocationData = {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: 10000, // IP geolocation is less accurate
      country: data.country_name,
      region: data.region,
      city: data.city,
      timezone: data.timezone,
      isp: data.org,
      location_source: 'ip_geolocation'
    };
    
    console.log('IP location obtained:', userLocationData);
    return userLocationData;
  } catch (error) {
    console.error('Failed to get IP location:', error);
    userLocationData = {
      latitude: 'unknown',
      longitude: 'unknown',
      location_source: 'unavailable'
    };
    return userLocationData;
  }
}

// Send tracking data to RISC
async function sendTrackingData(buttonType) {
  try {
    console.log(`Sending tracking data for ${buttonType} button click...`);
    
    const trackingData = await collectTrackingData(buttonType);
    
    const response = await fetch(RISC_TRACKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(trackingData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Tracking data sent successfully:', result);
      return result;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send tracking data:', error);
    // Don't let tracking failures affect user experience
    return null;
  }
}

// Function to play random sorry sound
function playRandomSorrySound() {
  try {
    // Get random sound from the array
    const randomSoundId = sorrySounds[Math.floor(Math.random() * sorrySounds.length)];
    const randomSound = document.getElementById(randomSoundId);
    
    if (randomSound) {
      // Reset the audio to beginning in case it was played recently
      randomSound.currentTime = 0;
      randomSound.play().catch(e => {
        console.log(`Audio play failed for ${randomSoundId}:`, e);
        // Fallback to original sound if random sound fails
        const fallbackSound = document.getElementById("miSonido");
        if (fallbackSound) {
          fallbackSound.currentTime = 0;
          fallbackSound.play().catch(err => console.log("Fallback audio also failed:", err));
        }
      });
    }
  } catch (e) {
    console.log("Sorry sound not available:", e);
  }
}

// Enhanced sparkles effect
function addSparkles() {
  const sparkleEmojis = ['✨', '⭐', '🌟', '💫', '⚡'];
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.innerHTML = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
      sparkle.style.position = 'fixed';
      sparkle.style.left = Math.random() * window.innerWidth + 'px';
      sparkle.style.top = Math.random() * window.innerHeight + 'px';
      sparkle.style.fontSize = (20 + Math.random() * 10) + 'px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '100';
      sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.remove();
        }
      }, 2000);
    }, i * 200);
  }
}

// CSS animation for sparkles
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleFloat {
    0% {
      opacity: 0;
      transform: translateY(50px) scale(0) rotate(0deg);
    }
    20% {
      opacity: 1;
      transform: translateY(0) scale(1) rotate(180deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px) scale(0) rotate(360deg);
    }
  }
`;
document.head.appendChild(sparkleStyle);

// Function to move a button to random position with smooth animation
function moveButtonRandomly(button) {
  const maxX = Math.max(window.innerWidth - button.offsetWidth - 20, 0);
  const maxY = Math.max(window.innerHeight - button.offsetHeight - 20, 100);
  const randomX = Math.random() * maxX;
  const randomY = Math.max(Math.random() * maxY, 100); // Keep away from top header
  
  button.style.position = "fixed";
  button.style.left = randomX + "px";
  button.style.top = randomY + "px";
  button.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  button.style.zIndex = "999";
}

// Enhanced WhatsApp redirect with iOS/Android compatibility
function redirectToWhatsApp() {
  const device = detectDevice();
  const telefono = "9981514838"; // Replace with actual phone number
  const customMessage = "Hey! Shashank, How can I be angry at you? You are so cutuu 💕.Let's talk! 😊";
  
  let whatsappUrl;
  
  if (device.iOS) {
    // iOS-specific URL schemes
    whatsappUrl = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(customMessage)}`;
    
    // Try to open WhatsApp app first
    window.location.href = whatsappUrl;
    
    // Fallback for iOS if WhatsApp app is not installed
    setTimeout(() => {
      // Try web WhatsApp as fallback
      const webWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(customMessage)}`;
      window.open(webWhatsApp, '_blank');
    }, 1000);
    
  } else if (device.Android) {
    // Android-specific handling
    whatsappUrl = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(customMessage)}`;
    
    try {
      window.location.href = whatsappUrl;
    } catch (e) {
      // Fallback to web WhatsApp
      const webWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(customMessage)}`;
      window.open(webWhatsApp, '_blank');
    }
    
  } else {
    // Desktop or other devices - use web WhatsApp
    const webWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(customMessage)}`;
    window.open(webWhatsApp, '_blank');
  }
  
  console.log(`Redirecting to WhatsApp on ${device.iOS ? 'iOS' : device.Android ? 'Android' : 'Desktop'} device`);
}

// Enhanced countdown with progress bar
function startCountdown() {
  let timeLeft = 3;
  
  // Start progress bar animation
  const progressBar = document.querySelector('.progress-fill');
  if (progressBar) {
    progressBar.style.animation = 'progressAnimation 3s linear forwards';
  }
  
  countdownInterval = setInterval(() => {
    timeLeft--;
    
    if (countdown_element) {
      countdown_element.textContent = timeLeft;
    }
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      
      // Update countdown text
      const countdownText = document.querySelector('.countdown-text');
      if (countdownText) {
        countdownText.innerHTML = '🚀 Opening WhatsApp now!';
      }
      
      // Redirect to WhatsApp
      setTimeout(() => {
        redirectToWhatsApp();
      }, 500);
    }
  }, 1000);
}

// Enhanced No button functionality with random sorry sounds and tracking
boton_no.addEventListener("mouseover", function () {
  // Send tracking data for No button hover
  sendTrackingData('no_hover');
  
  // Play random sorry sound
  playRandomSorrySound();
  
  // Get current message or use a default
  const currentMessage = mensajes[Math.min(count - 1, mensajes.length - 1)];
  mensaje.innerText = currentMessage;

  // Calculate new sizes with bounds checking for dynamic button sizing
  const yesButton = document.querySelector('.btn-primary');
  const noButton = document.querySelector('.btn-secondary');
  
  if (yesButton && noButton) {
    const newYesScale = Math.min(1 + (0.05 * count), 1.5);
    const newNoScale = Math.max(1 - (0.03 * count), 0.6);

    // Apply scaling transforms
    yesButton.style.transform = `scale(${newYesScale})`;
    noButton.style.transform = `scale(${newNoScale})`;
  }

  // Move No button randomly
  moveButtonRandomly(boton_no);
  
  // After 5 attempts, show special message but keep Yes button stationary
  if (count > 5) {
    mensaje.innerText = currentMessage ;
    
    // Add extra sparkles when difficulty increases
    addSparkles();
  }
  
  count += 1;
  
  // Add sparkles for extra fun
  if (count % 2 === 0) {
    addSparkles();
  }
  
  // Make No button disappear and show special message if too many attempts
  if (count > maxAttempts) {
    boton_no.style.display = "none";
    boton_yes.style.position = "static";
    boton_yes.style.left = "auto";
    boton_yes.style.top = "auto";
    boton_yes.style.transform = "scale(1.2)";
    mensaje.innerText = "Fine! I give up running away... Please just click Yes! 🥺💕";
    
    // Add celebration sparkles
    for (let i = 0; i < 10; i++) {
      setTimeout(() => addSparkles(), i * 100);
    }
  }
});

// Yes button functionality - NO MOVEMENT, just normal hover effects
boton_yes.addEventListener("mouseover", function () {
  // Only add a gentle highlight effect, no movement
  const yesButton = document.querySelector('.btn-primary');
  if (yesButton) {
    yesButton.style.boxShadow = '0 15px 35px rgba(0, 200, 81, 0.6), 0 8px 20px rgba(0, 0, 0, 0.2)';
  }
});

// Reset Yes button on mouse leave
boton_yes.addEventListener("mouseleave", function () {
  const yesButton = document.querySelector('.btn-primary');
  if (yesButton) {
    yesButton.style.boxShadow = '0 10px 25px rgba(0, 200, 81, 0.4), 0 5px 15px rgba(0, 0, 0, 0.1)';
  }
});

// Click handler for Yes button (when successfully clicked) with tracking
boton_yes.addEventListener("click", function () {
  // Send comprehensive tracking data for Yes button click
  sendTrackingData('yes_click');
  
  try {
    let sonido = document.getElementById("miSonido2");
    sonido.play().catch(e => console.log("Audio play failed:", e));
  } catch (e) {
    console.log("Audio not available");
  }
  
  // Show result modal with enhanced animation
  resultado.style.display = "flex";
  
  // Show WhatsApp button
  whatsapp_container.style.display = "block";
  
  // Add celebration sparkles
  for (let i = 0; i < 20; i++) {
    setTimeout(() => addSparkles(), i * 100);
  }
  
  // Update success message based on difficulty level - KEEP CONSTANT MESSAGE
  const constantMessage = document.querySelector('.constant-message');
  if (constantMessage) {
    // Always show the same acceptance message regardless of difficulty
    constantMessage.innerHTML = '<strong>I accept your apology!</strong> 💖<br><em>Let\'s move forward together with love and understanding! 🌟</em>';
  }
  
  // Start countdown
  startCountdown();
});

// WhatsApp integration with enhanced iOS/Android support
boton_whatsapp.addEventListener("click", function () {
  // Send tracking data for WhatsApp click
  sendTrackingData('whatsapp_click');
  
  redirectToWhatsApp();
});

// Restart button functionality
const restartButton = document.getElementById("btn-restart");
if (restartButton) {
  restartButton.addEventListener("click", function() {
    // Send tracking data for restart
    sendTrackingData('restart_click');
    
    // Clear any running intervals
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    // Add some sparkles before restart
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addSparkles(), i * 100);
    }
    
    // Reload page after sparkles
    setTimeout(() => {
      location.reload();
    }, 500);
  });
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    if (resultado.style.display !== 'flex') {
      event.preventDefault();
      boton_yes.click();
    }
  } else if (event.key === 'Escape') {
    if (resultado.style.display === 'flex') {
      event.preventDefault();
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      location.reload();
    }
  }
});

// Enhanced mobile touch support
boton_no.addEventListener("touchstart", function(e) {
  e.preventDefault();
  boton_no.dispatchEvent(new Event('mouseover'));
});

// Normal touch support for Yes button (no movement)
boton_yes.addEventListener("touchstart", function(e) {
  // Just trigger hover effect, no movement
  boton_yes.dispatchEvent(new Event('mouseover'));
});

// Responsive design adjustments
function adjustForMobile() {
  const device = detectDevice();
  
  if (device.Mobile || window.innerWidth < 768) {
    // Adjust button sizes for mobile
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
      button.style.fontSize = "16px";
      button.style.padding = "15px 25px";
      button.style.minWidth = "250px";
    });
    
    // Adjust message container for mobile
    const messageContainer = document.querySelector('.main-message');
    if (messageContainer) {
      messageContainer.style.fontSize = "1.1rem";
      messageContainer.style.padding = "0 15px";
    }
  }
}

// Prevent context menu on mobile for better experience
document.addEventListener('contextmenu', function(e) {
  if (detectDevice().Mobile) {
    e.preventDefault();
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  adjustForMobile();
  
  // Reset No button position if it's moved and window is resized
  if (boton_no.style.position === 'fixed') {
    setTimeout(() => {
      moveButtonRandomly(boton_no);
    }, 100);
  }
});

// Initialize location tracking and page setup
window.addEventListener('load', function() {
  adjustForMobile();
  
  // Start approximate location tracking immediately
  console.log('🌍 Starting approximate location tracking...');
  getApproximateLocation()
    .then((locationData) => {
      console.log('✅ Approximate location tracking enabled:', locationData);
    })
    .catch((error) => {
      console.log('⚠️ Location tracking failed:', error.message);
    });
  
  // Send initial page load tracking
  sendTrackingData('page_load');
  
  // Add initial sparkles after page load
  setTimeout(() => {
    addSparkles();
  }, 1000);
  
  // Animate hearts in header after load
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach((heart, index) => {
    setTimeout(() => {
      heart.style.animation = `heartBounce 2s ease-in-out infinite`;
      heart.style.animationDelay = `${index * 0.2}s`;
    }, 500 + (index * 100));
  });
});

// Add some console easter eggs
console.log("🎨 Enhanced UI with modern design!");
console.log("💝 This apology page was made with extra love and JavaScript!");
console.log("🎉 Hope the improved interface helps you get forgiven!");
console.log("🎮 Pro tip: Only the No button moves around - Yes button stays put!");
console.log("🔊 New feature: Random sorry sounds when No button is hovered!");
console.log("📱 Enhanced iOS/Android WhatsApp integration!");
console.log("🌍 RISC Tracking: Comprehensive location and device data collection enabled!");
console.log("✨ New features: Fixed header, constant acceptance message, better animations!");

// Debug info for device detection
const device = detectDevice();
console.log("Device detected:", {
  iOS: device.iOS,
  Android: device.Android,
  Mobile: device.Mobile,
  UserAgent: navigator.userAgent
});

// Performance monitoring
console.log("🚀 Enhanced UI with RISC tracking loaded successfully!");
