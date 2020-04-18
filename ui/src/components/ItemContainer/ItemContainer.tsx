import 'css/quill-custom.css'

import { Button, Card, CardActions, CardContent, CircularProgress } from '@material-ui/core'
import { toggleEditItem, updateItem } from 'actions/items'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import ArticleItemEdit from 'components/ArticleItem/ArticleItemEdit'
import ErrorMessage from 'components/ErrorMessage'
import Tags from 'components/Tags'
import VideoItem from 'components/VideoItem/VideoItem'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IItem, IItemUpdateRequest, IRootState, ITag } from 'types'
import EditableItem from 'utils/EditableItem'

import useStyles from './ItemContainer.styles'

interface IActionProps {
  updateItem: typeof updateItem
  toggleEditItem: typeof toggleEditItem
}

interface IStateProps {
  loadingItemUpdate?: boolean
  itemUpdateError?: boolean
  editingItem?: boolean
  loggedIn?: boolean
}

interface IProps {
  item: IItem
}

const ItemContainer: React.FC<IActionProps & IStateProps & IProps> = props => {
  const classes = useStyles()

  const {
    item: propsItem,
    toggleEditItem: toggleEdit,
    updateItem: update,
    loggedIn = false,
    editingItem = false,
    loadingItemUpdate = false,
    itemUpdateError = false
  } = props

  console.log('editing', editingItem)
  const [item, setItem] = useState<EditableItem>(new EditableItem(propsItem))
  const [itemNotValidError, setItemNotValidError] = useState(false)

  useEffect(() => {
    setItem(new EditableItem(propsItem))
    return () => {
      cancel()
    }
  }, [propsItem])

  const openEditMode = () => {
    toggleEdit(true)
  }

  const cancel = () => {
    setItem(new EditableItem(propsItem || {}))
    toggleEdit(false)
  }

  const save = () => {
    setItemNotValidError(false)
    if (!item.hasErrors()) {
      update(createUpdatePayload())
    } else {
      setItem(item.validateAll())
      setItemNotValidError(true)
    }
  }

  const itemChanged = (newItem: EditableItem) => {
    setItem(Object.assign(item, newItem))
  }

  const tagsChanged = (tags: ITag[]) => {
    const newItem = new EditableItem(item)
    newItem.tags = tags
    setItem(newItem)
  }

  const createUpdatePayload = (): IItemUpdateRequest => {
    const tagUpdate = item.tags ? item.tags.map((tag: ITag) => tag.id) : []
    if (item) {
      return {
        id: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        content: item.content,
        tags: tagUpdate
      }
    } else {
      throw new Error('Item is not valid for update')
    }
  }

  let actions

  if (loggedIn && editingItem) {
    actions = (
      <CardActions>
        <Button size="small" color="secondary" variant="contained" className={classes.actionButton} onClick={cancel}>
          Cancel
        </Button>
        <Button size="small" color="primary" variant="contained" className={classes.actionButton} onClick={save}>
          Save
        </Button>
      </CardActions>
    )
  } else if (loggedIn) {
    actions = (
      <CardActions>
        <Button size="small" onClick={openEditMode}>
          Edit
        </Button>
      </CardActions>
    )
  }

  const videoItem = (
    <Card className={classes.card}>
      <VideoItem item={propsItem} />
      {actions}
    </Card>
  )

  const articleItem = (
    <Card className={classes.card}>
      <CardContent>
        {editingItem ? (
          <div>
            <ArticleItemEdit item={item} itemChanged={itemChanged} />
            <Tags tags={item.tags} edit={editingItem} tagsChanged={tagsChanged} />
          </div>
        ) : (
          <div>
            <ArticleItem item={propsItem} />
            <Tags tags={item.tags} />
          </div>
        )}
        {loadingItemUpdate && <CircularProgress size={25} />}
        {itemNotValidError && <ErrorMessage error={{ message: 'Item is not valid' }} />}
        {itemUpdateError && <ErrorMessage error={{ message: 'Item update failed' }} />}
      </CardContent>
      {actions}
    </Card>
  )

  switch (item.type) {
    case 'video':
      return videoItem
    case 'article':
      return articleItem
    default:
      return articleItem
  }
}

const mapStateToProps = (state: IRootState): Partial<IStateProps> => {
  return {
    loadingItemUpdate: state.items.loadingItemUpdate,
    itemUpdateError: state.items.itemUpdateError,
    editingItem: state.items.editingItem,
    loggedIn: state.auth.loggedIn
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators({ toggleEditItem, updateItem }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemContainer)
