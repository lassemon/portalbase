import connection from '../database/connection'
import { ApiError, UnknownError, Visibility } from '@portalbase/domain'
import { Order, unixtimeNow, uuid } from '@portalbase/common'
import { Logger } from '@portalbase/common'
import {
  DBItem,
  DatabaseItemRepositoryInterface,
  ITEM_DEFAULTS,
  ItemDBResponse,
  ItemInsertQuery,
  ItemUpdateQuery,
  ItemResponse,
  ItemSearchQuery
} from '@portalbase/application'
import { omit } from 'lodash'
import { Knex } from 'knex'
import { ItemSortableKeys } from '@portalbase/domain'

const logger = new Logger('ItemRepository')

const withAccess =
  (userId?: string, visibility?: `${Visibility}`[], onlyMyItems: boolean = false) =>
  (queryBuilder: Knex.QueryBuilder) => {
    const visibilityFilterIsSet = visibility?.length && visibility?.length > 0
    // double equals (==) to cover for both null and undefined
    if (userId == null) {
      queryBuilder.where({ 'items.visibility': 'public' }) // only public items
    } else {
      if (onlyMyItems === true) {
        queryBuilder.where({ 'items.createdBy': userId }) // only items created by the user
        if (visibilityFilterIsSet) {
          queryBuilder.whereIn('items.visibility', visibility)
        }
      } else {
        if (visibilityFilterIsSet) {
          queryBuilder.whereIn('items.visibility', visibility).andWhere((queryBuilder: Knex.QueryBuilder) => {
            queryBuilder.where({ 'items.createdBy': userId }).orWhereNot({ 'items.visibility': 'private' })
          })
        } else {
          // all users own items and all other items except private items of other users
          queryBuilder.andWhere((_queryBuilder) => {
            _queryBuilder.where({ 'items.createdBy': userId }).orWhereNot({ 'items.visibility': 'private' })
          })
        }
      }
    }
  }

const withOrderBy = (orderBy: (typeof ItemSortableKeys)[number], order: `${Order}`) => (queryBuilder: Knex.QueryBuilder) => {
  if (orderBy) {
    const _orderBy = ItemSortableKeys.includes(orderBy) ? orderBy : 'name'
    const _order = order === Order.ASCENDING || order === Order.DESCENDING ? order : Order.ASCENDING
    switch (orderBy) {
      case 'createdBy':
        queryBuilder.orderBy(`createdByUserName`, _order)
        break
      case 'name':
      case 'visibility':
        queryBuilder.orderBy(`items.${_orderBy}`, _order)
        break
      default:
        queryBuilder.orderBy(`items.${_orderBy}`, _order)
        break
    }
  }
}

const withHasImage = (hasImage?: boolean | null) => (queryBuilder: Knex.QueryBuilder) => {
  if (hasImage === true || hasImage === false) {
    hasImage ? queryBuilder.whereNot('items.imageId', null) : queryBuilder.where('items.imageId', null)
  }
}

const withWordSearch = (wordSearch?: string) => (queryBuilder: Knex.QueryBuilder) => {
  if (wordSearch) {
    queryBuilder.andWhere(function (_queryBuilder) {
      _queryBuilder.whereILike('items.name', `%${wordSearch}%`)
      _queryBuilder.orWhereILike('items.shortDescription', `%${wordSearch}%`)
      _queryBuilder.orWhereILike('items.mainDescription', `%${wordSearch}%`)
    })
  }
}

class ItemRepository implements DatabaseItemRepositoryInterface {
  async getAllPublic(orderBy: string, order: `${Order}`): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public'])
        .modify<any, ItemDBResponse[]>(withOrderBy(orderBy, order))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getLatest(limit: number, loggedIn: boolean): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', [...(loggedIn ? [Visibility.LOGGED_IN] : []), Visibility.PUBLIC])
        .modify<any, ItemDBResponse[]>(withOrderBy('createdAt', Order.DESCENDING))
        .limit(limit || 5)
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async countAll(userId?: string): Promise<number> {
    const result = await connection('items')
      .whereNotIn('visibility', userId ? ['private'] : ['private', 'logged_in'])
      .count<{ count: number }>('id as count') // Count the number of item ids
      .first() // Use .first() to get the first row of the result
    return result ? result.count : 0
  }

  async count(query: Omit<ItemSearchQuery, 'order' | 'orderBy'>): Promise<number> {
    const result = await connection('items')
      .modify<any, ItemDBResponse[]>(withAccess(query.userId, query.visibility, query.onlyMyItems))
      .modify<any, ItemDBResponse[]>(withHasImage(query.hasImage))
      .modify<any, ItemDBResponse[]>(withWordSearch(query.search))
      .count<{ count: number }>('id as count')
      .first()
    return result ? result.count : 0
  }

