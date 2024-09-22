// import Exifr from 'npm:exifr';
import { expandGlob } from 'https://deno.land/std/fs/mod.ts';
import Exifreader from 'npm:exifreader';

import * as GGON from './ggon-parser.ts';
import * as Walkmask from './walkmask-parser.ts';

for await(const map of expandGlob('Source/gg2/Included Files/**.png')) {
    const result = await Exifreader.load(map.path);
    const levelData = result['Gang Garrison 2 Level Data'].value;

    console.log(map.path);
    // console.log(levelData);
    // console.log(levelData);
    const entitiesGgon = levelData.match(/\{ENTITIES\}([\s\S]*?)\{END ENTITIES\}/)![1];
    const walkmaskData = levelData.match(/\{WALKMASK\}([\s\S]*?)\{END WALKMASK\}/)![1];

    console.dir(GGON.parse(entitiesGgon));

    const walkmask = Walkmask.parse(walkmaskData);
    Walkmask.logVisualize(walkmask);
}
