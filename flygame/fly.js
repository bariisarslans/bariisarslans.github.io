
let MAIN_COMPONENT = document.createElement("DIV"), _interval, AIRPLANE_MAX_RIGHT = false, SCORE = 1, EARNED_SCORE = 1, SUFFICIENT = false, PLAYING = false;


let speed = .3;
let config = {
  defaults: {
    maxScore: 50,
    flowRate: speed * 1000,
    gameAreaSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    animationDuration: speed + "s",
    cloudFrequency: 1, // azaldıkça sıklık artar
    cloudMoveStepSize: 150, // Bulutların akış hızı
    airplaneMoveUPStepSize: 30, // Uçağın yükseliş hızı
    airplaneMoveRIGHTStepSize: 140, // Uçağın uçuş hızı
    scoreIncreaseStepSize: 1, // Score artma hızı
  },
  components: {
    airplane: {
      width: 200,
      height: 50,
    }
  }
}


initGame = (gameAreaComponentId) => {
  getGameAreaSize(gameAreaComponentId)
  createMainComponents(gameAreaComponentId)
  createCloseButton()
  createScoreBoard()
  startStopButton3D()
  buttonCSS()

  createAirplane()
  createCloud()
}

createAirplaneSceneCSS = (left, callback) => {
  var style = document.createElement("style");
  style.id = "vlAirplaneSceneStyle";
  style.innerHTML = "@keyframes airplaneScene {" +
    "0%   {left: " + (left) + "px;}" +
    "10%  {left: " + (left + 20) + "px;}" +
    "50%  {left: " + (left) + "px;}" +
    "75%  {left: " + (left - 20) + "px;}" +
    "100% {left: " + (left) + "px;}" +
    "}";

  document.head.appendChild(style);
  callback()
}

createMainComponents = (gameAreaComponentId) => {
  MAIN_COMPONENT.id = "main";
  MAIN_COMPONENT.style.width = "100%";
  MAIN_COMPONENT.style.height = "100%";
  MAIN_COMPONENT.style.top = "0";
  MAIN_COMPONENT.style.left = "0";
  MAIN_COMPONENT.style.zIndex = "9999";
  MAIN_COMPONENT.style.position = "absolute";
  MAIN_COMPONENT.style.background = "linear-gradient(#6B93BD, #ffffff)";
  if (gameAreaComponentId) {
    document.querySelector("#" + gameAreaComponentId).appendChild(MAIN_COMPONENT);
  } else {
    document.body.appendChild(MAIN_COMPONENT);
  }
}

createCloseButton = () => {
  var closeButton = document.createElement("BUTTON");
  closeButton.id = "close";
  closeButton.innerHTML = "&#10006;";
  closeButton.style.position = "absolute";
  closeButton.style.right = "0px";
  closeButton.style.top = "0px";
  closeButton.style.border = "0";
  closeButton.style.color = "#fff";
  closeButton.style.padding = "5px 10px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "29px";
  closeButton.style.borderRadius = "5px";
  closeButton.style.backgroundColor = 'rgba(0,0,0,0)';
  closeButton.style.zIndex = "999";
  closeButton.style.transform = "translate3d(0,0,3px)";

  closeButton.addEventListener("click", function () {
    stopGame();
    console.log('Oyun Durdu');
  });

  MAIN_COMPONENT.appendChild(closeButton);
}

createScoreBoard = () => {
  var dashboard = document.createElement("div");
  dashboard.id = "scoreboard";
  dashboard.style.padding = '10px 0px';
  dashboard.style.position = "fixed";
  dashboard.style.color = "white";
  dashboard.style.textAlign = "center";
  dashboard.style.fontFamily = "'Rubik One', sans-serif";
  dashboard.style.background = '#124364';
  dashboard.style.textDecoration = 'none';
  dashboard.style.width = "250px";
  dashboard.style.minWidth = "max-content";
  dashboard.style.margin = "5px";
  dashboard.style.backgroundSize = "contain";
  dashboard.style.left = "10px";
  dashboard.style.borderRadius = "5px";
  dashboard.style.fontSize = "25px";
  dashboard.style.zIndex = "9999";
  dashboard.style.transition = "1s all";

  var _score = document.createElement("DIV");
  _score.id = "score";
  _score.innerText = '0x';
  _score.style.transition = "1s all";

  dashboard.appendChild(_score);
  MAIN_COMPONENT.appendChild(dashboard);
}

