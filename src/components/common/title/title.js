/**
 * Created by Berlin on 2018/5/14.
 */
import React, { Component } from 'react';
import { Icon } from 'antd-mobile';
import './title.css';

export default class Title extends Component {
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

  render() {
    const { titleText, isHome } = this.props;
    return <div>
      <div className='title'>
        <Icon
          type='left'
          className='leftIcon'
          onClick={isHome ? this.backApp : this.props.history.goBack}
        />
        <p>{titleText}</p>
      </div>
      <div className='titlePlaceHolder'/>
    </div>
  }
}
