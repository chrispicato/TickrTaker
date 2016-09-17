import React, {Component} from 'react';
import Cart from './cart.jsx';

export default class Payment extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    Stripe.setPublishableKey('pk_test_UahXVPVR1lOrfFKhQIxrY5re');
  }

  render () {
    return (
      <div className="payment">
        
        <h5 className="payment-header">Payment Info</h5>
        <form onChange={this.props.paymentChange} onSubmit={this.props.submitPayment} method="POST" id="payment-form">

          <div className="payment-div">
            <label>
              <span className="payment-span">Name On Card</span>
              <input className="payment-input" type="text" size="20" data-stripe="number" />
            </label>
          </div>

          <div className="payment-div">
            <label>
              <span className="payment-span">Card Number</span>
              <input className="payment-input" type="text" size="20" id="number" data-stripe="number" />
            </label>
          </div>

          <div className="payment-div">
            <label>
              <span className="payment-span">Expiration (MM/YY)</span>
              <input className="payment-input" type="text" size="2" id="exp_month" data-stripe="exp_month" />
            </label>
            <span className="payment-span"> / </span>
            <input className="payment-input" type="text" size="2" id="exp_year" data-stripe="exp_year" />
          </div>

          <div className="payment-div">
            <label>
              <span className="payment-span">CVC</span>
              <input className="payment-input" type="text" size="4" id="cvc" data-stripe="cvc" />
            </label>
          </div>

          <div className="col-xs-12 payment-container">
            <Cart winningBids={this.props.winningBids} submitPayment={this.props.submitPayment} />
          </div>

          <input type="submit" className="submit" value="Submit Payment" id="form-submit-disable" />

          <span className="payment-span payment-errors"></span>
        </form>
      </div>
    );
  }
}