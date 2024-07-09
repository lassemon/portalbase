export interface ItemServiceInterface {
  itemExists: (itemId: string, userId: string) => Promise<boolean>
}

export default ItemServiceInterface
