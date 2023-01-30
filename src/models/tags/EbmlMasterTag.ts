import { EbmlTag } from '../EbmlTag'
import { EbmlElementType } from '../enums/EbmlElementType'
import { EbmlTagPosition } from '../enums/EbmlTagPosition'
import { concatArrayBuffers, readHexString, readVint } from '../../tools'
import { EbmlTagFactory } from '../EbmlTagFactory'

export class EbmlMasterTag extends EbmlTag {
  private _children: EbmlTag[] = []
  get Children(): EbmlTag[] {
    return this._children
  }
  set Children(value: EbmlTag[]) {
    this._children = value
  }

  constructor(id: number, position: EbmlTagPosition = EbmlTagPosition.Content) {
    super(id, EbmlElementType.Master, position)
  }

  encodeContent(): ArrayBuffer {
    return concatArrayBuffers(...this._children.map((child) => child.encode()))
  }

  parseContent(content?: ArrayBuffer): void {
    while (content && content.byteLength > 0) {
      const tag = readVint(content)!
      const size = readVint(content, tag.length)!

      const tagIdHex = readHexString(content, 0, tag.length)
      const tagId = Number.parseInt(tagIdHex, 16)
      let tagObject = EbmlTagFactory.create(tagId)
      tagObject.size = size.value

      let totalTagLength = tag.length + size.length + size.value
      tagObject.parseContent(content.slice(tag.length + size.length, totalTagLength))
      this._children.push(tagObject)

      content = content.slice(totalTagLength)
    }
  }
}
