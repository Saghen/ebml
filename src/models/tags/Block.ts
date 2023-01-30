import { EbmlDataTag } from './EbmlDataTag'
import { BlockLacing } from '../enums/BlockLacing'
import { concatArrayBuffers, readSigned, readVint, writeVint } from '../../tools'
import { EbmlTagId } from '../enums/EbmlTagId'
import { EbmlElementType } from '../enums/EbmlElementType'

export class Block extends EbmlDataTag {
  payload: ArrayBuffer = new ArrayBuffer(0)
  track: number = 0
  value: number = 0

  invisible: boolean | undefined
  lacing: BlockLacing | undefined

  constructor(subTypeId?: number) {
    super(subTypeId || EbmlTagId.Block, EbmlElementType.Binary)
  }

  protected writeTrackBuffer(): ArrayBuffer {
    return writeVint(this.track)
  }

  protected writeValueBuffer(): ArrayBuffer {
    let value = new DataView(new ArrayBuffer(2))
    value.setInt16(0, this.value)
    return value.buffer
  }

  protected writeFlagsBuffer(): ArrayBuffer {
    let flags = 0x00
    if (this.invisible) {
      flags |= 0x10
    }

    switch (this.lacing) {
      case BlockLacing.None:
        break
      case BlockLacing.Xiph:
        flags |= 0x04
        break
      case BlockLacing.EBML:
        flags |= 0x08
        break
      case BlockLacing.FixedSize:
        flags |= 0x0c
        break
    }

    return new Uint8Array([flags % 256]).buffer
  }

  encodeContent(): ArrayBuffer {
    return concatArrayBuffers(
      this.writeTrackBuffer(),
      this.writeValueBuffer(),
      this.writeFlagsBuffer(),
      this.payload
    )
  }

  parseContent(data: ArrayBuffer): void {
    const track = readVint(data)!
    this.track = track.value
    this.value = readSigned(data.slice(track.length, track.length + 2))
    let flags: number = new Uint8Array(data)[track.length + 2]
    this.invisible = Boolean(flags & 0x10)
    switch (flags & 0x0c) {
      case 0x00:
        this.lacing = BlockLacing.None
        break

      case 0x04:
        this.lacing = BlockLacing.Xiph
        break

      case 0x08:
        this.lacing = BlockLacing.EBML
        break

      case 0x0c:
        this.lacing = BlockLacing.FixedSize
        break
    }
    this.payload = data.slice(track.length + 3)
  }
}
