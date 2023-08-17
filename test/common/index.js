const variable = require('./variable.js')

const {I} = inject()
const Common = {
  fillValue: ({selector, value, keyboardKey, iframe}) => {
    if (!!iframe) {
      I.switchTo(iframe);
    }
    I.wait(0.2);

    I.scrollTo(selector);
    I.waitForElement(selector, variable.time.waitForText)
    if (value) {
      I.fillField(selector, value);
    } else {
      I.clearField(selector);
      I.pressKey('Space');
      I.pressKey('Backspace');
    }
    I.wait(0.2);

    if (keyboardKey) {
      I.pressKey(keyboardKey);
    }
    if (!!iframe) {
      I.switchTo()
    }
    return value;
  },

  clickValue: ({selector, iframe, nextTab = false}) => {
    if (!!iframe) {
      I.switchTo(iframe);
    }
    I.scrollTo(selector);
    I.waitForElement(selector, variable.time.waitForText)
    I.forceClick(selector);

    if (!!iframe) {
      I.switchTo()
    }
    if (!!nextTab) {
      I.switchToNextTab();
    }
  },

  waitForText: ({text, selector, iframe}) => {
    if (iframe) {
      I.switchTo(iframe);
    }
    if (selector) {
      I.scrollTo(selector, variable.time.waitForText);
    }
    if (text) {
      I.waitForText(text, variable.time.waitForText, selector);
    }
    if (iframe) {
      I.switchTo();
    }
  },

  selectItems: ({selector, value}) => {
    Common.fillValue({selector, value});
    I.wait(0.05);
    Common.waitForText({text: value, selector: '.ant-select-item-option:nth-of-type(1)'})
    I.click('.ant-select-item-option:nth-of-type(1)');
  },

  checkboxItem: ({selector}) => {
    I.waitForElement(selector, variable.time.waitForText)
    I.checkOption(selector)
    I.seeCheckboxIsChecked(selector)
  },

  waitNumberOfVisibleElements: ({selector, length}) => I.waitNumberOfVisibleElements(selector, length),
  amOnPage: ({url}) => I.amOnPage(url)

}

module.exports = Common;
