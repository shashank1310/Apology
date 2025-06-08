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
  "I'll write you a love letter! 💌",
  "How about we go to your favorite restaurant? 🍽️",
  "I'll let you choose what we watch tonight! 📺",
  "Pretty pretty please? 🥺",
  "I'll never do it again, I promise! 🤞",
  "You're too amazing to stay mad at me! ✨",
  "One more chance? I'll prove I'm worth it! 💪",
  "Okay, you're really testing my creativity now! 🎨"
];

// Get DOM elements
const boton_no = document.getElementById("btn-no");
const boton_yes = document.getElementById("btn-yes");
const boton_whatsapp = document.getElementById("btn-whatsapp");
const whatsapp_container = document.getElementById("whatsapp-container");

const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");

let count = 1;
let maxAttempts = mensajes.length;
let bothButtonsMoving = false;

// Device detection for better iOS/Android support
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return {
    iOS: /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream,
    Android: /android/i.test(userAgent),
    Mobile: /Mobi|Android/i.test(userAgent)
  };
}

// Add some fun effects
function addSparkles() {
  const sparkle = document.createElement('div');
  sparkle.innerHTML = '✨';
  sparkle.style.position = 'absolute';
  sparkle.style.left = Math.random() * window.innerWidth + 'px';
  sparkle.style.top = Math.random() * window.innerHeight + 'px';
  sparkle.style.fontSize = '20px';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '100';
  document.body.appendChild(sparkle);
  
  setTimeout(() => {
    sparkle.remove();
  }, 2000);
}

// Function to move a button to random position
function moveButtonRandomly(button) {
  const maxX = Math.max(window.innerWidth - button.offsetWidth, 0);
  const maxY = Math.max(window.innerHeight - button.offsetHeight, 0);
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  
  button.style.position = "absolute";
  button.style.left = randomX + "px";
  button.style.top = randomY + "px";
  button.style.transition = "all 0.3s ease";
}

