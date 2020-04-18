import { checkLoginStatus, login, loginReset, logout } from 'actions/auth'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IAuthState, IRootState, IUser } from 'types'

import LoginModal from './LoginModal'

interface IActionProps {
  login: typeof login
  loginReset: typeof loginReset
  logout: typeof logout
  checkLoginStatus: typeof checkLoginStatus
}

interface IProps {
  loginError?: boolean
  loginLoading?: boolean
  logoutError?: boolean
  logoutLoading?: boolean
  loggedIn?: boolean
  user?: IUser
}

const LoginModalContainer: React.FC<IActionProps & IProps> = props => {
  const {
    loginLoading = false,
    logoutLoading = false,
    loginError = false,
    logoutError = false,
    loginReset,
    login,
    loggedIn = false,
    checkLoginStatus,
    user,
    logout
  } = props

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const usernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const passwordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleClose = () => {
    setUsername('')
    setPassword('')
    loginReset()
  }

  const handleLogin = () => {
    login(username, password)
    let timer: number
    timer = window.setInterval(() => {
      if (loggedIn) {
        checkLoginStatus()
      } else {
        clearInterval(timer)
      }
    }, 10000)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <LoginModal
      username={username}
      password={password}
      loading={loginLoading || logoutLoading}
      error={loginError || logoutError}
      loggedIn={loggedIn}
      user={user}
      passwordChanged={passwordChanged}
      usernameChanged={usernameChanged}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      handleClose={handleClose}
    />
  )
}

const mapStateToProps = (state: IRootState): Partial<IAuthState> => {
  return {
    loginError: state.auth.loginError,
    loginLoading: state.auth.loginLoading,
    logoutError: state.auth.logoutError,
    logoutLoading: state.auth.logoutLoading,
    loggedIn: state.auth.loggedIn,
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators({ login, loginReset, logout, checkLoginStatus }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalContainer)
