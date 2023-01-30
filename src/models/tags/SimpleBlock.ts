import { concatArrayBuffers, readVint } from '../../tools'
import { Block } from './Block'
import { EbmlTagId } from '../enums/EbmlTagId'

export class SimpleBlock extends Block {
  discardable: boolean | undefined
  keyframe: boolean | undefined

  constructor() {
    super(EbmlTagId.SimpleBlock)
  }

  encodeContent(): ArrayBuffer {
    let flags = new Uint8Array(this.writeFlagsBuffer())

    if (this.keyframe) flags[0] |= 0x80
    if (this.discardable) flags[0] |= 0x01

    return concatArrayBuffers(this.writeTrackBuffer(), this.writeValueBuffer(), flags, this.payload)
  }

  parseContent(data: ArrayBuffer): void {
    super.parseContent(data)

    const track = readVint(data)!
    const flags: number = new Uint8Array(data)[track.length + 2]
    this.keyframe = Boolean(flags & 0x80)
    this.discardable = Boolean(flags & 0x01)
  }
}
