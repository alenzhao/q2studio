import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import actions from './actions';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import App from './components/pages/App';
import reducer from './reducers';
import Flow from './components/pages/Flow';
import queryString from 'query-string';

const logger = createLogger();

let store = createStore(
    reducer,
    applyMiddleware(
      thunk,
      logger
    )
);

const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App} />
            <Route path="job/:pluginId/:flowId" component={Flow} />
        </Router>
    </Provider>,
    document.getElementById('root')
);

const parseHash = () => {
    const { type } = queryString.parse(location.hash);
    if (type === 'ESTABLISH_CONNECTION') {
        const { uri, secret_key } = queryString.parse(location.hash);
        store.dispatch(actions.establishConnection(uri, secret_key));
        window.history.replaceState('', document.title, window.location.pathname);
    }
};

window.onhashchange = parseHash;

parseHash();
