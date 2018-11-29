import React, { Component } from 'react';
import { Toast, Button } from 'antd-mobile';
import Title from '../../common/title/title';
import Card from '../../common/Card/card';
import Item from "../../common/Item/item";
import Loading from '../../common/Loading/loading';
import '../domain.less';
import md5 from 'md5';
import {backApp} from "../../../utils/utilFunc";

const base = {
  'LAST_NAME': '员工姓名',
  'EMPLOYEE_NUMBER': '员工编号',
  'TYPE': '业务类型'
}
// 普通
const normal = {
  'ACTUAL_APPLYER_LAST_NAME': '中文姓名',
  'ACTUAL_APPLYER_FIRST_NAME': '汉语拼音',
  'ACTUAL_APPLYER_ORG_NAME': '部门名称',
  'ACTUAL_APPLYER_COSTCENTER_NAME': '发薪地点',
  'ACTUAL_APPLYER_WK_LOCATION': '办公地点',
  'EMPLOYEE_NUMBER': '员工编号',
  // 'REMARKS': '备注',
}
// 特殊
const special = {
  'ACTUAL_APPLYER_LAST_NAME': '中文姓名',
  'ACTUAL_APPLYER_ORG_NAME': '部门名称',
  'ACTUAL_APPLYER_COSTCENTER_NAME': '发薪地点',
  'ACTUAL_APPLYER_WK_LOCATION': '办公地点',
  'LIABLE_NAME': '责任人',
  // 'REMARKS': '备注',
}
// 虚拟
const fictitious = {
  'ACTUAL_APPLYER_LAST_NAME': '中文姓名',
  'EMPLOYEE_NUMBER': '员工编号',
  'ACTUAL_APPLYER_COSTCENTER_NAME': '公司名称',
  'ACTUAL_APPLYER_ORG_NAME': 'BU名称',
  // 'REMARKS': '备注',
}

export default class Nt extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      title: '',
      pageType: 0,
      typeName: '',
    }
  }

  componentDidMount() {
    const { match, user, getMisInfo } = this.props
    const key = 'xxe7b*jw'
    const md = md5(`${user.personId}_${key}_${match.params.data}_${key}`)
    const param = `method=GetNTAccountApplicationDetail&personId=${user.personId}&ApplicationID=${match.params.data}&encryptedstr=${md}`
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
        let name = '', type = '', typeName = '';
        if (res.response.result.NORMAL_NT_DATA.length !== 0) {
          name = 'NT账号申请'
          type = 1
          typeName = 'NORMAL_NT_DATA'
        } else if (res.response.result.SPECIAL_NT_DATA.length !== 0) {
          name = '特殊NT账号申请'
          type = 2
          typeName = 'SPECIAL_NT_DATA'
        } else if (res.response.result.VIRTUAL_NT_DATA.length !== 0) {
          name = '虚拟NT账号申请'
          type = 3
          typeName = 'VIRTUAL_NT_DATA'
        }
        this.setState({ data: res.response.result, title: name, pageType: type, typeName: typeName })
      }
    })
  }

  itemDomFunc = (type, item) => {
    const {data, pageType} = this.state
    if (type === 'person') {
      return Object.keys(base).map((i, idx) => {
        return <Item
          key={idx}
          lt={base[i]}
          rt={i !== 'TYPE' ? data[i]: this.state.title}
        />
      })
    } else if (type === 'detail') {
      let detail = {};
      if (pageType === 1) {
        Object.assign(detail, normal)
      } else if (pageType === 2) {
        Object.assign(detail, special)
      } else if (pageType === 3) {
        Object.assign(detail, fictitious)
      }
      return Object.keys(detail).map((i, idx) => {
        return <Item
          key={idx}
          lt={detail[i]}
          rt={item[i]}
        />
      })
    } else if (type === 'remark') {
      return <Item lt='备注' rt={data.REMARKS}/>
    }
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
        titleText={this.state.title}
        isHome={true}
      />
      <div className='scrollBody'>
         {/*内容*/}
         <Card
           title='申请人信息'
           children={this.itemDomFunc('person')}
         />
        {
          Object.keys(this.state.data).length !== 0 && this.state.data[this.state.typeName].map((i, idx) =>
            <Card
              key={idx}
              title={idx === 0 ? this.state.title : null}
              children={this.itemDomFunc('detail', i)}
            />
          )
        }
        {
          this.state.data.REMARKS !== '' ?
            <Card
              title='备注'
              children={this.itemDomFunc('remark')}
            /> : null
        }
        {/*IS_AUDIT_PERSON 审核*/}
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
