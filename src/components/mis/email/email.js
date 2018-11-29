import React, { Component } from 'react';
import { Toast, Button, Icon } from 'antd-mobile';
import Title from '../../common/title/title'
import '../domain.less';
import Card from '../../common/Card/card'
import Item from '../../common/Item/item'
import {backApp} from '../../../utils/utilFunc'
import md5 from 'md5'
import Loading from '../../common/Loading/loading'

const base = {
  'LAST_NAME': '员工姓名',
  'EMPLOYEE_NUMBER': '员工编号',
}

// 新建
const add = {
  'EMAIL_GROUP_NAME': '新邮件组名称',
  'PRINCIPAL_NT_ACCOUNT': '负责人NT',
  'ORGANIZATION_ID': '申请原因',
  'ORGANIZATION_NAME': '部门名称',
  'LOCATION': '办公地点',
  'IS_TEMP_APPLY': '是否临时申请',
  'END_DATE': '截止日期',
}

// 删除
const del = {
  'EMAIL_GROUP_NAME': '邮件组名称',
  'DELETE_REASON': '删除原因',
  'REQUEST_DELETE_DATE': '删除日期',
  'ORGANIZATION_NAME': '使用部门',
  'WORKING_LOCATION': '办公室地点',
  'CONTACT_PHONE': '联系电话',
}

// 变更
const rename = {
  'OLD_EMAIL_GROUP_NAME': '原邮件组名称',
  'NEW_EMAIL_GROUP_NAME': '新邮件组名称',
  'OLD_PRINCIPAL_EMPLOYEENO': '原负责人',
  'NEW_PRINCIPAL_EMPLOYEENO': '新负责人',
  'ORGANIZATION_NAME': '使用部门',
  'CONTACT_PHONE': '联系电话',
}

export default class Email extends Component{
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
    const param = `method=GetEmailGroupAppDetail&personId=${user.personId}&ApplicationID=${match.params.data}&encryptedstr=${md}`
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
        let type = '', typeName = '', title = '';
        if (res.response.result.EMAIL_ADD_DATA.length !== 0) {
          typeName = 'EMAIL_ADD_DATA';
          title = '新建邮件组';
        } else if (res.response.result.EMAIL_RENAME_DATA.length !== 0) {
          typeName = 'EMAIL_RENAME_DATA';
          title = '更名邮件组';
        } else if (res.response.result.EMAIL_DEL_DATA.length !== 0) {
          typeName = 'EMAIL_DEL_DATA';
          title = '删除邮件组';
        }
        this.setState({ data: res.response.result, typeName: typeName, title: title })
        const newInfo = {
          EMAIL_ADD_DATA: res.response.result.EMAIL_ADD_DATA,
          EMAIL_RENAME_DATA: res.response.result.EMAIL_RENAME_DATA,
          EMAIL_DEL_DATA: res.response.result.EMAIL_DEL_DATA,
        }
        this.setState({ data: res.response.result, info: newInfo })
      }
    })
  }

  specialDom = (key, defaultVal) => {
    if (key === 'REMARKS') {
      return this.state.data['REMARKS']
    } else if (key === 'IS_TEMP_APPLY') {
      return this.state.data['IS_TEMP_APPLY'] === '1' ? '是' : '否'
    } else {
      return defaultVal
    }
  }

  itemDomFunc = (type, itemType, item) => {
    const {data, typeName} = this.state
    // const outsourceData = data[typeName]
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
    } else if (type === 'remark') {
      return <Item lt='备注' rt={data.REMARKS}/>
    } else {
      if (itemType === 'EMAIL_ADD_DATA') {
        // 新增
        newObj = add
      } else if (itemType === 'EMAIL_DEL_DATA') {
        // 删除
        newObj = del
      } else if (itemType === 'EMAIL_RENAME_DATA') {
        // 更名
        newObj = rename
      }
      return Object.keys(newObj).map((i, idx) => {
        return <Item
          key={idx}
          lt={newObj[i]}
          rt={this.specialDom(i, item[i])}
        />
      })
    }
  }

  titleFunc = (item) => {
    let title = ''
    if (item === 'EMAIL_ADD_DATA') {
      title = '新建邮件组';
    } else if (item === 'EMAIL_RENAME_DATA') {
      title = '更名邮件组';
    } else if (item === 'EMAIL_DEL_DATA') {
      title = '删除邮件组';
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
        titleText='邮件组开通更名删除责任人变更'
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
