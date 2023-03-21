let UPDATE_PRODUCT_INTERVAL, SCORE = 0, DURATION, HEIGHT = window.innerHeight, WIDTH = window.innerWidth, PAIR_COUNTER = 0, LAST_CLICKED_CARD_ID = null, PAIR_COUNT = 0, MAX_PAIR_COUNT = 0, CLICKABLE = true, CLICKABLE_DURATION = 1000, PAIRS = [], AUDIO, TIME_INTERVAL, EMAIL='', REPORT='', CURRENT_TOTAL_LEFT=0;

let MAIN_COMPONENT = document.createElement("DIV");

// Page nums
let screens = {
    form: 1,
    rules: 2,
    game: 3,
    finish: 4
};


let activePageData = {
    mailSubsScreen: false,
    rulesScreen: false,
};

/**
 * Defaults 
 * */
let generalData = {
    id: 'rmc-giftbox',
    bgColor: '',
    bgImg: 'https://picsum.photos/seed/picsum/400/800',
    fontColor: '',
    fontName: 'Helvetica',
    fontFiles: [],
    closeButtonId: 'rmc-close-button',
    closeButton: 'true',
    closeButtonColor: 'black',
    borderRadius: '10px',
    scoreBoardRadius: '5px',
    sound: 'https://bariisarslans.github.io/giftcatchgame/sound.mp3'
};

/**
 * Components defaults
 */
let componentsData = {
    mailSubsScreen: {
        id: "rmc-mail-subs-screen",
        title: { // OPTIONAL
            use: true,
            text: '',
            textColor: '',
            fontSize: ''
        },
        message: { // OPTIONAL
            use: true,
            text: '',
            textColor: '',
            fontSize: ''
        },
        emailPermission: { // OPTIONAL
            use: true,
            id: 'rmc-email-permission-checkbox',
            text: '',
            fontSize: '',
            url: '',
        },
        secondPermission: { // OPTIONAL
            use: true,
            id: 'rmc-second-permission-checkbox',
            text: '',
            fontSize: '',
            url: '',
        },
        button: { // REQUIRED
            use: true,
            id: 'rmc-mail-subs-button',
            text: '',
            textColor: '',
            buttonColor: '',
            fontSize: '',
            goScreen: screens.rules,
        },
        emailInput: {
            id: 'rmc-email-input',
            placeHolder: 'Email',
            value: '',
        },
        alerts: {
            invalid_email_message: '',
            check_consent_message: ''
        }
    },
    rulesScreen: {
        bgImage: '',
        id: 'rmc-rules-screen',
        title: { // OPTIONAL
            use: true,
            text: '',
            textColor: '',
            fontSize: ''
        },
        message: { // OPTIONAL
            use: true,
            text: '',
            textColor: '',
            fontSize: ''
        },
        button: { // REQUIRED
            use: true,
            id: 'rmc-rules-button',
            text: '',
            textColor: '',
            buttonColor: '',
            fontSize: '',
            goScreen: screens.game,
        },
    },
    gameScreen: {
        id: "rmc-game-screen",
        gameArea: "rmc-game-screen-game-area",
        boxes: [
            {
                id:"1",
                image:"giftbox.png",
                promoCode:"1",
            },
            {
                id:"2",
                image:"giftbox.png",
                promoCode:"2",
            },
            {
                id:"3",
                image:"giftbox.png",
                promoCode:"3",
            },
            {
                id:"4",
                image:"giftbox.png",
                promoCode:"4",
            },
            {
                id:"5",
                image:"giftbox.png",
                promoCode:"5",
            },
        ],
        scoreboard: {
            id: 'rmc-scoreboard',
            fontSize: '',
            background: '',
            fontColor: '',
            type: 'round', // square | circle | round
            position: 'topLeft', // topLeft | topRight | bottomLeft | bottomRight
            countDown: {
                id: 'rmc-count-down',
            },
            score: {
                id: 'rmc-score'
            }
        }
    },
    finishScreen: {
        id: 'rmc-finish-screen',
        title: { // OPTIONAL
            use: true,
            text: '',
            loseText: '',
            textColor: '',
            fontSize: ''
        },
        message: { // OPTIONAL
            use: true,
            text: '',
            loseText: '',
            textColor: '',
            fontSize: ''
        },
        img: { // OPTIONAL
            use: false,
            src: '',
        },
        score: { // OPTIONAL
            use: true,
            id: 'rmc-finish-score',
            text: '',
        },
        lose: {
            id: 'rmc-finish-lose-img',
            src: '',
            buttonLabel: '',
            loseAndroidLink: '',
            loseIOSLink: '',
            loseButtonColor: '',
            loseButtonTextSize: '',
            loseButtonTextColor: ''
        },
        couponCode: { // OPTIONAL
            use: true,
            id: 'rmc-coupon-code',
            fontSize: '',
        },
        button: { // REQUIRED
            use: true,
            id: 'rmc-finish-button',
            text: '',
            textColor: '',
            buttonColor: '',
            fontSize: '',
            androidLink: '',
            iOSLink: ''
        }
    }
};

/**
 * Card settings
 */
let boxSettings = {
    boxWidth: 200,
    boxHeight: 200,
    cardIdPrefix: 'item',
    duration: 500,
    backfaceImg: 'https://picsum.photos/id/29/300/600',
    backfaceColor: 'green',
    emptyBackfaceImg: '',
    emptyBackfaceColor: 'gray',
    emptyFrontImg: '',
    emptyFrontColor: 'gray',
}

/**
 * Game page settins
*/
let gameSettings = {
    duration: 6,
    gameAreaHeight: HEIGHT * 0.7,
    matchedIconEnable: false,
    gameScreenSecondScoreEnable: false
}

/**
 * Coupons
*/
let couponCodes = {
};

let pair = [];

/**
 * Init
 */
function initFindToWinGame(responseConfig) {
    console.log("INIT GAME");
    configRegulator(responseConfig);
    config();
}

