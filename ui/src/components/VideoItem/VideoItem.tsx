import { Card, CardContent, Chip, Typography } from '@material-ui/core'
import React from 'react'
import { IItem } from 'types'

import useStyles from './VideoItem.styles'

interface IProps {
  item: IItem
}

const VideoItem: React.FC<IProps> = props => {
  const { item } = props

  const classes = useStyles()

  const tags = []

  for (const tag of item.tags) {
    tags.push(<Chip className={classes.chip} key={tag.id} label={tag.name} component="a" clickable={true} />)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h2">{item.title}</Typography>
        <Typography className={classes.description} color="textSecondary">
          {item.description}
        </Typography>
        <p
          key="content"
          className={'ql-editor ' + classes.content}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </CardContent>
      <div className={classes.chipsContainer}>{tags}</div>
    </Card>
  )
}

export default VideoItem
