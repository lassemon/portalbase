import {
  FetchOptions,
  HttpItemRepositoryInterface,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemUpdateResponse
} from '@portalbase/application'
import { Image, Item } from '@portalbase/domain'
import { jsonToQueryString } from '@portalbase/infrastructure'
import { deleteJson, getJson, putJson } from 'infrastructure/dataAccess/http/fetch'
import _ from 'lodash'

export class HttpItemRepository implements HttpItemRepositoryInterface {
  async getAll(options: FetchOptions = {}): Promise<ItemSearchResponse> {
    return await getJson<ItemSearchResponse>({ ...{ endpoint: `/items` }, ...options })
  }

  async getAllForUser(options: FetchOptions = {}): Promise<ItemResponse[]> {
    return await getJson<ItemResponse[]>({ ...{ endpoint: `/myitems` }, ...options })
  }

  async search(query: ItemSearchRequest, options?: FetchOptions): Promise<ItemSearchResponse> {
    const { search, visibility, itemsPerPage = 50, ...mandatoryParams } = query
    const cleanedUpQuery = {
      ...mandatoryParams,
      itemsPerPage,
      ...(!_.isEmpty(search) ? { search } : {}),
      ...(!_.isEmpty(visibility) ? { visibility } : {})
    }
    return await getJson<ItemSearchResponse>({ ...{ endpoint: jsonToQueryString('/items', cleanedUpQuery) }, ...options })
  }

  async getById(id: string, options: FetchOptions = {}): Promise<ItemResponse> {
    return await getJson<ItemResponse>({ ...{ endpoint: `/item/${id ? id : ''}` }, ...options })
  }

  async save(item: Item, image?: Image | null, options: FetchOptions = {}) {
    return await putJson<ItemUpdateResponse>({ ...{ endpoint: '/item', payload: { item, image } }, ...options })
  }

  async delete(itemId: string, options: FetchOptions = {}) {
    return await deleteJson<ItemResponse>({ ...{ endpoint: `/item/${itemId}` }, ...options })
  }
}
