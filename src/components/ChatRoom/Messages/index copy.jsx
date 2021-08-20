import { useState, useEffect, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { Button } from "@material-ui/core";
import Message from '../Message';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
// import { Picker } from 'emoji-mart'
import Picker from 'emoji-picker-react';
import { useDispatch } from "react-redux";
import axios from 'axios';

import { promisifyEmit } from "../../../core/socket";
import { loadMessage } from "../../../core/request"
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

});
export const Messages = ({ socket, roomId }) => {
  const classes = useStyles();

  const [text, setText] = useState('');
  const [newMessage, setNewMessage] = useState([]);

  const [emojiPickerVisible, setShowEmojiPicker] = useState(false);

  const dispatch = useDispatch();


  // const dispatchProcess = (msg) => {
  //   dispatch(process(msg));
  // };

  useEffect(() => {
    const userName = localStorage.getItem('userName')
    if (roomId === null || userName === 'null' || userName === null) { window.location.href = '/'; }

    promisifyEmit(socket, 'room:join', { userName, roomId }).then((data) => {
      console.log('00000000000000000000000000000000000000000000000000000000000000000000000000000000');
      console.log(data)
      localStorage.setItem('userId', data._id);
      localStorage.setItem('roomId', data.room._id);
      localStorage.setItem('userName', data.username);
    });

    (async function () {
      const getLoadMessage = await loadMessage(roomId, newMessage.length, 20)
      console.log(getLoadMessage)
      getLoadMessage.forEach(e => {
        let info = newMessage;
        info.push({
          userName: e.user.username,
          userId: e.user._id,
          text: e.messageText,
          date: e.createDate,
        });
        setNewMessage([...info]);
        scrollToBottom();
      })
    })();

    socket.on('message:get', (data) => {
      let info = newMessage;
      console.log(data)
      info.push({
        userName: data.user.username,
        userId: data.user._id,
        text: data.messageText,
        date: data.createDate,
      });
      setNewMessage([...info]);
    })


  }, [socket]);


  console.log(newMessage)

  const url = 'http://192.168.1.245:8000';
  // const messageId = '6110fbdc70bb3743041c1595';
  //   axios.delete(`${url}/deleteMessage`, { data: {messageId} })
  //     .then((response) => {
  //       const allInfo = response.data;
  //       console.log(allInfo)
  //     })
  //     .catch(error => console.error(`Error ${error}`));

  const hangleChangeText = (e) => {
    setText(e.target.value)
  };

  const sendMessage = () => {
    let userId = localStorage.getItem('userId');
    if (text !== '') {
      axios.post(`${url}/sendMessage`, { userId, roomId, messageText: text })
        .then((response) => {
          const allInfo = response.data.messageText;
          console.log(allInfo)
        })
        .catch(error => console.error(`Error ${error}`));
      setText('');

    }

  };



  const messagesEndRef = useRef(null);
  // const scrollToBottom = messagesEndRef.current.scrollIntoView(true);
  const scrollToBottomSmooth = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };
  // useEffect(scrollToBottom, [newMessage]);


  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!emojiPickerVisible);
  };
  const addEmoji = (event, emojiObject) => {
    console.log(emojiObject.emoji);
    setText((text + ' ' + emojiObject.emoji).trim());
  };
  const handleScroll = async elem => {
    let element = elem.target;
    // console.log(elem.scrollTop);
    if (element.scrollTop === 0) {
      const result = await loadMessage(roomId, newMessage.length, 10);
      let info = [];
      result.forEach(e => {
        info.push({
          userName: e.user.username,
          userId: e.user._id,
          text: e.messageText,
          date: e.createDate,
        });
      })
      setNewMessage([...info, ...newMessage])

    }
  }

  return (
    <Grid item xs={9}>
      <List className={classes.messageArea} onScroll={handleScroll}>
        {newMessage.map((e, ind) => {

          console.log('asd');
          if (e.userId === localStorage.getItem('userId')) {
            return (
              <Message
                date={e.date}
                text={e.text}
                userName={e.userName}
                key={ind}
                className={true}
              />
            );

          } else {
            return (
              <Message
                date={e.date}
                text={e.text}
                userName={e.userName}
                key={ind}
              />
            );
          }
        })}
        <div ref={messagesEndRef} />
      </List>

      <Divider />
      <Grid container alignItems={'center'} style={{ padding: '20px' }}>
        <Grid item xs={1} className={classes.emodji}>
          {emojiPickerVisible && (
            <Picker onEmojiClick={addEmoji} set="apple" />
          )}
          <InsertEmoticonIcon
            color={'primary'}
            fontSize={'large'}
            onClick={toggleEmojiPicker}
            cursor={'pointer'}
          />
          {/* <Button
            onClick={toggleEmojiPicker}
            variant="outlined"
            type="link"
            shape="circle"
            icon="smile"
          >
            🖕
          </Button> */}
        </Grid>
        <Grid item xs={10}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Message"
            fullWidth
            value={text}
            onChange={hangleChangeText}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
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
    </Grid >
  );

};