function configRegulator(responseConfig) {
    // responseConfig = JSON.parse(responseConfig)
    // responseConfig.actiondata.ExtendedProps = JSON.parse(unescape(responseConfig.actiondata.ExtendedProps))

    const res = responseConfig;
    const ext = res.ExtendedProps;

    const row = res.game_elements.playground_rowcount;
    const col = res.game_elements.playground_columncount;

    const blankCard = ext.game_elements.blankcard_image ? ext.game_elements.blankcard_image : false
    // promoCodeCalculator(res.promo_codes);

    setBoxId(res.game_elements.gift_boxes)

    boxSizeCalculator(componentsData.gameScreen.boxes.length)

    // General data
    gameSettings.duration = res.game_elements.duration_of_game;
    generalData.sound = res.game_elements.sound_url;
    generalData.bgColor = ARGBtoRGBA(ext.background_color);
    generalData.bgImg = ext.background_image;
    generalData.closeButtonColor = ARGBtoRGBA(ext.close_button_color);
    generalData.fontName = ext.font_family;
    boxSettings.backfaceImg = ext.game_elements.backofcards_image;
    boxSettings.backfaceColor = ext.game_elements.backofcards_color;
    boxSettings.emptyBackfaceImg = ext.game_elements.blankcard_image;
    boxSettings.emptyFrontImg = ext.game_elements.blankcard_image;

    utils.loadSound();

    if (ext.font_family == 'custom' && utils.getMobileOperatingSystem() == 'Android') {
        generalData.fontName = ext.custom_font_family_android;
        generalData.fontFiles = responseConfig.fontFiles;
        console.log('font files ', generalData.fontFiles);
        addFonts();
    }

    // Mail Form Optionals
    if (res.mail_subscription) {
        activePageData.mailSubsScreen = true;

        if (res.mail_subscription_form.title) {
            componentsData.mailSubsScreen.title.use = true;
            componentsData.mailSubsScreen.title.text = slashController(res.mail_subscription_form.title);
            componentsData.mailSubsScreen.title.textColor = ARGBtoRGBA(ext.mail_subscription_form.title_text_color);
            componentsData.mailSubsScreen.title.fontSize = fontSizeCalculator(ext.mail_subscription_form.title_text_size) + 'px';
        }

        if (res.mail_subscription_form.message) {
            componentsData.mailSubsScreen.message.use = true;
            componentsData.mailSubsScreen.message.text = slashController(res.mail_subscription_form.message);
            componentsData.mailSubsScreen.message.textColor = ARGBtoRGBA(ext.mail_subscription_form.text_color);
            componentsData.mailSubsScreen.message.fontSize = fontSizeCalculator(ext.mail_subscription_form.text_size) + 'px';
        }

        if (res.mail_subscription_form.emailpermit_text) {
            componentsData.mailSubsScreen.emailPermission.use = true;
            componentsData.mailSubsScreen.emailPermission.text = slashController(res.mail_subscription_form.emailpermit_text);
            componentsData.mailSubsScreen.emailPermission.fontSize = fontSizeCalculator(ext.mail_subscription_form.emailpermit_text_size) + 'px';
            componentsData.mailSubsScreen.emailPermission.url = ext.mail_subscription_form.emailpermit_text_url;
        }

        if (res.mail_subscription_form.consent_text) {
            componentsData.mailSubsScreen.secondPermission.use = true;
            componentsData.mailSubsScreen.secondPermission.text = slashController(res.mail_subscription_form.consent_text);
            componentsData.mailSubsScreen.secondPermission.fontSize = fontSizeCalculator(ext.mail_subscription_form.consent_text_size) + 'px';
            componentsData.mailSubsScreen.secondPermission.url = ext.mail_subscription_form.consent_text_url;
        }
        // Mail Form Required
        componentsData.mailSubsScreen.button.text = slashController(res.mail_subscription_form.button_label);
        componentsData.mailSubsScreen.button.textColor = ARGBtoRGBA(ext.mail_subscription_form.button_text_color);
        componentsData.mailSubsScreen.button.buttonColor = ARGBtoRGBA(ext.mail_subscription_form.button_color);
        componentsData.mailSubsScreen.button.fontSize = fontSizeCalculator(ext.mail_subscription_form.button_text_size) + 'px';
        componentsData.mailSubsScreen.emailInput.placeHolder = res.mail_subscription_form.placeholder;
        componentsData.mailSubsScreen.alerts.check_consent_message = slashController(res.mail_subscription_form.check_consent_message);
        componentsData.mailSubsScreen.alerts.invalid_email_message = slashController(res.mail_subscription_form.invalid_email_message);
    }

    // Rules Screen Optionals
    if (res.gamification_rules && Object.keys(res.gamification_rules).length > 0) {
        activePageData.rulesScreen = true;

        componentsData.rulesScreen.bgImage = res.gamification_rules.background_image
        componentsData.rulesScreen.button.text = slashController(res.gamification_rules.button_label)
        componentsData.rulesScreen.button.textColor = ARGBtoRGBA(ext.gamification_rules.button_text_color);
        componentsData.rulesScreen.button.buttonColor = ARGBtoRGBA(ext.gamification_rules.button_color);
        componentsData.rulesScreen.button.fontSize = fontSizeCalculator(ext.gamification_rules.button_text_size) + 'px';
    }


    // Game Screen
    componentsData.gameScreen.scoreboard.background = ARGBtoRGBA(ext.game_elements.scoreboard_background_color);
    componentsData.gameScreen.scoreboard.type = ext.game_elements.scoreboard_shape;
    componentsData.gameScreen.scoreboard.position = ext.game_elements.scoreboard_pageposition;
    if (componentsData.gameScreen.scoreboard.type == "") componentsData.gameScreen.scoreboard.type = "roundedcorners"


    // Finish Screen
    if (res.game_result_elements.title) {
        componentsData.finishScreen.title.use = true
        componentsData.finishScreen.title.text = slashController(res.game_result_elements.title)
        componentsData.finishScreen.title.fontSize = fontSizeCalculator(ext.game_result_elements.title_text_size) + 'px'
        componentsData.finishScreen.title.textColor = ARGBtoRGBA(ext.game_result_elements.title_text_color)

    }
    if (res.game_result_elements.message) {
        componentsData.finishScreen.message.use = true
        componentsData.finishScreen.message.text = slashController(res.game_result_elements.message)
        componentsData.finishScreen.message.fontSize = fontSizeCalculator(ext.game_result_elements.text_size) + 'px'
        componentsData.finishScreen.message.textColor = ARGBtoRGBA(ext.game_result_elements.text_color)
    }
    if (res.game_result_elements.image) {
        componentsData.finishScreen.img.use = true
        componentsData.finishScreen.img.src = res.game_result_elements.image
    }

    componentsData.finishScreen.button.text = slashController(res.copybutton_label);
    componentsData.finishScreen.button.textColor = ARGBtoRGBA(ext.copybutton_text_color);
    componentsData.finishScreen.button.fontSize = fontSizeCalculator(ext.copybutton_text_size) + 'px';
    componentsData.finishScreen.button.buttonColor = ARGBtoRGBA(ext.copybutton_color);
    componentsData.finishScreen.button.androidLink = res.android_lnk;

    componentsData.finishScreen.lose.buttonLabel = slashController(res.game_result_elements.lose_button_label);
    componentsData.finishScreen.lose.loseAndroidLink = res.game_result_elements.lose_android_lnk;
    componentsData.finishScreen.lose.src = res.game_result_elements.lose_image;
    componentsData.finishScreen.lose.loseButtonTextColor = ARGBtoRGBA(ext.game_result_elements.losebutton_text_color);
    componentsData.finishScreen.lose.loseButtonColor = ARGBtoRGBA(ext.game_result_elements.losebutton_color);
    componentsData.finishScreen.lose.loseButtonTextSize = fontSizeCalculator(ext.game_result_elements.losebutton_text_size) + 'px';



    componentsData.finishScreen.couponCode.background = ARGBtoRGBA(ext.promocode_background_color);
    componentsData.finishScreen.couponCode.textColor = ARGBtoRGBA(ext.promocode_text_color);
    componentsData.finishScreen.couponCode.fontSize = fontSizeCalculator(ext.game_result_elements.text_size) + 'px';


    try { REPORT = res.report.click; } 
    catch (error) { console.log("ERROR",res.report); }
}

