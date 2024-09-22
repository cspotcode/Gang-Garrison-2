// const input = await Deno.readTextFile('./refactoring/old_builtin_constants.txt');
// const seen = new Set();
// for(const line of input.split(/\r?\n/)) {
//     if(!seen.has(line)) seen.add(line);
// }
// await Deno.writeTextFile('./refactoring/builtin_constants.txt', [...seen].join('\n'));