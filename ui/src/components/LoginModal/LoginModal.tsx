import { Drawer, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Modal from 'components/Modal'
import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { IUser } from 'types'

import useStyles from './LoginModal.styles'

interface IItemParams {
  id: string
}

interface IProps extends RouteComponentProps<IItemParams> {
  username: string
  password: string
  error: boolean
  loading: boolean
  loggedIn: boolean
  user?: IUser
  usernameChanged: (event: React.ChangeEvent<HTMLInputElement>) => void
  passwordChanged: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleLogin: () => void
  handleLogout: () => void
  handleOpen?: () => void
  handleClose?: () => void
}

const LoginModal: React.FC<IProps> = props => {
  const {
    handleOpen,
    handleClose,
    history,
    loggedIn,
    user,
    handleLogout,
    handleLogin,
    error,
    loading,
    username,
    usernameChanged,
    password,
    passwordChanged
  } = props
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const internalHandleOpen = () => {
    setOpen(true)
    if (typeof handleOpen === 'function') {
      handleOpen()
    }
  }

  const internalHandleClose = () => {
    setOpen(false)
    if (typeof handleClose === 'function') {
      handleClose()
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const internalHandleLogout = () => {
    internalHandleClose()
    closeDrawer()
    handleLogout()
  }

  const openDrawer = () => {
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  const manageItems = () => {
    history.push('/items/manage')
    setDrawerOpen(false)
  }

  return (
    <div>
      {loggedIn && user ? (
        <div>
          <div className={classes.loginLogoutContainer}>
            <IconButton color="inherit" aria-label="Menu" onClick={openDrawer}>
              <MenuIcon />
            </IconButton>
          </div>
          <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
            <div className={classes.drawerContent} role="button">
              <Typography variant="h2" color="inherit" align="center" gutterBottom={true}>
                {user.name}
              </Typography>
              <Button color="secondary">
                Settings
                <SettingsIcon />
              </Button>
              <Button color="secondary" onClick={manageItems}>
                Manage Items
              </Button>
              <Button color="secondary">Manage Tags</Button>
              <Button color="secondary" className={classes.logoutButton} onClick={internalHandleLogout}>
                Logout
              </Button>
            </div>
          </Drawer>
        </div>
      ) : (
        <Button color="inherit" onClick={internalHandleOpen}>
          Login
        </Button>
      )}
      <Modal open={open && !loggedIn} handleOpen={internalHandleOpen} handleClose={handleClose}>
        <Typography variant="h1" className={classes.loginTitle}>
          HatsuPortal Login
        </Typography>
        <FormControl className={classes.loginInput}>
          <InputLabel htmlFor="login-username">Username</InputLabel>
          <Input error={error} disabled={loading} id="login-username" value={username} onChange={usernameChanged} />
        </FormControl>
        <FormControl className={classes.loginInput}>
          <InputLabel htmlFor="login-password">Password</InputLabel>
          <Input
            error={error}
            disabled={loading}
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={passwordChanged}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="Toggle password visibility" onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <div className={classes.loginButtonLoader}>{loading && <CircularProgress size={25} />}</div>
        <div className={classes.loginButtonBar}>
          <Button
            disabled={loading}
            className={classes.loginModalButton}
            color="secondary"
            variant="contained"
            onClick={internalHandleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            className={classes.loginModalButton}
            color="primary"
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default withRouter(LoginModal)
