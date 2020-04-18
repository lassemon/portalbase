import { Chip } from '@material-ui/core'
import React from 'react'
import { ITag } from 'types'

import useStyles from './Tags.styles'

interface IProps {
  tags: ITag[]
}

const Tags: React.FC<IProps> = props => {
  const classes = useStyles()

  const { tags } = props

  const tagChips = []

  for (const tag of tags) {
    tagChips.push(<Chip className={classes.tag} key={tag.id} label={tag.name} component="a" clickable={true} />)
  }

  return <div className={classes.tagsContainer}>{tagChips}</div>
}

export default Tags
