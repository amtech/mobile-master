import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { borrowInfo, borrowApprove } from '../../action/contractBorrow'
import contractBorrrow from '../../components/contractBorrrow/contractBorrrow'

const mapStateToProps = state => ({
  user: state.common.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    borrowInfo,
    borrowApprove,
  },dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(contractBorrrow);