# Where I left off

Created some AI prompts in OneNote to refactor GML constructs into C#

Generated index of every GML built-in variable, function, and constant.

Tweaked some sprites' collision settings where `<separate>` was not necessary, so
future me doesn't worry about supporting it.

---

## Areas of the codebase:

Breaking the codebase into discrete sections, some of which could be completely disabled in the early stages of a port,
to make it easier.

TODO repurpose find_all_function_calls logic to augment `native_functions_used_by_gg2.tsv` with this info.

GGON
Builder
Network
HTTP
Updater
Holiday
Gear
[other]