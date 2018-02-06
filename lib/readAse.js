/// <reference path="../index.d.ts" />
import { readFileSync } from 'fs';


// Imports
const fs = require('fs');
const util = require('util');
const AseBuffer = require('./ase-buffer');
const chunk = require('./chunk');

const readFileAsync = util.promisify(fs.readFile);

let currentLayerIndex = 0;
let layerChunkRoots = {};

let latestReadCell;

let latestReadChunk;

/**
 * Parse an aseprite file into valid JSON
 * @param {string} fpath .ASE file path
 * @returns {Ase.File}
 */
async function readAse(fpath) {
  let buffer, file = {};
  file.frames = [];

  // Attempt to read file to buffer
  try {
    buffer = await readFileAsync(fpath);
  } catch(e) {
    throw e;
  }

  // Wrap buffer as AseBuffer
  let aseBuffer = new AseBuffer(buffer);

  // Read header
  file.header = readAseHeader(aseBuffer);

  // Loop through frames
  for (let i = 0; i < file.header.frames; i++) {
    let frame = {};
    layerChunkRoots = {};

    frame.chunks = [];
    frame.layers = [];

    lastLayerChunkArray = frame.layers;
    latestReadChunk = undefined;
    latestReadCell = undefined;

    // Read frame header
    frame.frameHeader = readAseFrameHeader(aseBuffer);

    // Loop through chunks
    for (let y = 0; y < frame.frameHeader.numberOfChunks; y++) {

      // Read chunk
      let frameChunk = chunk.readChunk(aseBuffer);

      // If the chunk is a layer type
      if (frameChunk.type === 0x2004) {
        frameChunk.children = [];

        // Assign layer index
        frameChunk.layerIndex = currentLayerIndex++;

        // Build layers array
        if (frameChunk.childLevel === 0) {
          frame.layers.push(frameChunk);
          layerChunkRoots[0] = frameChunk.children;
        } else {
          layerChunkRoots[frameChunk.childLevel - 1].push(frameChunk);
          layerChunkRoots[frameChunk.childLevel] = frameChunk.children;
        }
      }

      // If the chunk is a cell chunk
      if (frameChunk.type === 0x2005) {
        latestReadCell = frameChunk;
      }

      // If the chunk is a cell extra chunk
      if (frameChunk.type === 0x2006) {
        latestReadCell.extra = frameChunk;
      }

      // If the chunk is a user data chunk
      if (frameChunk.type === 0x2020) {
        latestReadChunk.userData = frameChunk;
      }

      // Add chunk
      frame.chunks.push(frameChunk);

      // Remember this chunk
      latestReadChunk = frameChunk;      
    }

    // Add frame
    file.frames.push(frame);
  }

  return file;
}

/**
 * Parse an aseprite file into valid JSON synchronously
 * @param {string} fpath .ASE file path
 * @returns {Ase.File}
 */
