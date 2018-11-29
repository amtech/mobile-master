import React, { Component } from 'react';
import { Toast, Button, Icon } from 'antd-mobile';
import Title from '../../common/title/title'
import Card from '../../common/Card/card'
import Item from '../../common/Item/item'
import Loading from '../../common/Loading/loading'
import md5 from 'md5'
import '../domain.less';
import {backApp} from "../../../utils/utilFunc";

const base = {
  'LAST_NAME': '员工姓名',
  'EMPLOYEE_NUMBER': '员工编号',
}

// 申请
const apply = {
  'ACTUAL_APPLYER_LAST_NAME': '中文姓名',
  'NT_ACCOUNT': 'NT账号',
  'ACTUAL_APPLYER_ORG_NAME': '部门名称',
  'ACTUAL_APPLYER_HERDER_NAME': '内部责任人',
  'ACTUAL_APPLYER_VALIDITYDATE': '账号有效截止日期',
  'ACTUAL_APPLYER_IDNUMBER': '身份证',
}

// 删除
const del = {
  'ACTUAL_APPLYER_LAST_NAME': '中文姓名',
  'NT_ACCOUNT': 'NT账号',
  'ACTUAL_APPLYER_IDNUMBER': '身份证',
  'NT_DELETEDATE': '删除日期',
  'NT_DELETEREASON': '删除原因',
}

// 延期
const prolong = {
  'ACTUAL_APPLYER_LAST_NAME': '中文姓名',
  'NT_ACCOUNT': 'NT账号',
  'ACTUAL_APPLYER_ORG_NAME': '部门名称',
  'ACTUAL_APPLYER_HERDER_NAME': '内部责任人',
  'ACTUAL_APPLYER_VALIDITYDATE': '账号有效截止日期',
  'ACTUAL_APPLYER_IDNUMBER': '身份证',
  'NT_PROLONGREASON': '延期原因',
}


export default class Outsource extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      typeName: '',
      title: '',
      info: {}, // 详情
    }
  }

  componentDidMount() {
    const { match, user, getMisInfo } = this.props
    const key = 'xxe7b*jw'
    const md = md5(`${user.personId}_${key}_${match.params.data}_${key}`)
    const param = `method=GetOutsourcingNTAccountDetail&personId=${user.personId}&ApplicationID=${match.params.data}&encryptedstr=${md}`
    this.setState({ loading: true })
    getMisInfo(param).then(res => {
      this.setState({ loading: false })
      if (!res || !res.response) {
        Toast.fail('网络错误')
        return false
      } else if (res && res.response && res.response.resultCode !== '000000') {
        Toast.fail(res.response.resultMessage)
        return false
      } else if (res && res.response && res.response.resultCode === '000000') {
        const newInfo = {
          OUTSOURCING_NT_DATA: res.response.result.OUTSOURCING_NT_DATA,
          OUT_NT_DEL_NT_DATA: res.response.result.OUT_NT_DEL_NT_DATA,
          OUT_PROLONG_NT_DATA: res.response.result.OUT_PROLONG_NT_DATA,
        }
        this.setState({ data: res.response.result, info: newInfo })
      }
    })
  }

  itemDomFunc = (type, itemType, item) => {
    const {data, typeName} = this.state
    let newObj = {}, outsourceData = data[typeName]
    if (Object.keys(data).length === 0) {
      return false
    }

    if (type === 'base') {
      outsourceData = data
      newObj = base
      return Object.keys(newObj).map((i, idx) => {
        return <Item
          key={idx}
          lt={newObj[i]}
          rt={i !== 'REMARKS' ? outsourceData[i] : data[i]}
        />
      })
    }  else if (type === 'remark') {
      return <Item lt='备注' rt={data.REMARKS}/>
    } else {
      if (itemType === 'OUTSOURCING_NT_DATA') {
        // 申请外包人员NT账号
        newObj = apply
      } else if (itemType === 'OUT_NT_DEL_NT_DATA') {
        // 删除外包人员NT账号
        newObj = del
      } else if (itemType === 'OUT_PROLONG_NT_DATA') {
        // 延期外包人员NT账号
        newObj = prolong
      }
      return Object.keys(newObj).map((i, idx) => {
        return <Item
          key={idx}
          lt={newObj[i]}
          rt={i === 'REMARKS' ? this.state.data.REMARKS : item[i]}
        />
      })
    }
  }

  titleFunc = (item) => {
    let title = ''
    if (item === 'OUTSOURCING_NT_DATA') {
      title = '申请外包人员NT账号';
    } else if (item === 'OUT_NT_DEL_NT_DATA') {
      title = '删除外包人员NT账号';
    } else if (item === 'OUT_PROLONG_NT_DATA') {
      title = '延期外包人员NT账号';
    }
    return title
  }

  approveFunc = (status) => {
    const {misApprove, match, user} = this.props
    const {data, iptValue} = this.state
    const param = `SystemID=515&ApplicationID=${match.params.data}&ApplicationProcessID=${data.APPLICATION_PROCESS_ID}&ApproverID=${user.personId}&ApproveResult=${status}&RejectReason=${this.state.iptValue}&IsAgentApprove=${data.IS_AGENT_APPROVER}`
    if (status === 0 && iptValue === '') {
      Toast.fail('审批拒绝请输入原因')
      return false
    }
    this.setState({loading: true})
    misApprove(param).then(res => {
      this.setState({loading: false})
      if (res && res.response && res.response.statusCode === 'SUCCESS') {
        Toast.success('审批成功')
        backApp();
      } else if (res && res.response && res.response.statusCode !== 'SUCCESS') {
        Toast.fail(res.response.msgDesc)
        return false
      }
    })
  }

  render() {
    return <div className='domainBody'>
      <Title
        titleText='外包NT账号开通延期删除'
        isHome={true}
      />
      <div className='scrollBody'>
         {/*内容*/}
        <Card
          title='申请人信息'
          children={this.itemDomFunc('base')}
        />
        {
          Object.keys(this.state.info).length !== 0 && Object.keys(this.state.info).map((item, idx) => {
            if (this.state.info[item].length !== 0) {
              return this.state.info[item].map((i, k) => {
                return <Card
                key={k}
                title={k === 0 ? this.titleFunc(item) : null}
                children={this.itemDomFunc('info', item, i)}
              />
            })}
          })
        }
        {
          this.state.data.REMARKS !== '' ?
            <Card
              title='备注'
              children={this.itemDomFunc('remark')}
            /> : null
        }
        {this.state.data.IS_APPROVER_PERSON === 1 ? <div style={{height: '142px'}}/> : <div style={{height: '10px'}}/>}
        {this.state.data.IS_APPROVER_PERSON === 1 ?
          <div className='approve'>
            <textarea placeholder='审批意见...' onChange={e => {
              this.setState({iptValue: e.target.value})
            }}></textarea>
            <div className='approveBtn'>
              <Button
                type='ghost'
                className='ghost two-btn'
                onClick={() => {
                  this.approveFunc(0)
                }}
              >
                拒绝
              </Button>
              <Button
                type='primary'
                className='primate two-btn'
                onClick={() => {
                  this.approveFunc(1)
                }}
              >
                通过
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
