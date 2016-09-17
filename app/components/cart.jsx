import React, {Component} from 'react';

export default class Cart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sum: 0
    }
  }

  componentDidMount () {
    
    var context = this;
    setTimeout(function () {
      context.props.winningBids.forEach(function (item) {
        var sum = parseInt(context.state.sum) + parseInt(item.highestBid);
        var decimalSum = sum.toFixed(2);
        context.setState({
          sum: decimalSum
        });
        
      });
      console.log(context.state.sum);
    }, 4000);
    // this.setState({
    //   sum: sum
    // });
  }

  render () {
    return (
      <div>
        <h5>Subtotal: $</h5><h5 id="subtotal">{this.state.sum}</h5>
      </div>
    );
  }
}