function readAseSync(fpath) {
  let buffer, file = {};
  file.frames = [];

  // Attempt to read file to buffer
  buffer = readFileSync(fpath);

  if (!buffer) {
    throw new Error('Could not read file!');
  }

  // Wrap buffer as AseBuffer
  let aseBuffer = new AseBuffer(buffer);

  // Read header
  file.header = readAseHeader(aseBuffer);

  // Loop through frames
  for (let i = 0; i < file.header.frames; i++) {
    let frame = {};
    layerChunkRoots = {};

    frame.chunks = [];
    frame.layers = [];

    lastLayerChunkArray = frame.layers;
    latestReadChunk = undefined;
    latestReadCell = undefined;

    // Read frame header
    frame.frameHeader = readAseFrameHeader(aseBuffer);

    // Loop through chunks
    for (let y = 0; y < frame.frameHeader.numberOfChunks; y++) {

      // Read chunk
      let frameChunk = chunk.readChunk(aseBuffer);

      // If the chunk is a layer type
      if (frameChunk.type === 0x2004) {
        frameChunk.children = [];

        // Assign layer index
        frameChunk.layerIndex = currentLayerIndex++;

        // Build layers array
        if (frameChunk.childLevel === 0) {
          frame.layers.push(frameChunk);
          layerChunkRoots[0] = frameChunk.children;
        } else {
          layerChunkRoots[frameChunk.childLevel - 1].push(frameChunk);
          layerChunkRoots[frameChunk.childLevel] = frameChunk.children;
        }
      }

      // If the chunk is a cell chunk
      if (frameChunk.type === 0x2005) {
        latestReadCell = frameChunk;
      }

      // If the chunk is a cell extra chunk
      if (frameChunk.type === 0x2006) {
        latestReadCell.extra = frameChunk;
      }

      // If the chunk is a user data chunk
      if (frameChunk.type === 0x2020) {
        latestReadChunk.userData = frameChunk;
      }

      // Add chunk
      frame.chunks.push(frameChunk);

      // Remember this chunk
      latestReadChunk = frameChunk;      
    }

    // Add frame
    file.frames.push(frame);
  }

  return file;
}

/**
 * Reads frame header information
 * @param {AseBuffer} aseBuffer 
 * @returns {Ase.FrameHeader}
 */
function readAseFrameHeader(aseBuffer) {
  let header = {};

  // Read frame header
  header.bytesInFrame = aseBuffer.readDword();
  header.magicNumber = aseBuffer.readWord();

  // Sanity check magic number
  if (header.magicNumber !== 0xF1FA) {
    throw new Error('Magic number mismatch in frame header!');
  }

  // Continue
  header.numberOfChunks = aseBuffer.readWord();
  header.frameDuration = aseBuffer.readWord();

  // Skip through empty bytes
  aseBuffer.skipBytes(6);

  return header;
}

/**
 * Reads ASE header information
 * @param {AseBuffer} aseBuffer 
 * @returns {Ase.Header}
 */
function readAseHeader(aseBuffer) {
  let header = {};

  // Read file header
  header.fileSize = aseBuffer.readDword();
  header.magicNumber = aseBuffer.readWord();

  // Check magic number integrity
  if (header.magicNumber !== 0xA5E0) {
    throw new Error('Magic number mismatch in header!');
  }

  header.frames = aseBuffer.readWord();
  header.width = aseBuffer.readWord();
  header.height = aseBuffer.readWord();
  header.colorDepth = aseBuffer.readWord();
  header.validLayerOpacity = aseBuffer.readDword() & 1 === 1 ? true : false;
  header.globalFrameSpeed = aseBuffer.readWord();

  // Read through empty vals
  aseBuffer.readDword();
  aseBuffer.readDword();

  // Read palette transparency index
  header.transparentBackgroundPaletteIndex = aseBuffer.readByte();

  // Skip empty
  aseBuffer.skipBytes(3);

  header.numberOfColors = aseBuffer.readWord();
  header.pixelWidth = aseBuffer.readByte();
  header.pixelheight = aseBuffer.readByte();

  // Read through empty bytes
  aseBuffer.skipBytes(92);

  // Calculate pixel ratio
  header.pixelRatio = (header.pixelheight === 0 || header.pixelWidth === 0) ? 1 : header.pixelWidth / header.pixelheight;

  // Determine color depth
  switch(header.colorDepth) {
    case 32:
      header.colorDepth = 'RGBA';
      break;
    case 16:
      header.colorDepth = 'Grayscale';
      break;
    case 8:
      header.colorDepth = 'Indexed';
      break;
  }

  // Save color depth to buffer for proper pixel reading
  aseBuffer.colorDepth = header.colorDepth;

  return header;
}

// Applys a require hook for .ase files
require.extensions['.ase'] = function (module, filename) {
  module.exports = readAseSync(filename);
};

module.exports = readAse;
