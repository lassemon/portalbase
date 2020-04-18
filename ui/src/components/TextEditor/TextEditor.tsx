import React, { useState } from 'react'
import ReactQuill from 'react-quill'

import useStyles from './TextEditor.styles'

const rootClassName = 'quillEditor'

interface IProps {
  themeName: string
  content: string
  onChange: (html: string) => void
}

interface IState {
  editorHtml: string
}

const Editor: React.FC<IProps> = props => {
  /*
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    }
  }

  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video'
  ]

  const { themeName, onChange, content } = props

  const placeholder = 'Write something...'

  const [editorHtml, setEditorHtml] = useState('')

  const classes = useStyles()

  return (
    <div className={`${rootClassName} ${classes.editorContainer}`}>
      <ReactQuill
        theme={themeName}
        onChange={onChange}
        value={content}
        modules={modules}
        formats={formats}
        bounds={rootClassName}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Editor
