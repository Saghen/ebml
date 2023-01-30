import { assert, describe, it } from 'vitest'
import { EbmlStreamDecoder as Decoder } from '../src/EbmlStreamDecoder'
import { EbmlTagPosition } from '../src/models/enums/EbmlTagPosition'
import { EbmlElementType } from '../src/models/enums/EbmlElementType'
import { EbmlDataTag } from '../src/models/tags/EbmlDataTag'

const bufFrom = (data: Uint8Array | readonly number[]): ArrayBuffer => new Uint8Array(data).buffer

const getDecoderWithNullSink = () => {
  const decoder = new Decoder()
  decoder.readable.pipeTo(new WritableStream({}))
  return decoder
}

describe('EBML', () => {
  describe('Decoder', () => {
    it('should wait for more data if a tag is longer than the buffer', async () => {
      const decoder = getDecoderWithNullSink()
      const writer = decoder.writable.getWriter()
      await writer.write(bufFrom([0x1a, 0x45]))

      assert.strictEqual(decoder.getBuffer().byteLength, 2)
    })

    it('should clear the buffer after a full tag is written in one chunk', async () => {
      const decoder = getDecoderWithNullSink()
      const writer = decoder.writable.getWriter()
      await writer.write(bufFrom([0x42, 0x86, 0x81, 0x01]))

      assert.strictEqual(decoder.getBuffer().byteLength, 0)
    })

    it('should clear the buffer after a full tag is written in multiple chunks', async () => {
      const decoder = getDecoderWithNullSink()
      const writer = decoder.writable.getWriter()

      await writer.write(bufFrom([0x42, 0x86]))
      await writer.write(bufFrom([0x81, 0x01]))

      assert.strictEqual(decoder.getBuffer().byteLength, 0)
    })

    it('should increment the cursor on each step', async () => {
      const decoder = getDecoderWithNullSink()
      const writer = decoder.writable.getWriter()

      await writer.write(bufFrom([0x42])) // 4

      assert.strictEqual(decoder.getBuffer().byteLength, 1)

      await writer.write(bufFrom([0x86])) // 5

      assert.strictEqual(decoder.getBuffer().byteLength, 2)

      await writer.write(bufFrom([0x81])) // 6 & 7

      assert.strictEqual(decoder.getBuffer().byteLength, 3)

      await writer.write(bufFrom([0x01])) // 6 & 7

      assert.strictEqual(decoder.getBuffer().byteLength, 0)
    })

    it('should emit correct tag events for simple data', async () => {
      const decoder = new Decoder()
      const writer = decoder.writable.getWriter()

      decoder.readable.pipeTo(
        new WritableStream({
          write: (tag) => {
            assert.strictEqual(tag.position, EbmlTagPosition.Content)
            assert.strictEqual(tag.id.toString(16), '4286')
            assert.strictEqual(tag.size, 0x01)
            assert.strictEqual(tag.type, EbmlElementType.UnsignedInt)
            assert.ok(tag instanceof EbmlDataTag)
            assert.deepStrictEqual(tag.data, 1)
          },
        })
      )

      await writer.write(bufFrom([0x42, 0x86, 0x81, 0x01]))
      await writer.close()
    })

    it('should emit correct EBML tag events for master tags', async () => {
      const decoder = new Decoder()
      const writer = decoder.writable.getWriter()

      writer.write(bufFrom([0x1a, 0x45, 0xdf, 0xa3, 0x80]))
      writer.close()

      await decoder.readable.pipeTo(
        new WritableStream({
          write: (tag) => {
            assert.strictEqual(tag.position, EbmlTagPosition.Start)
            assert.strictEqual(tag.id.toString(16), '1a45dfa3')
            assert.strictEqual(tag.size, 0)
            assert.strictEqual(tag.type, EbmlElementType.Master)
            assert.ok(!(tag instanceof EbmlDataTag))
            assert.ok(!('data' in tag))
          },
        })
      )
    })

    it('should emit correct EBML:end events for master tags', async () => {
      const decoder = new Decoder()
      const writer = decoder.writable.getWriter()

      writer.write(bufFrom([0x1a, 0x45, 0xdf, 0xa3]))
      writer.write(bufFrom([0x84, 0x42, 0x86, 0x81, 0x00]))
      writer.close()

      let tags = 0
      await decoder.readable.pipeTo(
        new WritableStream({
          write: (tag) => {
            if (tag.position !== EbmlTagPosition.End) {
              tags += 1
              return
            }
            assert.strictEqual(tags, 2) // two tags
            assert.strictEqual(tag.id.toString(16), '1a45dfa3')
            assert.strictEqual(tag.size, 4)
            assert.strictEqual(tag.type, EbmlElementType.Master)
            assert.ok(!(tag instanceof EbmlDataTag))
            assert.ok(!('data' in tag))
          },
        })
      )
    })
  })
})
