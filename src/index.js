// import { getGreetings } from './app';

// document.body.append(VM.m(getGreetings()));

import App from './app';
import AppV2 from './appV2';
import { toggleConsole } from './log';

toggleConsole(true);

const host = unsafeWindow.location.hostname;
if (host === 'www.qidian.com') {
    AppV2.init();
} else {
    App.init();
}
