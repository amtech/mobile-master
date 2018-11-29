/**
 * Created by Berlin on 2018/5/10.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { getUserInfo } from '../action/action'
import { Toast } from 'antd-mobile'
import Labour from './labour/labour' // 劳动合同
import ContractBorrow from './contractBorrow/contractBorrrow' // 合同借阅
import Domain from './mis/domain' // mis 域名申请
import Email from './mis/email' // mis 邮箱申请
import FireWall from './mis/firewall' // mis 防火墙
import Ntaccount from './mis/ntaccount' // mis NT账号
import Outsource from './mis/outsource' // mis 外包
import Publicnet from './mis/publicnet' // mis 公网
import Specialnt from './mis/specialnt' // mis 特殊nt

const mapStateToProps = state => ({
  ...state,
  user: state.common.user,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({getUserInfo},dispatch)
});

class RootContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.props.getUserInfo().then(res => {
      if (res && res.response && res.response.resultCode !== '000000') {
        Toast.fail(res.response.resultMessage, 2);
      }
    });
  }
  render() {
    const rootPath = process.env.REACT_APP_ROOT_PATH
      if (this.props.user) {
        return(
          <Router basename={rootPath}>
            <Switch>
              <Route path="/labour/:data" component={Labour} />
              <Route path="/contractborrow/:data" component={ContractBorrow} />
              <Route path="/mis/domain/:data" component={Domain} />
              <Route path="/mis/email/:data" component={Email} />
              <Route path="/mis/firewall/:data" component={FireWall} />
              <Route path="/mis/ntaccount/:data" component={Ntaccount} />
              <Route path="/mis/outsource/:data" component={Outsource} />
              <Route path="/mis/publicnet/:data" component={Publicnet} />
              <Route path="/mis/specialnt/:data" component={Specialnt} />
            </Switch>
          </Router>)
      } else {
        return null
      }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);