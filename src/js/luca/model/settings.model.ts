import UtilsEngine from "../utils-engine";

export class Settings {
    username?: string = UtilsEngine.randomNames();
    userAvatar?: string = '0.svg';
    userId?: string = UtilsEngine.uuid();
    darkTheme?: boolean = false;
    playSounds?: boolean = true;
    showActionsInChat?: boolean = true;
}
