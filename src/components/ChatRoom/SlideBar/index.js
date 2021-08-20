import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import socket, { userJoin } from '../../../core/socket'

export const useStyles = makeStyles({
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
    background: '#F8F8F8',
    position: 'relative',
  },
  exitBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export const SlideBar = () => {
  const classes = useStyles()

  const [newUser, setNewUser] = useState([])
  const [inputValue, setInputValue] = useState('')

  const onChangeInput = (e) => {
    setInputValue(e.target.value)
  }
  const filteredName = newUser.filter((item) => item.username
    .toLowerCase()
    .includes(inputValue.toLowerCase()))

  useEffect(() => {
    userJoin((data) => {
      console.log(data)
      const userInfo = data.map((user) => {
        console.log(user)
        return {
          username: user.username,
          avatarUrl: user.avatarURL,
          userId: user._id,
        }
      })
      setNewUser([...userInfo])
    })
    // socket.on('user:join', (data) => {
    //   console.log(data)
    //   const userInfo = data.map((user) => {
    //     console.log(user)
    //     return {
    //       username: user.username,
    //       avatarUrl: user.avatarURL,
    //       userId: user._id,
    //     }
    //   })
    //   setNewUser([...userInfo])
    // })
  }, [socket])
  console.log(newUser)

  const reloadBtn = () => {
    localStorage.clear()
    window.location.href = '/'
  }
  return (
    <Grid item xs={3} className={classes.borderRight500}>
      <List>
        {newUser.map((e, ind) => {
          console.log('NEWUSER', e.userId)
          console.log('localStorage', localStorage.getItem('userId'))
          if (e.userId === localStorage.getItem('userId')) {
            return (
              <ListItem button key={ind}>
                <ListItemIcon>
                  <Avatar alt="John Wick" src={e.avatarUrl} />
                </ListItemIcon>
                <ListItemText primary={e.username} />
              </ListItem>
            )
          }
          return false
        })}
      </List>
      <Divider />
      <Grid item xs={12} style={{ padding: '10px' }}>
        <TextField
          id="outlined-basic-email"
          label="Search"
          variant="outlined"
          fullWidth
          onChange={onChangeInput}
          value={inputValue}
        />

      </Grid>
      <Divider />
      <List>
        {filteredName.map((e, ind) => {
          if (e.userId !== localStorage.getItem('userId')) {
            return (
              <ListItem button key={ind}>
                <ListItemIcon>
                  <Avatar alt="John Wick" src={e.avatarUrl} />
                </ListItemIcon>
                <ListItemText>
                  {e.username}
                </ListItemText>
              </ListItem>
            )
          }
          return false
        })}
      </List>
      <Grid item xs={12} style={{ padding: '10px' }} className={classes.exitBtn}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={reloadBtn}
          fullWidth
        >
          EXIT
        </Button>
      </Grid>
    </Grid>
  )
}

export default SlideBar
