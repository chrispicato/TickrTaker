import React, {Component} from 'react';
import WinningBid from './winningBid.jsx';
import LosingBid from './losingBid.jsx';
import SaleItem from './saleItem.jsx';

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsForSale: [],
      itemsWinningBidOn: [],
      itemsLosingBidOn: []
    };
    this._routePage = this._routePage.bind(this);
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
            context.setState({'itemsForSale': items});
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
            var losingBids = [];
            items.forEach(function(item) {
              if (item.myBid.price === item.highestBid) {
                winningBids.push(item);
              } else {
                losingBids.push(item);
              }
            });
            console.log('bids are', winningBids, losingBids);
            context.setState({ //TODO winningBids can't be losingBids on the same item...
              'itemsWinningBidOn': winningBids, 
              'itemsLosingBidOn': losingBids
            });
            context.render();
          }
        });
      }
    });
  }

  _routePage(page) {
    this.setState({route: page});
  }

  render() {
    return (
      <div>
      
        <div className="col-md-2 sidebar">
          <h5>History</h5>
          <hr className="col-md-10 off-set-2"/>
          <br />
          <h5>As a Buyer</h5>
          <div className="filterCriteria" onClick={() => this._routePage('won')}><a href="#">Purchase History</a></div>
          <div className="filterCriteria" onClick={() => this._routePage('lost')}><a href="#">Lost Bids</a></div>
          <br />
          <h5>As a Seller</h5>
          <div className="filterCriteria" onClick={() => this._routePage('sold')}><a href="#">Sold History</a></div>
        </div>

        <div className="col-md-8 off-set-2">

        {(this.state.route === 'won') ?
          <div className="container title">
            <h3>Items Won in the Past</h3>
            <br />
            {this.state.itemsWinningBidOn.map((winningBid, index) => {
              return (<WinningBid old={true} key={index} parity={index % 2} item={winningBid}/>);
              })
            }
          </div>
          : null}

        {(this.state.route === 'lost') ?
          <div className="container title">
            <h3>Items You Have Lost</h3>
            <br />
            {this.state.itemsLosingBidOn.map((losingBid, index) => {
              return (<LosingBid old={true} key={index} parity={index % 2} item={losingBid}/>);
              })
            }
          </div>
          : null}

          {(this.state.route === 'sold') ?
            <div className="container title">
            <h3>Items You have Sold</h3>
            <br />
              {this.state.itemsForSale.map((saleItem, index) => {
                return (<SaleItem old={true} key={index} parity={index % 2} item={saleItem}/>);
                }) 
              }
            </div>
          : null}

        </div>
      </div>
    );
  }
}