import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import 'babel-polyfill'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import reduxRequestMiddleware from './http/reduxRequestMiddleware'
import requestJson from './http/requestJson'
import reducers from './reducers/index'
import Root from './containers/index'
import './index.css'
import './asset/css/normalize.css'
import './asset/css/restyle.css'
import env from './config/env'
import registerServiceWorker from './registerServiceWorker'
import setSize from './utils/setSize'

export const httpRequestJson = requestJson(process.env.REACT_APP_GATEWAY)

function loader() {
  setSize()
  const history = createHistory()
  const middleware = [thunk, routerMiddleware(history), reduxRequestMiddleware(httpRequestJson)]
  // see: http://zalmoxisus.github.io/redux-devtools-extension/
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

  const enhancer = composeEnhancers(applyMiddleware(...middleware))

  const store = createStore(reducers, enhancer)

  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Root />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root'),
  )
  registerServiceWorker();
}

function getToken() {
  window.kara.getToken({
    success: function(result) {
      sessionStorage.token = result.token
      loader()
    }
  })
}

function bootstrap() {
  if(env.ENV === 'development') {
    window.sessionStorage.setItem('token', `bearer RbOBliC3RxE3hBoyaJ0AwA6isJa6AAJl`);
    if (window.location.hash && window.location.hash.indexOf('access_token=') > -1) {
      window.sessionStorage.setItem('token', `Bearer ${window.location.hash.split('access_token=')[1].split('&')[0]}`)
    } else if (window.kara) {
      getToken()
    } else {
      document.addEventListener('JSSDKReady', function(){
        getToken()
      }, false);
    }
    loader()
  } else {
    if (window.location.hash && window.location.hash.indexOf('access_token=') > -1) {
      window.sessionStorage.setItem('token', `Bearer ${window.location.hash.split('access_token=')[1].split('&')[0]}`)
      loader()
    } else if(window.kara) {
      // window.kara.setNavigationBar({ isHide: 1 });
      getToken()
    } else {
      document.addEventListener('JSSDKReady', function(){
        // window.kara.setNavigationBar({ isHide: 1 });
        getToken()
      }, false);
    }
  }
  loader()
}

export default bootstrap()