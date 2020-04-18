import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { history } from 'config'
import RootLayout from 'layouts/RootLayout'
import React from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { Route, Router, Switch } from 'react-router-dom'
import Home from 'routes/Home'
import Item from 'routes/Item'
import ItemManage from 'routes/ItemManage'
import store from 'store'
import theme from 'theme'

class App extends React.Component {
  public render() {
    return (
      <ReduxStoreProvider store={store}>
        <Router history={history}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <RootLayout>
              <Route exact={true} path="/" component={Home} key="home" />
              <Switch>
                <Route exact={true} path="/items/manage" component={ItemManage} key="manageItems" />
                <Route exact={true} path="/items/:id" component={Item} key="item" />
              </Switch>
            </RootLayout>
          </MuiThemeProvider>
        </Router>
      </ReduxStoreProvider>
    )
  }
}

export default App
