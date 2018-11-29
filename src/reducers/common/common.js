/**
 * Created by Berlin on 2018/5/21.
 */
import caseReducer from '../caseReducer';

const common = {
  user: null,
}

const getUserInfo = (state, action) => {
  const {staffInfo} = action.response;
  return {
    ...state,
    user: staffInfo,
  }
}

export default caseReducer(common, {
  GET_USER_INFO_SUCCESS: getUserInfo,
});