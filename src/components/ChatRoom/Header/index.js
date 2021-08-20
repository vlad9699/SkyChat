import Typography from '@material-ui/core/Typography'
import { AppBar, Toolbar, Grid } from '@material-ui/core'

export const Header = ({ roomId }) => (
  <Grid container>
    <Grid item xs={12}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">
            SkyChat:
            {roomId}
          </Typography>
        </Toolbar>
      </AppBar>
    </Grid>
  </Grid>
)
export default Header
