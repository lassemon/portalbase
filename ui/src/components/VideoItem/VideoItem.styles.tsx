import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 275
    },
    description: {
      marginBottom: 12
    },
    content: {
      whiteSpace: 'pre-wrap'
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    playIcon: {
      height: 38,
      width: 38
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
