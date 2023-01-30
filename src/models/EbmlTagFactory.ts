import { EbmlTagId } from './enums/EbmlTagId'
import { EbmlTag } from './EbmlTag'
import { EbmlMasterTag } from './tags/EbmlMasterTag'
import { EbmlDataTag } from './tags/EbmlDataTag'
import { Block } from './tags/Block'
import { SimpleBlock } from './tags/SimpleBlock'
import { EbmlElementType } from './enums/EbmlElementType'

export class EbmlTagFactory {
  static create(
    commonTagId:
      | EbmlTagId.ChapterDisplay
      | EbmlTagId.ContentCompression
      | EbmlTagId.ContentEncryption
      | EbmlTagId.SilentTracks
      | EbmlTagId.ContentEncoding
      | EbmlTagId.TrackTranslate
      | EbmlTagId.ChapProcessCommand
      | EbmlTagId.ChapterTranslate
      | EbmlTagId.ChapProcess
      | EbmlTagId.Tag
      | EbmlTagId.Segment
      | EbmlTagId.SimpleTag
      | EbmlTagId.Targets
      | EbmlTagId.Tags
      | EbmlTagId.ChapterTrack
      | EbmlTagId.ChapterAtom
      | EbmlTagId.EditionEntry
      | EbmlTagId.Chapters
      | EbmlTagId.AttachedFile
      | EbmlTagId.Attachments
      | EbmlTagId.CueReference
      | EbmlTagId.CueTrackPositions
      | EbmlTagId.CuePoint
      | EbmlTagId.Cues
      | EbmlTagId.ContentEncAESSettings
      | EbmlTagId.ContentEncodings
      | EbmlTagId.TrackJoinBlocks
      | EbmlTagId.TrackPlane
      | EbmlTagId.TrackCombinePlanes
      | EbmlTagId.TrackOperation
      | EbmlTagId.Audio
      | EbmlTagId.Video
      | EbmlTagId.TrackEntry
      | EbmlTagId.Tracks
      | EbmlTagId.ReferenceFrame
      | EbmlTagId.TimeSlice
      | EbmlTagId.Slices
      | EbmlTagId.BlockMore
      | EbmlTagId.BlockAdditions
      | EbmlTagId.BlockGroup
      | EbmlTagId.Cluster
      | EbmlTagId.Info
      | EbmlTagId.Seek
      | EbmlTagId.SeekHead
      | EbmlTagId.SignatureElementList
      | EbmlTagId.SignatureElements
      | EbmlTagId.SignatureSlot
      | EbmlTagId.EBML
  ): EbmlMasterTag

