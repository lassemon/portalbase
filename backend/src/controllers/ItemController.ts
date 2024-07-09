import { Body, Controller, Delete, Get, Middlewares, Path, Post, Put, Queries, Request, Route, SuccessResponse, Tags } from 'tsoa'
import passport from 'passport'
import Authentication from '/security/Authentication'
import express from 'express'
import { ApiError, ItemSortableKeys, User, Visibility } from '@portalbase/domain'
import ItemRepository from '/infrastructure/repositories/ItemRepository'
import { AuthenticatedRequest } from '/infrastructure/entities/AuthenticatedRequest'
import {
  ItemResponse,
  ItemSearchRequest,
  ItemSearchResponse,
  ItemUpdateRequest,
  ItemUpdateResponse,
  UserService
} from '@portalbase/application'
import ImageRepository from '/infrastructure/repositories/ImageRepository'
import { SaveImageUseCase } from '/useCases/SaveImageUseCase'
import { SaveItemUseCase } from '/useCases/SaveItemUseCase'
import { throwIllegalArgument, throwUnknownError } from '/utils/errorUtil'
import { RemoveImageFromItemUseCase } from '/useCases/RemoveImageFromItemUseCase'
import { DeleteItemUseCase } from '/useCases/DeleteItemUseCase'
import UserRepository from '/infrastructure/repositories/UserRepository'
import { SearchItemsUseCase } from '/useCases/SearchItemsUseCase'
import { ImageProcessingService } from '/services/ImageProcessingService'
import { ImageStorageService } from '/services/ImageStorageService'
import { ImageService } from '@portalbase/infrastructure'
import _ from 'lodash'
import { Order } from '@portalbase/common'
const authentication = new Authentication(passport)

const imageService = new ImageService()
const imageProcessingService = new ImageProcessingService()
const imageStorageService = new ImageStorageService()
const imageRepository = new ImageRepository()
const saveImageUseCase = new SaveImageUseCase(imageService, imageProcessingService, imageStorageService, imageRepository)
const itemRepository = new ItemRepository()
const userService = new UserService(new UserRepository())

const removeImageFromItemUseCase = new RemoveImageFromItemUseCase(itemRepository, imageStorageService, imageRepository)
const saveItemUseCase = new SaveItemUseCase(itemRepository, saveImageUseCase)

const deleteItemUseCase = new DeleteItemUseCase(itemRepository, removeImageFromItemUseCase)
const searchItemsUseCase = new SearchItemsUseCase(itemRepository)

interface SearchQueryParams extends Omit<ItemSearchRequest, 'order' | 'orderBy'> {
  order?: `${Order}`
  orderBy?: (typeof ItemSortableKeys)[number]
}

@Route('/')
@Middlewares(authentication.passThroughAuthenticationMiddleware())
export class ItemController extends Controller {
  @Tags('Item')
  @Get('items/')
  public async search(@Request() request: express.Request, @Queries() queryParams: SearchQueryParams): Promise<ItemSearchResponse> {
    if (request?.isAuthenticated()) {
      return await searchItemsUseCase.execute({
        userId: (request.user as User).id,
        ...{
          order: Order.ASCENDING,
          orderBy: 'name',
          ...queryParams
        },
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument
      })
    } else {
      return await searchItemsUseCase.execute({
        ...{
          order: Order.ASCENDING,
          orderBy: 'name',
          ...queryParams
        },
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument
      })
    }
  }

  @Tags('Item')
  @Get('myitems/')
  public async getAllForUser(@Request() request: express.Request): Promise<ItemResponse[]> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }
    return await itemRepository.getAllForUser((request.user as User).id)
  }

  @Tags('Item')
  @Get('item/{itemId}')
  public async getItem(@Request() request: express.Request, @Path() itemId: string): Promise<ItemResponse> {
    const item = await itemRepository.getById(itemId)
    if (item.visibility === Visibility.LOGGED_IN && !request.user) {
      throw new ApiError(404, 'NotFound')
    }
    return item
  }

  @Tags('Item')
  @SuccessResponse('201', 'Created')
  @Middlewares(authentication.authenticationMiddleware())
  @Post('item/')
  public async create(@Request() request: AuthenticatedRequest, @Body() requestBody: ItemUpdateRequest): Promise<ItemUpdateResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    if (!request?.isAuthenticated()) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }

    if (requestBody.item.id === 'defaultItem') {
      throw new ApiError(403, 'Unauthorized', 'Cannot modify the default item.')
    }

    let item = requestBody.item

    const createdItemResponse = { item } as any /*await createItemUseCase.execute({
      userId: (request.user as User).id,
      item,
      image: requestBody.image,
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })*/

    return {
      ...createdItemResponse,
      item: {
        ...createdItemResponse.item,
        createdByUserName: await userService.getUserNameByUserId(createdItemResponse.item.createdBy)
      }
    }
  }

  @Tags('Item')
  @SuccessResponse('201', 'Created')
  @Middlewares(authentication.authenticationMiddleware())
  @Put('item/')
  public async update(@Request() request: AuthenticatedRequest, @Body() requestBody: ItemUpdateRequest): Promise<ItemUpdateResponse> {
    if (!request.user) {
      throw new ApiError(401, 'Unauthorized')
    }
    if (!request?.isAuthenticated()) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }

    if (requestBody.item.id === 'defaultItem') {
      throw new ApiError(403, 'Unauthorized', 'Cannot modify the default item.')
    }

    let item = requestBody.item

    const savedItemResponse = await saveItemUseCase.execute({
      userId: (request.user as User).id,
      item,
      image: requestBody.image,
      unknownError: throwUnknownError,
      invalidArgument: throwIllegalArgument
    })

    return {
      ...savedItemResponse,
      item: {
        ...savedItemResponse.item,
        createdByUserName: await userService.getUserNameByUserId(savedItemResponse.item.createdBy)
      }
    }
  }

  @Tags('Item')
  @SuccessResponse('200', 'OK')
  @Delete('item/{itemId}')
  @Middlewares(authentication.authenticationMiddleware())
  public async deleteIem(@Request() request: express.Request, @Path() itemId: string): Promise<ItemResponse> {
    if (!request?.isAuthenticated() || !request.user) {
      throw new ApiError(401, 'Unauthorized', 'Must be logged in to do that')
    }

    const itemToDelete = await itemRepository.getById(itemId)

    if (itemToDelete.createdBy !== (request.user as User).id) {
      throw new ApiError(401, 'Unauthorized', 'This item was not created by you')
    }

    if (itemToDelete) {
      return await deleteItemUseCase.execute({
        itemId: itemToDelete.id,
        userId: (request.user as User).id,
        unknownError: throwUnknownError,
        invalidArgument: throwIllegalArgument
      })
    } else {
      throw new ApiError(404, 'NotFound')
    }
  }
}
