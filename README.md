# node-ase
[Aseprite](https://github.com/aseprite/aseprite) file parser implemented in node, based on the [file spec](https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md). This parser does not support older Aseprite saves, as it skips over chunk types 0x0004 and 0x0011. It also skips over 0x2016 as it is deprecated.

## Quick Start
Install with
```
$ npm i node-ase
```

Read .ase file example:
```
const readAse = require('node-ase');
const path    = require('path');

let filePath = path.join(__dirname, './myCoolSprite.ase');

(async () => {
  let aseFile;

  try {
    aseFile = await readAse(filePath);
  } catch(e) {
    console.log(e);
  }

  console.log( JSON.stringify(aseFile, null, 2) );
})();
```

You can also read .ase files synchronously using the included require hook:
```
const readAse = require('node-ase');

let aseFile = require('./myCoolSprite.ase');

console.log( JSON.stringify(aseFile, null, 2) );
```

## Reading Information
node-ase will return an object containing all parsed data. It has two properties, `header` and `frames`.

The `header` property contains file header information, like file size, color depth, number of frames, etc.

The `frames` property contains all the frames for the project, as well as every chunk for that frame under the `frames[n].chunks` array. All layers in a frame are organized into the `frames[n].layers` array. A layer also has a `layer.children` array that contains all child layers.

For more information on ase files, [see the spec](https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md).

## License
MIT
