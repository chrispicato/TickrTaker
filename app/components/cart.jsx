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
        context.setState({
          sum: context.state.sum + item.highestBid
        });
        
      });
      console.log(context.state.sum);
    }, 2000);
    // this.setState({
    //   sum: sum
    // });
  }

  render () {
    return (
      <div>
        <h5>Subtotal: {this.state.sum}</h5>
      </div>
    );
  }
}