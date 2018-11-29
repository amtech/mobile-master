import React, { Component } from 'react';
import { Toast, Button, Icon } from 'antd-mobile';
import Card from '../common/Card/card'
import Title from '../common/title/title'
import Item from "../common/Item/item";
import './contractBorrrow.less';
import QueryParam from '../../utils/queryParam';
import Loading from '../common/Loading/loading'

const applyInfo = {
  borrowId: '申请单编号',
  applyDate: '申请日期',
  applyer: '申请人',
  applyDepartment: '申请人部门',
  sbu: '立项BU',
  saleManager: '销售合同管理员',
  borrowPurpose: '借阅用途',
  borrowType: '借阅文档类型',
  borrower: '借阅人',
  // forecastBorrowDate: '预计借阅日期',
  // forecastReturnDate: '预计归还日期',
}

const contractInfo = {
  pactName: '合同名称',
  signYear: '签约年份',
  salesAcct: 'Sales Account',
  amountRange: '合同金额范围',
  pactType: '合同种类',
  signatory: '签约方',
}

export default class Labour extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      iptValue: '',
      loading: false,
    }
  }

  componentDidMount() {
    const {borrowInfo, match} = this.props
    const borId = QueryParam(match.params.data, 'borrowId')
    const proId = QueryParam(match.params.data, 'processId')
    this.setState({ loading: true })
    borrowInfo(borId, proId).then(res => {
      this.setState({ loading: false })
      if (!res) {
        Toast.fail('网络错误')
        return false
      }
      if (res && res.response && res.response.resultCode === '000000') {
        const data = res.response.borrowBean;
        this.setState({data: data})
      } else if (res && res.response && res.response.resultCode !== '000000') {
        Toast.info(res.response.resultMessage)
        return false
      }
    })
  }

  backApp = () => {
    // 关闭当前窗口
    if(window.kara) {
      window.kara.closePage()
    }else{
      document.addEventListener('JSSDKReady', function(){
        window.kara.closePage()
      }, false);
    }
  }

  itemDomFunc = (type, item) => {
    const data = this.state.data
    // apply 申请单信息
    if (type === 'apply') {
      return Object.keys(applyInfo).map((i, idx) => {
        return <Item
          key={idx}
          lt={applyInfo[i]}
          rt={data[i]}
        />
      })
    } else if (type === 'contract') {
      // 合同信息
      return Object.keys(contractInfo).map((i, idx) => {
        return <Item
          key={idx}
          lt={contractInfo[i]}
          rt={item[i]}
        />
      })
    }
  }

  borrowApp = (state) => {
    const {borrowApprove, match, user} = this.props
    const borId = QueryParam(match.params.data, 'borrowId')
    const pId = user.personId
    const proId = QueryParam(match.params.data, 'processId')
    const txt = this.state.iptValue
    this.setState({ loading: true })
    borrowApprove(pId, borId, proId, state, txt).then(res => {
      this.setState({ loading: false })
      if (!res) {
        Toast.fail('网络错误')
        return false
      }
      if (res && res.response && res.response.statusCode === 'SUCCESS') {
        Toast.success('审核成功')
        this.backApp()
      } else if (res && res.response && res.response.statusCode !== 'SUCCESS') {
        Toast.info(res.response.msgDesc, 5)
        return false
      }
    })
  }

  render() {
    const {data} = this.state
    return <div className='contractBorrowBody'>
      <Title
        titleText='合同借阅详情'
        isHome={true}
      />
      <div className='contractBorrowScroll'>
        <Card
          title='申请单信息'
          children={this.itemDomFunc('apply')}
        />
        {
          Object.keys(data).length !== 0 && data && data.contractInfos.map((item, idx) =>
            <Card
              key={idx}
              title={idx === 0 ? '合同信息' : ''}
              children={this.itemDomFunc('contract', item)}
            />
          )
        }
        {data.needApproverd === 1 ? <div style={{height: '142px'}}/> : <div style={{height: '10px'}}/> }
        {
          data.needApproverd === 1 ?
            <div className='approve'>
              <textarea placeholder='审批意见...' onChange={e => {this.setState({ iptValue: e.target.value })}}></textarea>
              <div className='approveBtn'>
                <Button
                  type='ghost'
                  className='ghost two-btn'
                  onClick={() => {this.borrowApp(2)}}
                >
                  驳回
                </Button>
                <Button
                  type='primary'
                  className='primate two-btn'
                  onClick={() => {this.borrowApp(1)}}
                >
                  同意
                </Button>
              </div>
            </div> : null
        }
    </div>
      {
        this.state.loading ?
          <Loading/> : null
      }
    </div>
  }
}
