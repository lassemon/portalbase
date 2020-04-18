import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editorContainer: {
      display: 'flex',
      alignItems: 'center',
      '& .ql-container': {
        borderBottomLeftRadius: '0.5em',
        borderBottomRightRadius: '0.5em',
        background: '#fefcfc'
      },
      '& .ql-snow.ql-toolbar': {
        display: 'block',
        background: '#eaecec',
        borderTopLeftRadius: '0.5em',
        borderTopRightRadius: '0.5em'
      },
      '& .ql-editor': {
        minHeight: '18em'
      },
      ' & .ql-video': {
        width: '40em',
        height: '25em'
      }
    }
  })
)
export default useStyles
