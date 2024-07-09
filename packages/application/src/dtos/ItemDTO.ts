import DTO from './DTO'
import { ItemResponse, ItemUpdateRequest } from '../interfaces/http/Item'
import _, { capitalize } from 'lodash'

type ItemProperties = ItemResponse
export class ItemDTO extends DTO<ItemDTO, ItemProperties> {
  constructor(item: ItemProperties) {
    super({ ...item })
  }

  public get id() {
    return this._properties.id
  }
  public set id(value) {
    this._properties.id = value
  }

  public get url() {
    return this._properties.url
  }
  public set url(value) {
    this._properties.url = value
  }

  public get imageId() {
    return this._properties.imageId
  }
  public set imageId(value) {
    this._properties.imageId = value
  }

  public get name() {
    return this._properties.name
  }
  public set name(value) {
    this._properties.name = value
  }

  public get visibility() {
    return this._properties.visibility
  }
  public get visibility_label() {
    return this._properties.visibility
      ?.replaceAll('_', ' ')
      ?.split(' ')
      ?.map((part) => capitalize(part))
      ?.join(' ')
  }

  public set visibility(value) {
    this._properties.visibility = value
  }

  public get createdBy() {
    return this._properties.createdBy
  }
  public set createdBy(value) {
    this._properties.createdBy = value
  }

  public get createdByUserName() {
    return this._properties.createdByUserName || ''
  }
  public getCreatedByUserName(userId?: string) {
    if (userId && this._properties.createdByUserName && userId === this._properties.createdBy) {
      return `${this._properties.createdByUserName} (You)`
    }
    return this._properties.createdByUserName || ''
  }

  get createdAt() {
    return this._properties.createdAt
  }
  public set createdAt(value) {
    this._properties.createdAt = value
  }

  get updatedAt() {
    return this._properties.updatedAt
  }
  public set updatedAt(value) {
    this._properties.updatedAt = value
  }

  public clone(attributes?: Partial<ItemProperties>) {
    if (attributes) {
      const cloneAttrs = {
        ...this.toJSON(),
        ...attributes
      }
      return new ItemDTO(cloneAttrs)
    } else {
      return new ItemDTO({ ...this.toJSON() })
    }
  }

  isEqual(otherItem: ItemDTO | object | null): boolean {
    if (otherItem === null || _.isEmpty(otherItem)) {
      return false
    }
    return (
      JSON.stringify(_.omit(this.toJSON(), 'updatedAt')) ===
      JSON.stringify(_.omit((otherItem as ItemDTO)?.toJSON() || otherItem, 'updatedAt'))
    )
  }

  toJSON(): ItemProperties {
    return _.cloneDeep(this._properties)
  }

  toUpdateRequestItemJSON(): ItemUpdateRequest['item'] {
    return _.omit(this._properties as ItemUpdateRequest['item'], 'createdByUserName')
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }
}

export default ItemDTO
