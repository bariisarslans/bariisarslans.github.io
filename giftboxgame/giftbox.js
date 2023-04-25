// VERSION 1.0

let SCORE = 0,
  HEIGHT = window.innerHeight,
  CLICKABLE = true,
  AUDIO,
  EMAIL = '',
  REPORT = '',
  CURRENT_TOTAL_LEFT = 0;

let MAIN_COMPONENT = document.createElement('DIV');

// Page nums
let screens = {
  form: 1,
  rules: 2,
  game: 3,
  finish: 4,
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
  sound: '',
};

/**
 * Components defaults
 */
let componentsData = {
  mailSubsScreen: {
    id: 'rmc-mail-subs-screen',
    title: { use: true, text: '', textColor: '', fontSize: '' },
    message: { use: true, text: '', textColor: '', fontSize: '' },
    emailPermission: {
      use: true,
      id: 'rmc-email-permission-checkbox',
      text: '',
      fontSize: '',
      url: '',
    },
    secondPermission: {
      use: true,
      id: 'rmc-second-permission-checkbox',
      text: '',
      fontSize: '',
      url: '',
    },
    button: {
      use: true,
      id: 'rmc-mail-subs-button',
      text: '',
      textColor: '',
      buttonColor: '',
      fontSize: '',
      goScreen: screens.rules,
    },
    emailInput: { id: 'rmc-email-input', placeHolder: 'Email', value: '' },
    alerts: { invalid_email_message: '', check_consent_message: '' },
  },
  rulesScreen: {
    bgImage: '',
    id: 'rmc-rules-screen',
    title: { use: true, text: '', textColor: '', fontSize: '' },
    message: { use: true, text: '', textColor: '', fontSize: '' },
    button: {
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
    id: 'rmc-game-screen',
    gameArea: 'rmc-game-screen-game-area',
    boxes: [...Array(5)].map((_, i) => ({
      id: (i + 1).toString(),
      image: 'giftbox.png',
      promoCode: (i + 1).toString(),
    })),
    scoreboard: {
      id: 'rmc-scoreboard',
      fontSize: '',
      background: '',
      fontColor: '',
      type: 'round',
      position: 'topLeft',
      countDown: { id: 'rmc-count-down' },
      score: { id: 'rmc-score' },
    },
  },
  finishScreen: {
    id: 'rmc-finish-screen',
    title: { use: true, text: '', loseText: '', textColor: '', fontSize: '' },
    message: { use: true, text: '', loseText: '', textColor: '', fontSize: '' },
    img: { use: false, src: '' },
    score: { use: true, id: 'rmc-finish-score', text: '' },
    lose: {
      id: 'rmc-finish-lose-img',
      src: '',
      buttonLabel: '',
      loseAndroidLink: '',
      loseIOSLink: '',
      loseButtonColor: '',
      loseButtonTextSize: '',
      loseButtonTextColor: '',
    },
    couponCode: { use: true, id: 'rmc-coupon-code', fontSize: '' },
    button: {
      use: true,
      id: 'rmc-finish-button',
      text: '',
      textColor: '',
      buttonColor: '',
      fontSize: '',
      androidLink: '',
      iOSLink: '',
    },
  },
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
  emptyBackfaceImg: '',
  emptyBackfaceColor: 'gray',
  emptyFrontImg: '',
  emptyFrontColor: 'gray',
};

/**
 * Game page settings
 */
let gameSettings = {
  duration: 6,
  gameAreaHeight: HEIGHT * 0.7,
  matchedIconEnable: false,
  gameScreenSecondScoreEnable: false,
};

/**
 * Coupons
 */
let couponCodes = {};

/**
 * Init
 */
function initGame(responseConfig) {
  console.log('INITIALIZED GIFT BOX GAME');
  configRegulator(responseConfig);
  config();
}

function configRegulator(responseConfig) {
  // responseConfig = JSON.parse(responseConfig)
  // responseConfig.actiondata.ExtendedProps = JSON.parse(unescape(responseConfig.actiondata.ExtendedProps))

  const res = responseConfig.actiondata;
  const ext = res.ExtendedProps;
  setBoxId(res.game_elements.gift_boxes);

  boxSizeCalculator(componentsData.gameScreen.boxes.length);

  // General data
  generalData = {
    ...generalData,
    bgImg: ext.background_image,
    fontName: ext.font_family,
    bgColor: ARGBtoRGBA(ext.background_color),
    closeButtonColor: ARGBtoRGBA(ext.close_button_color),
  };

  // utils.loadSound();

  if (
    ext.font_family === 'custom' &&
    utils.getMobileOperatingSystem() === 'Android'
  ) {
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
      componentsData.mailSubsScreen.title.text = slashController(
        res.mail_subscription_form.title
      );
      componentsData.mailSubsScreen.title.textColor = ARGBtoRGBA(
        ext.mail_subscription_form.title_text_color
      );
      componentsData.mailSubsScreen.title.fontSize =
        fontSizeCalculator(ext.mail_subscription_form.title_text_size) + 'px';
    }

    if (res.mail_subscription_form.message) {
      componentsData.mailSubsScreen.message.use = true;
      componentsData.mailSubsScreen.message.text = slashController(
        res.mail_subscription_form.message
      );
      componentsData.mailSubsScreen.message.textColor = ARGBtoRGBA(
        ext.mail_subscription_form.text_color
      );
      componentsData.mailSubsScreen.message.fontSize =
        fontSizeCalculator(ext.mail_subscription_form.text_size) + 'px';
    }

    if (res.mail_subscription_form.emailpermit_text) {
      componentsData.mailSubsScreen.emailPermission.use = true;
      componentsData.mailSubsScreen.emailPermission.text = slashController(
        res.mail_subscription_form.emailpermit_text
      );
      componentsData.mailSubsScreen.emailPermission.fontSize =
        fontSizeCalculator(ext.mail_subscription_form.emailpermit_text_size) +
        'px';
      componentsData.mailSubsScreen.emailPermission.url =
        ext.mail_subscription_form.emailpermit_text_url;
    }

    if (res.mail_subscription_form.consent_text) {
      componentsData.mailSubsScreen.secondPermission.use = true;
      componentsData.mailSubsScreen.secondPermission.text = slashController(
        res.mail_subscription_form.consent_text
      );
      componentsData.mailSubsScreen.secondPermission.fontSize =
        fontSizeCalculator(ext.mail_subscription_form.consent_text_size) + 'px';
      componentsData.mailSubsScreen.secondPermission.url =
        ext.mail_subscription_form.consent_text_url;
    }
    // Mail Form Required
    componentsData.mailSubsScreen.button.text = slashController(
      res.mail_subscription_form.button_label
    );
    componentsData.mailSubsScreen.button.textColor = ARGBtoRGBA(
      ext.mail_subscription_form.button_text_color
    );
    componentsData.mailSubsScreen.button.buttonColor = ARGBtoRGBA(
      ext.mail_subscription_form.button_color
    );
    componentsData.mailSubsScreen.button.fontSize =
      fontSizeCalculator(ext.mail_subscription_form.button_text_size) + 'px';
    componentsData.mailSubsScreen.emailInput.placeHolder =
      res.mail_subscription_form.placeholder;
    componentsData.mailSubsScreen.alerts.check_consent_message =
      slashController(res.mail_subscription_form.check_consent_message);
    componentsData.mailSubsScreen.alerts.invalid_email_message =
      slashController(res.mail_subscription_form.invalid_email_message);
  }

  // Rules Screen Optionals
  if (
    res.gamification_rules &&
    Object.keys(res.gamification_rules).length > 0
  ) {
    activePageData.rulesScreen = true;

    componentsData.rulesScreen.bgImage =
      res.gamification_rules.background_image;
    componentsData.rulesScreen.button.text = slashController(
      res.gamification_rules.button_label
    );
    componentsData.rulesScreen.button.textColor = ARGBtoRGBA(
      ext.gamification_rules.button_text_color
    );
    componentsData.rulesScreen.button.buttonColor = ARGBtoRGBA(
      ext.gamification_rules.button_color
    );
    componentsData.rulesScreen.button.fontSize =
      fontSizeCalculator(ext.gamification_rules.button_text_size) + 'px';
  }

  // Game Screen

  componentsData.gameScreen.scoreboard.position =
    ext.game_elements.scoreboard_pageposition;
  if (componentsData.gameScreen.scoreboard.type === '')
    componentsData.gameScreen.scoreboard.type = 'roundedcorners';

  // Finish Screen
  if (res.game_result_elements.title) {
    componentsData.finishScreen.title.use = true;
    componentsData.finishScreen.title.text = slashController(
      res.game_result_elements.title
    );
    componentsData.finishScreen.title.fontSize =
      fontSizeCalculator(ext.game_result_elements.title_text_size) + 'px';
    componentsData.finishScreen.title.textColor = ARGBtoRGBA(
      ext.game_result_elements.title_text_color
    );
  }
  if (res.game_result_elements.message) {
    componentsData.finishScreen.message.use = true;
    componentsData.finishScreen.message.text = slashController(
      res.game_result_elements.message
    );
    componentsData.finishScreen.message.fontSize =
      fontSizeCalculator(ext.game_result_elements.text_size) + 'px';
    componentsData.finishScreen.message.textColor = ARGBtoRGBA(
      ext.game_result_elements.text_color
    );
  }
  if (res.game_result_elements.image) {
    componentsData.finishScreen.img.use = true;
    componentsData.finishScreen.img.src = res.game_result_elements.image;
  }

  componentsData.finishScreen.button.text = slashController(
    res.copybutton_label
  );
  componentsData.finishScreen.button.textColor = ARGBtoRGBA(
    ext.copybutton_text_color
  );
  componentsData.finishScreen.button.fontSize =
    fontSizeCalculator(ext.copybutton_text_size) + 'px';
  componentsData.finishScreen.button.buttonColor = ARGBtoRGBA(
    ext.copybutton_color
  );
  componentsData.finishScreen.button.androidLink = res.android_lnk;

  componentsData.finishScreen.lose.buttonLabel = slashController(
    res.game_result_elements.lose_button_label
  );
  componentsData.finishScreen.lose.loseAndroidLink =
    res.game_result_elements.lose_android_lnk;
  componentsData.finishScreen.lose.src = res.game_result_elements.lose_image;
  componentsData.finishScreen.lose.loseButtonTextColor = ARGBtoRGBA(
    ext.game_result_elements.losebutton_text_color
  );
  componentsData.finishScreen.lose.loseButtonColor = ARGBtoRGBA(
    ext.game_result_elements.losebutton_color
  );
  componentsData.finishScreen.lose.loseButtonTextSize =
    fontSizeCalculator(ext.game_result_elements.losebutton_text_size) + 'px';

  componentsData.finishScreen.couponCode.background = ARGBtoRGBA(
    ext.promocode_background_color
  );
  componentsData.finishScreen.couponCode.textColor = ARGBtoRGBA(
    ext.promocode_text_color
  );
  componentsData.finishScreen.couponCode.fontSize =
    fontSizeCalculator(ext.game_result_elements.text_size) + 'px';

  try {
    REPORT = res.report.click;
  } catch (error) {
    console.log('ERROR', res.report);
  }
}

