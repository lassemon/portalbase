import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'

interface IProps {
  error: boolean
  loading: boolean
}

class CalendarView extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props)
  }

  public render() {
    const loading = false

    return (
      <div>
        {loading ? (
          <CircularProgress size={25} />
        ) : (
          <Typography variant="subtitle1">TODO: Implement Calendar</Typography>
        )}
      </div>
    )
  }
}

export default CalendarView
