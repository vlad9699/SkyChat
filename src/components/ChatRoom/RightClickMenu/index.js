import { ContextMenu, ContextMenuItem } from 'rctx-contextmenu'
import { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const RightClickMenu = (props) => {
  const [copyTxt, setCopyTxt] = useState()
  // eslint-disable-next-line react/destructuring-assignment
  console.log(props.id)
  const copyMessage = () => {
    const text = document.getElementById('lol span')
    text.select()
    navigator.clipboard.writeText(text.value)
    console.log(text.value)
  }
  return (
    <ContextMenu id="rightClick">
      <ContextMenuItem>
        <StyledMenuItem onClick={copyMessage}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Copy" />
        </StyledMenuItem>
      </ContextMenuItem>
      <ContextMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </StyledMenuItem>
      </ContextMenuItem>
      <ContextMenuItem>
        <StyledMenuItem>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </StyledMenuItem>
      </ContextMenuItem>
    </ContextMenu>
  )
}
const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem)
export default RightClickMenu
