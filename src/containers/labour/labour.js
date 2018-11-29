import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Labour from '../../components/labour/labour'
import {labourDetail} from '../../action/labour'

const mapStateToProps = state => ({
  user: state.common.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    labourDetail,
  },dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Labour);