const home = require('../assets/imgs/home.svg');
const friends = require('../assets/imgs/friends.svg');
const settings = require('../assets/imgs/settings.svg');
const options = require('../assets/imgs/options.svg');
const data = [
    {
        id: 1,
        to: '/dashboard',
        icon: home,
        name: 'home',
    },
    {
        id: 2,
        to: '/friends',
        icon: friends,
        name: 'friends',
    },
    {
        id: 3,
        to: '/settings',
        icon: settings,
        name: 'settings',
    },
    {
        id: 4,
        to: '/',
        icon: options,
        name: 'options',
    },
];
export default data;
