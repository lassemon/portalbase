import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { emphasize } from '@material-ui/core/styles/colorManipulator'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: '2em 0'
    },
    tagsContainer: {
      textAlign: 'right'
    },
    tag: {
      marginRight: theme.spacing(1),
      height: '2em',
      fontSize: theme.typography.fontSize * 0.8
    },
    input: {
      display: 'flex',
      padding: 0
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      padding: `${theme.spacing(1)}px 0`
    },
    chip: {
      margin: `0 ${theme.spacing(1 / 4)}px`
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08
      )
    },
    noOptionsMessage: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16
    },
    paper: {
      marginTop: theme.spacing(1)
    }
  })
)
export default useStyles
