import CircularProgress from '@material-ui/core/CircularProgress'
import { fetchItems } from 'actions/items'
import ItemList from 'components/ItemList'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IItem, IItemsState, IRootState } from 'types'

interface IActionProps {
  fetchItems: typeof fetchItems
}

interface IProps {
  itemsError?: boolean
  items?: IItem[]
  loadingItems?: boolean
}

const HomeView: React.FC<IActionProps & IProps> = props => {
  const { fetchItems: getItems, loadingItems: loading = false, items = [] } = props

  useEffect(() => {
    getItems()
  }, [getItems])

  return <div>{loading || items.length < 1 ? <CircularProgress size={25} /> : <ItemList items={items} />}</div>
}

const mapStateToProps = (state: IRootState): Partial<IItemsState> => {
  return {
    itemsError: state.items.itemsError,
    items: state.items.items,
    loadingItems: state.items.loadingItems
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators({ fetchItems }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
