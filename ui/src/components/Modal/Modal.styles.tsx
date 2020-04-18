import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxHeight: '95%',
      overflowY: 'auto',
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'space-between',
      overflow: 'hidden',
      position: 'absolute',
      width: '70%',
      maxWidth: theme.spacing(80),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(1.5)
    }
  })
)
export default useStyles