function setBoxId(boxes){
    let tmpArr = []
    boxes.forEach((box,i) => {
        let id = i+1
        let tmpObj = box
        tmpObj.id = id
        tmpArr.push(tmpObj)
        couponCodes[id] = box.staticcode
    });
    componentsData.gameScreen.boxes = tmpArr
}

/**
 * Start page check
 */
function pageChecker() {
    createMainComponents();
    if (activePageData.mailSubsScreen) {
        createMailSubsScreen()
    }
    else if (!activePageData.mailSubsScreen && activePageData.rulesScreen) {
        createRulesScreen()
    }
    else {
        createGameScreen()
    }
}

/*
 * Main(container) component
 */
function createMainComponents() {
    MAIN_COMPONENT.id = generalData.id;
    MAIN_COMPONENT.style.width = "100%";
    MAIN_COMPONENT.style.height = "100%";
    MAIN_COMPONENT.style.top = "0";
    MAIN_COMPONENT.style.left = "0";
    MAIN_COMPONENT.style.zIndex = "9999";
    MAIN_COMPONENT.style.position = "absolute";
    document.body.appendChild(MAIN_COMPONENT);
}

/**
 * Mail subscribe form screen
 */

function createMailSubsScreen() {
    var mailSubsScreen = document.createElement("DIV");
    mailSubsScreen.id = componentsData.mailSubsScreen.id;
    mailSubsScreen.style.width = "100%";
    mailSubsScreen.style.height = "100%";
    mailSubsScreen.style.backgroundColor = generalData.bgColor;
    mailSubsScreen.style.backgroundImage = "url('" + generalData.bgImg + "')";
    mailSubsScreen.style.backgroundRepeat = "no-repeat";
    mailSubsScreen.style.backgroundSize = "cover";
    mailSubsScreen.style.backgroundPosition = "center";
    mailSubsScreen.style.transition = "all 1s";
    mailSubsScreen.style.position = "fixed";
    mailSubsScreen.style.top = "0";
    mailSubsScreen.style.left = "0";
    mailSubsScreen.style.zIndex = "998";

    var container = document.createElement("DIV");
    container.id = "rmc-container";
    container.style.width = "80%";
    container.style.height = "auto";
    container.style.position = "absolute";
    container.style.transform = "translate(-50%, -50%)";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.textAlign = "center";

    if (componentsData.mailSubsScreen.title.use) {
        var title = document.createElement("DIV");
        title.id = "rmc-mail-subs-title";
        title.style.color = componentsData.mailSubsScreen.title.textColor;
        title.style.fontSize = componentsData.mailSubsScreen.title.fontSize;
        title.style.display = "inline-block";
        title.style.width = "100%";
        title.style.margin = "15px 0";
        title.style.fontFamily = generalData.fontName;
        title.innerText = componentsData.mailSubsScreen.title.text;
        container.appendChild(title);
    }

    if (componentsData.mailSubsScreen.message.use) {
        var message = document.createElement("DIV");
        message.id = "rmc-mail-subs-message";
        message.style.color = componentsData.mailSubsScreen.message.textColor;
        message.style.fontSize = componentsData.mailSubsScreen.message.fontSize;
        message.style.display = "inline-block";
        message.style.width = "100%";
        message.style.margin = "15px 0";
        message.style.fontFamily = generalData.fontName;
        message.innerText = componentsData.mailSubsScreen.message.text;
        container.appendChild(message);
    }


    var input = document.createElement("INPUT");
    input.setAttribute("type", "email");
    input.setAttribute("placeholder", componentsData.mailSubsScreen.emailInput.placeHolder);
    input.id = componentsData.mailSubsScreen.emailInput.id;
    input.style.backgroundColor = "white";
    input.style.width = "100%";
    input.style.padding = "9px";
    input.style.border = "1px solid " + generalData.fontColor;
    input.style.borderRadius = generalData.borderRadius;
    input.style.maxWidth = "-webkit-fill-available";
    input.style.fontSize = "19px";
    input.style.fontWeight = "bold";
    input.style.margin = "15px 0";
    input.style.color = generalData.fontColor;
    input.style.marginBottom = "12px";
    input.style.display = "inline-block";
    input.style.fontFamily = generalData.fontName;
    container.appendChild(input);

    var emailAlert = document.createElement("div");
    emailAlert.id = 'emailAlert';
    container.appendChild(emailAlert);

    if (componentsData.mailSubsScreen.emailPermission.use) {
        var emailPermission = createPermitRow(
            componentsData.mailSubsScreen.emailPermission.id,
            componentsData.mailSubsScreen.emailPermission.text,
            componentsData.mailSubsScreen.emailPermission.fontSize,
            generalData.fontName,
            componentsData.mailSubsScreen.emailPermission.url
        )

        container.appendChild(emailPermission);

        var checkboxAlert1 = document.createElement("div");
        checkboxAlert1.id = 'checkboxAlert1';
        container.appendChild(checkboxAlert1);
    }

    if (componentsData.mailSubsScreen.emailPermission.use) {
        var secondPermission = createPermitRow(
            componentsData.mailSubsScreen.secondPermission.id,
            componentsData.mailSubsScreen.secondPermission.text,
            componentsData.mailSubsScreen.emailPermission.fontSize,
            generalData.fontName,
            componentsData.mailSubsScreen.secondPermission.url
        )

        container.appendChild(secondPermission);

        var checkboxAlert2 = document.createElement("div");
        checkboxAlert2.id = 'checkboxAlert2';
        container.appendChild(checkboxAlert2);
    }

    var submit = document.createElement("button");
    submit.id = componentsData.mailSubsScreen.button.id;
    submit.style.backgroundColor = componentsData.mailSubsScreen.button.buttonColor;
    submit.style.color = componentsData.mailSubsScreen.button.textColor;
    submit.style.padding = "15px 30px";
    submit.style.fontSize = componentsData.mailSubsScreen.button.fontSize;
    submit.style.borderRadius = generalData.borderRadius;
    submit.style.border = 0;
    submit.style.position = "absolute";
    submit.style.bottom = "70px";
    submit.style.left = "50%";
    submit.style.width = "fit-content";
    submit.style.transform = "translate(-50%, 0%)";
    submit.style.cursor = "pointer";
    submit.style.fontWeight = "bolder";
    submit.style.fontFamily = generalData.fontName;
    submit.innerText = componentsData.mailSubsScreen.button.text;

    activePageData.rulesScreen && createRulesScreen();

    submit.addEventListener("click", function () {
        if (emailChecker()) {
            removeAlert("emailAlert")
            if (emailPermitChecker() && secondPermitChecker()) {
                EMAIL = document.querySelector("#" + componentsData.mailSubsScreen.emailInput.id).value.toLowerCase()
                utils.subscribe(EMAIL);
                if (document.querySelector("#" + componentsData.mailSubsScreen.id)) {
                    document.querySelector("#" + componentsData.mailSubsScreen.id).remove();
                    if (!activePageData.rulesScreen) {
                        createGameScreen();
                    }
                }
            } else {
                if (!emailPermitChecker()) {
                    alertChecker(componentsData.mailSubsScreen.alerts.check_consent_message, 'checkboxAlert1')
                }
                else {
                    removeAlert("checkboxAlert1")
                }
                if (!secondPermitChecker()) {
                    alertChecker(componentsData.mailSubsScreen.alerts.check_consent_message, 'checkboxAlert2')
                }
                else {
                    removeAlert("checkboxAlert2")
                }
            }
        } else {
            alertChecker(componentsData.mailSubsScreen.alerts.invalid_email_message, 'emailAlert')
        }
    });

    mailSubsScreen.appendChild(submit);
    mailSubsScreen.appendChild(container);
    MAIN_COMPONENT.appendChild(mailSubsScreen);
}

