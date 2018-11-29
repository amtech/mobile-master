/**
 * Created by Berlin on 2018/5/14.
 */
import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import Modal from '../Modal/modal';
import Loading from '../Loading/loading'
import './confirmBtn.less';

export default class ConfirmBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      btn: '',
      remark: '',
      approving: false,
    }
  }
  onMask = () => {
    this.setState({ modalShow: false })
  }

  render() {
    const {title, text, onMask, onOk, isInfo} = this.props;
    const textDom = text.split('/n')
    return <div className='confirmBody'>
      {
        title ? <p className='confirmTitle'>{title}</p> : null
      }
      {
        textDom.map((item, idx) =>
          <p
            key={idx}
            className='confirmText'
            style={isInfo ? {textAlign: 'center'} : {}}
          >
            {item}
          </p>)
      }
      <div className={`confirmBtn`}>
        {
          !isInfo ?
            <Button
              type='primary'
              className='btnClass'
              onClick={onMask}
            >
              取消
            </Button> : null
        }
        <Button
          type={isInfo ? 'primary' : 'ghost' }
          className='btnClass'
          onClick={isInfo ? onMask : onOk}
        >
          确定
        </Button>
        {
          this.state.approving ?
            <Loading /> : null
        }
      </div>
    </div>

  }
}
