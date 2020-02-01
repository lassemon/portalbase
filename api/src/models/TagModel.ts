import Model from '@ruanmartinelli/knex-model'
import { IItemTagInsertQuery, ITagInsertQuery } from 'interfaces/requests'
import { IDBItemTag, IDBTag } from 'interfaces/tag'

export default class TagModel extends Model {
  constructor(options) {
    super(options)
  }

  public getAll(): Promise<IDBTag[]> {
    return this.knex('tags').select('*')
  }

  public findByItemId(itemId: number): Promise<IDBTag[]> {
    return this.knex('tags')
      .join('item_tag as item_tag', 'tags.id', 'item_tag.tag_id')
      .select('tags.*')
      .where('item_tag.item_id', itemId)
  }

  public findByIds(tagIds: number[]): Promise<IDBTag[]> {
    return this.knex('tags')
      .select('*')
      .where(builder => {
        builder.whereIn('id', tagIds)
      })
  }

  public insert(tag: ITagInsertQuery): Promise<IDBTag[]> {
    return this.knex('tags').insert(tag, '*')
  }

  public addToItem(tagItems: IItemTagInsertQuery[]): Promise<IDBItemTag[]> {
    return this.knex('item_tag').insert(tagItems, '*')
  }

  public remove(tagId: number): Promise<boolean> {
    return this.knex('tags')
      .where('id', tagId)
      .del()
      .then(result => {
        return !!result
      })
  }

  public removeAllFromItem(itemId: number): Promise<boolean> {
    return this.knex('item_tag')
      .where('item_id', itemId)
      .del()
      .then(result => {
        return !!result
      })
  }
}
