import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LoginModal from 'components/LoginModal'
import { history } from 'config'
import React, { useState } from 'react'

import useStyles from './NavBar.styles'

const deduceTabValue = (path: string) => {
  if (path === '/') {
    return 0
  } else if (path.includes('items')) {
    return 0
  } else {
    return -1
  }
}

export const NavBar: React.FC = () => {
  const [value, setValue] = useState(deduceTabValue(window.location.pathname))

  const classes = useStyles()

  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setValue(value)

    if (value === 0) {
      history.push('/')
    } else if (value === 1) {
      history.push('/calendar')
    }
  }

  return (
    <AppBar position="static" classes={{ root: classes.navRoot }}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h1" color="inherit" className={classes.flex}>
          HatsuPortal
        </Typography>
        <LoginModal />
      </Toolbar>
      <Tabs value={value} onChange={handleChange} classes={{ root: classes.tabs, indicator: classes.tabsIndicator }}>
        <Tab label="Items" />
        <Tab label="Calendar" />
      </Tabs>
    </AppBar>
  )
}

export default NavBar
