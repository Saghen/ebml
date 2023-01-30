import { readVint, readHexString, concatArrayBuffers } from './tools'
import { EbmlTag } from './models/EbmlTag'
import { EbmlElementType } from './models/enums/EbmlElementType'
import { EbmlTagPosition } from './models/enums/EbmlTagPosition'
import { EbmlTagFactory } from './models/EbmlTagFactory'
import { EbmlTagId } from './models/enums/EbmlTagId'
import { EbmlMasterTag } from './models/tags/EbmlMasterTag'
import { EbmlDataTag } from './models/tags/EbmlDataTag'

export type EbmlStreamDecoderOptions = {
  bufferTagIds?: EbmlTagId[]
}

function getTransformer(
  options?: EbmlStreamDecoderOptions
): Transformer<ArrayBuffer, EbmlTag> & { getBuffer(): ArrayBuffer } {
  let currentBufferOffset = 0
  const tagStack: ProcessingTag[] = []
  let buffer: ArrayBuffer = new ArrayBuffer(0)
  const _bufferTagIds: EbmlTagId[] = options?.bufferTagIds ?? []

  const advanceBuffer = (length: number): void => {
    currentBufferOffset += length
    buffer = buffer.slice(length)
  }

  const readTagHeader = (buffer: ArrayBuffer, offset: number = 0): ProcessingTag | undefined => {
    if (buffer.byteLength === 0) return

    const tag = readVint(buffer, offset)
    if (!tag) return
    const size = readVint(buffer, offset + tag.length)
    if (!size) return

    const tagIdHex = readHexString(new Uint8Array(buffer), offset, offset + tag.length)
    const tagId = Number.parseInt(tagIdHex, 16)
    const tagObject = EbmlTagFactory.create(tagId)

    tagObject.size = size.value

    return Object.assign(tagObject, {
      absoluteStart: currentBufferOffset + offset,
      tagHeaderLength: tag.length + size.length,
    })
  }

  const makeTag = (processingTag: ProcessingTag, position: EbmlTagPosition, data?: ArrayBuffer): EbmlTag => {
    const tag: EbmlTag = EbmlTagFactory.create(processingTag.id)
    tag.size = processingTag.size
    tag.position = position
    if (position === EbmlTagPosition.Content) {
      if (data === undefined) throw Error('Data must be provided when position is of type Content')
      tag.parseContent(data)
    }
    return tag
  }

  return {
    start() {
      buffer = new ArrayBuffer(0)
      currentBufferOffset = 0
    },
    transform(chunk, controller): void {
      buffer = concatArrayBuffers(buffer, chunk)

      while (true) {
        const currentTag = readTagHeader(buffer)
        if (!currentTag) break

        if (currentTag.type === EbmlElementType.Master && !_bufferTagIds.some((i) => i === currentTag.id)) {
          tagStack.push(currentTag)
          controller.enqueue(makeTag(currentTag, EbmlTagPosition.Start))
          advanceBuffer(currentTag.tagHeaderLength)
          continue
        }
        if (buffer.byteLength < currentTag.tagHeaderLength + currentTag.size ?? 0) break

        const data = buffer.slice(currentTag.tagHeaderLength, currentTag.tagHeaderLength + currentTag.size)
        controller.enqueue(makeTag(currentTag, EbmlTagPosition.Content, data))
        advanceBuffer(currentTag.tagHeaderLength + currentTag.size)

        while (tagStack.length > 0) {
          const nextTag = tagStack[tagStack.length - 1]
          if (currentBufferOffset < nextTag.absoluteStart + nextTag.tagHeaderLength + nextTag.size) {
            break
          }
          controller.enqueue(makeTag(nextTag, EbmlTagPosition.End))
          tagStack.pop()
        }
      }
    },
    getBuffer() {
      return buffer
    },
  }
}

export class EbmlStreamDecoder extends TransformStream<ArrayBuffer, EbmlMasterTag | EbmlDataTag> {
  getBuffer: () => ArrayBuffer
  constructor(options?: EbmlStreamDecoderOptions) {
    const transformer = getTransformer(options)
    super(transformer)
    this.getBuffer = transformer.getBuffer
  }
}

type ProcessingTag = EbmlTag & {
  absoluteStart: number
  tagHeaderLength: number
}
