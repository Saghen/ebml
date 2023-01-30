import { EbmlTag } from '../EbmlTag'
import { EbmlElementType } from '../enums/EbmlElementType'
import {
  readFloat,
  readSigned,
  readUnsigned,
  readUtf8,
  writeFloat,
  writeSigned,
  writeUnsigned,
} from '../../tools'
import { EbmlTagPosition } from '../enums/EbmlTagPosition'

export class EbmlDataTag extends EbmlTag {
  data: any

  constructor(id: number, type: EbmlElementType) {
    super(id, type, EbmlTagPosition.Content)
  }

  parseContent(data: ArrayBuffer): void {
    switch (this.type) {
      case EbmlElementType.UnsignedInt:
        this.data = readUnsigned(data)
        break
      case EbmlElementType.Float:
        this.data = readFloat(data)
        break
      case EbmlElementType.Integer:
        this.data = readSigned(data)
        break
      case EbmlElementType.String:
        this.data = String.fromCharCode(...new Uint8Array(data))
        break
      case EbmlElementType.UTF8:
        this.data = readUtf8(data)
        break
      default:
        this.data = data
        break
    }
  }

  encodeContent(): ArrayBuffer {
    switch (this.type) {
      case EbmlElementType.UnsignedInt:
        return writeUnsigned(<number>this.data)
      case EbmlElementType.Float:
        return writeFloat(<number>this.data)
      case EbmlElementType.Integer:
        return writeSigned(<number>this.data)
      case EbmlElementType.String:
        // TODO: Buffer.from(this.data, 'ascii') WTF DOES THAT EVEN MEAN?
        return new Uint8Array(this.data)
      case EbmlElementType.UTF8:
        return new Uint8Array(this.data)
      case EbmlElementType.Binary:
      default:
        return this.data
    }
  }
}
