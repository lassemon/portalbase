import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) => {
  const drawerWidth = 240
  const closedDrawerWidth = 48

  return createStyles({
    root: {
      display: 'flex'
    },
    drawerContainer: {
      flex: '0 0 auto'
    },
    drawerPaper: {
      position: 'relative',
      width: drawerWidth
    },
    card: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      boxShadow: 'none',
      borderRadius: 0
    },
    cardShift: {
      marginLeft: closedDrawerWidth - drawerWidth,
      width: '100%'
    },
    listItem: {
      height: 'auto',
      paddingLeft: theme.spacing(2),
      paddingRight: 0
    },
    itemHeader: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    itemDescription: {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    areYouSureTitle: {
      flex: '0 0 100%'
    },
    areYouSureActionContainer: {
      flex: '0 0 100%',
      textAlign: 'right'
    },
    actionButton: {
      boxShadow: 'none',
      margin: theme.spacing(1)
    },
    menuList: {
      '& > li + li': {
        borderTop: `1px solid ${theme.palette.divider}`
      }
    }
  })
})
export default useStyles
