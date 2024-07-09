import { Order } from '@portalbase/common'
import { Item, Image, Visibility } from '@portalbase/domain'
import { ItemSortableKeys } from '@portalbase/domain'

export interface DBItem extends Item {}
export interface ItemDBResponse extends DBItem {
  createdByUserName: string
}

export type ItemResponse = Item & {
  createdByUserName: string
  url?: string
}

export interface ItemUpdateRequest {
  item: Item
  image: Image | null
}

export interface ItemUpdateResponse {
  item: ItemResponse
  image: Image | null
}

export type ItemInsertQuery = Item
export type ItemUpdateQuery = Partial<Item> & { id: string }

export interface ItemSearchQuery {
  order: `${Order}`
  orderBy: (typeof ItemSortableKeys)[number]
  itemsPerPage?: number
  pageNumber?: number
  userId?: string
  onlyMyItems?: boolean
  search?: string
  visibility?: `${Visibility}`[]
  hasImage?: boolean | null
}

export interface ItemCountQuery extends Omit<ItemSearchQuery, 'order' | 'orderBy'> {}

export interface ItemSearchRequest {
  itemsPerPage?: number
  pageNumber?: number
  onlyMyItems?: boolean
  order: `${Order}`
  orderBy: (typeof ItemSortableKeys)[number]
  search?: string
  visibility?: `${Visibility}`[]
  hasImage?: boolean | null
}

export interface ItemSearchResponse {
  items: ItemResponse[]
  totalCount: number
}
