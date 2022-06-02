import UtilsEngine from "../../js/luca/utils-engine";

export class AppearanceSystem {
    username?: string = UtilsEngine.randomNames();
    userAvatar?: string = '0.svg';
    userId?: string = UtilsEngine.uuid();
    darkTheme?: boolean = false;
}