getGameAreaSize = (gameAreaComponentId) => {
  if (gameAreaComponentId) {
    const component = document.querySelector("#" + gameAreaComponentId)
    config.defaults.gameAreaSize = {
      width: component.offsetWidth,
      height: component.offsetHeight,
    }
  } else {
    config.defaults.gameAreaSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
}

createAirplane = () => {
  var airplane = document.createElement("img");
  airplane.id = "airplane";
  airplane.src = "plane.png";
  airplane.style.width = config.components.airplane.width + "px";
  airplane.style.height = config.components.airplane.height + "px";
  airplane.style.zIndex = "9999";
  airplane.style.position = "absolute";
  airplane.style.bottom = "150px";
  airplane.style.left = "0px";
  airplane.style.transition = "all " + config.defaults.animationDuration + " linear 0s";
  MAIN_COMPONENT.appendChild(airplane);
}

airplaneMove = () => {
  if (!AIRPLANE_MAX_RIGHT) {
    let airplane = document.querySelector("#airplane")
    if (airplane) {
      let airplaneLeft = parseInt(airplane.style.left)
      let airplaneBottom = parseInt(airplane.style.bottom)
      let leftMax = false, bottomMax = false
      if ((airplaneBottom + (config.defaults.airplaneMoveUPStepSize * 2)) < (config.defaults.gameAreaSize.height - config.components.airplane.height)) {
        airplane.style.bottom = (airplaneBottom + config.defaults.airplaneMoveUPStepSize) + "px"
      }
      else { bottomMax = true }

      if ((airplaneLeft + config.defaults.airplaneMoveRIGHTStepSize) < (config.defaults.gameAreaSize.width - config.components.airplane.width)) {
        airplane.style.left = (airplaneLeft + config.defaults.airplaneMoveRIGHTStepSize) + "px"
      }
      else { leftMax = true }

      if (leftMax && bottomMax) {
        AIRPLANE_MAX_RIGHT = true
        airplaneMaxTopAnimation();
      }
    }
  }
}

airplaneMaxTopAnimation = () => {
  console.log("airplaneMaxTopAnimation");

  let airplane = document.querySelector("#airplane")
  createAirplaneSceneCSS(parseInt(airplane.style.left), () => {
    airplane.style.animation = "airplaneScene 3s linear infinite"
  })
}

createCloud = () => {
  var cloud = document.createElement("div");
  cloud.className = "cloud";
  cloud.style.width = "100px";
  cloud.style.height = "50px";
  cloud.style.zIndex = "9";
  cloud.style.left = config.defaults.gameAreaSize.width + 20 + "px";
  cloud.style.top = utils.randNum(0, config.defaults.gameAreaSize.height - 200) + "px";
  cloud.style.position = "absolute";
  cloud.style.transition = "all " + config.defaults.animationDuration + " linear 0s";

  var puf1 = document.createElement("div");
  puf1.style.width = "50px";
  puf1.style.height = "50px";
  puf1.style.left = "10px";
  puf1.style.borderRadius = "50px";
  puf1.style.background = "white";
  puf1.style.float = "left";
  puf1.style.position = "absolute";

  var puf2 = document.createElement("div");
  puf2.style.width = "100px";
  puf2.style.height = "35px";
  puf2.style.borderRadius = "50px";
  puf2.style.float = "left";
  puf2.style.bottom = "0";
  puf2.style.background = "white";
  puf2.style.position = "absolute";

  var puf3 = document.createElement("div");
  puf3.style.width = "30px";
  puf3.style.height = "30px";
  puf3.style.left = "45px";
  puf3.style.top = "5px";
  puf3.style.borderRadius = "50px";
  puf3.style.background = "white";
  puf3.style.float = "left";
  puf3.style.position = "absolute";

  cloud.appendChild(puf1)
  cloud.appendChild(puf2)
  cloud.appendChild(puf3)
  MAIN_COMPONENT.appendChild(cloud);
}

cloudsMove = () => {
  const clouds = document.querySelectorAll(".cloud")
  for (let i = 0; i < clouds.length; i++) {
    let cloud = clouds[i]
    const cloudLeft = parseInt(cloud.style.left)
    if (cloudLeft > -100) {
      cloud.style.left = (parseInt(cloud.style.left) - config.defaults.cloudMoveStepSize) + "px"
      cloud.style.top = (parseInt(cloud.style.top) + (config.defaults.cloudMoveStepSize/5)) + "px"
    } else {
      cloud.remove();
    }

  }
}

updateGame = () => {
  let counter = 0;
  _interval = setInterval(() => {
    cloudsMove()
    airplaneMove()

    if (SCORE <= config.defaults.maxScore) {
      updateScore(SCORE)
    } else {
      stopGame();
      return;
    }

    if (counter >= config.defaults.cloudFrequency) {
      counter = 0;
      createCloud();
    }
    counter++;
    SCORE += config.defaults.scoreIncreaseStepSize;
  }, config.defaults.flowRate);
}

updateScore = (value) => {
  let score = document.querySelector("#score")
  score.innerText = "%" + (value).toFixed(0) + " İndirim"

  if (!SUFFICIENT) {
    let buttonScore = document.querySelector("#vl3DButton")
    buttonScore.innerText = "DURDUR (%" + (value).toFixed(0) + ")"
  }
}

startGame = () => {
  updateGame();
}

stopGame = () => {
  clearInterval(_interval)
  updateScore(SCORE)
  console.log("OYUN BITTI " + SCORE)
  document.querySelector("#airplane").style.animation = "";
}

sufficientGame = () => {
  startConfetti()
  setTimeout(() => {
    stopConfetti()
  }, 1000);
  SUFFICIENT = true;
  EARNED_SCORE = SCORE;
  let buttonScore = document.querySelector("#vl3DButton")
  buttonScore.innerText = "KAZANILAN %" + (EARNED_SCORE).toFixed(0)
  console.log("KAZANILAN PUAN " + EARNED_SCORE)
}

buttonCSS = () => {
  var clickSpeed = .2;
  var style = document.createElement("style");
  style.id = "vl3DButtonStyle";
  style.innerHTML = "@import 'https://fonts.googleapis.com/css?family=Rubik+One';\
  .button::before, .button::after {\
    position: absolute;\
    content: '';\
    transition: all "+ clickSpeed + "s;\
  }\
  .button {\
    display: inline-block;\
    padding: 20px 40px;\
    color: white;\
    position: absolute;\
    top: 90%;\
    left: 50%;\
    transform: translate(-50%, -50%);\
    vertical-align: middle;\
    text-align: center;\
    font-family: 'Rubik One', sans-serif;\
    text-decoration: none;\
    width: max-content;\
    min-width: 50%;\
    font-size: 4vw;\
    transition: all "+ clickSpeed + "s;\
    background-color: #3498db;\
  }\
  .button::before {\
    bottom: -15px;\
    height: 15px;\
    width: 100%;\
    left: 8px;\
    transform: skewX(45deg);\
    background-color: #196090;\
  }\
  .button::after {\
    right: -15px;\
    height: 100%;\
    width: 15px;\
    bottom: -8px;\
    transform: skewY(45deg);\
    background-color: #124364;\
  }\
  .button:active {\
    margin-left: 10px;\
    margin-top: 10px;\
  }\
  .button:active::before {\
    bottom: -5px;\
    height: 5px;\
    left: 3px;\
  }\
  .button:active::after {\
    right: -5px;\
    width: 5px;\
    bottom: -3px;\
  }";
  document.head.appendChild(style);
}

startStopButton3D = () => {
  var button = document.createElement("a");
  button.id = "vl3DButton";
  button.className = "button";
  button.innerText = "BAŞLAT";

  button.addEventListener('mouseup', () => {
    startOrStop()
  })


  startOrStop = () => {
    if (PLAYING) {
      PLAYING = false
      sufficientGame()
    } else {
      if (!SUFFICIENT) {
        PLAYING = true
        button.innerText = "DURDUR";
        startGame()
      }
    }
  }

  MAIN_COMPONENT.appendChild(button)
}

let utils = {
  randNum: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// Oyun bitince uçak uçup gitme efekti
// butona tıklayınca kazandınız ekrannı
// kazanamayınca kaybettiniz mesajı
// Buttona tekrar tıklayınca oynayamazsınız mesajı

/**
 * CONFETTI
 */
 var maxParticleCount = 150; //set max confetti count
 var particleSpeed = 2; //set the particle animation speed
 var startConfetti; //call to start confetti animation
 var stopConfetti; //call to stop adding confetti
 var toggleConfetti; //call to start or stop the confetti animation depending on whether it's already running
 var removeConfetti; //call to stop the confetti animation and remove all confetti immediately
 
 (function() {
   startConfetti = startConfettiInner;
   stopConfetti = stopConfettiInner;
   toggleConfetti = toggleConfettiInner;
   removeConfetti = removeConfettiInner;
   var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
   var streamingConfetti = false;
   var animationTimer = null;
   var particles = [];
   var waveAngle = 0;
   
   function resetParticle(particle, width, height) {
     particle.color = colors[(Math.random() * colors.length) | 0];
     particle.x = Math.random() * width;
     particle.y = Math.random() * height - height;
     particle.diameter = Math.random() * 10 + 5;
     particle.tilt = Math.random() * 10 - 10;
     particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
     particle.tiltAngle = 0;
     return particle;
   }
 
   function startConfettiInner() {
     var width = window.innerWidth;
     var height = window.innerHeight;
     window.requestAnimFrame = (function() {
       return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function (callback) {
           return window.setTimeout(callback, 16.6666667);
         };
     })();
     var canvas = document.getElementById("confetti-canvas");
     if (canvas === null) {
       canvas = document.createElement("canvas");
       canvas.setAttribute("id", "confetti-canvas");
       canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:fixed;top:0px");
       document.body.appendChild(canvas);
       canvas.width = width;
       canvas.height = height;
       window.addEventListener("resize", function() {
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;
       }, true);
     }
     var context = canvas.getContext("2d");
     while (particles.length < maxParticleCount)
       particles.push(resetParticle({}, width, height));
     streamingConfetti = true;
     if (animationTimer === null) {
       (function runAnimation() {
         context.clearRect(0, 0, window.innerWidth, window.innerHeight);
         if (particles.length === 0)
           animationTimer = null;
         else {
           updateParticles();
           drawParticles(context);
           animationTimer = requestAnimFrame(runAnimation);
         }
       })();
     }
   }
 
   function stopConfettiInner() {
     streamingConfetti = false;
   }
 
   function removeConfettiInner() {
     stopConfetti();
     particles = [];
   }
 
   function toggleConfettiInner() {
     if (streamingConfetti)
       stopConfettiInner();
     else
       startConfettiInner();
   }
 
   function drawParticles(context) {
     var particle;
     var x;
     for (var i = 0; i < particles.length; i++) {
       particle = particles[i];
       context.beginPath();
       context.lineWidth = particle.diameter;
       context.strokeStyle = particle.color;
       x = particle.x + particle.tilt;
       context.moveTo(x + particle.diameter / 2, particle.y);
       context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
       context.stroke();
     }
   }
 
   function updateParticles() {
     var width = window.innerWidth;
     var height = window.innerHeight;
     var particle;
     waveAngle += 0.01;
     for (var i = 0; i < particles.length; i++) {
       particle = particles[i];
       if (!streamingConfetti && particle.y < -15)
         particle.y = height + 100;
       else {
         particle.tiltAngle += particle.tiltAngleIncrement;
         particle.x += Math.sin(waveAngle);
         particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
         particle.tilt = Math.sin(particle.tiltAngle) * 15;
       }
       if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
         if (streamingConfetti && particles.length <= maxParticleCount)
           resetParticle(particle, width, height);
         else {
           particles.splice(i, 1);
           i--;
         }
       }
     }
   }
 })();

/**
 * 1- arkadan akacak bir bulut arka planı
 * 2- kuponu al butonu 3D
 * 3- başlama için geri sayım
 * 4- uçak yok olma animasyonu
 * 5- başlama için zeminden kalkış
 * 6- uçağın arkasında belirecek iz düşümü
 * 7- uçak oyun alanı sonuna gelince zirveye çıkmış olacak ve ileri geri animasyon olacak
 * 8- uçacağı max puan başta belli
 */