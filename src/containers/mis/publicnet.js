import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Publicnet from '../../components/mis/publicnet/publicnet'
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

export default connect(mapStateToProps, mapDispatchToProps)(Publicnet);