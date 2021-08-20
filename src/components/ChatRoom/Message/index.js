import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ListItemIcon, Avatar } from '@material-ui/core'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import rulocale from 'date-fns/locale/ru'

const Message = ({
  text, date, userName, className, onContextMenu,
}) => {
  const classes = useStyles()

  const changeClass = (what) => {
    if (what) {
      console.log('true')
      return classes.messageRight
    }

    console.log('false')

    return classes.messageLeft
  }
  return (
    <ListItem className={changeClass(className)} onContextMenu={onContextMenu}>
      <Grid container>
        <Grid item xs={12}>
          <ListItemText secondary={userName} />
          <ListItemText primary={text} id="lol" />
        </Grid>
        <Grid item xs={12}>
          <ListItemText
            secondary={formatDistanceToNow(new Date(date), { addSuffix: true, locale: rulocale })}
          />
        </Grid>
      </Grid>
    </ListItem>
  )
}

const useStyles = makeStyles({
  messageLeft: {
    '&': {
      flexDirection: 'row',
      '& > div': {
        maxWidth: 'max-content',
        width: '70%',
        background: '#3f51b5',
        boxShadow: '0px 5px 5px rgb(54 116 255 / 20%)',
        borderRadius: '12px 12px 12px 0px',
        padding: '15px',
        marginBottom: '8px',
        color: '#fff',
        wordWrap: 'break-word',
        textAlign: 'justify',
        '& p': {
          color: '#fff',
        },
      },
      '&:nth-child(1)': {
        marginTop: 'auto !important',
      },
    },
  },
  messageRight: {
    '&': {
      flexDirection: 'row-reverse',
      '& > div': {
        background: '#ffffff',
        border: '1px solid #ececec',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.0220444)',
        borderRadius: '12px 12px 0px 12px',
        color: '#000',
        padding: '15px',
        textAlign: 'justify',
        maxWidth: 'max-content',
        width: '70%',
        wordWrap: 'break-word',
      },
      '&:nth-child(1)': {
        marginTop: 'auto !important',
      },

    },
  },
})
export default Message
