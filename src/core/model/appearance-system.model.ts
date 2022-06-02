import { randomNames, uuid } from '../utils/utils';

export class AppearanceSystem {
    username?: string = randomNames();
    userAvatar?: string = '0.svg';
    userId?: string = uuid();
    darkTheme?: boolean = false;
}
