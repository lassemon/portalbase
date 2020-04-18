import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorContainer: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
      margin: '.5em 0'
    },
    errorIndicatorIcon: {
      flex: '1',
      margin: '0 .3em 0 0',
      minWidth: '.5em',
      background: theme.palette.error.main,
      color: 'white',
      textAlign: 'center'
    },
    errorContent: {
      flex: '0 0 95%',
      padding: '0 .5em .5em 0'
    },
    errorTitle: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    errorMessage: {
      whiteSpace: 'pre-wrap',
      margin: '0'
    }
  })
)
export default useStyles