function setBoxId(boxes) {
  let tmpArr = [];
  boxes.forEach((box, i) => {
    let id = i + 1;
    let tmpObj = box;
    tmpObj.id = id;
    tmpArr.push(tmpObj);
    couponCodes[id] = box.staticcode;
  });
  componentsData.gameScreen.boxes = tmpArr;
}

/**
 * Start page check
 */
function pageChecker() {
  createMainComponents();
  if (activePageData.mailSubsScreen) {
    createMailSubsScreen();
  } else if (!activePageData.mailSubsScreen && activePageData.rulesScreen) {
    createRulesScreen();
  } else {
    createGameScreen();
  }
}

/*
 * Main(container) component
 */
function createMainComponents() {
  MAIN_COMPONENT.id = generalData.id;
  MAIN_COMPONENT.style.width = '100%';
  MAIN_COMPONENT.style.height = '100%';
  MAIN_COMPONENT.style.top = '0';
  MAIN_COMPONENT.style.left = '0';
  MAIN_COMPONENT.style.zIndex = '9999';
  MAIN_COMPONENT.style.position = 'absolute';
  document.body.appendChild(MAIN_COMPONENT);
}

/**
 * Mail subscribe form screen
 */

function createMailSubsScreen() {
  const createEl = (type, attrs, styles) => {
    const el = document.createElement(type);
    Object.assign(el, attrs);
    Object.assign(el.style, styles);
    return el;
  };

  const { mailSubsScreen } = componentsData;
  const { emailInput, button } = mailSubsScreen;
  const { title, message, emailPermission, secondPermission } = mailSubsScreen;

  let screen = createEl(
    'DIV',
    { id: mailSubsScreen.id },
    {
      width: '100%',
      height: '100%',
      backgroundColor: generalData.bgColor,
      backgroundImage: `url('${generalData.bgImg}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'all 1s',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '998',
    }
  );

  let container = createEl(
    'DIV',
    { id: 'rmc-container' },
    {
      width: '80%',
      height: 'auto',
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      textAlign: 'center',
    }
  );

  [title, message].forEach((comp) => {
    if (comp.use) {
      container.appendChild(
        createEl(
          'DIV',
          { id: comp.id, innerText: comp.text },
          {
            color: comp.textColor,
            fontSize: comp.fontSize,
            display: 'inline-block',
            width: '100%',
            margin: '15px 0',
            fontFamily: generalData.fontName,
          }
        )
      );
    }
  });

  container.appendChild(
    createEl(
      'INPUT',
      { type: 'email', placeholder: emailInput.placeHolder, id: emailInput.id },
      {
        backgroundColor: 'white',
        width: '100%',
        padding: '9px',
        border: `1px solid ${generalData.fontColor}`,
        borderRadius: generalData.borderRadius,
        maxWidth: '-webkit-fill-available',
        fontSize: '19px',
        fontWeight: 'bold',
        margin: '15px 0',
        color: generalData.fontColor,
        marginBottom: '12px',
        display: 'inline-block',
        fontFamily: generalData.fontName,
      }
    )
  );

  container.appendChild(createEl('div', { id: 'emailAlert' }));

  [emailPermission, secondPermission].forEach((comp, i) => {
    if (comp.use) {
      container.appendChild(
        createPermitRow(
          comp.id,
          comp.text,
          comp.fontSize,
          generalData.fontName,
          comp.url
        )
      );
      container.appendChild(createEl('div', { id: `checkboxAlert${i + 1}` }));
    }
  });

  let submit = createEl(
    'button',
    { id: button.id, innerText: button.text },
    {
      backgroundColor: button.buttonColor,
      color: button.textColor,
      padding: '15px 30px',
      fontSize: button.fontSize,
      borderRadius: generalData.borderRadius,
      border: 0,
      position: 'absolute',
      bottom: '70px',
      left: '50%',
      width: 'fit-content',
      transform: 'translate(-50%, 0%)',
      cursor: 'pointer',
      fontWeight: 'bolder',
      fontFamily: generalData.fontName,
    }
  );

  activePageData.rulesScreen && createRulesScreen();

  submit.addEventListener('click', () => {
    if (emailChecker()) {
      removeAlert('emailAlert');
      if (emailPermitChecker() && secondPermitChecker()) {
        EMAIL = document.querySelector(`#${emailInput.id}`).value.toLowerCase();
        utils.subscribe(EMAIL);
        if (document.querySelector(`#${mailSubsScreen.id}`)) {
          document.querySelector(`#${mailSubsScreen.id}`).remove();
          if (!activePageData.rulesScreen) {
            createGameScreen();
          }
        }
      } else {
        if (!emailPermitChecker()) {
          alertChecker(
            mailSubsScreen.alerts.check_consent_message,
            'checkboxAlert1'
          );
        } else {
          removeAlert('checkboxAlert1');
        }
        if (!secondPermitChecker()) {
          alertChecker(
            mailSubsScreen.alerts.check_consent_message,
            'checkboxAlert2'
          );
        } else {
          removeAlert('checkboxAlert2');
        }
      }
    } else {
      alertChecker(mailSubsScreen.alerts.invalid_email_message, 'emailAlert');
    }
  });

  screen.appendChild(submit);
  screen.appendChild(container);
  MAIN_COMPONENT.appendChild(screen);
}

