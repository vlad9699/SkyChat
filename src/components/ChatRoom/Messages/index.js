import {
  useState, useEffect, useRef, useCallback, useLayoutEffect,
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import Fab from '@material-ui/core/Fab'
import SendIcon from '@material-ui/icons/Send'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import Picker from 'emoji-picker-react'
import axios from 'axios'
import useStayScrolled from 'react-stay-scrolled'
import { ContextMenuTrigger } from 'rctx-contextmenu'
import RightClickMenu from '../RightClickMenu'
import Message from '../Message'
import socket, { connectJoin, getMessage } from '../../../core/socket'
import { loadMessage } from '../../../core/request'

const useStyles = makeStyles({
  messageArea: {
    height: '70vh',
    overflowY: 'auto',

    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
  },
  emodji: {
    position: 'relative',
  },

})

export const Messages = ({ roomId }) => {
  const classes = useStyles()

  const [text, setText] = useState('')
  const [newMessage, setNewMessage] = useState([])
  const [emojiPickerVisible, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    const userName = localStorage.getItem('userName')
    if (roomId === null || userName === 'null' || userName === null) {
      window.location.href = '/'
    }

    // connectJoin({ userName, roomId }, (data, error) => {
    //   console.log(data)
    //   localStorage.setItem('userId', data._id)
    //   localStorage.setItem('roomId', data.room._id)
    //   localStorage.setItem('userName', data.username)
    // });

    // socket.emit('room:join', { userName, roomId }, (data) => {
    //   localStorage.setItem('userId', data._id)
    //   localStorage.setItem('roomId', data.room._id)
    //   localStorage.setItem('userName', data.username)
    // });

    (async () => {
      const getLoadMessage = await loadMessage(roomId, newMessage.length, 20)
      console.log(getLoadMessage)

      const info = newMessage
      getLoadMessage.forEach((e) => {
        info.push({
          userName: e.user.username,
          userId: e.user._id,
          text: e.messageText,
          date: e.createDate,
        })
      })
      setNewMessage([...info])
      // scrollToBottom()
    })()
    getMessage((data) => {
      const info = newMessage
      console.log(data)
      info.push({
        userName: data.user.username,
        userId: data.user._id,
        text: data.messageText,
        date: data.createDate,
      })
      setNewMessage([...info])
    })
    // socket.on('message:get', (data) => {
    //   const info = newMessage
    //   console.log(data)
    //   info.push({
    //     userName: data.user.username,
    //     userId: data.user._id,
    //     text: data.messageText,
    //     date: data.createDate,
    //   })
    //   setNewMessage([...info])
    // })
  }, [socket])

  console.log(newMessage)

  const url = 'http://192.168.1.245:8000'

  const hangleChangeText = (e) => {
    setText(e.target.value)
  }

  const sendMessage = () => {
    const userId = localStorage.getItem('userId')
    if (text !== '') {
      axios.post(`${url}/api/messages`, { userId, roomId, messageText: text })
        .then((response) => {
          const allInfo = response.data.messageText
          console.log(allInfo)
        })
        .catch((error) => console.error(`Error ${error}`))
      setText('')
    }
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!emojiPickerVisible)
  }
  const addEmoji = (event, emojiObject) => {
    console.log(emojiObject.emoji)
    setText((`${text} ${emojiObject.emoji}`).trim())
  }

  const handleScroll = async (elem) => {
    const element = elem.target

    if (element.scrollTop === 0) {
      const scrollHeigthContainer = element.scrollHeight
      let scrollCurrentPos = 0
      const result = await loadMessage(roomId, newMessage.length, 10)
      const info = []
      result.forEach((e) => {
        info.push({
          userName: e.user.username,
          userId: e.user._id,
          text: e.messageText,
          date: e.createDate,
        })
      })
      setNewMessage([...info, ...newMessage])
      const tempScrollHeigthContainer = element.scrollHeight
      scrollCurrentPos = (tempScrollHeigthContainer - scrollHeigthContainer)
      element.scrollTop = scrollCurrentPos
    }
  }
  const [notifyNewMessage, setNotifyNewMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const { stayScrolled, isScrolled } = useStayScrolled(messagesEndRef)

  const onScroll = useCallback(() => {
    if (isScrolled()) setNotifyNewMessage(false)
  }, [])

  useLayoutEffect(() => {
    // Tell the user to scroll down to see the newest messages if the element wasn't scrolled down
    stayScrolled()
    // setNotifyNewMessage(!stayScrolled())
  }, [newMessage.length])

  return (
    <Grid item xs={9}>
      <List className={classes.messageArea} id="scrollH" ref={messagesEndRef} onScroll={handleScroll}>
        {newMessage.map((e, ind) => {
          if (e.userId === localStorage.getItem('userId')) {
            return (
              <ContextMenuTrigger id="rightClick">
                <Message
                  date={e.date}
                  text={e.text}
                  userName={e.userName}
                  key={ind}
                  className
                  // onContextMenu={rightClickMenu}
                />
              </ContextMenuTrigger>
            )
          }
          return (
            <Message
              date={e.date}
              text={e.text}
              userName={e.userName}
              key={ind}
            />
          )
        })}
      </List>
      <RightClickMenu />
      {notifyNewMessage && <div>Scroll down to new message</div>}
      <Divider />
      <Grid container alignItems="center" style={{ padding: '20px' }}>
        <Grid item xs={1} className={classes.emodji}>
          {emojiPickerVisible && (
            <Picker onEmojiClick={addEmoji} set="apple" />
          )}
          <InsertEmoticonIcon
            color="primary"
            fontSize="large"
            onClick={toggleEmojiPicker}
            cursor="pointer"
          />
        </Grid>
        <Grid item xs={1}>
          <AttachFileIcon
            color="primary"
            fontSize="large"
          />
        </Grid>
        <Grid item xs={9}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Message"
            fullWidth
            value={text}
            onChange={hangleChangeText}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage()
              }
            }}
          />
        </Grid>
        <Grid item xs={1} align="right">
          <Fab
            color="primary"
            aria-label="add"
            type="button"
            onClick={sendMessage}
          >
            <SendIcon />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Messages
