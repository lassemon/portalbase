import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import WebAsset from '@material-ui/icons/WebAsset'
import Tags from 'components/Tags'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { IItem } from 'types'

import useStyles from './ItemList.styles'

interface IItemParams {
  id: string
}

interface IProps extends RouteComponentProps<IItemParams> {
  items: IItem[]
}

const ItemList: React.FC<IProps> = props => {
  const { history, items } = props

  const classes = useStyles()

  const itemClicked = (itemId: number) => () => {
    history.push('/items/' + itemId)
  }

  const convertedItems = items.map((item: IItem, index: number) => {
    return (
      <ListItem button={true} key={index} onClick={itemClicked(item.id)}>
        <ListItemIcon>
          <WebAsset />
        </ListItemIcon>
        <ListItemText primary={item.title} secondary={item.description} />
        <Tags tags={item.tags} />
      </ListItem>
    )
  })

  return (
    <div>
      <List className={classes.list}>{convertedItems}</List>
    </div>
  )
}

export default withRouter(ItemList)
