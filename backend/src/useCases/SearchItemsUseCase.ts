import {
  DatabaseItemRepositoryInterface,
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  UseCaseInterface,
  UseCaseOptionsInterface
} from '@portalbase/application'
import _ from 'lodash'
import { Order } from '@portalbase/common'

interface SearchItemsUseCaseResponse extends ItemSearchResponse {}

export interface SearchItemsUseCaseOptions extends UseCaseOptionsInterface, ItemSearchRequest {
  userId?: string
}

export type SearchItemsUseCaseInterface = UseCaseInterface<SearchItemsUseCaseOptions, SearchItemsUseCaseResponse>

export class SearchItemsUseCase implements SearchItemsUseCaseInterface {
  constructor(private readonly itemRepository: DatabaseItemRepositoryInterface) {}

  async execute(options: SearchItemsUseCaseOptions) {
    const { userId, unknownError, invalidArgument, ...itemSearchRequest } = options
    try {
      const isAnyFilterDefined = this.anyFilterDefined(itemSearchRequest)

      let itemList = []
      let totalCount = itemList.length

      if (isAnyFilterDefined) {
        if (!userId && options.visibility) {
          invalidArgument('visibility')
        }
        const { items, itemCount } = await this.searchItemsWithFilters(options)
        itemList = items
        totalCount = itemCount
      } else if (userId) {
        const { items, itemCount } = await this.getAllItemsForLoggedInUser(userId, options.orderBy, options.order)
        itemList = items
        totalCount = itemCount
      } else {
        const { items, itemCount } = await this.getAllPublicItems(options.orderBy, options.order)
        itemList = items
        totalCount = itemCount
      }

      const sortedItems = this.sortItems(itemList, itemSearchRequest.orderBy, itemSearchRequest.order)

      return {
        items: this.paginateItems(sortedItems, options.itemsPerPage, options.pageNumber),
        totalCount
      }
    } catch (error) {
      unknownError('SearchItemsUseCase', error)
      throw error
    }
  }

  private paginateItems = (items: ItemResponse[], itemsPerPage: number | undefined, pageNumber: number = 0) => {
    const startIndex = itemsPerPage ? (pageNumber || 1 - 1) * (itemsPerPage || items.length) : 0
    const endIndex = itemsPerPage ? startIndex + (itemsPerPage || items.length) : items.length

    return items.slice(startIndex, endIndex)
  }

  private searchItemsWithFilters = async (queryParams: SearchItemsUseCaseOptions) => {
    const itemCount = await this.itemRepository.count(this.constructItemCountQueryParams(queryParams))
    const items = await this.itemRepository.search(this.constructItemSearchQueryParams(queryParams))
    return {
      items,
      itemCount
    }
  }

  private getAllItemsForLoggedInUser = async (userId: string, orderBy: string = 'name', order: `${Order}` = Order.ASCENDING) => {
    const items = await this.itemRepository.getAllVisibleForLoggedInUser(userId, orderBy, order)
    const itemCount = items.length
    return {
      items,
      itemCount
    }
  }

  private getAllPublicItems = async (orderBy: string = 'name', order: `${Order}` = Order.ASCENDING) => {
    const items = await this.itemRepository.getAllPublic(orderBy, order)
    const itemCount = items.length
    return {
      items,
      itemCount
    }
  }

  private anyFilterDefined(filters: ItemSearchRequest): boolean {
    if (!filters) {
      return false
    }
    const anyNonMandatoryFilterExists =
      _.without(Object.keys(filters), 'itemsPerPage', 'pageNumber', 'onlyMyItems', 'order', 'orderBy').length > 0
    return anyNonMandatoryFilterExists || filters.onlyMyItems === true
  }

  private constructItemCountQueryParams = ({
    userId,
    onlyMyItems = false,
    search,
    visibility,
    hasImage
  }: Omit<SearchItemsUseCaseOptions, 'order' | 'orderBy'>) => {
    return {
      userId,
      onlyMyItems,
      search,
      visibility,
      hasImage
    }
  }

  private constructItemSearchQueryParams = ({
    userId,
    onlyMyItems = false,
    order = 'asc',
    orderBy = 'name',
    search,
    visibility,
    hasImage
  }: SearchItemsUseCaseOptions) => {
    return {
      onlyMyItems,
      order,
      orderBy,
      userId,
      search,
      visibility,
      hasImage
    }
  }

  private sortItems = (_items: ItemResponse[], orderBy: string = 'name', order: `${Order}` = Order.ASCENDING) => {
    return _.orderBy(_items, [orderBy], order)
  }
}