function createPermitRow(inputId, desc, fontSize, fontName, url) {
  let container = document.createElement('DIV');
  container.style.color = 'black';
  container.style.fontSize = '13px';
  container.style.margin = '15px 0';
  container.style.width = '100%';
  container.style.display = 'flex';
  container.style.alignItems = 'center';

  let input = document.createElement('input');
  input.id = inputId;
  input.type = 'checkbox';
  input.style.width = '20px';
  input.style.height = '20px';
  input.style.display = 'block';
  input.style.marginRight = '7px';
  input.style.float = 'left';

  let text = document.createElement('div');
  text.innerText = desc;
  text.style.fontSize = fontSize;
  text.style.fontFamily = fontName;
  text.style.textDecoration = 'underline';
  text.style.color = 'black';

  text.addEventListener('click', () => {
    utils.linkClicked(url);
    console.log(url, desc);
  });

  container.appendChild(input);
  container.appendChild(text);

  return container;
}

function createAlert(text, id) {
  if (!document.querySelector('#' + id).innerText) {
    let alert = document.createElement('div');
    alert.innerText = text;
    alert.style.width = '100%';
    alert.style.padding = '5px 10px';
    alert.style.zIndex = '999';
    alert.style.textAlign = 'left';
    alert.style.color = '#000';
    alert.style.fontSize = '14px';
    alert.style.fontFamily = generalData.fontName;
    alert.style.transform = 'translate3d(0,0,3px)';

    document.querySelector('#' + id).appendChild(alert);
  } else {
  }
}

