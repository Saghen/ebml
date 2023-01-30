import { EbmlTag } from './models/EbmlTag'
import { EbmlTagPosition } from './models/enums/EbmlTagPosition'
import { EbmlTagId } from './models/enums/EbmlTagId'
import { EbmlMasterTag } from './models/tags/EbmlMasterTag'
import { concatArrayBuffers } from './tools'

function getTransformer(): Transformer<EbmlTag, ArrayBuffer> & {
  getBuffer(): ArrayBuffer
  getStack(): EbmlMasterTag[]
} {
  let buffer: ArrayBuffer = new ArrayBuffer(0)
  const openTags: EbmlMasterTag[] = []

  const flush = (controller: TransformStreamDefaultController<ArrayBuffer>) => {
    if (buffer.byteLength === 0) return
    controller.enqueue(buffer)
    buffer = new ArrayBuffer(0)
  }

  function addToBuffer(chunk: ArrayBuffer) {
    buffer = concatArrayBuffers(buffer, chunk)
  }

  return {
    transform(tag, controller): void {
      if (!tag) return
      if (!tag.id) throw new Error(`No id found for ${JSON.stringify(tag)}`)

      if (tag.position === EbmlTagPosition.Start) {
        if (openTags.length > 0) {
          openTags[openTags.length - 1].Children.push(tag)
        }
        openTags.push(tag)
      }
      else if (tag.position === EbmlTagPosition.Content) {
        if (openTags.length === 0) {
          addToBuffer(tag.encode())
          flush(controller)
          return
        }
        openTags[openTags.length - 1].Children.push(tag)
      }
      else if (tag.position === EbmlTagPosition.End) {
        const inMemoryTag = openTags.pop()!
        if (tag.id !== inMemoryTag.id) {
          throw `Logic error - closing tag "${EbmlTagId[tag.id]}" is not expected tag "${
            EbmlTagId[inMemoryTag.id]
          }"`
        }

        if (openTags.length === 0) {
          addToBuffer(inMemoryTag.encode())
          flush(controller)
        }
      }
    },
    flush,
    getBuffer() {
      return buffer
    },
    getStack() {
      return openTags
    },
  }
}

export class EbmlStreamEncoder extends TransformStream<EbmlTag, ArrayBuffer> {
  getBuffer: () => ArrayBuffer
  getStack: () => EbmlMasterTag[]
  constructor() {
    const transformer = getTransformer()
    super(transformer)
    this.getBuffer = transformer.getBuffer
    this.getStack = transformer.getStack
  }
}
