import App from './components/App';
import Home from './components/Home';
import Player from './components/Player';
import Faq from './components/Faq';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

require('es6-promise').polyfill();
require('isomorphic-fetch');

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="player" component={Player} />
      <Route path="faq" component={Faq} />
    </Route>
  </Router>
  , document.getElementById('root'));