function removeAlert(id) {
  if (document.querySelector('#' + id)) {
    document.querySelector('#' + id).innerText = '';
  }
}

function alertChecker(text, id) {
  switch (id) {
    case 'checkboxAlert1':
      if (emailPermitChecker()) {
        document.querySelector('#' + id).innerText = '';
      } else {
        createAlert(text, id);
      }
      break;
    case 'checkboxAlert2':
      if (secondPermitChecker()) {
        document.querySelector('#' + id).innerText = '';
      } else {
        createAlert(text, id);
      }
      break;
    case 'emailAlert':
      if (emailChecker()) {
        document.querySelector('#' + id).innerText = '';
      } else {
        createAlert(text, id);
      }
      break;
    default:
      break;
  }
}

function emailChecker() {
  if (
    document.querySelector('#' + componentsData.mailSubsScreen.emailInput.id)
  ) {
    let email = document
      .querySelector('#' + componentsData.mailSubsScreen.emailInput.id)
      .value.toLowerCase();
    let pattern = new RegExp('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}');
    let emailStatus = pattern.test(email);
    if (emailStatus === true) {
      console.log('email checker', true);
      return true;
    } else {
      console.log('email checker', false);
      return false;
    }
  } else {
    console.log('email checker', false);
    return false;
  }
}

function emailPermitChecker() {
  if (
    document.querySelector(
      '#' + componentsData.mailSubsScreen.emailPermission.id
    )
  ) {
    return !!document.querySelector(
      '#' + componentsData.mailSubsScreen.emailPermission.id
    ).checked;
  } else {
    return false;
  }
}

function secondPermitChecker() {
  if (
    document.querySelector(
      '#' + componentsData.mailSubsScreen.secondPermission.id
    )
  ) {
    return !!document.querySelector(
      '#' + componentsData.mailSubsScreen.secondPermission.id
    ).checked;
  } else {
    return false;
  }
}

/**
 * Close button
 */
function createCloseButton() {
  let closeButton = document.createElement('BUTTON');
  closeButton.id = generalData.closeButtonId;
  closeButton.innerHTML = '&#10006;';
  closeButton.style.position = 'absolute';
  closeButton.style.right = '0px';
  closeButton.style.top = '0px';
  closeButton.style.border = '0';
  closeButton.style.color = generalData.closeButtonColor;
  closeButton.style.padding = '5px 10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '29px';
  closeButton.style.borderRadius = generalData.borderRadius;
  closeButton.style.backgroundColor = 'rgba(0,0,0,0)';
  closeButton.style.zIndex = '999';
  closeButton.style.transform = 'translate3d(0,0,3px)';
  if (componentsData.gameScreen.scoreboard.position === 'topRight') {
    closeButton.style.left = '0px';
    closeButton.style.right = 'auto';
  }

  closeButton.addEventListener('click', function () {
    utils.close();
    document.querySelector('#' + generalData.id)
      ? document.querySelector('#' + generalData.id).remove()
      : null;
    document.querySelector('#' + componentsData.mailSubsScreen.id)
      ? document.querySelector('#' + componentsData.mailSubsScreen.id).remove()
      : null;
    document.querySelector('#' + componentsData.rulesScreen.id)
      ? document.querySelector('#' + componentsData.rulesScreen.id).remove()
      : null;
    document.querySelector('#' + generalData.closeButtonId)
      ? document.querySelector('#' + generalData.closeButtonId).remove()
      : null;
    document.documentElement.style.overflow = 'auto';
    utils.pauseSound();
    console.log('Game Closed');
  });

  MAIN_COMPONENT.appendChild(closeButton);
}