function createPermitRow(inputId,desc,fontSize,fontName,url){
    var container = document.createElement("DIV");
    container.style.color = "black";
    container.style.fontSize = "13px";
    container.style.margin = "15px 0";
    container.style.width = "100%";
    container.style.display = "flex";
    container.style.alignItems = "center";

    var input = document.createElement("input");
    input.id = inputId;
    input.type="checkbox";
    input.style.width="20px";
    input.style.height="20px";
    input.style.display="block";
    input.style.marginRight="7px";
    input.style.float="left";

    var text = document.createElement("div");
    text.innerText=desc;
    text.style.fontSize=fontSize;
    text.style.fontFamily=fontName;
    text.style.textDecoration="underline";
    text.style.color="black";

    text.addEventListener('click',()=>{
        utils.linkClicked(url)
        console.log(url,desc);
    })

    container.appendChild(input);
    container.appendChild(text);

    return container;
}

function createAlert(text, id) {
    if (!document.querySelector('#' + id).innerText) {
        var alert = document.createElement("div");
        alert.innerText = text;
        alert.style.width = "100%";
        alert.style.padding = "5px 10px";
        alert.style.zIndex = "999";
        alert.style.textAlign = "left";
        alert.style.color = "#000";
        alert.style.fontSize = "14px";
        alert.style.fontFamily = generalData.fontName;
        alert.style.transform = "translate3d(0,0,3px)";

        document.querySelector('#' + id).appendChild(alert)
    }
    else {

    }
}

function removeAlert(id) {
    if (document.querySelector('#' + id)) {
        document.querySelector('#' + id).innerText = ""
    }
}

function alertChecker(text, id) {
    switch (id) {
        case "checkboxAlert1":
            if (emailPermitChecker()) {
                document.querySelector('#' + id).innerText = ""
            } else {
                createAlert(text, id)
            }
            break;
        case "checkboxAlert2":
            if (secondPermitChecker()) {
                document.querySelector('#' + id).innerText = ""
            } else {
                createAlert(text, id)
            }
            break;
        case "emailAlert":
            if (emailChecker()) {
                document.querySelector('#' + id).innerText = ""
            } else {
                createAlert(text, id)
            }
            break;
        default:
            break;
    }
}

function emailChecker() {
    if (document.querySelector("#" + componentsData.mailSubsScreen.emailInput.id)) {
        var email = document.querySelector("#" + componentsData.mailSubsScreen.emailInput.id).value.toLowerCase();
        var pattern = new RegExp("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}");
        var emailStatus = pattern.test(email);
        if (emailStatus == true) {
            console.log("email checker", true)
            return true
        }
        else {
            console.log("email checker", false)
            return false
        }
    }
    else {
        console.log("email checker", false)
        return false
    }
}

