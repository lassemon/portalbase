import CircularProgress from '@material-ui/core/CircularProgress'
import { fetchItem } from 'actions/items'
import ItemContainer from 'components/ItemContainer'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IItem, IItemsState, IRootState } from 'types'

interface IItemParams {
  id: string
}

interface IProps extends RouteComponentProps<IItemParams> {
  itemError?: boolean
  item?: IItem
  loadingItem?: boolean
}

interface IActionProps {
  fetchItem: typeof fetchItem
}

const ItemView: React.FC<IActionProps & IProps> = props => {
  const { match, fetchItem: getItems, loadingItem: loading = true, item, itemError = false } = props

  useEffect(() => {
    const itemId = match.params.id
    getItems(itemId)
  }, [getItems])

  return itemError ? (
    <div>Item not found</div>
  ) : (
    <div>{loading || !item ? <CircularProgress size={25} /> : <ItemContainer item={item} />}</div>
  )
}

const mapStateToProps = (state: IRootState): Partial<IItemsState> => {
  return {
    itemError: state.items.itemError,
    item: state.items.item,
    loadingItem: state.items.loadingItem
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators({ fetchItem }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ItemView))