  static create(
    commonTagId:
      | EbmlTagId.TrackType
      | EbmlTagId.FlagDefault
      | EbmlTagId.ChapterTrackNumber
      | EbmlTagId.ChapterTimeStart
      | EbmlTagId.ChapterTimeEnd
      | EbmlTagId.CueRefTime
      | EbmlTagId.CueRefCluster
      | EbmlTagId.ChapterFlagHidden
      | EbmlTagId.ContentCompAlgo
      | EbmlTagId.DocTypeReadVersion
      | EbmlTagId.EBMLVersion
      | EbmlTagId.DocTypeVersion
      | EbmlTagId.TagDefault
      | EbmlTagId.ChapterFlagEnabled
      | EbmlTagId.FileUsedStartTime
      | EbmlTagId.FileUsedEndTime
      | EbmlTagId.ContentEncodingOrder
      | EbmlTagId.ContentEncodingScope
      | EbmlTagId.ContentEncodingType
      | EbmlTagId.CueBlockNumber
      | EbmlTagId.BitDepth
      | EbmlTagId.ChapProcessTime
      | EbmlTagId.ChapProcessCodecID
      | EbmlTagId.AttachmentLink
      | EbmlTagId.TagAttachmentUID
      | EbmlTagId.TagChapterUID
      | EbmlTagId.TagEditionUID
      | EbmlTagId.TagTrackUID
      | EbmlTagId.TargetTypeValue
      | EbmlTagId.ChapterPhysicalEquiv
      | EbmlTagId.ChapterSegmentEditionUID
      | EbmlTagId.ChapterUID
      | EbmlTagId.EditionFlagOrdered
      | EbmlTagId.EditionFlagDefault
      | EbmlTagId.EditionFlagHidden
      | EbmlTagId.EditionUID
      | EbmlTagId.FileUID
      | EbmlTagId.CueRefCodecState
      | EbmlTagId.CueRefNumber
      | EbmlTagId.CueCodecState
      | EbmlTagId.CueDuration
      | EbmlTagId.CueRelativePosition
      | EbmlTagId.CueClusterPosition
      | EbmlTagId.CueTrack
      | EbmlTagId.CueTime
      | EbmlTagId.AESSettingsCipherMode
      | EbmlTagId.ContentSigHashAlgo
      | EbmlTagId.ContentSigAlgo
      | EbmlTagId.ContentEncAlgo
      | EbmlTagId.TrickMasterTrackUID
      | EbmlTagId.TrickTrackFlag
      | EbmlTagId.TrickTrackUID
      | EbmlTagId.TrackJoinUID
      | EbmlTagId.TrackPlaneType
      | EbmlTagId.TrackPlaneUID
      | EbmlTagId.Channels
      | EbmlTagId.AspectRatioType
      | EbmlTagId.DisplayUnit
      | EbmlTagId.DisplayHeight
      | EbmlTagId.DisplayWidth
      | EbmlTagId.PixelCropRight
      | EbmlTagId.PixelCropLeft
      | EbmlTagId.PixelCropTop
      | EbmlTagId.PixelCropBottom
      | EbmlTagId.PixelHeight
      | EbmlTagId.PixelWidth
      | EbmlTagId.OldStereoMode
      | EbmlTagId.AlphaMode
      | EbmlTagId.StereoMode
      | EbmlTagId.FlagInterlaced
      | EbmlTagId.TrackTranslateCodec
      | EbmlTagId.TrackTranslateEditionUID
      | EbmlTagId.SeekPreRoll
      | EbmlTagId.CodecDelay
      | EbmlTagId.TrackOverlay
      | EbmlTagId.CodecDecodeAll
      | EbmlTagId.MaxBlockAdditionID
      | EbmlTagId.DefaultDecodedFieldDuration
      | EbmlTagId.DefaultDuration
      | EbmlTagId.MaxCache
      | EbmlTagId.MinCache
      | EbmlTagId.FlagLacing
      | EbmlTagId.FlagForced
      | EbmlTagId.FlagEnabled
      | EbmlTagId.TrackUID
      | EbmlTagId.TrackNumber
      | EbmlTagId.ReferenceTimeCode
      | EbmlTagId.ReferenceOffset
      | EbmlTagId.SliceDuration
      | EbmlTagId.Delay
      | EbmlTagId.BlockAdditionID
      | EbmlTagId.FrameNumber
      | EbmlTagId.LaceNumber
      | EbmlTagId.ReferencePriority
      | EbmlTagId.BlockDuration
      | EbmlTagId.BlockAddID
      | EbmlTagId.PrevSize
      | EbmlTagId.Position
      | EbmlTagId.SilentTrackNumber
      | EbmlTagId.Timecode
      | EbmlTagId.TimecodeScaleDenominator
      | EbmlTagId.TimecodeScale
      | EbmlTagId.ChapterTranslateCodec
      | EbmlTagId.ChapterTranslateEditionUID
      | EbmlTagId.SeekPosition
      | EbmlTagId.SignatureHash
      | EbmlTagId.SignatureAlgo
      | EbmlTagId.EBMLMaxSizeLength
      | EbmlTagId.EBMLMaxIDLength
      | EbmlTagId.EBMLReadVersion
      | EbmlTagId.TrackOffset
      | EbmlTagId.DiscardPadding
      | EbmlTagId.ReferenceVirtual
      | EbmlTagId.ReferenceBlock
      | EbmlTagId.CodecID
      | EbmlTagId.DocType
      | EbmlTagId.FileMimeType
      | EbmlTagId.TagLanguage
      | EbmlTagId.TargetType
      | EbmlTagId.ChapCountry
      | EbmlTagId.ChapLanguage
      | EbmlTagId.CodecDownloadURL
      | EbmlTagId.CodecInfoURL
      | EbmlTagId.Language
      | EbmlTagId.ChapString
      | EbmlTagId.TagString
      | EbmlTagId.ChapterStringUID
      | EbmlTagId.WritingApp
      | EbmlTagId.SegmentFilename
      | EbmlTagId.CodecName
      | EbmlTagId.TagName
      | EbmlTagId.FileName
      | EbmlTagId.FileDescription
      | EbmlTagId.CodecSettings
      | EbmlTagId.Name
      | EbmlTagId.MuxingApp
      | EbmlTagId.Title
      | EbmlTagId.NextFilename
      | EbmlTagId.PrevFilename
      | EbmlTagId.ContentCompSettings
      | EbmlTagId.SegmentFamily
      | EbmlTagId.TagBinary
      | EbmlTagId.FileReferral
      | EbmlTagId.SignedElement
      | EbmlTagId.ChapProcessData
      | EbmlTagId.ChapProcessPrivate
      | EbmlTagId.ChapterSegmentUID
      | EbmlTagId.FileData
      | EbmlTagId.ContentSigKeyID
      | EbmlTagId.ContentSignature
      | EbmlTagId.ContentEncKeyID
      | EbmlTagId.TrickMasterTrackSegmentUID
      | EbmlTagId.TrickTrackSegmentUID
      | EbmlTagId.ChannelPositions
      | EbmlTagId.ColourSpace
      | EbmlTagId.TrackTranslateTrackID
      | EbmlTagId.CodecPrivate
      | EbmlTagId.EncryptedBlock
      | EbmlTagId.CodecState
      | EbmlTagId.BlockAdditional
      | EbmlTagId.BlockVirtual
      | EbmlTagId.ChapterTranslateID
      | EbmlTagId.NextUID
      | EbmlTagId.PrevUID
      | EbmlTagId.SegmentUID
      | EbmlTagId.SeekID
      | EbmlTagId.Signature
      | EbmlTagId.SignaturePublicKey
      | EbmlTagId.CRC32
      | EbmlTagId.Void
      | EbmlTagId.Duration
      | EbmlTagId.OutputSamplingFrequency
      | EbmlTagId.SamplingFrequency
      | EbmlTagId.FrameRate
      | EbmlTagId.GammaValue
      | EbmlTagId.TrackTimecodeScale
      | EbmlTagId.DateUTC
  ): EbmlDataTag

