import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorContainer: {
      display: 'flex',
      flexFlow: 'row wrap',
      flex: '9',
      justifyContent: 'space-between'
    },
    errorIndicatorIcon: {
      flex: '1',
      margin: '0 .3em 0 0',
      minWidth: '.5em',
      background: theme.palette.error.main,
      color: 'white',
      textAlign: 'center'
    },
    errorTitle: {
      flex: '0 0 100%',
      margin: theme.spacing(1, 0)
    },
    errorContent: {
      flex: '0 0 100%'
    },
    errorMessage: {
      whiteSpace: 'pre-wrap',
      margin: '0'
    },
    reloadButton: {
      boxShadow: 'none',
      margin: '.5em 0  .5em auto'
    }
  })
)
export default useStyles
