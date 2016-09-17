import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';
import ShippingInfo from './shippingInfo.jsx';
import Payment from './payment.jsx';
import Cart from './cart.jsx';

export default class ItemsWon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsWinningBidOn: [],
      submitPaymentInfo: {
        nameOnCard: '',
        cardNumber: '',
        expiration: '',
        cvc: ''
      }
    };
  }

  componentDidMount() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        console.log(user);
        $.ajax({
          method: 'POST',
          url: 'api/oldselleritems',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            console.log('items are', items);
            context.setState({
              'itemsForSale': items  
            });
          },
          error: function(err) {
            console.log(err);
          }
        });

        $.ajax({
          method: 'POST',
          url: 'api/oldbids',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            console.log('these are old bid items', items);
            var winningBids = [];
            items.forEach(function(item) {
              if (item.myBid.price === item.highestBid) {
                winningBids.push(item);
              }
            });
            console.log('bids are', winningBids);
            context.setState({ //TODO winningBids can't be losingBids on the same item...
              'itemsWinningBidOn': winningBids
            });
            context.render();
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <h3 className="col-xs-12 bid-container items-won-header">Items Won</h3>

        <div className="col-xs-12 payment-container">
          {this.state.itemsWinningBidOn.map((winningBid, index) => {
            return (<WinningBid old={true} key={index} parity={index % 2} item={winningBid}/>);
          })}
        </div>

        <div className="col-xs-12 shipping-container">
          <ShippingInfo />
        </div>

        <div className="col-xs-12 payment-container">
          <Payment paymentChange={this.props.paymentChange} submitPayment={this.props.submitPayment}/>
        </div>

        <div className="col-xs-12 payment-container">
          <Cart winningBids={this.state.itemsWinningBidOn}/>
        </div>

        <h1>{this.props.userId}</h1>
      </div>
    );
  }
}