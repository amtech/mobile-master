import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Domain from '../../components/mis/domain/domain'
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

export default connect(mapStateToProps, mapDispatchToProps)(Domain);