/**
 * Rules screen
 */
function createRulesScreen() {
  let rulesScreen = document.createElement('DIV');
  rulesScreen.id = componentsData.rulesScreen.id;
  rulesScreen.style.width = '100%';
  rulesScreen.style.height = '100%';
  rulesScreen.style.position = 'fixed';
  rulesScreen.style.transition = 'all 1s';
  rulesScreen.style.top = '0';
  rulesScreen.style.left = '0';
  rulesScreen.style.zIndex = '997';

  let rulesIMG = document.createElement('DIV');
  rulesIMG.style.width = '100%';
  rulesIMG.style.height = '100%';
  rulesIMG.style.backgroundImage =
    "url('" +
    (componentsData.rulesScreen.bgImage
      ? componentsData.rulesScreen.bgImage
      : generalData.bgImg) +
    "')";
  rulesIMG.style.backgroundRepeat = 'no-repeat';
  rulesIMG.style.backgroundSize = 'contain';
  rulesIMG.style.backgroundPosition = 'center';
  rulesIMG.style.position = 'fixed';
  rulesIMG.style.transition = 'all 1s';
  rulesIMG.style.top = '0';
  rulesIMG.style.left = '0';
  rulesIMG.style.zIndex = '2';
  rulesIMG.style.transform = ' translate3d(0,0,3px)';

  if (componentsData.rulesScreen.bgImage) {
    let rulesScreenBlurredBG = document.createElement('DIV');
    rulesScreenBlurredBG.style.width = '100%';
    rulesScreenBlurredBG.style.height = '100%';
    rulesScreenBlurredBG.style.backgroundImage =
      "url('" + componentsData.rulesScreen.bgImage + "')";
    rulesScreenBlurredBG.style.backgroundRepeat = 'no-repeat';
    rulesScreenBlurredBG.style.backgroundSize = 'center';
    rulesScreenBlurredBG.style.backgroundPosition = 'center';
    rulesScreenBlurredBG.style.position = 'fixed';
    rulesScreenBlurredBG.style.transition = 'all 1s';
    rulesScreenBlurredBG.style.top = '0';
    rulesScreenBlurredBG.style.left = '0';
    rulesScreenBlurredBG.style.zIndex = '1';
    rulesScreenBlurredBG.style.filter = 'blur(35px)';
    rulesScreen.appendChild(rulesScreenBlurredBG);
  }

  let submit = document.createElement('div');
  submit.id = componentsData.rulesScreen.button.id;
  submit.style.backgroundColor = componentsData.rulesScreen.button.buttonColor;
  submit.style.color = componentsData.rulesScreen.button.textColor;
  submit.style.padding = '15px 30px';
  submit.style.fontSize = componentsData.rulesScreen.button.fontSize;
  submit.style.borderRadius = generalData.borderRadius;
  submit.style.position = 'absolute';
  submit.style.bottom = '70px';
  submit.style.left = '50%';
  submit.style.width = 'fit-content';
  submit.style.transform = 'translate(-50%, 0%) translate3d(0,0,3px)';
  submit.style.cursor = 'pointer';
  submit.style.zIndex = '3';
  submit.style.fontWeight = 'bolder';
  submit.style.fontFamily = generalData.fontName;
  submit.innerText = componentsData.rulesScreen.button.text;

  rulesScreen.appendChild(rulesIMG);
  rulesScreen.appendChild(submit);
  MAIN_COMPONENT.appendChild(rulesScreen);

  submit.addEventListener('click', function () {
    document.querySelector('#' + componentsData.rulesScreen.id)
      ? document.querySelector('#' + componentsData.rulesScreen.id).remove()
      : null;
    createGameScreen();
  });
}

/**
 * Game area
 */
