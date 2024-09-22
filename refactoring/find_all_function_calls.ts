// Find all function calls in GG2's codebase.
// So we know how much API surface to implement.

import * as Path from 'https://deno.land/std/path/mod.ts';
import { expandGlob } from 'https://deno.land/std/fs/mod.ts';

const re = /\b(?!if)(?!for)(?!with)(?!until)(?!while)(?!switch)(?!repeat)([a-zA-Z_][a-zA-Z0-9_]*)\(/g;

const filesGlob = 'Source/gg2/{Scripts,Objects}/**/*.{gml,xml}';

const functionsCalled = new Set();

const files = expandGlob(filesGlob);
for await (const entry of files) {
    const fileExtension = Path.extname(entry.name);

    if (fileExtension === '.xml' || fileExtension === '.gml') {
        try {
            const data = await Deno.readTextFile(entry.path);
            const relativePath = Path.relative('Source/gg2', entry.path);

            let match;
            while ((match = re.exec(data)) !== null) {
                functionsCalled.add(match[1]);
            }
        } catch (err) {
            console.error('Error reading file:', err);
        }
    }
}

const functionsCalledNames = [...functionsCalled];
functionsCalledNames.sort();
console.log('Functions called:i\n', functionsCalledNames.join('\n'));