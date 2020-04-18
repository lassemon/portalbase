import CircularProgress from '@material-ui/core/CircularProgress'
import { fetchItems } from 'actions/items'
import ItemManage from 'components/ItemManage'
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

const ItemManageView: React.FC<IActionProps & IProps> = props => {
  const { loadingItems: loading = false, items = [] } = props

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return <div>{loading || items.length < 1 ? <CircularProgress size={25} /> : <ItemManage items={items} />}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemManageView)
