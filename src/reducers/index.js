import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import common from './common/common'

export default combineReducers({
  common,
  routing: routerReducer, // 整合路由
})
