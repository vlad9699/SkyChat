import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { Header } from './Header'
import { Messages } from './Messages'
import { SlideBar } from './SlideBar'
import { connectJoin } from '../../core/socket'

const useStyles = makeStyles({
  chatSection: {
    width: '100%',
    height: '90vh',
    paddingTop: '64px',
  },
})

export function ChatRoom({ roomId, userId }) {
  const classes = useStyles()
  const [ready, setReady] = useState(false)
  const userName = localStorage.getItem('userName')

  useEffect(() => {
    connectJoin({ userName, roomId }, (data, error) => {
      localStorage.setItem('userId', data._id)
      localStorage.setItem('roomId', data.room._id)
      localStorage.setItem('userName', data.username)
      setReady(true)
    })
  }, [])

  if (!ready) return null

  return (
    <>
      <Header
        roomId={roomId}
      />
      <Grid container component={Paper} className={classes.chatSection}>
        <SlideBar
          userName={userName}
        />
        <Messages
          roomId={roomId}
          userId={userId}
          userName={userName}
        />
      </Grid>
    </>
  )
}

export default ChatRoom
