import { tokenMiddleware, userMiddleware } from 'middleware'
import rootReducer from 'reducers/root'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { IRootState } from 'types'
import { loadUser } from 'utils/localStorage'

const persistedState: IRootState = {
  items: {
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
  },
  tags: {
    loading: false,
    tags: [],
    error: false
  },
  auth: {
    loginError: false,
    loginLoading: false,
    logoutError: false,
    logoutLoading: false,
    ...loadUser()
  },
  error: {
    globalError: {
      title: undefined,
      message: '',
      errorCode: undefined
    }
  }
}

const middleware = [thunk, userMiddleware, tokenMiddleware]

const composedEnhancers = composeWithDevTools(applyMiddleware(...middleware))

const store = createStore(rootReducer, persistedState, composedEnhancers)

export default store