  async search(query: ItemSearchQuery) {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from('items')
        .modify<any, ItemDBResponse[]>(withAccess(query.userId, query.visibility, query.onlyMyItems))
        .modify<any, ItemDBResponse[]>(withHasImage(query.hasImage))
        .modify<any, ItemDBResponse[]>(withWordSearch(query.search))
        .modify<any, ItemDBResponse[]>(withOrderBy(query.orderBy, query.order))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getByImageId(imageId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where({ imageId })
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getAllVisibleForLoggedInUser(userId: string, orderBy: string, order: `${Order}`): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .whereIn('visibility', ['public', 'logged_in'])
        .orWhere('items.createdBy', userId)
        .modify<any, ItemDBResponse[]>(withOrderBy(orderBy, order))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getAllForUser(userId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where('items.createdBy', userId)
        .modify<any, ItemDBResponse[]>(withOrderBy('name', 'asc'))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async getUserItemsByName(itemName: string, userId: string): Promise<ItemResponse[]> {
    return (
      await connection
        .join('users', 'items.createdBy', '=', 'users.id')
        .select('items.*', 'users.name as createdByUserName')
        .from<any, ItemDBResponse[]>('items')
        .where({ createdBy: userId })
        .whereLike('items.name', `${itemName}%`)
        .modify<any, ItemDBResponse[]>(withOrderBy('name', 'asc'))
    ).map((item) => {
      return this.parseDBItemJSON(item)
    })
  }

  async countItemsCreatedByUser(userId: string): Promise<number> {
    const result = await connection('items')
      .count<{ count: number }>('id as count') // Count the number of item ids
      .where('createdBy', userId) // Apply the condition
      .first() // Use .first() to get the first row of the result
    return result ? result.count : 0
  }

  async getById(itemId: string): Promise<ItemResponse> {
    const item = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse>('items')
      .where('items.id', itemId)
      .first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `Item was not found. ( ${itemId} )`)
    }

    return this.parseDBItemJSON(item)
  }

  async create(item: ItemInsertQuery, userId: string) {
    const itemToInsert: DBItem = this.constructItemToInsertFromQuery(item, userId)
    try {
      await connection<any, DBItem>('items').insert(itemToInsert) // mariadb does not return inserted object
    } catch (error: any) {
      logger.error((error as any)?.message, error.stack ? error.stack : error)
      throw new UnknownError(500, 'UnknownError')
    }

    return this.parseDBItemJSON(await this.getByIdRAW(itemToInsert.id))
  }

  async update(item: ItemUpdateQuery) {
    const itemUpdate = this.constructItemToUpdateFromQuery(item)
    try {
      // TODO use update here instead of insert
      // need to create separate POST and PUT into ItemController
      await connection<any, DBItem>('items').where('id', item.id).update(itemUpdate) // mariadb does not return inserted object
    } catch (error: any) {
      logger.error((error as any)?.message, error.stack ? error.stack : error)
      throw new UnknownError(500, 'UnknownError')
    }

    return this.parseDBItemJSON(await this.getByIdRAW(itemUpdate.id))
  }

  async delete(itemId: string) {
    try {
      await connection<any, DBItem>('items').where('id', itemId).delete()
    } catch (error: any) {
      logger.error((error as any)?.message, error.stack ? error.stack : error)
      throw new UnknownError(500, 'UnknownError')
    }
  }

  // RAW in this case means without converting the stringified json data into json
  private async getByIdRAW(itemId: string): Promise<ItemDBResponse> {
    const item = await connection
      .join('users', 'items.createdBy', '=', 'users.id')
      .select('items.*', 'users.name as createdByUserName')
      .from<any, ItemDBResponse>('items')
      .where('items.id', itemId)
      .first()
    if (!item) {
      throw new ApiError(404, 'NotFound', `RAW Item was not found. ( ${itemId} )`)
    }

    return item
  }

  private parseDBItemJSON = (dbItem: ItemDBResponse): ItemResponse => {
    return {
      ...dbItem
    }
  }

  private constructItemToInsertFromQuery = (insertQuery: ItemInsertQuery, userId: string): DBItem => {
    const updatedAt = unixtimeNow()
    return {
      ...omit(insertQuery, 'createdByUserName'),
      id: insertQuery.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : insertQuery.id, // don't allow overwriting of the default item
      imageId: insertQuery.imageId,
      createdBy: userId,
      createdAt: updatedAt,
      updatedAt: updatedAt
    }
  }

  private constructItemToUpdateFromQuery = (item: ItemUpdateQuery): Partial<DBItem> & { id: string } => {
    const updatedAt = unixtimeNow()
    return {
      ...omit(item, 'createdByUserName', 'source', 'createdAt'),
      id: item.id === ITEM_DEFAULTS.DEFAULT_ITEM_ID ? uuid() : item.id, // don't allow overwriting of the default item
      imageId: item.imageId,
      updatedAt: updatedAt
    }
  }
}

export default ItemRepository
