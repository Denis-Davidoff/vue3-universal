
import { Capacitor } from '@capacitor/core';

const isRunningOnCapacitor = Capacitor.isNativePlatform();

declare global {
    interface Window {
        electron: any;
        Telegram: any;
    }
}


export const getPlatform = () => {
    let platform = "web";

    if (isRunningOnCapacitor) {
        platform = "capacitor";
    } else if (window?.electron) {
        platform = "electron";
    } else if (window?.Telegram?.WebApp) {
        platform = "telegram";
    } else {
        platform = import.meta.env?.MODE;
    }

    return platform;
}