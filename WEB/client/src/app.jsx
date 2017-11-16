import React from 'react';
import ReactDom from 'react-dom';
import App from './components/start.jsx';
import Main from './components/Main.jsx';

// import { Provider } from 'react-redux'
// import store, { history } from './components/store'


ReactDom.render((
        <App/>
), document.getElementById('react-app'));

// ReactDom.render((
//         <Provider store={store}>
//                 <Main/>
//         </Provider>
// ), document.getElementById('react-app'));