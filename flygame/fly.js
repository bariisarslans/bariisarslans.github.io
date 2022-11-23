
let MAIN_COMPONENT = document.createElement("DIV"), _interval, AIRPLANE_MAX_RIGHT = false, SCORE = 1;

let speed = .3;
let config = {
  defaults: {
    maxScore:50,
    flowRate: speed*1000,
    gameAreaSize: {
      width: 1000,
      height: 600,
    },
    animationDuration: speed+"s",
    cloudFrequency: 1, // azaldıkça sıklık artar
    cloudMoveStepSize: 150, // Bulutların akış hızı
    airplaneMoveUPStepSize: 50, // Uçağın yükseliş hızı
    airplaneMoveRIGHTStepSize: 140, // Uçağın uçuş hızı
    scoreIncreaseStepSize: .2, // Score artma hızı
  },
  components:{
    airplane:{
      width:200,
      height:100,
    }
  }
}


initGame = (gameAreaComponentId) => {
  getGameAreaSize(gameAreaComponentId)
  createMainComponents(gameAreaComponentId)
  createCloseButton()
  createScoreBoard()

  createAirplane()
  createCloud()
  start()
}

createAirplaneSceneCSS = (left,callback) => {
  var style = document.createElement("style");
  style.id = "vlAirplaneSceneStyle";
  style.innerHTML = "@keyframes airplaneScene {" +
      "0%   {left: "+(left)+"px;}" +
      "10%  {left: "+(left+20)+"px;}" +
      "50%  {left: "+(left)+"px;}" +
      "75%  {left: "+(left-20)+"px;}" +
      "100% {left: "+(left)+"px;}" +
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
  document.querySelector("#" + gameAreaComponentId).appendChild(MAIN_COMPONENT);
}

createCloseButton = () => {
  var closeButton = document.createElement("BUTTON");
  closeButton.id = "close";
  closeButton.innerHTML = "&#10006;";
  closeButton.style.position = "absolute";
  closeButton.style.right = "0px";
  closeButton.style.top = "0px";
  closeButton.style.border = "0";
  closeButton.style.color = "black";
  closeButton.style.padding = "5px 10px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "29px";
  closeButton.style.borderRadius = "5px";
  closeButton.style.backgroundColor = 'rgba(0,0,0,0)';
  closeButton.style.zIndex = "999";
  closeButton.style.transform = "translate3d(0,0,3px)";

  closeButton.addEventListener("click", function () {
    stop();
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
  dashboard.style.background = 'red';
  dashboard.style.width = "150px";
  dashboard.style.maxWidth = "150px";
  dashboard.style.margin = "5px";
  dashboard.style.backgroundSize = "contain";
  dashboard.style.left = "10px";
  dashboard.style.borderRadius = "5px";
  dashboard.style.fontSize = "24px";
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
  }
}

createAirplane = () => {
  var airplane = document.createElement("img");
  airplane.id = "airplane";
  airplane.src = "airplane.png";
  airplane.style.width = config.components.airplane.width+"px";
  airplane.style.height = config.components.airplane.height+"px";
  airplane.style.zIndex = "9999";
  airplane.style.position = "absolute";
  airplane.style.bottom = "0px";
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
      if ((airplaneBottom+(config.defaults.airplaneMoveUPStepSize*2)) < (config.defaults.gameAreaSize.height - config.components.airplane.height)) {
        airplane.style.bottom = (airplaneBottom + config.defaults.airplaneMoveUPStepSize) + "px"
      }
      else{ bottomMax = true }

      if ((airplaneLeft+config.defaults.airplaneMoveRIGHTStepSize) < (config.defaults.gameAreaSize.width - config.components.airplane.width)) {
        airplane.style.left = (airplaneLeft + config.defaults.airplaneMoveRIGHTStepSize) + "px"
      }
      else{ leftMax = true }

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
  createAirplaneSceneCSS(parseInt(airplane.style.left),()=>{
    airplane.style.animation= "airplaneScene 3s linear infinite"
  })
}

createCloud = () => {
  var cloud = document.createElement("div");
  cloud.className = "cloud";
  cloud.style.width = "100px";
  cloud.style.height = "50px";
  cloud.style.zIndex = "9";
  cloud.style.left = config.defaults.gameAreaSize.width + 20 + "px";
  cloud.style.top = utils.randNum(0,config.defaults.gameAreaSize.height-200) + "px";
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
      }else{
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
    }else{
      stop();
    }

    if (counter >= config.defaults.cloudFrequency) {
      counter = 0;
      createCloud();
    }
    counter++;
    SCORE+=config.defaults.scoreIncreaseStepSize;
  }, config.defaults.flowRate);
}

updateScore = (value) => {
  let score = document.querySelector("#score")
  score.innerText = (value).toFixed(2)+"x"
}

start = () => {
  updateGame();
}

stop = () => {
  console.log("SCORE "+SCORE)
  clearInterval(_interval)
  document.querySelector("#airplane").style.animation = "";
}

let utils = {
  randNum: (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

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