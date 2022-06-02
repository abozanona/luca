const lucaRandomNames = [
    'Xandyr the elf',
    'Raelle the elf',
    'Pollo the elf',
    'Wex the elf',
    'Solina the elf',
    'Balon the dragon',
    'Kolloth the dragon',
    'Tren the dragon',
    'Axan the dragon',
    'Naga the dragon',
    'Shalana the champ',
    'Leandra the champ',
    'Finhad the champ',
    'Giliel the champ',
    'Amrond the champ',
    'Dracul the villan',
    'Kedron the villan',
    'Edana the villan',
    'Brenna the villan',
    'Gorgon the villan',
    'Kahraman the superhero',
    'Lucinda the superhero',
    'Manning the superhero',
    'Gunnar the superhero',
    'Botilda the superhero',
    'Aanya the sidekick',
    'Creda the sidekick',
    'Ervin the sidekick',
    'Leya the sidekick',
    'Etel the sidekick',
    'Konrad the mentor',
    'Orela the mentor',
    'Eldred the mentor',
    'Zilya the mentor',
    'Kendry the mentor',
];

export let customLog = function (item: any): any {
    try {
        console.log(JSON.parse(JSON.stringify(item)));
    } catch (e) {
        console.log('');
    }
};

export let randomNames = (): string => {
    return lucaRandomNames[Math.floor(Math.random() * lucaRandomNames.length)];
};
export let isEmptyObject = (obj: any) => {
    return JSON.stringify(obj) === '{}';
};
export let uuid = () => {
    return ('' + 1e8).replace(/[018]/g, (c) =>
        (parseInt(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c) / 4)))).toString(16)
    );
};
