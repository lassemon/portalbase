import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      '& > div + div': {
        borderTop: `1px solid ${theme.palette.divider}`
      }
    }
  })
)
export default useStyles