// Enhanced WhatsApp redirect with iOS/Android compatibility
function redirectToWhatsApp() {
  const device = detectDevice();
  const telefono = "9981514838"; // Replace with actual phone number
  const customMessage = "Hey! I'm sorry for what I did. I accept your apology and I'm ready to move forward together! 💕 Let's talk! 😊";
  
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

// Enhanced No button functionality
boton_no.addEventListener("mouseover", function () {
  try {
    let sonido = document.getElementById("miSonido");
    sonido.play().catch(e => console.log("Audio play failed:", e));
  } catch (e) {
    console.log("Audio not available");
  }
  
  // Get current message or use a default
  const currentMessage = mensajes[Math.min(count - 1, mensajes.length - 1)];
  mensaje.innerText = currentMessage;

  // Calculate new sizes with bounds checking
  const newYesHeight = Math.min(50 + (5 * count), 120);
  const newYesWidth = Math.min(200 + (8 * count), 350);
  const newNoHeight = Math.max(50 - (2 * count), 25);
  const newNoWidth = Math.max(200 - (6 * count), 80);

  // Apply new sizes
  boton_yes.style.height = newYesHeight + "px";
  boton_yes.style.width = newYesWidth + "px";
  boton_no.style.height = newNoHeight + "px";
  boton_no.style.width = newNoWidth + "px";

  // Move No button randomly
  moveButtonRandomly(boton_no);
  
  // After 5 attempts, make Yes button also start moving
  if (count > 5) {
    bothButtonsMoving = true;
    moveButtonRandomly(boton_yes);
    mensaje.innerText = currentMessage + " (Now both buttons are running! 😈)";
  }
  
  count += 1;
  
  // Add sparkles for extra fun
  if (count % 3 === 0) {
    addSparkles();
  }
  
  // Make buttons disappear and show special message if too many attempts
  if (count > maxAttempts) {
    boton_no.style.display = "none";
    boton_yes.style.position = "static";
    boton_yes.style.left = "auto";
    boton_yes.style.top = "auto";
    boton_yes.style.transform = "none";
    mensaje.innerText = "Fine! I give up running away... Please just click Yes! 🥺💕";
  }
});

// Enhanced Yes button functionality - make it move too!
boton_yes.addEventListener("mouseover", function () {
  if (bothButtonsMoving && count <= maxAttempts) {
    // Make Yes button also run away, but less frequently
    if (Math.random() < 0.7) { // 70% chance to move
      moveButtonRandomly(boton_yes);
      
      // Show a cheeky message
      const cheekyMessages = [
        "Haha! Got you! Try again! 😏",
        "Almost! But not quite! 😜",
        "So close! Keep trying! 🤪",
        "Nope! I'm being extra sneaky now! 😎",
        "You'll have to be faster than that! ⚡"
      ];
      const randomMessage = cheekyMessages[Math.floor(Math.random() * cheekyMessages.length)];
      mensaje.innerText = randomMessage;
      
      try {
        let sonido = document.getElementById("miSonido");
        sonido.play().catch(e => console.log("Audio play failed:", e));
      } catch (e) {
        console.log("Audio not available");
      }
    }
  }
});

// Click handler for Yes button (when successfully clicked)
boton_yes.addEventListener("click", function () {
  try {
    let sonido = document.getElementById("miSonido2");
    sonido.play().catch(e => console.log("Audio play failed:", e));
  } catch (e) {
    console.log("Audio not available");
  }
  
  // Show result with animation
  resultado.style.display = "flex";
  resultado.style.flexDirection = "column";
  resultado.style.alignItems = "center";
  resultado.style.justifyContent = "center";
  resultado.style.position = "fixed";
  resultado.style.top = "0";
  resultado.style.left = "0";
  resultado.style.width = "100vw";
  resultado.style.height = "100vh";
  resultado.style.zIndex = "1000";
  resultado.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  resultado.style.backdropFilter = "blur(10px)";
  
  // Show WhatsApp button
  whatsapp_container.style.display = "block";
  
  // Add celebration sparkles
  for (let i = 0; i < 15; i++) {
    setTimeout(() => addSparkles(), i * 150);
  }
  
  // Update success message based on difficulty level
  const successMessages = document.querySelector('#resultado p');
  if (count > 15) {
    successMessages.innerHTML = "WOW! You're incredibly persistent! 🏆<br>You definitely earned this forgiveness! 💖<br><em>Redirecting to WhatsApp in 3 seconds... 🌟</em>";
  } else if (count > 10) {
    successMessages.innerHTML = "Great job catching me! 🎯<br>Your determination shows how much you care! 💖<br><em>Redirecting to WhatsApp in 3 seconds... 🌟</em>";
  } else {
    successMessages.innerHTML = "You're the best! I promise to make it up to you! 💖<br><em>Redirecting to WhatsApp in 3 seconds... 🌟</em>";
  }
  
  // Auto-redirect to WhatsApp after 3 seconds
  setTimeout(() => {
    redirectToWhatsApp();
  }, 3000);
  
  // Show countdown
  let countdown = 3;
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      const currentText = successMessages.innerHTML;
      successMessages.innerHTML = currentText.replace(/\d+ seconds/, `${countdown} second${countdown === 1 ? '' : 's'}`);
    } else {
      clearInterval(countdownInterval);
      successMessages.innerHTML = successMessages.innerHTML.replace(/Redirecting to WhatsApp in \d+ seconds?\.\.\./, "Opening WhatsApp now! 🚀");
    }
  }, 1000);
});

// WhatsApp integration with enhanced iOS/Android support
boton_whatsapp.addEventListener("click", function () {
  redirectToWhatsApp();
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    if (resultado.style.display !== 'flex') {
      boton_yes.click();
    }
  } else if (event.key === 'Escape') {
    if (resultado.style.display === 'flex') {
      location.reload();
    }
  }
});

// Add mobile touch support
boton_no.addEventListener("touchstart", function(e) {
  e.preventDefault();
  boton_no.dispatchEvent(new Event('mouseover'));
});

boton_yes.addEventListener("touchstart", function(e) {
  if (bothButtonsMoving) {
    e.preventDefault();
    boton_yes.dispatchEvent(new Event('mouseover'));
  }
});

// Responsive design adjustments
function adjustForMobile() {
  if (window.innerWidth < 768) {
    boton_yes.style.fontSize = "14px";
    boton_no.style.fontSize = "14px";
    boton_yes.style.padding = "15px";
    boton_no.style.padding = "15px";
  }
}

// Initialize
window.addEventListener('load', adjustForMobile);
window.addEventListener('resize', adjustForMobile);

// Add some console easter eggs
console.log("👀 Snooping around the code, are we?");
console.log("💝 This apology page was made with love and JavaScript!");
console.log("🎉 Hope it helps you get forgiven!");
console.log("🎮 Pro tip: Both buttons start moving after 5 attempts!");
console.log("📱 iOS/Android WhatsApp integration enabled!");

// Debug info for device detection
const device = detectDevice();
console.log("Device detected:", {
  iOS: device.iOS,
  Android: device.Android,
  Mobile: device.Mobile,
  UserAgent: navigator.userAgent
});
