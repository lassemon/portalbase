import { DatabaseItemRepositoryInterface, UseCaseInterface, UseCaseOptionsInterface } from '@portalbase/application'
import { ApiError, Image, Item } from '@portalbase/domain'
import { SaveImageUseCase } from './SaveImageUseCase'

import _ from 'lodash'

interface SaveItemUseCaseBody {
  userId: string
  item: Item
  image: Image | null
}

interface SaveItemUseCaseResponse extends Omit<SaveItemUseCaseBody, 'userId'> {}

export interface SaveItemUseCaseOptions extends UseCaseOptionsInterface, SaveItemUseCaseBody {}

export type SaveItemUseCaseInterface = UseCaseInterface<SaveItemUseCaseOptions, SaveItemUseCaseResponse>

//TODO, make this to be only used in PUT and make a CreateItemUseCase separately
export class SaveItemUseCase implements SaveItemUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface, private readonly saveImageUseCase: SaveImageUseCase) {}
  async execute({ userId, item, image, unknownError, invalidArgument }: SaveItemUseCaseOptions): Promise<SaveItemUseCaseResponse> {
    // To keep things as simple as possible, saving image and item always togeher
    // First removing old image, whether item is new or updated, the old image is redundant

    let existingItem = null
    try {
      existingItem = await this.itemRepository.getById(item.id)
    } catch (error) {
      // silently fail for not finding existing items
    }

    if (!existingItem) {
      throw new ApiError(405, 'MethodNotAllowed', 'Cannot update a non-existing item')
    }

    // clearing image in all item create/update cases and uploading a new image to replace one
    // if the request has one. This ensures images will be cleaned from the backend
    // if user removes them from the item in the UI
    //await this.removeImageFromItemUseCase.execute({ itemId: item.id, userId, unknownError, invalidArgument })
    let savedImage = null
    if (image) {
      image.metadata.fileName = item.id.replaceAll(' ', '').toLowerCase()
      savedImage = await this.saveImageUseCase.execute({ image, unknownError, invalidArgument })
    }

    let savedItem = null

    savedItem = await this.itemRepository.update({
      ...this.convertItemToSave(item),
      ...(savedImage ? { imageId: savedImage.metadata.id } : {})
    })

    return {
      item: savedItem,
      image: savedImage
    }
  }

  private convertItemToSave = (item: Item) => {
    return {
      ...item,
      name: item.name
        .split(' ')
        .map((namepart) => _.capitalize(namepart))
        .join(' ')
    }
  }
}
