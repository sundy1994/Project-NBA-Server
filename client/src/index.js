import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import PlayersPage from './pages/PlayersPage';
import TeamsPage from './pages/TeamsPage.js';


//import PlayersPage from './pages/PlayersPage';  ETC
//change fetcher, update fetch export
//change menubar in components
//change menubar in page specific js file and update export 

import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import MatchesPage from './pages/MatchesPage';

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
        <Route exact
							path="/players"
							render={() => (
								<PlayersPage />
							)}/>
        <Route exact
							path="/matches"
							render={() => (
								<MatchesPage />
							)}/>

		<Route exact
							path="/teams"
							render={() => (
								<TeamsPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