function createGameScreen() {
  let gameScreen = document.createElement('DIV');
  gameScreen.id = componentsData.gameScreen.id;
  gameScreen.style.width = '100%';
  gameScreen.style.height = '100%';
  gameScreen.style.backgroundColor = generalData.bgColor;
  gameScreen.style.backgroundImage = "url('" + generalData.bgImg + "')";
  gameScreen.style.backgroundRepeat = 'no-repeat';
  gameScreen.style.backgroundSize = 'cover';
  gameScreen.style.backgroundPosition = 'center';
  gameScreen.style.transition = 'all 1s';
  gameScreen.style.position = 'fixed';
  gameScreen.style.top = '0';
  gameScreen.style.left = '0';
  gameScreen.style.zIndex = '995';
  gameScreen.style.display = 'flex';
  gameScreen.style.alignItems = 'flex-end';

  let gameArea = document.createElement('DIV');
  gameArea.id = componentsData.gameScreen.gameArea;
  gameArea.style.width = '100%';
  gameArea.style.height = gameSettings.gameAreaHeight;
  gameArea.style.top = '50%';
  gameArea.style.left = '50%';
  gameArea.style.textAlign = 'center';
  // gameArea.style.display = "flex";
  // gameArea.style.justifyContent = "space-around";
  gameArea.style.marginBottom = '35px';
  // gameArea.style.backgroundColor = generalData.bgColor;

  gameScreen.appendChild(gameArea);

  MAIN_COMPONENT.appendChild(gameScreen);
  console.log('Gift Box Game Started');

  setTimeout(() => {
    startGame();
    utils.sendReport();
  }, 1);
}

function createBox(data) {
  if (!data || !data.id) return;

  let id = 'box' + data.id;
  const card = document.createElement('img');
  card.id = id;
  card.src = data.image;
  card.style.width = boxSettings.boxWidth + 'px';
  card.style.animation = 'tilt-n-move-shaking 0.50s infinite';
  card.style.transition = '.5s all';
  card.style.position = 'fixed';
  card.style.bottom = '5px';
  card.style.left = CURRENT_TOTAL_LEFT + 'px';
  CURRENT_TOTAL_LEFT += boxSettings.boxWidth;

  card.addEventListener('click', () => {
    if (CLICKABLE) {
      open(id, data);
    }
  });

  return card;
}

function createCSS() {
  let style = document.createElement('style');
  style.id = 'rmc-style';
  style.innerHTML = `
    @keyframes tilt-n-move-shaking {
      0%, 50%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(5px, 5px) rotate(5deg); }
      75% { transform: translate(-5px, 5px) rotate(-5deg); }
    }`;
  document.head.appendChild(style);
}

function clickableController() {
  CLICKABLE = false;
}

function open(boxId, data) {
  console.log('CLICKED ' + boxId + ':', data);
  SCORE = data.id;
  let box = document.querySelector('#' + boxId);

  box.style.animation = '';
  const halfWidth = box.getClientRects()[0].width / 2;
  const c = window.innerWidth / 2;
  setTimeout(() => {
    box.style.bottom = '200px';
    box.style.left = c - halfWidth + 'px';
    box.style.transform = 'scale(1.5)';
    setTimeout(() => {
      finish();
    }, 800);
  }, 100);
  clickableController();
}

function close(cardId) {
  let card = document.querySelectorAll('#' + cardId + '>div');
  let front = card[0];
  let back = card[1];
  front.style.transform = 'rotate3d(0, 1, 0, 180deg)';
  back.style.transform = 'rotate3d(0, 1, 0, 0deg)';
}

function startGame() {
  componentsData.gameScreen.boxes.forEach((box, i) => {
    if (
      document.querySelector('#' + componentsData.gameScreen.id) &&
      document.querySelector('#' + componentsData.gameScreen.gameArea)
    ) {
      let tmpBox = createBox(box);
      tmpBox &&
        document
          .querySelector('#' + componentsData.gameScreen.gameArea)
          .appendChild(tmpBox);
    }
  });
}

/**
 * Score board
 */

