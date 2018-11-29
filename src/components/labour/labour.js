import React, { Component } from 'react';
import { Toast, Button, Icon } from 'antd-mobile';
import DatePicker from 'react-mobile-datepicker';
import './labour.less';
import Card from '../common/Card/card'
import Title from '../common/title/title'
import Item from "../common/Item/item";
import dateToObjUtil from '../../utils/dateUtil'
import labourInfo from './labourInfoObj'
import QueryParam from '../../utils/queryParam'
import Modal from "../common/Modal/modal";
import Loading from "../common/Loading/loading";
import Confirm from "../common/ConfirmBtn/confirmBtn";
import md5 from 'md5';

export default class Labour extends Component{
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      showPicker: false,
      dateType: '',
      info: {},
      showDes: false, // 合同续签说明
      endTime: '请选择', // 实习生合同结束日期
      textVal: '', // 审批意见
      loading: false,
      approveModal: false, // 审批确认
      approveInfo: false, // 审批信息
      confirmTxt: '', // 审批提示
      approveTxt: '', // 审批后提示信息
    }
  }
  componentDidMount() {
    const {labourDetail, user, match} = this.props;
    const applicationId = QueryParam(match.params.data, 'ApplicationID')
    const applicationTypeID = QueryParam(match.params.data, 'ApplicationTypeID')
    const approveType  = QueryParam(match.params.data, 'ApproveType')
    const _this = this
    const key = '2ts68*as'
    const md = md5(`${user.personId}_${key}_${applicationId}_${key}_${applicationTypeID}`)
    const str = `method=GetReNewApproveDetail&personID=${user.personId}&ApplicationID=${applicationId}&ApplicationTypeID=${applicationTypeID}&encryptedstr=${md}&ApproveType=${approveType}`
    this.setState({ loading: true })
    labourDetail(str).then(res => {
      this.setState({ loading: false })
      if (!res) {
        Toast.fail('网络错误')
      } else if ( res.response.result === '0') {
        Toast.fail(res.response.error)
        return
      } else {
        const result = JSON.parse(res.response.result)[0]
        _this.setState({ info: result })
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

  selectDate = (time) => {
    // 时间回调
    const timeObj = dateToObjUtil(time.valueOf())
    this.setState({ showPicker: false, endTime: `${timeObj.year}-${timeObj.month}-${timeObj.day}` })
  }

  cardName = (name) => {
    let cardTitle = ''
    if (name === 'application') {
      cardTitle = '申请信息'
    } else if (name === 'approve') {
      cardTitle = '合同信息'
    } else if (name === 'contract') {
      cardTitle = '业务联系人信息'
    }
    return cardTitle
  }

  itemFunc = (k) => {
    if (k === 'CONTRACT_DES') {
      this.setState({ showDes: true })
    }
    if (k === 'APP_RANG_END' && this.state.info.APPLICATION_TYPE_ID === '1') {
      // 实习生 日期选择
      this.setState({ showPicker: true })
    }
  }

  supplyInfo = (info) => {
    // 合同信息重构数据
    const infoObj = Object.assign({}, this.state.info)
    const _this = this
    if (info.type === 'approve' ) {
      if (infoObj.APPLICATION_TYPE_ID === '0') {
        // 劳动合同
        const appRang = `${infoObj.NEW_CONTRACT_START_DATE.split('T')[0]} 至 ${infoObj.NEW_CONTRACT_END_DATE.split('T')[0]}`
        infoObj.CONTRACT_END = infoObj.CONTRACT_END.split('T')[0]
        infoObj.APP_RANG = appRang
        info = {
          CONTRACT_DES: "合同续签说明",
          CONTRACT_END: "合同到期日",
          APP_RANG: "下期协议时间范围",
        }
      } else {
        // 实习生
        // _this.state.endTime === '请选则' ? _this.setState({endTime: infoObj.TC_NEW_CONTRACT_END_DATE.split('T')[0]}) : null
        const appRang = <span>{infoObj.TC_NEW_CONTRACT_START_DATE.split('T')[0]}</span>
        infoObj.CONTRACT_END = infoObj.CONTRACT_END.split('T')[0]
        infoObj.GRADUATION_DATE = infoObj.GRADUATION_DATE.split('T')[0]
        infoObj.APP_RANG = appRang
        infoObj.APP_RANG_END = _this.state.endTime
        info = {
          EMPLOYEE_TYPE: '聘用形式',
          CONTRACT_END: "协议到期日",
          APP_RANG: "下期协议起始时间",
          APP_RANG_END: "下期协议截至时间",
          GRADUATION_DATE: '毕业日期',
        }
      }
    }
    if (info.type === 'application') {
      infoObj.LEVEL = `${infoObj.LEVEL_CLASS}.${infoObj.LEVEL_NAME}`
      delete info.LEVEL_CLASS;
      delete info.LEVEL_NAME;
    }

    delete info.type
    // 申请信息
    return <div>
      {
        Object.keys(info).map((k, idx) => {
          let rt = infoObj[k]
          if (k === 'CONTRACT_DES') {
            // 说明
            rt = <Icon type='right' size='lg'/>
          }
          return <Item
            long={k === 'APP_RANG' || 'APP_RANG_END' ? true : false}
            itemFunc={() => {this.itemFunc(k)}}
            key={idx}
            lt={info[k]}
            tip={infoObj.APPLICATION_TYPE_ID === '1' && k=== 'APP_RANG_END' ? '*选择的日期不得晚于毕业日期' : ''}
            rt={rt}
            lightHigh={k=== 'APP_RANG_END'}
          />
        })
      }
    </div>
  }

  showApprove = (param, status) => {
    this.setState({ approveModal: true, confirmTxt: param, approveStatus: status })
  }

  approve = () => {
    // 审批
    const { labourDetail, user, match } = this.props;
    const key = '2ts68*as'
    const applicationId = QueryParam(match.params.data, 'ApplicationID')
    const applicationTypeID = QueryParam(match.params.data, 'ApplicationTypeID')
    const approveType = QueryParam(match.params.data, 'ApproveType')
    const str = md5(`${user.personId}_${key}_${applicationId}_${key}_${applicationTypeID}`)
    if (approveType === 'M' && this.state.approveStatus === 0) {
      if (this.state.textVal === '') {
        Toast.info('请填写审批意见！')
        return false
      }
    }
    if (approveType === 'M' && applicationTypeID === '1' && this.state.approveStatus === 1) {
      if (this.state.end === '') {
        Toast.info('请选择合同结束日期！')
        return false
      }
    }
    const param = `method=ApproveRenew&personID=${user.personId}&ApplicationID=${applicationId}&ApplicationTypeID=${applicationTypeID}&ApproveType=${approveType}&ApproveStatus=${this.state.approveStatus}&ApproveRemark=${this.state.textVal}&EndDateTime=${this.state.endTime}&encryptedstr=${str}`
    this.setState({ loading: true })
    labourDetail(param).then(res => {
      this.setState({ loading: false })
      if (!res) {
        Toast.fail('网络错误')
      } else if ( res.response.result === '0') {
        Toast.fail(res.response.error)
        return
      } else {
        this.setState({approveModal: false, approveTxt: res.response.error, approveInfo: true})
      }
    })
  }

  render() {
    const {info} = this.state
    const add = info.ONSITE_ADDRESS;
    const pho = info.ONSITE_PHONE_NUMBER;
    const email = info.ONSITE_EMAIL_ADDRESS;
    const name = info.ONSITE_LAST_NAME;
    const interShip = {
      agree: '若【确定续签】，实习协议结束日期应早于或等于学生毕业时间。',
      disAgree: '温馨提醒：若【拒绝续签】实习协议，请填写理由后点击确定，至少提前7天与实习生沟通，并让实习生在协议到期前，按照如下链接提交离职申请。' +
      '/n' +
      '离职申请链接:登录登录OA-更多-常用工具-人事审批系统-提交员工主动离职申请单' +
      '/n' +
      '重要提示：点击【拒绝续签】后，实习生依旧需要在人事审批系统提交离职申请；人力资源部在收到实习生离职审批完成之前，将正常发放工资。如因实习生未提交离职申请或离职审批不及时，照成的风险将由实习生经理承担。',
      transfer: '点击转聘申请前提示：若【确定转聘】，实习协议结束日期至转聘预计生效日期之间相差大于30天，将自动续延实习协议至实习生毕业日期，规避法律风险。'
    }
    const official = {
      disAgree: '若您【拒绝续签】劳动合同，请登入系统拒绝续签。在劳动合同到期前，提前至少1月与员工沟通，并及时联系BP介入协调，仔细阅读HR提醒。' + '/n' +
      'HR温馨提醒：'+ '/n' +
      '1、 若您未在劳动合同到期前一个月书面告知员工不续签事宜，您部门将多支付一个月工资作为赔偿金，会给公司和部门带来损失；' + '/n' +
      '2、 请主动联系BP，当BP与员工协商完毕签署相关协议后，根据BP提示，线上提交员工辞退申请(须员工上级经理提交)。',
      agreeEmploy: '提示：若您点击【确定】选项，请主动联系合同续签专员'+ name +'完成劳动合同的续签。' + '/n' +
      '邮箱：'+ email +'/n 电话：' + pho + '/n 地址：' + add +'/n',
      agree: '是否确认续签？',
      disAgreeEmploy: '感谢您为亚信所付出的劳动与努力！与我们共同见证公司的成就与发展！/n' +
      '若您点击【确定】选项，则表示您拒绝续签劳动合同，需要与公司解除劳动关系，请谨慎选择。',
      leave: '选择【员工主动离职】，则表示确认员工已经线上提交主动离职申请，如员工还未提交请勿点击此选项。Onsite收到【员工主动离职】信息后将不再通知员工续签。' +
      '/n' +
      '离职申请操作: 登录登录OA-更多-常用工具-人事审批系统-提交员工主动离职申请单' +
      '/n' +
      '重要提示：人力资源部在收到员工离职审批完成之前，将正常发放工资。如因员工未提交离职申请或离职审批不及时，给公司照成的损失和风险将由员工经理承担。'
    }
    return <div className='labourBody'>
      <Title
        titleText={Object.keys(this.state.info).length !==0 && this.state.info.APPLICATION_TYPE_ID === '0' ? '劳动合同续签' : '实习协议续签'}
        isHome={true}
      />
      {
        labourInfo(this.state.info).map((item, idx) =>
          <Card
            key={idx}
            title={this.cardName(item.type)}
            children={this.supplyInfo(item)}
          />)
      }
      <DatePicker
        isOpen={this.state.showPicker}
        onCancel={() => {this.setState({ showPicker: false })}}
        onSelect={this.selectDate}
        theme='ios'
        dateFormat={['YYYY年', 'MM月', 'DD日']}
      />
      {info.IS_SHOW_BTN === '1' ? <div style={{height: '142px'}}/> : null}
      {
        info.IS_SHOW_BTN === '1' && Object.keys(this.state.info).length !== 0 ?
          <div className='approve'>
            <textarea placeholder='审批意见...' onChange={e => {this.setState({ textVal: e.target.value })}}></textarea>
            <div className='approveBtn'>
              {
                QueryParam(this.props.match.params.data, 'ApproveType') !== 'E' ?
                  this.state.info.APPLICATION_TYPE_ID === '0' ?
                    <Button
                      type='ghost'
                      className='ghost'
                      onClick={() => {this.showApprove(official.leave, 3)}}
                    >
                      员工主动离职
                    </Button> :
                    <Button
                      type='ghost'
                      className='ghost'
                      onClick={() => {this.showApprove(interShip.transfer, 2)}}
                    >
                      转聘申请
                    </Button> : null
              }
              <Button
                type='ghost'
                className='ghost'
                onClick={() => {this.showApprove(this.state.info.APPLICATION_TYPE_ID !== '0' ? interShip.disAgree : (QueryParam(this.props.match.params.data, 'ApproveType') !== 'E' ? official.disAgree : official.disAgreeEmploy), 0)}}
              >
                拒绝续签
              </Button>
              <Button
                type='primary'
                className='primate'
                onClick={() => {this.showApprove(this.state.info.APPLICATION_TYPE_ID !== '0' ? interShip.agree : (QueryParam(this.props.match.params.data, 'ApproveType') !== 'E' ? official.agree : official.agreeEmploy) , 1)}}
              >
                同意续签
              </Button>
            </div>
          </div> : null
      }
      {
        this.state.showDes ?
          <Modal
            onMask={() => {this.setState({showDes: false})}}
            title='合同续签说明'
          >
            <div className='labourDes'>
              <p className='labourDesTitle'>下期合同签署期限及形式</p>
              <p className='labourDesTxt'>HR部门将根据员工的实际情况签署固定期限或者无固定期限劳动合同，最终合同形式，以最后签订版本为准，请知悉！</p>
              <p className='labourDesTitle'>判断条件如下</p>
              <p className='labourDesTxt'>
                【固定期限劳动合同】：不满足以下签署无固定期限条件者，将予以签订固定期限劳动合同，时间周期为三年；
                <br/>
                【无固定期限劳动合同】：
                <br/>
                1、劳动者已在公司连续工作满十年者予以签署无固定期限劳动合同；
                <br/>
                2、2008年后，连续与公司签订二次固定期限劳动合同且劳动者没有劳动合同法第三十九条和第四十条第一项、第二项规定的情形续订劳动合同者予以签订无固定期限劳动合同
              </p>
              <Button className='desBtn' type='primary' onClick={() => {this.setState({showDes: false})}}>确定</Button>
            </div>
          </Modal> : null
      }
      {
        this.state.loading ? <Loading /> : null
      }
      {
        this.state.approveModal ?
          <Modal>
            <Confirm
              onOk={this.approve}
              onMask={() => {this.setState({approveModal: false})}}
              text={this.state.confirmTxt}
            />
          </Modal>: null
      }
      {
        this.state.approveInfo ?
          <Modal>
            <Confirm
              onMask={() => {this.setState({approveInfo: false}); this.backApp()}}
              text={this.state.approveTxt}
              isInfo={true}
            />
          </Modal>: null
      }
    </div>
  }
}
