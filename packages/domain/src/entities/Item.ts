import { Entity } from './Entity'

export interface Item extends Entity {
  imageId: string | null
  name: string
  description: string
}

export const ItemSortableKeys = ['name', 'visibility', 'createdBy', 'source', 'createdAt', 'updatedAt']
