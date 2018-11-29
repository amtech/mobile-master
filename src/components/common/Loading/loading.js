/**
 * Created by Berlin on 2018/5/22.
 */
import React, {Component} from 'react';
import './loading.less';
import Modal from '../Modal/modal';

export default class Loading extends Component {
  render() {
    return <Modal>
      <div className='loading'>
        <div className='circle c1'/>
        <div className='circle c2'/>
        <div className='circle c3'/>
        <div className='circle c4'/>
        <div className='circle c5'/>
        <div className='circle c6'/>
        <div className='circle c7'/>
        <div className='circle c8'/>
        <div className='circle c9'/>
        <div className='circle c10'/>
        <div className='circle c11'/>
        <div className='circle c12'/>
        <p>Loading</p>
      </div>
    </Modal>
  }
}
