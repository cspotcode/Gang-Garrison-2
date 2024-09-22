// Generate filtered list of the *builtin* and DLL functions called by GG2's codebase,
// excluding ones from GG2's `Scripts/*.gml`

// Step 1: Read the contents of both files
const gg2Functions = await Deno.readTextFile('all_function_calls_in_gg2_codebase.txt');
const gmlFunctions = await Deno.readTextFile('gml_scripts.txt');

// Step 2: Split the contents into lines
const gg2FunctionsList = gg2Functions.split('\n').map(line => line.trim()).filter(line => line.length > 0);
const gmlFunctionsList = gmlFunctions.split('\n').map(line => line.trim()).filter(line => line.length > 0);

// Step 3: Convert lists to sets for easier comparison
const gg2FunctionsSet = new Set(gg2FunctionsList);
const gmlFunctionsSet = new Set(gmlFunctionsList);

// Step 4: Find functions in gg2FunctionsSet that are not in gmlFunctionsSet
const uniqueFunctions = [...gg2FunctionsSet].filter(func => !gmlFunctionsSet.has(func));

// Step 5: Output the list of unique functions
uniqueFunctions.forEach(func => console.log(func));