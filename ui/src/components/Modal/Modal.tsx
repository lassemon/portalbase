import MUIModal from '@material-ui/core/Modal'
import React from 'react'

import useStyles from './Modal.styles'

interface IProps {
  open: boolean
  handleOpen?: () => void
  handleClose?: () => void
  modalApi?: any
}

const Modal: React.FC<IProps> = props => {
  const classes = useStyles()

  const { children, open, handleClose, modalApi } = props

  return (
    <div>
      <MUIModal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        {...modalApi}
      >
        <div className={classes.modal}>{children}</div>
      </MUIModal>
    </div>
  )
}

export default Modal
