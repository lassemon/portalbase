import {
  CLEAR_FETCHED_ITEM,
  DELETE_ITEM_COMPLETE,
  DELETE_ITEM_ERROR,
  DELETE_ITEM_LOADING,
  DELETE_ITEM_SUCCESS,
  FETCH_ITEM_COMPLETE,
  FETCH_ITEM_ERROR,
  FETCH_ITEM_LOADING,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEMS_COMPLETE,
  FETCH_ITEMS_ERROR,
  FETCH_ITEMS_LOADING,
  FETCH_ITEMS_SUCCESS,
  INSERT_ITEM_COMPLETE,
  INSERT_ITEM_ERROR,
  INSERT_ITEM_LOADING,
  INSERT_ITEM_SUCCESS,
  ItemAction,
  TOGGLE_EDIT_ITEM,
  TOGGLE_MANAGE_ITEM,
  UPDATE_ITEM_COMPLETE,
  UPDATE_ITEM_ERROR,
  UPDATE_ITEM_LOADING,
  UPDATE_ITEM_SUCCESS
} from 'actions/items';
import { orderBy } from 'lodash';
import { IItem, IItemsState } from 'types';

const initialState = {
  loadingItems: false,
  loadingItem: false,
  loadingItemInsert: false,
  loadingItemUpdate: false,
  loadingItemDelete: false,
  items: [],
  item: undefined,
  itemsError: false,
  itemError: false,
  itemInsertError: false,
  itemUpdateError: false,
  itemDeleteError: false,
  editingItem: false,
  managingItem: false
};


const sortItems = (items: IItem[]) => {
  return orderBy(items, [(o) => o.created || '', (o) => o.modified || ''], ['desc', 'desc']);
};

export default (state: IItemsState = initialState, action: ItemAction) => {
  switch (action.type) {
    case FETCH_ITEM_LOADING:
      return {
        ...state,
        itemError: false,
        loadingItem: true
      };
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        item: action.payload
      };
    case FETCH_ITEM_ERROR:
      return {
        ...state,
        itemError: true
      };
    case FETCH_ITEM_COMPLETE:
      return {
        ...state,
        loadingItem: false
      };
    case FETCH_ITEMS_LOADING:
      return {
        ...state,
        itemsError: false,
        loadingItems: true
      };
    case FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        items: action.payload
      };
    case FETCH_ITEMS_ERROR:
      return {
        ...state,
        itemsError: true
      };
    case FETCH_ITEMS_COMPLETE:
      return {
        ...state,
        loadingItems: false
      };
    case CLEAR_FETCHED_ITEM:
      return {
        ...state,
        item: undefined
      };
    case TOGGLE_EDIT_ITEM:
      return {
        ...state,
        editingItem: action.payload,
        itemUpdateError: action.payload ? state.itemUpdateError : false
      };
    case TOGGLE_MANAGE_ITEM:
      return {
        ...state,
        managingItem: action.payload,
        itemUpdateError: action.payload ? state.itemUpdateError : false
      };
    case INSERT_ITEM_LOADING:
      return {
        ...state,
        itemInsertError: false,
        loadingItemInsert: true
      };
    case INSERT_ITEM_SUCCESS:
      let itemsAfterInsert = state.items;
      itemsAfterInsert.push(action.payload);
      itemsAfterInsert = sortItems(itemsAfterInsert);
      return {
        ...state,
        item: action.payload,
        items: itemsAfterInsert
      };
    case INSERT_ITEM_ERROR:
      return {
        ...state,
        itemInsertError: true
      };
    case INSERT_ITEM_COMPLETE:
      return {
        ...state,
        loadingItemInsert: false
      };
    case UPDATE_ITEM_LOADING:
      return {
        ...state,
        itemUpdateError: false,
        loadingItemUpdate: true
      };
    case UPDATE_ITEM_SUCCESS:
      let itemsAfterUpdate = state.items.map(item => {
        if (item.id === action.payload.id) {
          return action.payload;
        } else {
          return item;
        }
      });
      itemsAfterUpdate = sortItems(itemsAfterUpdate);
      return {
        ...state,
        item: action.payload,
        items: itemsAfterUpdate,
        editingItem: false
      };
    case UPDATE_ITEM_ERROR:
      return {
        ...state,
        itemUpdateError: true
      };
    case UPDATE_ITEM_COMPLETE:
      return {
        ...state,
        loadingItemUpdate: false
      };

    case DELETE_ITEM_LOADING:
      return {
        ...state,
        itemDeleteError: false,
        loadingItemDelete: true
      };
    case DELETE_ITEM_SUCCESS:
      const cleanedItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: cleanedItems
      };
    case DELETE_ITEM_ERROR:
      return {
        ...state,
        itemDeleteError: true
      };
    case DELETE_ITEM_COMPLETE:
      return {
        ...state,
        loadingItemDelete: false
      };
    default:
      return state;
  }
};