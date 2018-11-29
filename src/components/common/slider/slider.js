/**
 * Created by Berlin on 2018/5/15.
 */
import React, { Component } from 'react';
import './slider.less'

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buSelected: 'all',
      appSelected: 'all',
      typeSelected: 'all',
    }
  }

  componentDidMount() {
    const {buSelected, appSelected, typeSelected} = this.props;
    this.setState({buSelected, appSelected, typeSelected})
  }

  choice = (item) => {
    const {nav, onMask} = this.props;
    if (nav === 'bu') {
      if (item.sales_sbu_id !== this.state.buSelected) {
        this.setState({ buSelected: item.sales_sbu_id })
      }
      onMask('buSelected', item.sales_sbu_id);
    } else if (nav === 'applicant') {
      if (item.sales_id !== this.state.appSelected) {
        this.setState({ appSelected: item.sales_id })
      }
      onMask('appSelected', item.sales_id);
    } else if (nav === 'type') {
      if (item.code !== this.state.typeSelected) {
        this.setState({ typeSelected: item.code })
      }
      onMask('typeSelected', item.code);
    }
  }

  render() {
    let { nav, buList, sales, typeArr } = this.props;
    if (!buList[0] || buList[0].sales_sbu_id !== 'all') {
      return buList.unshift({sales_sbu_name: '全部', sales_sbu_id: 'all'})
    } else {
      return buList
    }
    if (!sales[0] || sales[0].sales_id !== 'all') {
      return sales.unshift({sales_name: '全部', sales_id: 'all'})
    } else {
      return sales
    }
    return <div className='slider'>
      <i className='sliderModal' onClick={this.props.onMask}/>
      {
        nav === 'bu' ?
          <ul className='sliderList' >
            {
              buList.map((item, idx) =>
                <li
                  key={idx}
                  className={this.state.buSelected === item.sales_sbu_id ? 'textActive buList' : 'buList'}
                  onClick={() => {this.choice(item)}}
                >
                  {item.sales_sbu_name}
                </li>)
            }
          </ul> : null
      }
      {
        nav === 'applicant' ?
          <ul className='personList'>
            {
              sales.map((item, idx) =>
                <li
                  key={idx}
                  className='personItem'
                  onClick={() => {this.choice(item)}}
                >
                  <span
                    className={this.state.appSelected === item.sales_id ? 'active' : ''}
                  >
                    {item.sales_name}
                  </span>
                </li>)
            }
          </ul> : null
      }
      {
        nav === 'type' ?
          <ul className='sliderList' >
            {
              typeArr.map((item, idx) =>
                <li
                  key={idx}
                  className={this.state.typeSelected === item.code ? 'textActive buList' : 'buList'}
                  onClick={() => {this.choice(item)}}
                >
                  {item.type_name}
                </li>)
            }
          </ul> : null
      }
    </div>
  }
}
