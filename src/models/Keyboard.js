import Key from './Key';

export default class Keyboard {
  constructor(languages, parentElement) {
    this.languageIds = [...languages.keys()];
    [this.activeLanguage] = this.languageIds;
    this.alt = false;
    this.shift = false;
    this.caps = false;
    this.ctrl = false;
    this.languages = languages;
    this.parentElement = parentElement;

    if (localStorage.getItem('language')) {
      this.activeLanguage = localStorage.getItem('language');
    } else {
      localStorage.setItem('language', this.activeLanguage);
    }

    this.setUpListeners();
  }

  setUpListeners() {
    this.setUpMouseListeners();
    this.setUpKeyboardListeners();
  }

  setUpMouseListeners() {
    document.addEventListener('mousedown', (e) => {
      const key = this.keys.find((item) => item.element === e.target);
      if (key) {
        key.makeActive();
        this.pressKey(key);
      }
    });
    document.addEventListener('mouseup', (e) => {
      const key = this.keys.find((item) => item.element === e.target);
      if (key) {
        key.makeInactive();
        if (key.lowerCase === 'Shift') {
          this.shift = false;
        }
      }
    });
  }

  setUpKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      const key = this.keys.find((item) => item.code === e.code);
      if (key) {
        key.makeActive();
        if ((!this.ctrl && !this.alt) || (key.lowerCase === 'Ctrl' || key.lowerCase === 'Alt')) {
          this.pressKey(key);
        }
      }
    });
    document.addEventListener('keyup', (e) => {
      const key = this.keys.find((item) => item.code === e.code);
      if (key) {
        key.makeInactive();
        if (key.lowerCase === 'Shift') {
          this.shift = false;
          this.toggleCapsLock();
        }
        if (key.lowerCase === 'Ctrl') {
          this.ctrl = false;
        }
        if (key.lowerCase === 'Alt') {
          this.alt = false;
        }
      }
    });
  }

  toggleCapsLock() {
    this.caps = !this.caps;
    this.keys.forEach((item) => item.setCapsLock(this.caps));
  }

  changeLanguage() {
    this.activeLanguage = this.languageIds[this.nextLanguageIndex];
    localStorage.setItem('language', this.activeLanguage);
    this.renderKeyboard();
  }

  get nextLanguageIndex() {
    let index = this.languageIds.indexOf(this.activeLanguage) + 1;
    if (index >= this.languageIds.length) {
      index = 0;
    }
    return index;
  }

  pressKey(key) {
    switch (key.code) {
      case 'Backspace':
        this.textArea.value = this.textArea.value.slice(0, -1);
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        if (this.shift) {
          break;
        } else {
          this.shift = true;
          this.toggleCapsLock();
          break;
        }
      case 'CapsLock':
        this.toggleCapsLock();
        break;
      case 'AltLeft':
      case 'AltRight':
        if (this.ctrl) {
          this.changeLanguage();
        } else {
          this.alt = true;
        }
        break;
      case 'ControlLeft':
      case 'ControlRight':
        if (this.alt) {
          this.changeLanguage();
        } else {
          this.ctrl = true;
        }
        break;
      case 'MetaLeft':
      case 'MetaRight':
        break;
      default:
        this.textArea.value += key.char(this.caps);
        break;
    }
  }

  renderHtml() {
    this.renderTextArea();
    this.renderKeyboard();
  }

  renderTextArea() {
    this.textArea = document.createElement('textarea');
    this.textArea.placeholder = 'Press Ctrl + Alt to change the input language.';
    this.textArea.className = 'textBox';
    this.textArea.disabled = 'disabled';
    this.parentElement.append(this.textArea);
  }

  renderKeyboard() {
    this.keyboardElement = document.createElement('div');
    this.keyboardElement.className = 'keyboard';
    this.keyboardElement.id = 'keyboard';
    this.keys = [];
    this.languages.get(this.activeLanguage)
      .forEach((row, rowIndex) => {
        row.forEach((item) => {
          const key = new Key(item);
          key.element.classList.add(`key_row_${rowIndex + 1}`);
          this.keyboardElement.append(key.element);
          this.keys.push(key);
        });
      });
    const prevKeyboard = document.getElementById('keyboard');
    if (prevKeyboard) {
      this.parentElement.removeChild(prevKeyboard);
    }
    this.parentElement.append(this.keyboardElement);
  }
}
