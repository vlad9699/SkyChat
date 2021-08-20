import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home, ChatRoom } from './components'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route
          exact
          path="/room/:roomId/"
          render={({ match }) => (
            <ChatRoom
              userName={match.params.userName}
              roomId={match.params.roomId}
            />
          )}
        />
      </Switch>
    </Router>
  )
}

export default App
