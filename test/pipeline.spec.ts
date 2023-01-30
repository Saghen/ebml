import { assert, describe, it } from 'vitest'
import { EbmlStreamDecoder } from '../src/EbmlStreamDecoder'
import { EbmlStreamEncoder } from '../src/EbmlStreamEncoder'
import { EbmlTag } from '../src/models/EbmlTag'
import { EbmlTagId } from '../src/models/enums/EbmlTagId'
import { EbmlTagFactory } from '../src/models/EbmlTagFactory'
import { EbmlTagPosition } from '../src/models/enums/EbmlTagPosition'
import { Block } from '../src/models/tags/Block'

// TODO: Prevent false positive by checking that an assert ran

describe('ebml', () => {
  describe('Pipeline', () => {
    it('should output input buffer', async () => {
      const buffer = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0x84, 0x42, 0x86, 0x81, 0x00])

      const source = new ReadableStream<ArrayBuffer>({
        pull(controller) {
          controller.enqueue(buffer.buffer)
          controller.close()
        },
      })
      const sink = new WritableStream<ArrayBuffer>({
        write(chunk) {
          assert.deepEqual(Array.from(new Uint8Array(chunk)), Array.from(buffer))
        },
      })

      await source
        .pipeThrough(new EbmlStreamDecoder())
        .pipeThrough(new EbmlStreamEncoder())
        .pipeTo(sink)
    })

    it('should support end === -1', async () => {
      const source = new ReadableStream<EbmlTag>({
        pull(controller) {
          controller.enqueue(
            Object.assign(EbmlTagFactory.create(EbmlTagId.Cluster), {
              position: EbmlTagPosition.Start,
              size: -1,
            })
          )
          controller.enqueue(
            Object.assign(EbmlTagFactory.create(EbmlTagId.Cluster), {
              position: EbmlTagPosition.End,
              size: -1,
            })
          )
          controller.close()
        },
      })
      const decoder = new EbmlStreamDecoder()
      const encoder = new EbmlStreamEncoder()
      const sink = new WritableStream<EbmlTag>({
        write(tag) {
          assert.strictEqual(tag.id, EbmlTagId.Cluster)
          assert.strictEqual(tag.size, -1)
        },
      })

      await source.pipeThrough(encoder).pipeThrough(decoder).pipeTo(sink)
    })

    it('should encode and decode Blocks correctly', async () => {
      const block = EbmlTagFactory.create(EbmlTagId.Block)
      block.track = 5
      block.invisible = true
      const payload = new Uint8Array(new ArrayBuffer(50))
      for (let i = 0; i < block.payload.byteLength; i++) {
        payload[i] = Math.floor(Math.random() * 255)
      }
      block.payload = payload.buffer

      const source = new ReadableStream<EbmlTag>({
        pull(controller) {
          controller.enqueue(block)
          controller.close()
        },
      })
      const encoder = new EbmlStreamEncoder()
      const decoder = new EbmlStreamDecoder()
      const sink = new WritableStream<Block>({
        write(tag) {
          if (!tag) return
          assert.strictEqual(tag.id, EbmlTagId.Block)
          assert.strictEqual(tag.track, block.track)
          assert.strictEqual(tag.invisible, block.invisible)
          assert.deepEqual(tag.payload, block.payload)
        },
      })

      await source.pipeThrough(encoder).pipeThrough(decoder).pipeTo(sink)
    })
  })
})
