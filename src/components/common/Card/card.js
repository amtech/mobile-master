/**
 * Created by Berlin on 2018/5/14.
 */
import React, { Component } from 'react';
import './card.css';

export default class Card extends Component {

  render() {
    /*
    * title: card名称
    * */
    const { title } = this.props;
    return <div className='cardContain'>
      {
        title && title !== '' ?
          <p className='cardTitle'>{title}</p> : <p className='cardNoTitle'/>
      }
      {
        this.props.children
      }
    </div>
  }
}
