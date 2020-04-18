import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginLogoutContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    loginTitle: {
      flex: '0 0 100%',
      margin: theme.spacing(1, 0)
    },
    loginInput: {
      [theme.breakpoints.down('sm')]: {
        flex: '0 0 100%'
      },
      [theme.breakpoints.up('md')]: {
        flex: '0 0 48%'
      },
      margin: theme.spacing(1, 0)
    },
    loginButtonLoader: {
      flex: '0 0 50%',
      marginTop: theme.spacing(4)
    },
    loginButtonBar: {
      flex: '0 0 50%',
      textAlign: 'right',
      marginTop: theme.spacing(4)
    },
    loginModalButton: {
      margin: theme.spacing(1, 0),
      boxShadow: 'none'
    },
    logoutButton: {
      marginTop: 'auto',
      boxShadow: 'none'
    },
    drawerContent: {
      display: 'flex',
      flex: '0 0 100%',
      flexDirection: 'column',
      padding: '1em',
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '& > button': {
        marginBottom: '0.8em'
      }
    }
  })
)

export default useStyles
