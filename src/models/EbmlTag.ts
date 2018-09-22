import { EbmlTagPosition } from "./EbmlTagPosition";
import { EbmlTagId } from "./EbmlTagId";
import { EbmlElementType } from "./EbmlElementType";
import { Tools } from "../tools";

export abstract class EbmlTag {
    
    size: number;

    // level: number;
    // minver: number;
    // description: string;

    constructor(
        public id: number,
        public type: EbmlElementType,
        public position: EbmlTagPosition
    ) {
    }

    abstract encodeContent(): Buffer;

    abstract parseContent(content: Buffer): void;

    protected getTagDeclaration(): Buffer {
        let tagHex = this.id.toString(16);
        if(tagHex.length%2!==0) {
            tagHex = `0${tagHex}`;
        }
        return Buffer.from(tagHex, 'hex');
    }

    public encode(): Buffer {
        let vintSize = null;
        let content = this.encodeContent();

        if(this.size === -1) {
            vintSize = Buffer.from('01ffffffffffffff', 'hex');
        } else {
            let specialLength: number = undefined;
            if([
                EbmlTagId.Segment,
                EbmlTagId.Cluster
            ].some(i => i === this.id)) {
                specialLength = 8;
            }
            vintSize = Tools.writeVint(content.length, specialLength);
        }
        
        return Buffer.concat([
            this.getTagDeclaration(),
            vintSize,
            content
        ]);
    }
}