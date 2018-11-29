import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './modal.less'
 
export default class Modal extends Component {

  constructor(props) {
    super(props)
    this.modal = document.createElement('div')
    this.modal.classList.add('modal')
    if(props.className) {
      this.modal.classList.add(props.className)
    }
    document.body.appendChild(this.modal)
  }

  componentWillUnmount() {
    document.body.removeChild(this.modal)
  }

  onMask = (e) => {
    const {modal, props} = this
    const {onMask} = props
    if(e.target.parentNode === modal && onMask) {
      onMask()
    }
  }

  render() {
    return ReactDOM.createPortal(
      <div className='content' onClick={(e)=>{this.onMask(e)}}>
        {this.props.children}
      </div>,
      this.modal
    )
  }

}