import { TextField } from '@material-ui/core'
import TextEditor from 'components/TextEditor'
import React, { useState } from 'react'
import EditableItem from 'utils/EditableItem'

import useStyles from './ArticleItemEdit.styles'

interface IProps {
  item: EditableItem
  itemChanged: (item: EditableItem) => void
}

const ArticleItemEdit: React.FC<IProps> = props => {
  const classes = useStyles()

  const { item: propsItem, itemChanged } = props

  //const [edit, setEdit] = useState(false)
  const [item, setItem] = useState<EditableItem>(propsItem)

  /*public componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({ item: nextProps.item });
    }
  }*/

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newItem = new EditableItem(item || {})
    newItem[name] = event.target.value
    newItem.validate(name)
    setItem(newItem)
    itemChanged(newItem)
  }

  const handleContentChange = (html: string) => {
    const newItem = new EditableItem(item || {})
    newItem.content = html
    newItem.validate('content')
    itemChanged(newItem)
  }

  return (
    <div className={classes.root}>
      <TextField
        error={item.titleError}
        required={true}
        label="Title"
        value={item.title}
        onChange={handleChange('title')}
        className={classes.textField}
        margin="normal"
        key="title"
      />
      <TextField
        error={item.descriptionError}
        required={true}
        label="Description"
        value={item.description}
        onChange={handleChange('description')}
        className={classes.textField}
        margin="normal"
        key="description"
      />
      <TextEditor themeName="snow" onChange={handleContentChange} content={item.content} />
    </div>
  )
}

export default ArticleItemEdit
