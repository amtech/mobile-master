/**
 * Created by Berlin on 2018/5/17.
 */
import { httpApi } from '../http/reduxRequestMiddleware';

// userInfo
export const getUserInfo = () => ({
  [httpApi]: {
    url: '/sdm/getCurrentStaff',
    options: {
      method: 'GET',
    },
    types: ['GET_USER_INFO_SUCCESS', 'GET_USER_INFO_REQUEST', 'GET_USER_INFO_FAILURE', 'NETWORK_FAILURE'],
  },
})
