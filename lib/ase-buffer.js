class AseBuffer {
  /**
   * 
   * @param {Buffer} buffer 
   */
  constructor(buffer) {
    this._buffer = buffer;
    this._currentReadPosition = 0;
    this._colorDepth = 'RGBA';
  }

  /**
   * Reads an unsigned 8bit int
   */
  readByte() {
    let res = this._buffer.readUInt8(this._currentReadPosition);
    this._currentReadPosition += 1;
    return res;
  }

  /**
   * Reads an unsigned 16bit int (LE)
   */
  readWord() {
    let res = this._buffer.readUInt16LE(this._currentReadPosition);
    this._currentReadPosition += 2;
    return res;
  }

  /**
   * Reads a signed 16bit int (LE)
   */
  readShort() {
    let res = this._buffer.readInt16LE(this._currentReadPosition);
    this._currentReadPosition += 2;
    return res;
  }

  /**
   * Reads an unsigned 32bit int (LE)
   */
  readDword() {
    let res = this._buffer.readUInt32LE(this._currentReadPosition);
    this._currentReadPosition += 4;
    return res;
  }

  /**
   * Reads a string from the buffer by parsing a WORD value, then sequential BYTEs
   */
  readString() {
    let stringLength = this.readWord();
    let chars = [];

    for (let i = 0; i < stringLength; i++) {
      chars.push( this.readByte() );
    }

    let byteBuffer = new Buffer(chars);

    return byteBuffer.toString('utf8');
  }

  /**
   * Reads a fixed 32 bit float (16.16)
   */
  readFixed() {
    let res = this._buffer.readFloatLE(this._currentReadPosition);
    this._currentReadPosition += 4;
    return res;
  }

  /**
   * Reads a pixel based on current buffer color depth
   */
  readPixel() {
    let pixel = {};

    switch (this._colorDepth) {
      case 'RGBA':
        pixel.r = this.readByte();
        pixel.g = this.readByte();
        pixel.b = this.readByte();
        pixel.a = this.readByte();
        break;
      case 'Grayscale':
        pixel.value = this.readByte();
        pixel.alpha = this.readByte();        
        break;
      case 'Indexed':
        pixel.index = this.readByte();
        break;
    }

    return pixel;
  }

  /**
   * Skips the read position ahead
   * @param {number} count Bytes to skip
   */
  skipBytes(count) {
    this._currentReadPosition += count;
  }

  get currentReadPosition() {
    return this._currentReadPosition;
  }

  set currentReadPosition(pos) {
    this._currentReadPosition = pos;
  }

  get colorDepth() {
    return this._colorDepth;
  }

  set colorDepth(colDepth) {
    this._colorDepth = colDepth;
  }
}

module.exports = AseBuffer;
