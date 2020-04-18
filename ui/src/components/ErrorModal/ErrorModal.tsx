import { Button, Typography } from '@material-ui/core'
import Modal from 'components/Modal'
import React, { useState } from 'react'
import { IError } from 'types'

import useStyles from './ErrorModal.styles'

interface IProps {
  error: IError
}

const ErrorModal: React.FC<IProps> = props => {
  const [reloading, setReloading] = useState(false)

  const classes = useStyles()

  const { error } = props

  const handleReload = () => {
    setReloading(true)
    location.reload()
  }

  return (
    <div>
      <Modal
        open={true}
        modalApi={{
          disableBackdropClick: true
        }}
      >
        <Typography variant="h3" className={classes.errorIndicatorIcon}>
          !
        </Typography>
        <div className={classes.errorContainer}>
          <Typography variant="h1" gutterBottom={true} className={classes.errorTitle}>
            {error.title}
          </Typography>
          <Typography variant="body2" className={classes.errorContent}>
            <p className={classes.errorMessage}>{error.message}</p>
          </Typography>
          <Button
            disabled={reloading}
            className={classes.reloadButton}
            color="secondary"
            variant="contained"
            onClick={handleReload}
          >
            Reload
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ErrorModal
