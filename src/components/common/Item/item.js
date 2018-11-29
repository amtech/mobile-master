import React, { Component } from 'react';
import { DatePicker } from 'antd-mobile';
import './item.less';

export default class Item extends Component{
  render() {
    /*
    * long title长度
    * type date时间选择
    * */
    const {long, lt, rt, dateChild, itemFunc, tip, lightHigh} = this.props;
    return <div className='itemBody clearfix' onClick={itemFunc ? itemFunc : null}>
      {
        tip && tip !== '' ?
          <span className='itemTip'>
            {tip}
          </span> : null
      }
      <span className={long ? 'longTitle' : 'shortTitle'}>
        {lt}
      </span>
      {
        dateChild ?
          dateChild :
          <span className={`${long ? 'shortTxt' : 'longTxt'}`} style={ lightHigh ? {color: '#ff8928'} : {} }>
            {rt}
          </span>
      }
    </div>
  }
}