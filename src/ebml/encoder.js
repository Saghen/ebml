import { Transform } from 'stream';
import Buffers from 'buffers';
import schema from './schema';
import tools from './tools';

const debug = require('debug')('ebml:encoder');

function encodeTag(tagId, tagData, end) {
  if (end === -1) {
    return Buffers([tagId, Buffer.from('01ffffffffffffff', 'hex'), tagData]);
  }
  return Buffers([tagId, tools.writeVint(tagData.length), tagData]);
}

/**
 * Encodes a raw EBML stream
 * @class EbmlEncoder
 * @extends Transform
 */
export default class EbmlEncoder extends Transform {
  /**
   * @type {Buffer}
   * @property
   * @private
   */
  mBuffer = null;

  /**
   * @private
   * @property
   * @type {Boolean}
   */
  mCorked = false;

  /**
   * @private
   * @property
   * @type {Array<Tag>}
   */
  mStack = [];

  constructor(options = {}) {
    super({ ...options, writableObjectMode: true });
  }

  get buffer() {
    return this.mBuffer;
  }

  get corked() {
    return this.mCorked;
  }

  get stack() {
    return this.mStack;
  }

  set buffer(buffer) {
    this.mBuffer = buffer;
  }

  set corked(corked) {
    this.mCorked = corked;
  }

  set stack(stak) {
    this.mStack = stak;
  }

  /**
   *
   * @param {[string, Tag]} chunk array of chunk data, starting with the tag
   * @param {string} enc the encoding type (not used)
   * @param {Function} done a callback method to call after the transformation
   */
  _transform(chunk, enc, done) {
    const [tag, { data, name, ...rest }] = chunk;
    if (debug.enabled) {
      debug(`encode ${tag} ${name}`);
    }

    switch (tag) {
      case 'start':
        this.startTag(name, { name, data, ...rest });
        break;
      case 'tag':
        this.writeTag(name, data);
        break;
      case 'end':
        this.endTag();
        break;
      default:
        break;
    }

    done();
  }

  /**
   * @private
   * @param {Function} done callback function
   */
  flush(done = () => {}) {
    if (!this.buffer || this.corked) {
      if (debug.enabled) {
        debug('no buffer/nothing pending');
      }
      done();

      return;
    }

    if (debug.enabled) {
      debug(`writing ${this.buffer.length} bytes`);
    }

    // console.info(`this.buffer.toBuffer = ${this.buffer.buffer}`);

    const chunk = Buffer.from(this.buffer);
    this.buffer = null;
    this.push(chunk);
    done();
  }

  /**
   * @private
   * @param {Buffer | Buffer[]} buffer
   */
  bufferAndFlush(buffer) {
    if (this.buffer) {
      this.buffer = tools.concatenate(this.buffer, buffer);
    } else {
      this.buffer = Buffers(buffer);
    }
    this.flush();
  }

  _flush(done = () => {}) {
    this.flush(done);
  }

  _bufferAndFlush(buffer) {
    this.bufferAndFlush(buffer);
  }

  /**
   * gets the ID of the type of tagName
   * @static
   * @param  {string} tagName to be looked up
   * @return {number}         A buffer containing the schema information
   */
  static getSchemaInfo(tagName) {
    const tagId = Array.from(schema.keys()).find(
      str => schema.get(str).name === tagName,
    );
    if (tagId) {
      return tagId;
    }

    return null;
  }

  cork() {
    this.corked = true;
  }

  uncork() {
    this.corked = false;
    this.flush();
  }

  writeTag(tagName, tagData) {
    const tagId = EbmlEncoder.getSchemaInfo(tagName);
    if (!tagId) {
      throw new Error(`No schema entry found for ${tagName}`);
    }
    if (tagData) {
      const data = encodeTag(tagId, tagData);
      if (this.stack.length > 0) {
        this.stack[this.stack.length - 1].children.push({ data });
      } else {
        this.bufferAndFlush(data.buffer);
      }
    }
  }

  /**
   *
   * @param {String} tagName The name of the tag to start
   * @param {{end: Number}} info an information object with a `end` parameter
   */
  startTag(tagName, { end }) {
    const tagId = EbmlEncoder.getSchemaInfo(tagName);
    if (!tagId) {
      throw new Error(`No schema entry found for ${tagName}`);
    }

    const tag = {
      data: null,
      id: tagId,
      name: tagName,
      end,
      children: [],
    };

    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].children.push(tag);
    }
    this.stack.push(tag);
  }

  endTag() {
    const tag = this.stack.pop();

    const childTagDataBuffers = tag.children.map(child => child.data);
    tag.data = encodeTag(tag.id, Buffers(childTagDataBuffers), tag.end);

    if (this.stack.length < 1) {
      this.bufferAndFlush(tag.data.buffer);
    }
    this.end();
  }
}