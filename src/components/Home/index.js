import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { useHistory } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
// eslint-disable-next-line import/named
import socket, { connectJoin, promisifyEmit } from '../../core/socket'

const validationSchema = yup.object({
  name: yup
    .string('Enter your name')
    .min(2, 'Too asdasd')
    .max(12, 'Too long Name')
    .required('Name is required'),
  room: yup
    .string('Enter your room')
    .min(5, 'Password should be of min 5 characters length')
    .max(5, 'Password should be of max 5 characters length')
    .required('Room is required'),
})

export function Home() {
  const classes = useStyles()
  // const [userName, setUsername] = useState('')
  // const [roomId, setRoomId] = useState('')
  const history = useHistory()

  const checkInfo = async (values) => {
    // e.preventDefault()
    const userName = values.name
    const roomId = String(values.room)
    connectJoin({ userName, roomId }, (data, error) => {
      if (error) {
        console.log(error)
        return window.location.reload()
      }

      localStorage.setItem('userId', data._id)
      localStorage.setItem('roomId', data.room._id)
      localStorage.setItem('userName', data.username)

      history.push(`/room/${roomId}`)
      return false
    })
    // const [data, error] = await promisifyEmit('room:join', {
    //   userName,
    //   roomId,
    // })
    // console.log(data)
    // if (error) {
    //   console.log(error)
    //   return window.location.reload()
    // }
    // localStorage.setItem('userId', data._id)
    // localStorage.setItem('roomId', data.room._id)
    // localStorage.setItem('userName', data.username)
    //
    // history.push(`/room/${roomId}`)
    // return false
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      room: '',
    },
    validationSchema: validationSchema,
    onSubmit: checkInfo,
  })

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          className={classes.avatar}
          src="https://previews.123rf.com/images/putracetol/putracetol1805/putracetol180501303/100988914-sky-chat-icon-design.jpg"
        />
        <Typography component="h1" variant="h5">
          SkyChat
        </Typography>
        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="name"
            id="name"
            label="Your name"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            id="room"
            name="room"
            fullWidth
            label="Number room"
            type="number"
            value={formik.values.room}
            onChange={formik.handleChange}
            error={formik.touched.room && Boolean(formik.errors.room)}
            helperText={formik.touched.room && formik.errors.room}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Room/Connect
          </Button>
        </form>
      </div>
    </Container>
  )
}
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))
export default Home
