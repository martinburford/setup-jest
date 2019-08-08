import React, { Component } from 'react';

const STATUS = {
  ERROR: 'error',
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

class Link extends Component {
  constructor() {
    super();

    this._onClick = this._onClick.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.state = {
      class: STATUS.NORMAL,
    };
  }

  _onClick(){
    this.setState({class: STATUS.HOVERED});
  }

  _onMouseLeave(){
    this.setState({class: STATUS.NORMAL});
  }

  componentDidMount(){
    if(this.props.error){
      this.setState({class: STATUS.ERROR});
    }
  }

  render(){
    return (
      <div>
        <a
          className={this.state.class}
          href={this.props.page || '#'}
          onClick={this._onClick}
          onMouseLeave={this._onMouseLeave}
        >
          {this.props.children}
        </a>
      </div>
    );
  }
}

export default Link;