import { Window } from '@tauri-apps/api/window';

const appWindow = new Window('main');

function minimize() {
    return appWindow.minimize();
}
function toggleMaximize() {
    return appWindow.toggleMaximize();
}

function close() {
    return appWindow.close();
}

export const mainWindow = {
    minimize,
    toggleMaximize,
    close,
};

export default mainWindow;