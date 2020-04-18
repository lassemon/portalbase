import { fetchTags } from 'actions/tags'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import { IRootState, ITag } from 'types'

import Tags from './Tags'
import TagsEdit from './TagsEdit'

interface IActionProps {
  fetchTags: typeof fetchTags
}

interface IProps {
  edit?: boolean
  tags: ITag[]
  tagsChanged?: (tags: ITag[]) => void
}

interface IPartialGlobalStateProps {
  allTags: ITag[]
}

const TagsContainer: React.FC<IActionProps & IPartialGlobalStateProps & IProps> = props => {
  const { fetchTags, tags, allTags, edit, tagsChanged } = props

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return edit ? (
    <TagsEdit tags={tags} tagSuggestions={allTags} edit={edit} tagsChanged={tagsChanged!} />
  ) : (
    <Tags tags={tags} />
  )
}

const mapStateToProps = (state: IRootState): IPartialGlobalStateProps => {
  return {
    allTags: state.tags.tags
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): IActionProps => {
  return bindActionCreators({ fetchTags }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsContainer)
