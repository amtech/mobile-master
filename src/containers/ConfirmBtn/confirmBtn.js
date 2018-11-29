/**
 * Created by Berlin on 2018/5/14.
 */
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import ConfirmBtn from '../../components/common/ConfirmBtn/confirmBtn'
import {approve} from '../../action/action'

const mapStateToProps = state => ({
  user: state.home.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    approve,
  },dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmBtn);
