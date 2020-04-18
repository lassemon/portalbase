import { logoutReset } from 'actions/auth'
import { globalError } from 'actions/error'
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { IRootState } from 'types'
import { saveUser } from 'utils/localStorage'

const userMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (
  action: AnyAction
) => {
  const previousState = getState()
  const previousUser = previousState.auth.user
  next(action)
  const nextState: IRootState = getState()
  const nextUser = nextState.auth.user || null

  if (previousUser !== nextUser) {
    saveUser(nextState.auth.loggedIn, nextUser)
  }
}

const tokenMiddleware: Middleware = ({ getState, dispatch }: MiddlewareAPI) => (next: Dispatch<AnyAction>) => (
  action: AnyAction
) => {
  const previousState = getState()
  const isLoggedIn = previousState.auth.loggedIn
  if (action.error && action.payload.status === 401 && isLoggedIn) {
    dispatch(logoutReset())
    dispatch(globalError({ title: 'Oh no!', message: 'It seems your login expired.' }))
  } else {
    next(action)
  }
}

export { userMiddleware, tokenMiddleware }
