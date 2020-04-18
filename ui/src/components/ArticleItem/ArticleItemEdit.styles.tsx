import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0 0 1em 0'
    },
    description: {
      marginBottom: 12
    },
    actionButton: {
      boxShadow: 'none'
    },
    textField: {
      flex: '0 0 100%'
    },
    textArea: {
      flex: '0 0 100%'
    },
    chipsContainer: {
      textAlign: 'right'
    },
    chip: {
      marginRight: theme.spacing(1),
      height: '2em',
      fontSize: theme.typography.fontSize * 0.8
    }
  })
)

export default useStyles
