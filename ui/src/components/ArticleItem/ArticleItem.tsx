import { Typography } from '@material-ui/core'
import React from 'react'
import { IItem } from 'types'

import useStyles from './ArticleItem.styles'

interface IProps {
  item: IItem
}

const ArticleItem: React.FC<IProps> = props => {
  const classes = useStyles()

  const { item } = props

  return (
    <>
      <Typography variant="h2" component="h2" key="title">
        {item.title}
      </Typography>
      <Typography className={classes.description} color="textSecondary" key="description">
        {item.description}
      </Typography>
      <p key="content" className={'ql-editor ' + classes.content} dangerouslySetInnerHTML={{ __html: item.content }} />
    </>
  )
}

export default ArticleItem
