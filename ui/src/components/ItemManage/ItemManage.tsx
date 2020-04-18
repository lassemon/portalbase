import 'css/quill-custom.css'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Typography
} from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ClearIcon from '@material-ui/icons/Clear'
import { clearFetchedItem, clearItemErrors, createItem, deleteItem, toggleManageItem, updateItem } from 'actions/items'
import classnames from 'classnames'
import ArticleItemEdit from 'components/ArticleItem/ArticleItemEdit'
import ErrorMessage from 'components/ErrorMessage'
import Modal from 'components/Modal'
import Tags from 'components/Tags'
import { debounce } from 'lodash'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IItem, IItemInsertRequest, IItemUpdateRequest, IRootState, ITag } from 'types'
import EditableItem from 'utils/EditableItem'

import useStyles from './ItemManage.styles'

interface IActionProps {
  createItem: typeof createItem
  updateItem: typeof updateItem
  deleteItem: typeof deleteItem
  clearItemErrors: typeof clearItemErrors
  clearFetchedItem: typeof clearFetchedItem
  toggleManageItem: typeof toggleManageItem
}

interface IStateProps {
  loadingItemUpdate?: boolean
  itemUpdateError?: boolean
  loadingItemInsert?: boolean
  itemInsertError?: boolean
  managingItem?: boolean
  loggedIn?: boolean
}

interface IProps {
  items: IItem[]
}

