import { sha1 } from "https://denopkg.com/chiefbiiko/sha1/mod.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";

const manualIndex = JSON.parse(await Deno.readTextFile('./refactoring/gml_docs_index.json'));

const constants = new Set((await Deno.readTextFile('./refactoring/builtin_constants.txt')).split(/\r?\n/).map(v => {
    return v.replace(/\s+-+\s+/, '');
}).filter(v => v));

const entries = [];
for(const [name, path] of manualIndex) {
    if(!name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        continue;
    }
    if(path.includes('GML_Reference')) {
        let p = path.replace(/^.*GML_Reference\//, '').replace(/\/[^/]*?\.htm$/, '');

        // Download docs page
        const sha1sum = sha1(path, undefined, 'hex');
        let html = '';
        try {
            html = await Deno.readTextFile(`./refactoring/gml_docs_cache/${sha1sum}`);
            if(html.includes('<title>Just a moment...</title>')) throw new Error('bad cache');
        } catch(e) {
            html = await (await fetch(path)).text();
            Deno.writeTextFile(`./refactoring/gml_docs_cache/${sha1sum}`, html);
        }

        let type = 'unknown';
        let syntax = undefined;

        if(constants.has(name)) {
            syntax = name;
            type = 'constant';
        } else{
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const syntaxNodes = doc.querySelectorAll("p.code")!;
            for(const n of syntaxNodes) {
                const t = n.innerText;
                if(t.startsWith(name)) {
                    syntax = t.replaceAll('\n', ' ');
                    break;
                }
            }
            if(syntax?.includes(name + '(')) {
                type = 'function';
            } else if(syntax?.startsWith(name + '[') || syntax?.startsWith(name + ';') || syntax == name) {
                type = 'variable';
            }
        }

        // {
        //     // Find any constants (commented out cuz we already did this)
        //     for(const elem of doc.querySelectorAll('table>tbody>tr>th')) {
        //         if(elem.innerText === 'Constant') {
        //             const constantsElems = elem.parentElement!.parentElement!.querySelectorAll('tr>td:first-child');
        //             for(const ce of constantsElems!) {
        //                 constants.push(ce.innerText);
        //             }
        //         }
        //     }
        // }

        entries.push(`${p.replaceAll('/', '.')}.${name}\t${name}\t${type}\t${syntax}\t${path}`);
    }
}

entries.sort();
console.log(entries.join('\n'));