  static create(commonTagId: EbmlTagId.Block): Block
  static create(commonTagId: EbmlTagId.SimpleBlock): SimpleBlock

  static create(id: number | EbmlTagId, type?: EbmlElementType): EbmlTag {
    if (EbmlTagId[id] !== undefined) {
      let foundType: EbmlElementType
      switch (id) {
        case EbmlTagId.Block:
          return new Block()
        case EbmlTagId.SimpleBlock:
          return new SimpleBlock()
        case EbmlTagId.ChapterDisplay:
        case EbmlTagId.ContentCompression:
        case EbmlTagId.ContentEncryption:
        case EbmlTagId.SilentTracks:
        case EbmlTagId.ContentEncoding:
        case EbmlTagId.TrackTranslate:
        case EbmlTagId.ChapProcessCommand:
        case EbmlTagId.ChapterTranslate:
        case EbmlTagId.ChapProcess:
        case EbmlTagId.Tag:
        case EbmlTagId.Segment:
        case EbmlTagId.SimpleTag:
        case EbmlTagId.Targets:
        case EbmlTagId.Tags:
        case EbmlTagId.ChapterTrack:
        case EbmlTagId.ChapterAtom:
        case EbmlTagId.EditionEntry:
        case EbmlTagId.Chapters:
        case EbmlTagId.AttachedFile:
        case EbmlTagId.Attachments:
        case EbmlTagId.CueReference:
        case EbmlTagId.CueTrackPositions:
        case EbmlTagId.CuePoint:
        case EbmlTagId.Cues:
        case EbmlTagId.ContentEncAESSettings:
        case EbmlTagId.ContentEncodings:
        case EbmlTagId.TrackJoinBlocks:
        case EbmlTagId.TrackPlane:
        case EbmlTagId.TrackCombinePlanes:
        case EbmlTagId.TrackOperation:
        case EbmlTagId.Audio:
        case EbmlTagId.Video:
        case EbmlTagId.TrackEntry:
        case EbmlTagId.Tracks:
        case EbmlTagId.ReferenceFrame:
        case EbmlTagId.TimeSlice:
        case EbmlTagId.Slices:
        case EbmlTagId.BlockMore:
        case EbmlTagId.BlockAdditions:
        case EbmlTagId.BlockGroup:
        case EbmlTagId.Cluster:
        case EbmlTagId.Info:
        case EbmlTagId.Seek:
        case EbmlTagId.SeekHead:
        case EbmlTagId.SignatureElementList:
        case EbmlTagId.SignatureElements:
        case EbmlTagId.SignatureSlot:
        case EbmlTagId.EBML:
          foundType = EbmlElementType.Master
          break
        case EbmlTagId.TrackType:
        case EbmlTagId.FlagDefault:
        case EbmlTagId.ChapterTrackNumber:
        case EbmlTagId.ChapterTimeStart:
        case EbmlTagId.ChapterTimeEnd:
        case EbmlTagId.CueRefTime:
        case EbmlTagId.CueRefCluster:
        case EbmlTagId.ChapterFlagHidden:
        case EbmlTagId.ContentCompAlgo:
        case EbmlTagId.DocTypeReadVersion:
        case EbmlTagId.EBMLVersion:
        case EbmlTagId.DocTypeVersion:
        case EbmlTagId.TagDefault:
        case EbmlTagId.ChapterFlagEnabled:
        case EbmlTagId.FileUsedStartTime:
        case EbmlTagId.FileUsedEndTime:
        case EbmlTagId.ContentEncodingOrder:
        case EbmlTagId.ContentEncodingScope:
        case EbmlTagId.ContentEncodingType:
        case EbmlTagId.CueBlockNumber:
        case EbmlTagId.BitDepth:
        case EbmlTagId.ChapProcessTime:
        case EbmlTagId.ChapProcessCodecID:
        case EbmlTagId.AttachmentLink:
        case EbmlTagId.TagAttachmentUID:
        case EbmlTagId.TagChapterUID:
        case EbmlTagId.TagEditionUID:
        case EbmlTagId.TagTrackUID:
        case EbmlTagId.TargetTypeValue:
        case EbmlTagId.ChapterPhysicalEquiv:
        case EbmlTagId.ChapterSegmentEditionUID:
        case EbmlTagId.ChapterUID:
        case EbmlTagId.EditionFlagOrdered:
        case EbmlTagId.EditionFlagDefault:
        case EbmlTagId.EditionFlagHidden:
        case EbmlTagId.EditionUID:
        case EbmlTagId.FileUID:
        case EbmlTagId.CueRefCodecState:
        case EbmlTagId.CueRefNumber:
        case EbmlTagId.CueCodecState:
        case EbmlTagId.CueDuration:
        case EbmlTagId.CueRelativePosition:
        case EbmlTagId.CueClusterPosition:
        case EbmlTagId.CueTrack:
        case EbmlTagId.CueTime:
        case EbmlTagId.AESSettingsCipherMode:
        case EbmlTagId.ContentSigHashAlgo:
        case EbmlTagId.ContentSigAlgo:
        case EbmlTagId.ContentEncAlgo:
        case EbmlTagId.TrickMasterTrackUID:
        case EbmlTagId.TrickTrackFlag:
        case EbmlTagId.TrickTrackUID:
        case EbmlTagId.TrackJoinUID:
        case EbmlTagId.TrackPlaneType:
        case EbmlTagId.TrackPlaneUID:
        case EbmlTagId.Channels:
        case EbmlTagId.AspectRatioType:
        case EbmlTagId.DisplayUnit:
        case EbmlTagId.DisplayHeight:
        case EbmlTagId.DisplayWidth:
        case EbmlTagId.PixelCropRight:
        case EbmlTagId.PixelCropLeft:
        case EbmlTagId.PixelCropTop:
        case EbmlTagId.PixelCropBottom:
        case EbmlTagId.PixelHeight:
        case EbmlTagId.PixelWidth:
        case EbmlTagId.OldStereoMode:
        case EbmlTagId.AlphaMode:
        case EbmlTagId.StereoMode:
        case EbmlTagId.FlagInterlaced:
        case EbmlTagId.TrackTranslateCodec:
        case EbmlTagId.TrackTranslateEditionUID:
        case EbmlTagId.SeekPreRoll:
        case EbmlTagId.CodecDelay:
        case EbmlTagId.TrackOverlay:
        case EbmlTagId.CodecDecodeAll:
        case EbmlTagId.MaxBlockAdditionID:
        case EbmlTagId.DefaultDecodedFieldDuration:
        case EbmlTagId.DefaultDuration:
        case EbmlTagId.MaxCache:
        case EbmlTagId.MinCache:
        case EbmlTagId.FlagLacing:
        case EbmlTagId.FlagForced:
        case EbmlTagId.FlagEnabled:
        case EbmlTagId.TrackUID:
        case EbmlTagId.TrackNumber:
        case EbmlTagId.ReferenceTimeCode:
        case EbmlTagId.ReferenceOffset:
        case EbmlTagId.SliceDuration:
        case EbmlTagId.Delay:
        case EbmlTagId.BlockAdditionID:
        case EbmlTagId.FrameNumber:
        case EbmlTagId.LaceNumber:
        case EbmlTagId.ReferencePriority:
        case EbmlTagId.BlockDuration:
        case EbmlTagId.BlockAddID:
        case EbmlTagId.PrevSize:
        case EbmlTagId.Position:
        case EbmlTagId.SilentTrackNumber:
        case EbmlTagId.Timecode:
        case EbmlTagId.TimecodeScaleDenominator:
        case EbmlTagId.TimecodeScale:
        case EbmlTagId.ChapterTranslateCodec:
        case EbmlTagId.ChapterTranslateEditionUID:
        case EbmlTagId.SeekPosition:
        case EbmlTagId.SignatureHash:
        case EbmlTagId.SignatureAlgo:
        case EbmlTagId.EBMLMaxSizeLength:
        case EbmlTagId.EBMLMaxIDLength:
        case EbmlTagId.EBMLReadVersion:
          foundType = EbmlElementType.UnsignedInt
          break
        case EbmlTagId.TrackOffset:
        case EbmlTagId.DiscardPadding:
        case EbmlTagId.ReferenceVirtual:
        case EbmlTagId.ReferenceBlock:
          foundType = EbmlElementType.Integer
          break
        case EbmlTagId.CodecID:
        case EbmlTagId.DocType:
        case EbmlTagId.FileMimeType:
        case EbmlTagId.TagLanguage:
        case EbmlTagId.TargetType:
        case EbmlTagId.ChapCountry:
        case EbmlTagId.ChapLanguage:
        case EbmlTagId.CodecDownloadURL:
        case EbmlTagId.CodecInfoURL:
        case EbmlTagId.Language:
          foundType = EbmlElementType.String
          break
        case EbmlTagId.ChapString:
        case EbmlTagId.TagString:
        case EbmlTagId.ChapterStringUID:
        case EbmlTagId.WritingApp:
        case EbmlTagId.SegmentFilename:
        case EbmlTagId.CodecName:
        case EbmlTagId.TagName:
        case EbmlTagId.FileName:
        case EbmlTagId.FileDescription:
        case EbmlTagId.CodecSettings:
        case EbmlTagId.Name:
        case EbmlTagId.MuxingApp:
        case EbmlTagId.Title:
        case EbmlTagId.NextFilename:
        case EbmlTagId.PrevFilename:
          foundType = EbmlElementType.UTF8
          break
        case EbmlTagId.ContentCompSettings:
        case EbmlTagId.SegmentFamily:
        case EbmlTagId.TagBinary:
        case EbmlTagId.FileReferral:
        case EbmlTagId.SignedElement:
        case EbmlTagId.ChapProcessData:
        case EbmlTagId.ChapProcessPrivate:
        case EbmlTagId.ChapterSegmentUID:
        case EbmlTagId.FileData:
        case EbmlTagId.ContentSigKeyID:
        case EbmlTagId.ContentSignature:
        case EbmlTagId.ContentEncKeyID:
        case EbmlTagId.TrickMasterTrackSegmentUID:
        case EbmlTagId.TrickTrackSegmentUID:
        case EbmlTagId.ChannelPositions:
        case EbmlTagId.ColourSpace:
        case EbmlTagId.TrackTranslateTrackID:
        case EbmlTagId.CodecPrivate:
        case EbmlTagId.EncryptedBlock:
        case EbmlTagId.CodecState:
        case EbmlTagId.BlockAdditional:
        case EbmlTagId.BlockVirtual:
        case EbmlTagId.ChapterTranslateID:
        case EbmlTagId.NextUID:
        case EbmlTagId.PrevUID:
        case EbmlTagId.SegmentUID:
        case EbmlTagId.SeekID:
        case EbmlTagId.Signature:
        case EbmlTagId.SignaturePublicKey:
        case EbmlTagId.CRC32:
        case EbmlTagId.Void:
          foundType = EbmlElementType.Binary
          break
        case EbmlTagId.Duration:
        case EbmlTagId.OutputSamplingFrequency:
        case EbmlTagId.SamplingFrequency:
        case EbmlTagId.FrameRate:
        case EbmlTagId.GammaValue:
        case EbmlTagId.TrackTimecodeScale:
          foundType = EbmlElementType.Float
          break
        case EbmlTagId.DateUTC:
          foundType = EbmlElementType.Date
          break
      }

      if (type === undefined) {
        type = foundType!
      }
      else if (type !== foundType!) {
        throw new Error(
          `Trying to create tag of well-known type "${EbmlTagId[id]}" using content type "${type}" (which is incorrect).  Either pass the correct type or ignore the type parameter to EbmlTag.create()`
        )
      }
    }

    switch (type) {
      case EbmlElementType.Master:
        return new EbmlMasterTag(id)
      case EbmlElementType.UTF8:
      case EbmlElementType.Binary:
      case EbmlElementType.Date:
      case EbmlElementType.Float:
      case EbmlElementType.Integer:
      case EbmlElementType.String:
      case EbmlElementType.UnsignedInt:
      default:
        return new EbmlDataTag(id, type!)
    }
  }
}
