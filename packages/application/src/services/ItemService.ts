import ItemServiceInterface from './ItemServiceInterface'
import { DatabaseItemRepositoryInterface } from '../repositories/ItemRepositoryInterface'
import { find, isEmpty } from 'lodash'

export class ItemService implements ItemServiceInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}

  async itemExists(itemId: string, userId: string) {
    const allUsersItems = await this.itemRepository.getAllForUser(userId)
    return !!find(allUsersItems, { id: itemId })
  }

  async itemWithNameExistsForUser(itemId: string, itemName: string, userId: string) {
    const allItemsOfUser = await this.itemRepository.getAllForUser(userId)
    const allItemsWithSameName = allItemsOfUser.filter((item) => item.name === itemName)
    const updatingExistingItem = !!find(allItemsWithSameName, { id: itemId })
    const itemWithSameNameExists = !isEmpty(allItemsWithSameName)
    return !updatingExistingItem && itemWithSameNameExists
  }
}
