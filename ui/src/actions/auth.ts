import authAPI from 'api/auth';
import { Dispatch } from 'react-redux';
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IPayloadAction, IRootState, IUser } from 'types';
import ActionUtil from 'utils/ActionUtil';

export const LOGIN_LOADING = 'LOGIN_LOADING';
export type LOGIN_LOADING_TYPE = typeof LOGIN_LOADING;
interface ILoginLoadingAction extends Action {
  readonly type: LOGIN_LOADING_TYPE;
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export type LOGIN_SUCCESS_TYPE = typeof LOGIN_SUCCESS;
interface ILoginSuccessAction extends IPayloadAction<IUser> {
  readonly type: LOGIN_SUCCESS_TYPE;
  payload: IUser;
}

export const LOGIN_ERROR = 'LOGIN_ERROR';
export type LOGIN_ERROR_TYPE = typeof LOGIN_ERROR;
interface ILoginErrorAction extends Action {
  readonly type: LOGIN_ERROR_TYPE;
}

export const LOGIN_COMPLETE = 'LOGIN_COMPLETE';
export type LOGIN_COMPLETE_TYPE = typeof LOGIN_COMPLETE;
interface ILoginCompleteAction extends Action {
  readonly type: LOGIN_COMPLETE_TYPE;
}

export const LOGIN_RESET = 'LOGIN_RESET';
export type LOGIN_RESET_TYPE = typeof LOGIN_RESET;
interface ILoginResetAction extends Action {
  readonly type: LOGIN_RESET_TYPE;
}

export const login: ActionCreator<
  ThunkAction<Promise<Action>, IRootState, void, Action>
  > = (username: string, password: string) => {
    return ActionUtil.createAsyncChain(
      authAPI.login,
      {
        loading: LOGIN_LOADING,
        success: LOGIN_SUCCESS,
        error: LOGIN_ERROR,
        complete: LOGIN_COMPLETE
      },
      {
        username, password
      }
    );
  };

export const loginReset: ActionCreator<Action> = () => {
  return {
    type: LOGIN_RESET
  };
};

export const LOGOUT_LOADING = 'LOGOUT_LOADING';
export type LOGOUT_LOADING_TYPE = typeof LOGOUT_LOADING;
interface ILogoutLoadingAction extends Action {
  readonly type: LOGOUT_LOADING_TYPE;
}

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export type LOGOUT_SUCCESS_TYPE = typeof LOGOUT_SUCCESS;
interface ILogoutSuccessAction extends IPayloadAction<boolean> {
  readonly type: LOGOUT_SUCCESS_TYPE;
  payload: boolean;
}

export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export type LOGOUT_ERROR_TYPE = typeof LOGOUT_ERROR;
interface ILogoutErrorAction extends Action {
  readonly type: LOGOUT_ERROR_TYPE;
}

export const LOGOUT_COMPLETE = 'LOGOUT_COMPLETE';
export type LOGOUT_COMPLETE_TYPE = typeof LOGOUT_COMPLETE;
interface ILogoutCompleteAction extends Action {
  readonly type: LOGOUT_COMPLETE_TYPE;
}

export const LOGOUT_RESET = 'LOGOUT_RESET';
export type LOGOUT_RESET_TYPE = typeof LOGOUT_RESET;
interface ILogoutResetAction extends Action {
  readonly type: LOGOUT_RESET_TYPE;
}

export const logout: ActionCreator<
  ThunkAction<Promise<Action>, IRootState, void, Action>
  > = () => {
    return ActionUtil.createAsyncChain(
      authAPI.logout,
      {
        loading: LOGOUT_LOADING,
        success: LOGOUT_SUCCESS,
        error: LOGOUT_ERROR,
        complete: LOGOUT_COMPLETE
      }
    );
  };

export const logoutReset: ActionCreator<Action> = () => {
  return {
    type: LOGOUT_RESET
  };
};

export const LOGIN_VALID = 'LOGIN_VALID';
export type LOGIN_VALID_TYPE = typeof LOGIN_VALID;
interface ILoginValidAction extends Action {
  readonly type: LOGIN_VALID_TYPE;
}

export const LOGIN_EXPIRED = 'LOGIN_EXPIRED';
export type LOGIN_EXPIRED_TYPE = typeof LOGIN_EXPIRED;
interface ILoginExpiredAction extends Action {
  readonly type: LOGIN_EXPIRED_TYPE;
}

export const checkLoginStatus: ActionCreator<
  ThunkAction<Promise<Action>, IRootState, void, Action>
  > = () => {
    return async (dispatch: Dispatch<Action>): Promise<Action> => {
      try {
        await authAPI.status();
        return dispatch({
          type: LOGIN_VALID
        });
      } catch (error) {
        return dispatch({
          type: LOGIN_EXPIRED,
          error: true,
          payload: {
            status: 401,
            error
          }
        });
      }
    };
  };

export type AuthAction =
  ILoginLoadingAction
  | ILoginSuccessAction
  | ILoginErrorAction
  | ILoginCompleteAction
  | ILoginResetAction
  | ILogoutLoadingAction
  | ILogoutSuccessAction
  | ILogoutErrorAction
  | ILogoutCompleteAction
  | ILogoutResetAction
  | ILoginValidAction
  | ILoginExpiredAction;