function createFinishScreen(lose) {
  let finishScreen = document.createElement('DIV');
  finishScreen.id = componentsData.finishScreen.id;
  finishScreen.style.width = '100%';
  finishScreen.style.height = '100%';
  finishScreen.style.backgroundColor = generalData.bgColor;
  finishScreen.style.backgroundImage = "url('" + generalData.bgImg + "')";
  finishScreen.style.backgroundRepeat = 'no-repeat';
  finishScreen.style.backgroundSize = 'cover';
  finishScreen.style.backgroundPosition = 'center';
  finishScreen.style.transition = 'all 1s';
  finishScreen.style.position = 'fixed';
  finishScreen.style.top = '0';
  finishScreen.style.left = '0';
  finishScreen.style.zIndex = '994';

  let container = document.createElement('DIV');
  container.id = 'rmc-finish-container';
  container.style.width = '100%';
  container.style.height = 'auto';
  container.style.position = 'absolute';
  container.style.transform = 'translate(-50%, -60%)';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.textAlign = 'center';

  if (componentsData.finishScreen.img.use) {
    let img = document.createElement('img');
    img.id = 'rmc-finish-img';
    img.src = componentsData.finishScreen.img.src;
    img.style.display = 'inline-block';
    img.style.margin = '15px 0';
    img.style.width = '80%';
    container.appendChild(img);
  }
  if (componentsData.finishScreen.title.use) {
    let title = document.createElement('DIV');
    title.id = 'rmc-finish-title';
    title.style.color = componentsData.finishScreen.title.textColor;
    title.style.fontSize = componentsData.finishScreen.title.fontSize;
    title.style.display = 'inline-block';
    title.style.margin = '15px 0';
    title.style.width = 'inherit';
    title.style.fontFamily = generalData.fontName;
    title.innerText = componentsData.finishScreen.title.text;
    container.appendChild(title);
  }
  if (componentsData.finishScreen.message.use) {
    let message = document.createElement('DIV');
    message.id = 'rmc-finish-message';
    message.style.color = componentsData.finishScreen.message.textColor;
    message.style.fontSize = componentsData.finishScreen.message.fontSize;
    message.style.display = 'inline-block';
    message.style.margin = '15px 0';
    message.style.width = 'inherit';
    message.style.fontFamily = generalData.fontName;
    message.innerText = utils.winCheck()
      ? componentsData.finishScreen.message.text
      : componentsData.finishScreen.message.loseText;
    container.appendChild(message);
  }
  let _score = document.createElement('DIV');
  _score.id = 'rmc-finish-finish';
  _score.innerHTML = couponCodes[SCORE];
  _score.style.transition = '1s all';
  _score.style.padding =
    componentsData.gameScreen.scoreboard.type === 'circle'
      ? utils.winCheck()
        ? '40px 30px'
        : '70px 20px'
      : '15px 10px';
  _score.style.width = 'fit-content';
  _score.style.margin = '0 auto';
  _score.style.color = componentsData.finishScreen.couponCode.fontColor;
  _score.style.fontFamily = generalData.fontName;
  _score.style.fontSize = componentsData.gameScreen.scoreboard.fontSize;
  _score.style.background = componentsData.finishScreen.couponCode.background;
  componentsData.gameScreen.scoreboard.type !== 'square' &&
    (_score.style.borderRadius =
      componentsData.gameScreen.scoreboard.type === 'circle' ? '50%' : '15px');
  container.appendChild(_score);

  _score.addEventListener('click', function () {
    utils.copyToClipboard(lose);
    utils.pauseSound();
  });

  let copyButton = document.createElement('div');
  copyButton.id = componentsData.finishScreen.button.id;
  copyButton.style.backgroundColor =
    componentsData.finishScreen.button.buttonColor;
  copyButton.style.color = componentsData.finishScreen.button.textColor;
  copyButton.style.padding = '15px 30px';
  copyButton.style.fontSize = componentsData.finishScreen.button.fontSize;
  copyButton.style.borderRadius = generalData.borderRadius;
  copyButton.style.position = 'absolute';
  copyButton.style.bottom = '70px';
  copyButton.style.left = '50%';
  copyButton.style.transform = 'translate(-50%, 0%) translate3d(0,0,3px)';
  copyButton.style.width = 'fit-content';
  copyButton.style.margin = '10px auto';
  copyButton.style.cursor = 'pointer';
  copyButton.style.zIndex = '3';
  copyButton.style.fontWeight = 'bolder';
  copyButton.style.fontFamily = generalData.fontName;
  copyButton.innerText = componentsData.finishScreen.button.text;

  finishScreen.appendChild(copyButton);

  utils.saveCodeGotten();

  copyButton.addEventListener('click', function () {
    utils.copyToClipboard();
    utils.pauseSound();
  });

  copyButton.addEventListener('click', function () {
    if (
      utils.getMobileOperatingSystem() === 'iOS' &&
      componentsData.finishScreen.button.iOSLink
    ) {
      redirection(componentsData.finishScreen.button.iOSLink);
    }
  });
  finishScreen.appendChild(container);
  MAIN_COMPONENT.appendChild(finishScreen);
}

function finish() {
  createFinishScreen();
  document.querySelector('#' + componentsData.gameScreen.id).remove();
}

function addFonts() {
  if (generalData.fontFiles === undefined) {
    return;
  }
  let addedFontFiles = [];
  for (let fontFileIndex in generalData.fontFiles) {
    let fontFile = generalData.fontFiles[fontFileIndex];
    if (addedFontFiles.includes(fontFile)) {
      continue;
    }
    let fontFamily = fontFile.split('.')[0];
    let newStyle = document.createElement('style');
    let cssContent =
      '@font-face{font-family:' + fontFamily + ";src:url('" + fontFile + "');}";
    newStyle.appendChild(document.createTextNode(cssContent));
    document.head.appendChild(newStyle);
    addedFontFiles.push(fontFile);
  }
}

