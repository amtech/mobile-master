/**
 * Created by Berlin on 2018/5/15.
 */
import { connect } from 'react-redux'
// import { bindActionCreators } from 'redux';
import Title from '../../components/common/title/title'

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Title);