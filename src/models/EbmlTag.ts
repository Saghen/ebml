import { EbmlTagPosition } from './enums/EbmlTagPosition'
import { EbmlTagId } from './enums/EbmlTagId'
import { EbmlElementType } from './enums/EbmlElementType'
import { concatArrayBuffers, hexStringToBuf, writeVint } from '../tools'

export abstract class EbmlTag {
  size: number = 0

  constructor(public id: number, public type: EbmlElementType, public position: EbmlTagPosition) {}

  protected abstract encodeContent(): ArrayBuffer

  public abstract parseContent(content: ArrayBuffer): void

  private getTagDeclaration(): ArrayBuffer {
    let tagHex = this.id.toString(16)
    if (tagHex.length % 2 !== 0) {
      tagHex = `0${tagHex}`
    }
    return hexStringToBuf(tagHex)
  }

  public encode(): ArrayBuffer {
    const content = this.encodeContent()

    if (this.size === -1) {
      const vintSize = hexStringToBuf('01ffffffffffffff')
      return concatArrayBuffers(this.getTagDeclaration(), vintSize, content)
    }
    const isSegment = this.id === EbmlTagId.Segment
    const isCluster = this.id === EbmlTagId.Cluster
    const specialLength: number = isSegment || isCluster ? 8 : 0
    const vintSize = writeVint(content.byteLength, specialLength)

    return concatArrayBuffers(this.getTagDeclaration(), vintSize, content)
  }
}
