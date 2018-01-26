declare namespace Ase {
  interface File {

    /** Ase file header */
    header: Header;

    /** Frames in file */
    frames: Array<Frame>;
  }

  interface Header {

    /** Total size of original .ase file */
    fileSize: number;

    /** Determines integrity of the file reading */
    magicNumber: string;

    /** Total number of frames */
    frames: number;

    /** Sprite width */
    width: number;

    /** Sprite height */
    height: number;

    /** Sprite color depth */
    colorDepth: string;

    /** Determines if layers have valid opacity values */
    validLayerOpacity: boolean;

    /** Global frame speed */
    globalFrameSpeed: number;

    transparentBackgroundPaletteIndex: number;

    /** Number of colors in sprite */
    numberOfColors: number;

    pixelWidth: number;

    pixelheight: number;

    /** Sprite pixel ratio */
    pixelRatio: number;
  }

  interface FrameHeader {

    /** Total bytes found in original frame */
    bytesInFrame: number;
  
    /** Determines integrity of the file reading */
    magicNumber: number;
  
    /** Number of chunks found in this frame */
    numberOfChunks: number;
  
    /** Loacl frame speed */
    frameDuration: number;
  }

  interface Frame {

    /** Frame header for this frame */
    frameHeader: FrameHeader

    /** Chunks belonging to this frame */
    chunks: Array<Chunk|Ase.CelChunk|Ase.CelExtraChunk|Ase.FrameTagsChunk|Ase.LayerChunk|Ase.PaletteChunk|Ase.SliceChunk|Ase.UserDataChunk>;

    /** Properly nested layer chunks for this frame */
    layers: Array<Ase.LayerChunk>;
  }

  interface Chunk {
  
    /** Size of chunk */
    size: number;

    /** Chunk type */
    type: number;

    /** Associated extra user data */
    userData?: Ase.UserDataChunk;
  }

  interface CelChunk extends Chunk {

    /** Layer index this cel chunk points to */
    layerIndex: number;

    /** Cel x position */
    xpos: number;

    /** Cel y position */
    ypos: number;

    /** Opacity level */
    opacity: number;

    /** Cel type */
    celType: string;

    /** Width of cel */
    width?: number;

    /** Height of cel */
    height?: number;

    /** Pixel data */
    pixels?: Array<Array<Pixel>>;

    /** Frame position to link with */
    frameLinkPos?: number;
  }

  interface CelExtraChunk extends Chunk {

    flags: number;

    /** Precise X position */
    preciseX: number;

    /** Precise Y position */
    preciseY: number;

    /** Width of cel in sprite (scaled in real-time) */
    width: number;

    /** Height of cel in sprite (scaled in real-time) */
    height: number;
  }

  interface LayerChunk extends Chunk {

    /** Index of the layer as referenced by other chunks */
    layerIndex: number;

    /** Child layers */
    children: Array<Ase.LayerChunk>;

    /** Layer flags */
    flags: Array<string>;

    /** Determines if layer is a group or normal layer */
    layerType: string;

    /** Current child level */
    childLevel: number;

    /** Should be ignored by implementation */
    defaultLayerWidth: number;

    /** Should be ignored by implementation */
    defaultLayerHeight: number;

    /** Layer blend mode */
    blendMode: string;

    /** Layer opacity. Only valid if the file header has validLayerOpacity set to true */
    opacity: number;

    /** Layer name */
    name: string;
  }

  interface PaletteChunk extends Chunk {

    /** Size of original palette */
    newPaletteSize: number;

    firstColorIndexToChange: number;

    lastColorIndexToChange: number;

    paletteEntries: Array<Ase.PaletteEntry>
  }

  interface UserDataChunk extends Chunk {

    /** User data flags */
    flags: Array<string>;

    text?: string;

    /** Red value (0-255) */
    r?: number;
    
    /** Green value (0-255) */
    g?: number;

    /** Blue value (0-255) */
    b?: number;

    /** Alpha value (0-255) */
    a?: number;
  }

  interface SliceChunk extends Chunk {

    sliceKeysCount: number;

    /** Type of slice */
    flags: Array<string>;

    reserved: any;

    /** Slice name */
    name: string;

    sliceKeys: Array<SliceKey>
  }

  interface FrameTagsChunk extends Chunk {

    /** Number of tags in this chunk */
    numberOfTags: number;

    /** Frame tags */
    tags: Array<Tag>;
  }

  interface Tag {

    fromFrame: any;

    toFrame: any;

    /** Determines the loop animation direction */
    loopAnimationDirection: string;

    /** Red value of tag color */
    r: number;
    
    /** Green value of tag color */
    g: number;

    /** Blue value of tag color */
    b: number;

    tagName: string;
  }

  interface SliceKey {

    /** Frame number (this slice is valid from this frame to the end of the animation) */
    frameNumber: number;

    /** Slice X origin coordinate in the sprite */
    xOrigin: number;

    /** Slice Y origin coordinate in the sprite */
    yOrigin: number;

    /** Slice width (can be 0 if this slice hidden in the animation from the given frame) */
    width: number;

    /** Slice height */
    height: number;

    /** Center X position (relative to slice bounds) */
    centerX?: number;

    /** Center Y position (relative to slice bounds) */
    centerY?: number;

    /** Center width */
    centerWidth?: number;

    /** Center height */
    centerHeight?: number;

    /** Pivot X position (relative to the slice origin) */
    pivotX?: number;

    /** Pivot Y position (relative to the slice origin) */
    pivotY?: number;
  }

  interface PaletteEntry {

    /** Indicates that this palette entry has a name (duh) */
    hasName: boolean;

    /** Red value (0-255) */
    r: number;
    
    /** Green value (0-255) */
    g: number;

    /** Blue value (0-255) */
    b: number;

    /** Alpha value (0-255) */
    a: number;

    /** Palette entry name */
    name?: string;
  }
}
