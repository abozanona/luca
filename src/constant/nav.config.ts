import UtilsEngine from "../js/luca/utils-engine";

const home = require('../assets/imgs/home.svg');
const friends = require('../assets/imgs/friends.svg');
const settings = require('../assets/imgs/settings.svg');
const options = require('../assets/imgs/options.svg');
const data = [
    {
        id: 1,
        to: '/dashboard',
        icon: home,
        name: UtilsEngine.translate('NAV_HOME'),
    },
    {
        id: 2,
        to: '/friends',
        icon: friends,
        name: UtilsEngine.translate('NAV_FRIENDS'),
    },
    {
        id: 3,
        to: '/settings',
        icon: settings,
        name: UtilsEngine.translate('NAV_SETTINGS'),
    },
];
export default data;
