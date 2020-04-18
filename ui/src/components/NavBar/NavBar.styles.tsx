import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navRoot: {
      boxShadow: 'none'
    },
    flex: {
      flexGrow: 1
    },
    toolbar: {
      background: theme.palette.secondary.main
    },
    tabs: {
      background: theme.palette.primary.main
    },
    tabsIndicator: {
      height: 5
    }
  })
)

export default useStyles
