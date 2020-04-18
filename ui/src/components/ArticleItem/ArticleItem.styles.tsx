import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    description: {
      marginBottom: 12
    },
    content: {
      whiteSpace: 'pre-wrap'
    }
  })
)

export default useStyles