function emailPermitChecker() {
    if (document.querySelector("#" + componentsData.mailSubsScreen.emailPermission.id)) {
        if (document.querySelector("#" + componentsData.mailSubsScreen.emailPermission.id).checked) {
            return true
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}

function secondPermitChecker() {
    if (document.querySelector("#" + componentsData.mailSubsScreen.secondPermission.id)) {
        if (document.querySelector("#" + componentsData.mailSubsScreen.secondPermission.id).checked) {
            return true
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}

/**
 * Close button
 */
function createCloseButton() {
    var closeButton = document.createElement("BUTTON");
    closeButton.id = generalData.closeButtonId;
    closeButton.innerHTML = "&#10006;";
    closeButton.style.position = "absolute";
    closeButton.style.right = "0px";
    closeButton.style.top = "0px";
    closeButton.style.border = "0";
    closeButton.style.color = generalData.closeButtonColor;
    closeButton.style.padding = "5px 10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "29px";
    closeButton.style.borderRadius = generalData.borderRadius;
    closeButton.style.backgroundColor = 'rgba(0,0,0,0)';
    closeButton.style.zIndex = "999";
    closeButton.style.transform = "translate3d(0,0,3px)";
    if (componentsData.gameScreen.scoreboard.position == 'topRight') {
        closeButton.style.left = "0px";
        closeButton.style.right = "auto";
    }

    closeButton.addEventListener("click", function () {
        utils.close();
        document.querySelector("#" + generalData.id) ? document.querySelector("#" + generalData.id).remove() : null;
        document.querySelector("#" + componentsData.mailSubsScreen.id) ? document.querySelector("#" + componentsData.mailSubsScreen.id).remove() : null;
        document.querySelector("#" + componentsData.rulesScreen.id) ? document.querySelector("#" + componentsData.rulesScreen.id).remove() : null;
        document.querySelector("#" + generalData.closeButtonId) ? document.querySelector("#" + generalData.closeButtonId).remove() : null;
        document.documentElement.style.overflow = 'auto';
        utils.pauseSound();
        console.log('Oyun Kapatıldı');
    });

    MAIN_COMPONENT.appendChild(closeButton);
}

/**
 * Rules screen
 */
function createRulesScreen() {
    var rulesScreen = document.createElement("DIV");
    rulesScreen.id = componentsData.rulesScreen.id;
    rulesScreen.style.width = "100%";
    rulesScreen.style.height = "100%";
    rulesScreen.style.position = "fixed";
    rulesScreen.style.transition = "all 1s";
    rulesScreen.style.top = "0";
    rulesScreen.style.left = "0";
    rulesScreen.style.zIndex = "997";

    var rulesIMG = document.createElement("DIV");
    rulesIMG.style.width = "100%";
    rulesIMG.style.height = "100%";
    rulesIMG.style.backgroundImage = "url('" + (componentsData.rulesScreen.bgImage ? componentsData.rulesScreen.bgImage : generalData.bgImg) + "')";
    rulesIMG.style.backgroundRepeat = "no-repeat";
    rulesIMG.style.backgroundSize = "contain";
    rulesIMG.style.backgroundPosition = "center";
    rulesIMG.style.position = "fixed";
    rulesIMG.style.transition = "all 1s";
    rulesIMG.style.top = "0";
    rulesIMG.style.left = "0";
    rulesIMG.style.zIndex = "2";
    rulesIMG.style.transform = " translate3d(0,0,3px)";

    if (componentsData.rulesScreen.bgImage) {
        var rulesScreenBluredBG = document.createElement("DIV");
        rulesScreenBluredBG.style.width = "100%";
        rulesScreenBluredBG.style.height = "100%";
        rulesScreenBluredBG.style.backgroundImage = "url('" + componentsData.rulesScreen.bgImage + "')";
        rulesScreenBluredBG.style.backgroundRepeat = "no-repeat";
        rulesScreenBluredBG.style.backgroundSize = "center";
        rulesScreenBluredBG.style.backgroundPosition = "center";
        rulesScreenBluredBG.style.position = "fixed";
        rulesScreenBluredBG.style.transition = "all 1s";
        rulesScreenBluredBG.style.top = "0";
        rulesScreenBluredBG.style.left = "0";
        rulesScreenBluredBG.style.zIndex = "1";
        rulesScreenBluredBG.style.filter = "blur(35px)";
        rulesScreen.appendChild(rulesScreenBluredBG)
    }


    var submit = document.createElement("div");
    submit.id = componentsData.rulesScreen.button.id;
    submit.style.backgroundColor = componentsData.rulesScreen.button.buttonColor;
    submit.style.color = componentsData.rulesScreen.button.textColor;
    submit.style.padding = "15px 30px";
    submit.style.fontSize = componentsData.rulesScreen.button.fontSize;
    submit.style.borderRadius = generalData.borderRadius;
    submit.style.position = "absolute";
    submit.style.bottom = "70px";
    submit.style.left = "50%";
    submit.style.width = "fit-content";
    submit.style.transform = "translate(-50%, 0%) translate3d(0,0,3px)";
    submit.style.cursor = "pointer";
    submit.style.zIndex = "3";
    submit.style.fontWeight = "bolder";
    submit.style.fontFamily = generalData.fontName;
    submit.innerText = componentsData.rulesScreen.button.text;

    rulesScreen.appendChild(rulesIMG)
    rulesScreen.appendChild(submit);
    MAIN_COMPONENT.appendChild(rulesScreen);


    submit.addEventListener("click", function () {
        document.querySelector("#" + componentsData.rulesScreen.id) ? document.querySelector("#" + componentsData.rulesScreen.id).remove() : null;
        createGameScreen();
    });


}

/**
 * Game area
 */
function createGameScreen() {
    var gameScreen = document.createElement("DIV");
    gameScreen.id = componentsData.gameScreen.id;
    gameScreen.style.width = "100%";
    gameScreen.style.height = "100%";
    gameScreen.style.backgroundColor = generalData.bgColor;
    gameScreen.style.backgroundImage = "url('" + generalData.bgImg + "')";
    gameScreen.style.backgroundRepeat = "no-repeat";
    gameScreen.style.backgroundSize = "cover";
    gameScreen.style.backgroundPosition = "center";
    gameScreen.style.transition = "all 1s";
    gameScreen.style.position = "fixed";
    gameScreen.style.top = "0";
    gameScreen.style.left = "0";
    gameScreen.style.zIndex = "995";
    gameScreen.style.display = "flex";
    gameScreen.style.alignItems = "flex-end";

    var gameArea = document.createElement("DIV");
    gameArea.id = componentsData.gameScreen.gameArea;
    gameArea.style.width = "100%";
    gameArea.style.height = gameSettings.gameAreaHeight;
    gameArea.style.top = "50%";
    gameArea.style.left = "50%";
    gameArea.style.textAlign = "center";
    // gameArea.style.display = "flex";
    // gameArea.style.justifyContent = "space-around";
    gameArea.style.marginBottom = "35px";
    // gameArea.style.backgroundColor = generalData.bgColor;

    gameScreen.appendChild(gameArea);

    MAIN_COMPONENT.appendChild(gameScreen);
    console.log("oyun başladı");

    setTimeout(() => {
        startGame();
        utils.sendReport();
    }, 1);
}

function createBox(data, i) {
    if (!data || !data.id) return

    let id = "box"+data.id;
    var card = document.createElement('img');
    card.id = id;
    card.src = data.image;
    card.style.width = boxSettings.boxWidth + 'px';
    card.style.animation = "tilt-n-move-shaking 0.50s infinite";
    card.style.transition = ".5s all";
    card.style.position = "fixed";   
    card.style.bottom = "5px"; 
    card.style.left = CURRENT_TOTAL_LEFT+"px";
    CURRENT_TOTAL_LEFT += boxSettings.boxWidth;


    card.addEventListener("click", () => {
        if (CLICKABLE) {
            open(id, data)
        }
    })

    return card;
}

function createCSS() {
    var style = document.createElement("style");
    style.id = "rmc-style";
    style.innerHTML = "@keyframes tilt-n-move-shaking {\
        0% {\
            transform: translate(0, 0) rotate(0deg);\
        }\
        25% {\
            transform: translate(5px, 5px) rotate(5deg);\
        }\
        50% {\
            transform: translate(0, 0) rotate(0eg);\
        }\
        75% {\
            transform: translate(-5px, 5px) rotate(-5deg);\
        }\
        100% {\
            transform: translate(0, 0) rotate(0deg);\
        }\
    }"
    document.head.appendChild(style);
}

function removeEventListener(id) {
    let card = document.querySelector('#' + id)
    card.outerHTML = card.outerHTML
}

function clickableController() {
    CLICKABLE = false
}

function open(boxId, data) {
    console.log("CLICKED " + boxId + ":", data);
    SCORE = data.id
    let box = document.querySelector('#' + boxId);
    
    box.style.animation = "";
    const halfWidth = (box.getClientRects()[0].width/2);
    const c = window.innerWidth/2;
    setTimeout(() => {
        box.style.bottom = "200px";
        box.style.left = c-halfWidth+"px"
        box.style.transform = "scale(1.5)"
        setTimeout(() => {
            finish()
        }, 800);
    }, 100);
    clickableController();
}

function close(cardId) {
    let card = document.querySelectorAll('#' + cardId + '>div');
    let front = card[0];
    let back = card[1];
    front.style.transform = "rotate3d(0, 1, 0, 180deg)"
    back.style.transform = "rotate3d(0, 1, 0, 0deg)"
}

function startGame() {
    componentsData.gameScreen.boxes.forEach((box, i) => {
        if (document.querySelector('#' + componentsData.gameScreen.id) && document.querySelector('#' + componentsData.gameScreen.gameArea)) {
            let tmpBox = createBox(box)
            tmpBox && document.querySelector('#' + componentsData.gameScreen.gameArea).appendChild(tmpBox);
        }
    });
}

/**
 * Score board
 */

function createFinishScreen(lose) {
    var finishScreen = document.createElement("DIV");
    finishScreen.id = componentsData.finishScreen.id;
    finishScreen.style.width = "100%";
    finishScreen.style.height = "100%";
    finishScreen.style.backgroundColor = generalData.bgColor;
    finishScreen.style.backgroundImage = "url('" + generalData.bgImg + "')";
    finishScreen.style.backgroundRepeat = "no-repeat";
    finishScreen.style.backgroundSize = "cover";
    finishScreen.style.backgroundPosition = "center";
    finishScreen.style.transition = "all 1s";
    finishScreen.style.position = "fixed";
    finishScreen.style.top = "0";
    finishScreen.style.left = "0";
    finishScreen.style.zIndex = "994";

    var container = document.createElement("DIV");
    container.id = "rmc-finish-container";
    container.style.width = "100%";
    container.style.height = "auto";
    container.style.position = "absolute";
    container.style.transform = "translate(-50%, -60%)";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.textAlign = "center";


    if (componentsData.finishScreen.img.use) {
        var img = document.createElement("img");
        img.id = "rmc-finish-img";
        img.src = componentsData.finishScreen.img.src;
        img.style.display = "inline-block";
        img.style.margin = "15px 0";
        img.style.width = '80%';
        container.appendChild(img);
    }
    if (componentsData.finishScreen.title.use) {
        var title = document.createElement("DIV");
        title.id = "rmc-finish-title";
        title.style.color = componentsData.finishScreen.title.textColor;
        title.style.fontSize = componentsData.finishScreen.title.fontSize;
        title.style.display = "inline-block";
        title.style.margin = "15px 0";
        title.style.width = 'inherit';
        title.style.fontFamily = generalData.fontName;
        title.innerText = componentsData.finishScreen.title.text;
        container.appendChild(title);
    }
    if (componentsData.finishScreen.message.use) {
        var message = document.createElement("DIV");
        message.id = "rmc-finish-message";
        message.style.color = componentsData.finishScreen.message.textColor;
        message.style.fontSize = componentsData.finishScreen.message.fontSize;
        message.style.display = "inline-block";
        message.style.margin = "15px 0";
        message.style.width = 'inherit';
        message.style.fontFamily = generalData.fontName;
        message.innerText = utils.winCheck() ? componentsData.finishScreen.message.text : componentsData.finishScreen.message.loseText;
        container.appendChild(message);
    }
    var _score = document.createElement("DIV");
    _score.id = 'rmc-finish-finish';
    _score.innerHTML = couponCodes[SCORE];
    _score.style.transition = "1s all";
    _score.style.padding = componentsData.gameScreen.scoreboard.type === 'circle' ? (utils.winCheck() ? '40px 30px' : '70px 20px') : '15px 10px';
    _score.style.width = 'fit-content';
    _score.style.margin = '0 auto';
    _score.style.color = componentsData.gameScreen.scoreboard.fontColor;
    _score.style.fontFamily = generalData.fontName;
    _score.style.fontSize = componentsData.gameScreen.scoreboard.fontSize;
    _score.style.background = componentsData.gameScreen.scoreboard.background;
    componentsData.gameScreen.scoreboard.type !== 'square' && (_score.style.borderRadius = componentsData.gameScreen.scoreboard.type == 'circle' ? '50%' : '15px');
    container.appendChild(_score);

    _score.addEventListener('click', function () {
        utils.copyToClipboard(lose);
        utils.pauseSound();
    });

    
    var copyButton = document.createElement("div");
    copyButton.id = componentsData.finishScreen.button.id;
    copyButton.style.backgroundColor = componentsData.finishScreen.button.buttonColor;
    copyButton.style.color = componentsData.finishScreen.button.textColor;
    copyButton.style.padding = "15px 30px";
    copyButton.style.fontSize = componentsData.finishScreen.button.fontSize;
    copyButton.style.borderRadius = generalData.borderRadius;
    copyButton.style.position = "absolute";
    copyButton.style.bottom = "70px";
    copyButton.style.left = "50%";
    copyButton.style.transform = "translate(-50%, 0%) translate3d(0,0,3px)";
    copyButton.style.width = "fit-content";
    copyButton.style.margin = "10px auto";
    copyButton.style.cursor = "pointer";
    copyButton.style.zIndex = "3";
    copyButton.style.fontWeight = "bolder";
    copyButton.style.fontFamily = generalData.fontName;
    copyButton.innerText = componentsData.finishScreen.button.text;

    finishScreen.appendChild(copyButton);

    utils.saveCodeGotten()

    copyButton.addEventListener('click', function () {
        utils.copyToClipboard();
        utils.pauseSound();
    });

    copyButton.addEventListener("click", function () {
        if (utils.getMobileOperatingSystem() == 'iOS' && componentsData.finishScreen.button.iOSLink) {
            redirection(componentsData.finishScreen.button.iOSLink)
        }
    });
    finishScreen.appendChild(container);
    MAIN_COMPONENT.appendChild(finishScreen);
}

function finish() {
    createFinishScreen();
    document.querySelector('#' + componentsData.gameScreen.id).remove();
}

function promoCodeCalculator(data) {
    let codes = { 0: "" }, counter = 1;
    data.forEach(range => {
        if (range.rangebottom == range.rangetop) {
            codes[counter] = range.staticcode;
            counter++;
        }
        else {
            for (let index = range.rangebottom; index <= range.rangetop; index++) {
                codes[counter] = range.staticcode;
                counter++;
            }
        }
    });

    couponCodes = codes;
}

function scoreCalculator() {
    let durationEl = document.querySelector('#' + componentsData.gameScreen.scoreboard.countDown.id)
    console.log();
}

function addFonts() {
    if (generalData.fontFiles === undefined) {
        return
    }
    var addedFontFiles = [];
    for (var fontFileIndex in generalData.fontFiles) {
        var fontFile = generalData.fontFiles[fontFileIndex];
        if (addedFontFiles.includes(fontFile)) {
            continue;
        }
        var fontFamily = fontFile.split(".")[0];
        var newStyle = document.createElement('style');
        var cssContent = "@font-face{font-family:" + fontFamily + ";src:url('" + fontFile + "');}";
        newStyle.appendChild(document.createTextNode(cssContent));
        document.head.appendChild(newStyle);
        addedFontFiles.push(fontFile);
    }
};

function ARGBtoRGBA(argb) {
    if (!argb || argb.length < 8) return argb

    if (argb.substr(0, 1) !== '#') return argb.replace(/(..)(......)/, '$2$1')

    return argb.replace(/#(..)(......)/, '#$2$1')
}

function fontSizeCalculator(BEFS) {
    BEFS = parseInt(BEFS)
    switch (BEFS) {
        case 10:
            return 28
            break;
        case 9:
            return 26
            break;
        case 8:
            return 24
            break;
        case 7:
            return 22
            break;
        case 6:
            return 20
            break;
        case 5:
            return 18
            break;
        case 4:
            return 16
            break;
        case 3:
            return 14
            break;
        case 2:
            return 12
            break;
        case 1:
            return 10
            break;
        default:
            return 18
            break;
    }
}

function slashController(text) {
    if (!text) return text

    let pos = text.indexOf('\\n');
    while (pos > -1) {
        text = text.replace("\\n", "\n");
        pos = text.indexOf('\\n');
    }
    return text
}

function boxSizeCalculator(boxCount) {
    let cardWidth = (window.innerWidth / boxCount);
    let cardHeight = cardWidth

    boxSettings.boxWidth = cardWidth
    boxSettings.boxHeight = cardHeight
}

function redirection(url) {
    location.href = url
}

function getAndroidLink(lose) {
    if (lose) {
        if (componentsData.finishScreen.lose.loseAndroidLink) {
            return componentsData.finishScreen.lose.loseAndroidLink
        }
        else {
            return ""
        }
    } else {
        if (componentsData.finishScreen.button.androidLink) {
            return componentsData.finishScreen.button.androidLink
        } else {
            return ""
        }
    }
}

function getIOSLink(lose) {
    if (lose) {
        if (componentsData.finishScreen.lose.loseIOSLink) {
            return componentsData.finishScreen.lose.loseIOSLink
        }
        else {
            return ""
        }
    } else {
        if (componentsData.finishScreen.button.iOSLink) {
            return componentsData.finishScreen.button.iOSLink
        } else {
            return ""
        }
    }
}

let utils = {
    randNum: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    cardSizeCalculate: () => {
        const rowItemCount = componentsData.gameScreen.cards[0].length;
        const colmItemCount = componentsData.gameScreen.cards.length;
        const w = (WIDTH - (rowItemCount * (boxSettings.cardMargin * 2))) / rowItemCount;
        const h = (gameSettings.gameAreaHeight - (colmItemCount * (boxSettings.cardMargin * 2))) / colmItemCount;

        boxSettings.cardWidth = w;
        boxSettings.cardHeight = h;
    },
    startCountDown: (elem, seconds) => {
        var that = {};

        that.elem = elem;
        that.seconds = seconds;
        that.totalTime = seconds * 100;
        that.usedTime = 0;
        that.startTime = +new Date();
        that.timer = null;

        that.count = function () {
            that.usedTime = Math.floor((+new Date() - that.startTime) / 10);
            var tt = that.totalTime - that.usedTime;
            SCORE = Math.round(that.usedTime / 100)
            // console.log("score",SCORE);
            if (tt <= 0) {
                that.elem.innerHTML = '00:00.00';
                clearInterval(that.timer);
            } else {
                var mi = Math.floor(tt / (60 * 100));
                var ss = Math.floor((tt - mi * 60 * 100) / 100);
                var ms = tt - Math.floor(tt / 100) * 100;

                that.elem.innerHTML = that.fillZero(mi) + ":" + that.fillZero(ss) + "." + that.fillZero(ms.toFixed(0));
            }
        };


        if (!that.timer) {
            that.timer = setInterval(that.count, 10);
        }

        that.fillZero = function (num) {
            return num < 10 ? '0' + num : num;
        };

        return that;
    },
    getMobileOperatingSystem: () => {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        if (/iPad|iPhone|iPod|Mac/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    },
    getBrowser: () => {
        try {
            // Opera 8.0+
            var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            if (isOpera) return "Opera"

            // Firefox 1.0+
            var isFirefox = typeof InstallTrigger !== 'undefined';
            if (isFirefox) return "Firefox"

            // Safari 3.0+ "[object HTMLElementConstructor]" 
            var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
            if (!isSafari) isSafari = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);

            if (isSafari) return "Safari"

            // Internet Explorer 6-11
            var isIE = /*@cc_on!@*/false || !!document.documentMode;
            if (isIE) return "IE"

            // Edge 20+
            var isEdge = !isIE && !!window.StyleMedia;
            if (isEdge) return "Edge"

            // Chrome 1 - 79
            var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
            if (isChrome) return "Chrome"

            // Edge (based on chromium) detection
            var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
            if (isEdgeChromium) return "EdgeChromium"

            // Blink engine detection
            // var isBlink = (isChrome || isOpera) && !!window.CSS;

            return "unknown"
        } catch (error) {
            console.log("getBrowser error", error);
            return "unknown"
        }
    },
    winCheck: () => {
        return SCORE > 0 ? true : false
    },
    copyToClipboard: (lose) => {
        console.log("NATIVE COPYCLIPBORD");
        if (window.Android) {
            Android.copyToClipboard(lose ? "" : couponCodes[SCORE], getAndroidLink(lose))
        } else if (window.webkit.messageHandlers.eventHandler) {
            window.webkit.messageHandlers.eventHandler.postMessage({
                method: "copyToClipboard",
                couponCode: lose ? "" : couponCodes[SCORE],
                url:getIOSLink(lose)
            })
        }
    },
    sendReport: () => {
        console.log("NATIVE SENDREPORT");
        if (window.Android) {
            Android.sendReport()
        } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.eventHandler.postMessage({
                method: "sendReport"
            })
        }
    },
    close: () => {
        console.log("NATIVE CLOSE");
        if (window.Android) {
            Android.close()
        } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.eventHandler.postMessage({
                method: "close"
            })
        }
    },
    subscribe: (email) => {
        console.log("NATIVE SUBSCRIBE");
        if (!email) return

        if (window.Android) {
            Android.subscribeEmail(email.trim())
        } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.eventHandler.postMessage({
                method: "subscribeEmail",
                email: email.trim()
            })
        }
    },
    saveCodeGotten: () => {
        console.log("NATIVE CODE GOTTEN");
        if (window.Android) {
            Android.saveCodeGotten(couponCodes[SCORE],EMAIL,REPORT)
        } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.eventHandler.postMessage({
                method: "saveCodeGotten",
                code: couponCodes[SCORE],
                email: EMAIL,
                report: REPORT
            })
        }
    },
    linkClicked: (url) => {
        if (window.Android) {
            location.href=url ? url : ""
        } else if (window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.eventHandler.postMessage({
                method: "linkClicked",
                url: url ? url : ""
            })
        }
    },
    loadSound: () => {
        AUDIO = document.createElement("audio")
        AUDIO.src = generalData.sound;
        AUDIO.currentTime = 0;
        AUDIO.setAttribute("playsinline", true);
        AUDIO.setAttribute("preload", "auto");
        AUDIO.setAttribute("loop", true);
        AUDIO.setAttribute("autoplay", true);
        document.querySelector('head').appendChild(AUDIO);
        try {
            if (utils.getBrowser() == 'Safari') {
                let html = document.querySelector('html');
                html.addEventListener('touchstart', () => { AUDIO.play(); html.removeEventListener('touchstart', () => { }) })
                html.addEventListener('click', () => { AUDIO.play(); html.removeEventListener('click', () => { }) })
            }
            else {
                AUDIO.play();
            }
        } catch (error) {
            console.log("loadSound error", error);
        }
    },
    pauseSound: () => {
        try {
            const audio = document.querySelector("audio")
            if (audio) {
                !audio.paused && audio.pause();
                audio.remove()
            } else {
                console.log("not closed sounnd");
            }
        } catch (error) {
            console.log(error);
        }
    },
};

/**
 * Start configs
 */
function config() {
    document.body.setAttribute('style', '-webkit-user-select:none');
    CLICKABLE_DURATION = boxSettings.duration
    pageChecker();
    createCloseButton();
    createCSS();
}
