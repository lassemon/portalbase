import { ImageMetadata } from '@portalbase/domain'

export interface ImageServiceInterface {
  convertBase64ImageToBuffer: (base64ImageData: string) => Buffer
  convertBufferToBase64Image: (imageBuffer: Buffer, metadata: ImageMetadata) => string
  parseImageFilename: (metadata: ImageMetadata) => string
}

export default ImageServiceInterface
