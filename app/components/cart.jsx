import React, {Component} from 'react';

export default class Cart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sum: 0
    }

    this.subtotal = this.subtotal.bind(this);
  }

  subtotal () {
    // var currSum = this.state.sum;
    // this.props.winningBids.map(function (item, index) {
    //   currSum += item;
    // });
    // this.setState({
    //   sum: currSum
    // });
  }

  render () {
    return (
      <div>
        <h5>{this.state.sum}</h5>
      </div>
    );
  }
}