function ARGBtoRGBA(argb) {
  if (!argb || argb.length < 8) return argb;

  if (argb.substr(0, 1) !== '#') return argb.replace(/(..)(......)/, '$2$1');

  return argb.replace(/#(..)(......)/, '#$2$1');
}

function fontSizeCalculator(BEFS) {
  const fontSizeMapping = {
    10: 28,
    9: 26,
    8: 24,
    7: 22,
    6: 20,
    5: 18,
    4: 16,
    3: 14,
    2: 12,
    1: 10,
  };
  BEFS = parseInt(BEFS, 10);
  return fontSizeMapping[BEFS] || 18;
}

function slashController(text) {
  if (!text) return text;

  let pos = text.indexOf('\\n');
  while (pos > -1) {
    text = text.replace('\\n', '\n');
    pos = text.indexOf('\\n');
  }
  return text;
}

function boxSizeCalculator(boxCount) {
  let size = window.innerWidth / boxCount;
  boxSettings.boxWidth = size;
  boxSettings.boxHeight = size;
}

function redirection(url) {
  document.location.href = url;
}

function getAndroidLink(lose) {
  return lose
    ? componentsData.finishScreen.lose.loseAndroidLink || ''
    : componentsData.finishScreen.button.androidLink || '';
}

function getIOSLink(lose) {
  return lose
    ? componentsData.finishScreen.lose.loseIOSLink || ''
    : componentsData.finishScreen.button.iOSLink || '';
}

let utils = {
  getMobileOperatingSystem: () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone/i.test(userAgent)) return 'Windows Phone';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iPad|iPhone|iPod|Mac/.test(userAgent) && !window.MSStream)
      return 'iOS';
    return 'unknown';
  },
  getBrowser: () => {
    try {
      // Opera 8.0+
      const isOpera =
        (!!window.opr && !!window.opr.addons) ||
        !!window.opera ||
        navigator.userAgent.indexOf(' OPR/') >= 0;
      if (isOpera) return 'Opera';

      // Firefox 1.0+
      let isFirefox = typeof InstallTrigger !== 'undefined';
      if (isFirefox) return 'Firefox';

      // Safari 3.0+ "[object HTMLElementConstructor]"
      let isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
          return p.toString() === '[object SafariRemoteNotification]';
        })(
          !window.safari ||
            (typeof safari !== 'undefined' && window.safari.pushNotification)
        );
      if (!isSafari)
        isSafari = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(
          navigator.userAgent
        );

      if (isSafari) return 'Safari';

      // Internet Explorer 6-11
      let isIE = /*@cc_on!@*/ !!document.documentMode;
      if (isIE) return 'IE';

      // Edge 20+
      let isEdge = !isIE && !!window.StyleMedia;
      if (isEdge) return 'Edge';

      // Chrome 1 - 79
      let isChrome =
        !!window.chrome &&
        (!!window.chrome.webstore || !!window.chrome.runtime);
      if (isChrome) return 'Chrome';

      // Edge (based on chromium) detection
      let isEdgeChromium =
        isChrome && navigator.userAgent.indexOf('Edg') !== -1;
      if (isEdgeChromium) return 'EdgeChromium';

      // Blink engine detection
      // var isBlink = (isChrome || isOpera) && !!window.CSS;

      return 'unknown';
    } catch (error) {
      console.log('getBrowser error', error);
      return 'unknown';
    }
  },
  winCheck: () => SCORE > 0,
  copyToClipboard: (lose) => {
    const args = {
      method: 'copyToClipboard',
      couponCode: lose ? '' : couponCodes[SCORE],
      url: lose ? getAndroidLink(lose) : getIOSLink(lose),
    };
    if (window.Android)
      window.Android.copyToClipboard(args.couponCode, args.url);
    else if (window.webkit.messageHandlers.eventHandler)
      window.webkit.messageHandlers.eventHandler.postMessage(args);
  },
  sendReport: () => {
    const method = 'sendReport';
    if (window.Android) window.Android.sendReport();
    else if (window.webkit && window.webkit.messageHandlers)
      window.webkit.messageHandlers.eventHandler.postMessage({ method });
  },
  close: () => {
    const method = 'close';
    if (window.Android) window.Android.close();
    else if (window.webkit && window.webkit.messageHandlers)
      window.webkit.messageHandlers.eventHandler.postMessage({ method });
  },
  subscribe: (email) => {
    if (!email) return;
    const args = { method: 'subscribeEmail', email: email.trim() };
    if (window.Android) window.Android.subscribeEmail(args.email);
    else if (window.webkit && window.webkit.messageHandlers)
      window.webkit.messageHandlers.eventHandler.postMessage(args);
  },
  saveCodeGotten: () => {
    const args = {
      method: 'saveCodeGotten',
      code: couponCodes[SCORE],
      email: EMAIL,
      report: REPORT,
    };
    if (window.Android)
      window.Android.saveCodeGotten(args.code, args.email, args.report);
    else if (window.webkit && window.webkit.messageHandlers)
      window.webkit.messageHandlers.eventHandler.postMessage(args);
  },
  linkClicked: (url) => {
    const args = { method: 'linkClicked', url: url || '' };
    if (window.Android) document.location.href = args.url;
    else if (window.webkit && window.webkit.messageHandlers)
      window.webkit.messageHandlers.eventHandler.postMessage(args);
  },
  loadSound: () => {
    AUDIO = document.createElement('audio');
    AUDIO.src = generalData.sound;
    AUDIO.currentTime = 0;
    AUDIO.setAttribute('playsinline', true);
    AUDIO.setAttribute('preload', 'auto');
    AUDIO.setAttribute('loop', true);
    AUDIO.setAttribute('autoplay', true);
    document.querySelector('head').appendChild(AUDIO);
    try {
      if (utils.getBrowser() === 'Safari') {
        let html = document.querySelector('html');
        html.addEventListener('touchstart', () => {
          AUDIO.play();
          html.removeEventListener('touchstart', () => {});
        });
        html.addEventListener('click', () => {
          AUDIO.play();
          html.removeEventListener('click', () => {});
        });
      } else {
        AUDIO.play();
      }
    } catch (error) {
      console.log('loadSound error', error);
    }
  },
  pauseSound: () => {
    try {
      const audio = document.querySelector('audio');
      if (audio) {
        !audio.paused && audio.pause();
        audio.remove();
      } else console.log('not closed sound');
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
  pageChecker();
  createCloseButton();
  createCSS();
}