import { ITEM_DEFAULTS, ItemDTO, ItemResponse } from '@portalbase/application'
import { unixtimeNow } from '@portalbase/common'
import { Visibility } from '@portalbase/domain'
import React from 'react'

export const defaultItem: ItemResponse = {
  id: ITEM_DEFAULTS.DEFAULT_ITEM_ID,
  description: 'description',
  imageId: null,
  name: 'Greatshield of Artorias',
  visibility: Visibility.PUBLIC,
  createdBy: '0',
  createdByUserName: 'system',
  createdAt: unixtimeNow()
}

export const newItemDTO = new ItemDTO({
  id: 'newItem',
  imageId: null,
  name: 'New Item',
  description: 'description',
  visibility: Visibility.PUBLIC,
  createdBy: '0',
  createdByUserName: '',
  createdAt: unixtimeNow()
})
