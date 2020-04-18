import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagsContainer: {
      textAlign: 'right'
    },
    tag: {
      marginRight: theme.spacing(1),
      height: '2em',
      fontSize: theme.typography.fontSize * 0.8
    }
  })
)
export default useStyles
