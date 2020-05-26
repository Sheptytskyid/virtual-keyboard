import '@styles/styles';
import ukrKeyboard from '@languages/ukrKeyboard';
import enKeyboard from '@languages/enKeyboard';
import Keyboard from '@models/Keyboard';

const languages = new Map();
languages.set('en', enKeyboard);
languages.set('ukr', ukrKeyboard);

const keyboard = new Keyboard(languages, document.body);
keyboard.renderHtml();
document.keyb = keyboard;
