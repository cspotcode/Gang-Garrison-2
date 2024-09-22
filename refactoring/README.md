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

## Collisions

Big differences between GM collisions and other engines. 

GM supports very imperative collision code: you can ask it try/false questions about collision at any position on the screen. You can, in a loop, move an object a pixel, check for collisions, move it again.

Other engines, on the other hand, encourage allowing a physics solver to detect and resolve all collisions at once.

However, Godot does support immediate collision queries at points in space.

https://docs.godotengine.org/en/stable/classes/class_shapecast2d.html#class-shapecast2d

`ShapeCast2D` with `force_shapecast_update`

`RayCast2D` with `force_raycast_update`