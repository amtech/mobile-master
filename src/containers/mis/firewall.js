import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Firewall from '../../components/mis/firewall/firewall'
import {getMisInfo, misApprove} from '../../action/mis'

const mapStateToProps = state => ({
  user: state.common.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    getMisInfo,
    misApprove
  },dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Firewall);