const ItemManage: React.FC<IActionProps & IStateProps & IProps> = props => {
  const classes = useStyles()

  const {
    items,
    toggleManageItem,
    clearFetchedItem,
    managingItem = false,
    loggedIn = false,
    updateItem,
    deleteItem,
    createItem,
    loadingItemInsert = false,
    itemInsertError = false,
    loadingItemUpdate = false,
    itemUpdateError = false
  } = props

  const [drawerOpen, setDrawerOpen] = useState(true)
  const [deletingItem, setDeletingItem] = useState(false)
  const [itemNotValidError, setItemNotValidError] = useState(false)
  const [item, setItem] = useState(new EditableItem({}))
  const [deleteCandidate, setDeleteCandidate] = useState<IItem>()

  const itemChanged = debounce(
    (newItem: EditableItem) => {
      clearErrors()
      setItem(Object.assign(item, newItem))
    },
    250,
    { maxWait: 1000 }
  )

  const findItem = (itemId: number) => {
    return items.find(item => item.id === itemId)
  }

  const itemClicked = (itemId: number) => () => {
    if (item.id !== itemId) {
      const selectedItem = findItem(itemId)
      if (selectedItem) {
        toggleManageItem(true)
        setItem(new EditableItem(selectedItem || {}))
      }
    }
  }

  const itemDelete = (item: IItem) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDeletingItem(true)
    setDeleteCandidate(item)
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const newItem = () => {
    clearErrors()
    clearFetchedItem()
    toggleManageItem(false)
    clearItem()
  }

  const clearItem = () => {
    setItem(new EditableItem({}))
  }

  const tagsChanged = (tags: ITag[]) => {
    clearErrors()
    const newItem = new EditableItem(item || {})
    newItem.tags = tags
    setItem(newItem)
  }

  const cancel = () => {
    setDeletingItem(false)
    setDeleteCandidate(undefined)
  }

  const saveItem = () => {
    clearErrors()
    setItemNotValidError(false)

    if (!item.hasErrors()) {
      if (managingItem) {
        updateItem(createUpdatePayload(item))
      } else {
        createItem(createInsertPayload(item))
      }
    } else {
      setItem(new EditableItem(item || {}).validateAll())
      setItemNotValidError(true)
    }
  }

  const createInsertPayload = (item: EditableItem): IItemInsertRequest => {
    return {
      type: 'article',
      title: item.title,
      description: item.description,
      content: item.content,
      tags: item.tags.map(tag => tag.id)
    }
  }

  const createUpdatePayload = (item: EditableItem): IItemUpdateRequest => {
    const tagUpdate = item.tags ? item.tags.map(tag => tag.id) : []
    const completeItem = findItem(item.id)
    if (item && completeItem) {
      return {
        id: completeItem.id,
        type: completeItem.type,
        title: item.title,
        description: item.description,
        content: item.content,
        tags: tagUpdate
      }
    } else {
      throw new Error('Item is not valid for update')
    }
  }

  const internalDeleteItem = () => {
    if (deleteCandidate) {
      setDeletingItem(false)
      setDeleteCandidate(undefined)
      deleteItem(deleteCandidate.id)
    }
  }

  const clearErrors = () => {
    clearItemErrors()
    setItemNotValidError(false)
  }

  const convertedItems = items.map((_item: IItem, index: number) => {
    return (
      <MenuItem
        selected={_item && _item.id === _item.id}
        button={true}
        className={classes.listItem}
        key={index}
        onClick={itemClicked(_item.id)}
      >
        <ListItemText
          primary={_item.title}
          secondary={_item.description}
          classes={{ primary: classes.itemHeader, secondary: classes.itemDescription }}
        />
        <IconButton color="inherit" aria-label="Menu" onClick={itemDelete(_item)}>
          <ClearIcon />
        </IconButton>
      </MenuItem>
    )
  })

  const areYouSureDialog = (
    <Modal open={deletingItem}>
      <Typography className={classes.areYouSureTitle} variant="body2" gutterBottom={true}>
        Are you sure you want to delete item <strong>{deleteCandidate ? deleteCandidate.title : ''}</strong>?
      </Typography>
      <div className={classes.areYouSureActionContainer}>
        <Button size="small" color="secondary" variant="contained" className={classes.actionButton} onClick={cancel}>
          Cancel
        </Button>
        <Button
          size="small"
          color="primary"
          variant="contained"
          className={classes.actionButton}
          onClick={internalDeleteItem}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )

  const currentItemEqualsSavedItem = EditableItem.equals(item, new EditableItem(findItem(item.id) || {}))
  const saveButtonDisabled = loadingItemInsert || loadingItemUpdate || currentItemEqualsSavedItem

  return (
    <div className={classes.root}>
      <div className={classes.drawerContainer}>
        <IconButton onClick={handleDrawerToggle}>{drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
        <Divider />
        <Drawer
          variant="persistent"
          anchor={'left'}
          open={drawerOpen}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <MenuList className={classes.menuList}>{convertedItems}</MenuList>
          <Divider />
          <Button size="small" color="primary" variant="contained" className={classes.actionButton} onClick={newItem}>
            New Item
          </Button>
        </Drawer>
      </div>
      <Card
        className={classnames(classes.card, {
          [classes.cardShift]: !drawerOpen
        })}
      >
        <CardContent>
          <ArticleItemEdit item={item} itemChanged={itemChanged} />
          <Tags tags={item.tags} edit={true} tagsChanged={tagsChanged} />
          {itemNotValidError && <ErrorMessage error={{ message: 'Item is not valid' }} />}
          {itemInsertError && <ErrorMessage error={{ message: 'Item insert failed' }} />}
          {itemUpdateError && <ErrorMessage error={{ message: 'Item update failed' }} />}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            className={classes.actionButton}
            onClick={saveItem}
            disabled={saveButtonDisabled}
          >
            Save
          </Button>
        </CardActions>
        {loadingItemInsert || (loadingItemUpdate && <CircularProgress size={25} />)}
      </Card>
      {areYouSureDialog}
    </div>
  )
}

const mapStateToProps = (state: IRootState): Partial<IStateProps> => {
  return {
    loadingItemUpdate: state.items.loadingItemUpdate,
    itemUpdateError: state.items.itemUpdateError,
    loadingItemInsert: state.items.loadingItemInsert,
    itemInsertError: state.items.itemInsertError,
    managingItem: state.items.managingItem,
    loggedIn: state.auth.loggedIn
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators(
    { updateItem, createItem, deleteItem, clearItemErrors, clearFetchedItem, toggleManageItem },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemManage)
