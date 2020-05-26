export default class Key {
  constructor({
    lowerCase, upperCase, size = 1, code, value,
  }) {
    this.lowerCase = lowerCase;
    this.upperCase = upperCase;
    this.size = size;
    this.code = code;
    this.value = value;
    this.renderHtml();
  }

  renderHtml() {
    this.element = document.createElement('div');
    this.element.classList.add('key');
    this.element.classList.add(`key_size_${this.size}`);
    this.element.innerText = this.label(false);
  }

  char(capsOn) {
    return this.value ? this.value : this.label(capsOn);
  }

  label(capsOn) {
    return capsOn ? this.upperCase : this.lowerCase;
  }

  makeActive() {
    this.element.classList.add('key_active');
  }

  makeInactive() {
    this.element.classList.remove('key_active');
  }

  setCapsLock(capsOn) {
    this.element.innerText = this.label(capsOn);
  }
}
