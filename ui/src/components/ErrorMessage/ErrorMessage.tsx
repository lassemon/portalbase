import { Paper, Typography } from '@material-ui/core'
import React from 'react'
import { IError } from 'types'

import useStyles from './ErrorMessage.styles'

interface IProps {
  error: IError
}

const ErrorMessage: React.FC<IProps> = props => {
  const classes = useStyles()

  const { error } = props

  return (
    <Paper className={classes.errorContainer}>
      <Typography variant="h2" className={classes.errorIndicatorIcon}>
        !
      </Typography>
      <div className={classes.errorContent}>
        <Typography variant="h3" gutterBottom={true} className={classes.errorTitle}>
          {error.title || 'Oh no!'}
        </Typography>
        <Typography variant="h4">
          <p className={classes.errorMessage}>{error.message}</p>
        </Typography>
      </div>
    </Paper>
  )
}

export default ErrorMessage
