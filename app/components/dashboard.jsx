import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';
import Inbox from './inbox.jsx';
import ManageFAQ from './manageFAQ.jsx';
import ItemsWon from './itemsWon.jsx';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsForSale: [],
      itemsWinningBidOn: [],
      itemsLosingBidOn: [],
      route: '',
      card: {
        number: '',
        cvc: '',
        exp_month: '',
        exp_year: ''
      },
      subtotal: ''
    };
    this._routePage = this._routePage.bind(this);
    // this.paymentChange = this.paymentChange.bind(this);
    this.submitPayment = this.submitPayment.bind(this);
    // this.stripeResponseHandler = this.stripeResponseHandler.bind(this);
  }

  componentDidMount() {    //   Retrieve user data form, show items seller items on dashboard page

    var context = this;
    $.ajax({
      method: 'GET',
      url: 'api/user_data',
      success: function(user) {
        context.setState({
          userId: user.user.id,
          userName: user.user.name
        });
        $.ajax({
          method: 'POST',
          url: 'api/selleritems',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            console.log('items are', items);
            context.setState({'itemsForSale': items});
          },
          error: function(err) {
            console.log(err);
          }
        });
        $.ajax({          // Retrieve data to show user's winnig and losingg bid on dashboard page
          method: 'POST',
          url: 'api/bids',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(user),
          success: function(items) {
            var winningBids = [];
            var losingBids = [];
            items.forEach(function(item) {
              if (item.myBid.price === item.highestBid) {
                winningBids.push(item);
              } else {
                losingBids.push(item);
              } 
            });
            //console.log('bids are', winningBids, losingBids);
            context.setState({ 
              'itemsWinningBidOn': winningBids, 
              'itemsLosingBidOn': losingBids
            });
            console.log('window object---->', window);
            context.render();
          }
        });
      }
    });
  }

  _routePage(page) {
    this.setState({route: page});
  }

  // handles storing shipping info in user table and sending payment info to stripe api
  submitPayment (e) {
    e.preventDefault();

    // stripe api parsing
    var number = $('#number').val();
    var cvc = $('#cvc').val();
    var exp_month = $('#exp_month').val();
    var exp_year = $('#exp_year').val();

    var card = {
      number: number,
      cvc: cvc,
      exp_month: exp_month,
      exp_year: exp_year
    };

    // ajax request for shipping info
    var name = $('#shipping-info-name').val();
    var addressLine1 = $('#shipping-info-address-line-1').val();
    var addressLine2 = $('#shipping-info-address-line-2').val();
    var city = $('#shipping-info-city').val();
    var state = $('#shipping-info-state').val();
    var zip = $('#shipping-info-zip').val();
    var country = $('#shipping-info-country').val();
    var phoneNumber = $('#shipping-info-phone-number').val();
    var amount = $('#subtotal').text();

    var shipping = {
      id: this.state.userId,
      name: name,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      zip: zip,
      country: country,
      phoneNumber: phoneNumber,
      stripeDateCreated: null,
      stripeId: null,
      token: null,
      amount: amount
    };

    console.log(shipping);

    var context = this;
    Stripe.createToken(card, function (status, response) {
      var payment = response;
      shipping['stripeDateCreated'] = response.created;
      shipping['stripeId'] = response.id;
      shipping['token'] = response;
      context.setState({
        payment: payment
      });
      if (response.error) {
        $('.payment').append('<h5 class="payment-validity">Your payment information is not valid</h5>');
      } else {
        $.ajax({
          method: 'POST',
          url: 'api/addresses',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify(shipping),
          success: function () {
            console.log('Your shipping info has been saved');
            $('#form-submit-disable').prop('disabled', true);
            $('.payment-validity').remove();
            $('.payment').append('<h5>Your payment has been submitted</h5>');
          },
          error: function (error) {
            console.log(error);
          }
        });
      }
      console.log(status, response);
    });


  }

  render() {
    return (
      <div>

        <div className="col-md-2 sidebar">
          <h5>Your Account</h5>
          <hr className="col-md-10 off-set-2"/>
          <div className="filterCriteria" onClick={() => this._routePage('inbox')}><a href="#">Inbox</a></div>
          <br />
          <h5>Buying</h5>
          <div className="filterCriteria" onClick={() => this._routePage('itemsWon')}><a href="#">Items Won</a></div>
          <div className="filterCriteria" onClick={() => this._routePage('winning')}><a href="#">Winning Bids</a></div>
          <div className="filterCriteria" onClick={() => this._routePage('losing')}><a href="#">Losing Bids</a></div>
          <br />
          <h5>Selling</h5>
          <div className="filterCriteria" onClick={() => this._routePage('OnAuction')}><a href="#">Items on Auction</a></div>
          <div className="filterCriteria" onClick={() => this._routePage('manageFAQ')}><a href="#">Manage Auction FAQs</a></div>

        </div>

        <div className="col-md-8 off-set-2">
        {(this.state.route === 'itemsWon') ?
          <div>
            <ItemsWon userId={this.state.userId} paymentChange={this.paymentChange} submitPayment={this.submitPayment} submitted={this.state.submitted} />
          </div> : null}

        {(this.state.route === 'winning') ? 
          <div className="container title">
          <h3>Winning Bids</h3>
          <br />
            {this.state.itemsWinningBidOn.map((winningBid, index) => {
              return (<WinningBid key={index} parity={index % 2} item={winningBid}/>);
              })
            }
          </div> : null}

        {(this.state.route === 'losing') ?
          <div className="container title">
          <h3>Losing Bids</h3>
          <br />
            {this.state.itemsLosingBidOn.map((losingBid, index) => {
                return (<LosingBid key={index} parity={index % 2} item={losingBid}/>);
              })
            }
          </div> : null}

        {(this.state.route === 'OnAuction title') ?
          <div className="container title">
          <h3>Items on Auction</h3>
          <br />
            {this.state.itemsForSale.map((saleItem, index) => {
              return (<SaleItem old={true} key={index} parity={index % 2} item={saleItem}/>);
              }) 
            }
          </div> : null}

          {(this.state.route === 'inbox') ?
            <div>
              <div className="container title">
                <h3>Inbox</h3>
                <br />
              </div>
                <Inbox userId={this.state.userId} userName={this.state.userName}/>
            </div> : null}

          {(this.state.route === 'manageFAQ') ?
            <div>
              <div className="container title">
                <h3>Manage Auctions FAQ</h3>
                <br />
              </div>
                <ManageFAQ userId={this.state.userId} itemsForSale={this.state.itemsForSale}/>
            </div>: null}

        </div>
      </div>
    );
  }
}

