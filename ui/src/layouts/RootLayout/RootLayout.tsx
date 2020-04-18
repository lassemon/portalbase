import NavBar from 'components/NavBar'
import React from 'react'

import useStyles from './RootLayout.styles'

export const RootLayout: React.FC = props => {
  const classes = useStyles()
  const { children } = props

  return (
    <main className={classes.root}>
      <NavBar />
      <section>{children}</section>
    </main>
  )
}

export default RootLayout
