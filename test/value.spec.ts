import fs from 'fs'
import { assert, describe, it } from 'vitest'
import { EbmlStreamDecoder } from '../src/EbmlStreamDecoder'
import { EbmlTagId } from '../src/models/enums/EbmlTagId'
import { EbmlDataTag } from '../src/models/tags/EbmlDataTag'
import { SimpleBlock } from '../src/models/tags/SimpleBlock'
import { Readable } from 'stream'
import { EbmlMasterTag } from '../src/models/tags/EbmlMasterTag'

process.setMaxListeners(Infinity)

const createReadStream = (file: string) =>
  Readable.toWeb(fs.createReadStream(file)) as ReadableStream<ArrayBuffer>

const makeDataStreamTest =
  (stream: () => ReadableStream<ArrayBuffer>) =>
  (cb: (tag: EbmlMasterTag | EbmlDataTag, done: () => void) => void) => {
    let isDone = false
    return stream().pipeThrough(new EbmlStreamDecoder()).pipeTo(
      new WritableStream({
        write: (tag) =>
          cb(tag, () => {
            isDone = true
          }),
        close() {
          if (!isDone) assert.fail('hit end of file without calling done')
        },
      })
    )
  }

describe('EBML', () => {
  describe('Values in tags', () => {
    describe('AVC1', () => {
      const makeAVC1StreamTest = makeDataStreamTest(
        () => createReadStream('media/video-webm-codecs-avc1-42E01E.webm')
      )

      it('should get a correct PixelWidth value from a file (2-byte unsigned int)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.PixelWidth) {
            assert.strictEqual(tag.data, 352)
            done()
          }
        }))

      it('should get a correct EBMLVersion value from a file (one-byte unsigned int)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.EBMLVersion) {
            assert.strictEqual(tag.data, 1)
            done()
          }
        }))

      it('should get a correct TimeCodeScale value from a file (3-byte unsigned int)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.TimecodeScale) {
            assert.strictEqual(tag.data, 1000000)
            done()
          }
        }))

      it('should get a correct TrackUID value from a file (56-bit integer in hex)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.TrackUID) {
            assert.strictEqual(tag.data, '1c63824e507a46')
            done()
          }
        }))

      it('should get a correct DocType value from a file (ASCII text)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.DocType) {
            assert.strictEqual(tag.data, 'matroska')
            done()
          }
        }))

      it('should get a correct MuxingApp value from a file (utf8 text)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.MuxingApp) {
            assert.strictEqual(tag.data, 'Chrome', JSON.stringify(tag))
            done()
          }
        }))

      it('should get a correct SimpleBlock time payload from a file (binary)', () =>
        makeAVC1StreamTest((tag, done) => {
          if (!(tag instanceof SimpleBlock)) return
          if (tag.value <= 0 || tag.value >= 200) return

          /* look at second simpleBlock */
          assert.strictEqual(tag.track, 1, 'track')
          assert.strictEqual(tag.value, 191, 'value (timestamp)')
          assert.strictEqual(tag.payload.byteLength, 169, JSON.stringify(tag.payload))
          done()
        }))
    })

    describe('VP8', () => {
      const makeVP8StreamTest = makeDataStreamTest(() => createReadStream('media/video-webm-codecs-vp8.webm'))

      it('should get a correct PixelWidth value from a video/webm; codecs="vp8" file (2-byte unsigned int)', () =>
        makeVP8StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.PixelWidth) {
            assert.strictEqual(tag.data, 352)
            done()
          }
        }))

      it('should get a correct EBMLVersion value from a video/webm; codecs="vp8" file (one-byte unsigned int)', () =>
        makeVP8StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.EBMLVersion) {
            assert.strictEqual(tag.data, 1)
            done()
          }
        }))

      it('should get a correct TimeCodeScale value from a video/webm; codecs="vp8" file (3-byte unsigned int)', () =>
        makeVP8StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.TimecodeScale) {
            assert.strictEqual(tag.data, 1000000)
            done()
          }
        }))

      it('should get a correct TrackUID value from a video/webm; codecs="vp8" file (56-bit integer in hex)', () =>
        makeVP8StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.TrackUID) {
            assert.strictEqual(tag.data, '306d02aaa74d06')
            done()
          }
        }))

      it('should get a correct DocType value from a video/webm; codecs="vp8" file (ASCII text)', () =>
        makeVP8StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.DocType) {
            assert.strictEqual(tag.data, 'webm')
            done()
          }
        }))

      it('should get a correct MuxingApp value from a video/webm; codecs="vp8" file (utf8 text)', () =>
        makeVP8StreamTest((tag, done) => {
          if (tag instanceof EbmlDataTag && tag.id === EbmlTagId.MuxingApp) {
            assert.strictEqual(tag.data, 'Chrome')
            done()
          }
        }))

      it('should get a correct SimpleBlock time payload from a file (binary)', () =>
        makeVP8StreamTest((tag, done) => {
          if (!(tag instanceof SimpleBlock)) return
          if (tag.value <= 0 || tag.value >= 100) return

          assert.strictEqual(tag.track, 1, 'track')
          assert.strictEqual(tag.value, 96, JSON.stringify(tag))
          /* look at second simpleBlock */
          assert.strictEqual(tag.payload.byteLength, 43, JSON.stringify(tag))
          assert.strictEqual(tag.discardable, false, 'discardable')
          done()
        }))
    })
  })
})
