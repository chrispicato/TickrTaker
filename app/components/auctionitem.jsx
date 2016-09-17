import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';
import BuyerItemView from './buyerItemView.jsx';
import ManageFAQ from './manageFAQ.jsx';

export default class AuctionItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      item: undefined,
      currentPrice: undefined,
      bids: [],
      timeRemaining: undefined,
      userId: ''
    };

    this.getUser = this.getUser.bind(this);
    this.getItem = this.getItem.bind(this);
    this.getItemBids = this.getItemBids.bind(this);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcTime = this.calcTime.bind(this);
    //this.sendItemBid = this.sendItemBid.bind(this);
  }
  
  componentWillMount () {      // Set state properties with updated values that were calculated with calcTime and calcPrice
    this.getUser();
    this.getItemBids();
    this.getItem();
    this.setState({
      currentPrice: this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    });
  }

  componentDidMount () {       //  Set state properties with calculated values
    $('img').on('error', function(){ //  Replace broken image links with the sample image
        $(this).attr('src', 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg');
    });
    
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    }), 1000);

  }

  componentWillUnmount () {    // Clears up DOM elements that were created in ComponentDidMount method
    clearInterval(this.interval);
  }

  calcPrice () {
    var thisItem = this.state.item;
    if (thisItem) {
      //only run calculations when item is loaded
      if (this.state.bids.length > 0 && this.state.bids[0].price > thisItem.endPrice) {
        return calcPrice(thisItem.startPrice, this.state.bids[0].price, thisItem.startDate, thisItem.endDate);
      } else {
        return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
      }
    } else {
      return 0;
    }
  }

  calcTime () {
    if (this.state.item) {
      return calcTime(this.state.item.auctionEndDateByHighestBid);
    } else {
      return '...';
    }
  }

  getUser () {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/user_data',
      success: function(user) {
        context.setState({
          userId: user.user.id
        });
      },
      error: function(err) {
        console.log('There is an error, it\'s a sad day! D=');
      }
    });
  }

  getItem () {          // Ajax request to retrieve items from database
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/singleitem/' + this.props.params.id,
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        context.setState({
          item: res
        });
      }
    });
  }

  getItemBids () {     // Ajax request to retrieve bid values from database
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/items/bids/' + this.props.params.id,
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        var sorted = res.sort(function (a, b) {
          return a.price < b.price;
        });
        context.setState({bids: sorted});
      }
    });
  }

  // sendItemBid(e) {     // Ajax request to bid on an item
  //   e.preventDefault();
  //   if (this.state.bids[0] === undefined || $('#bid').val() >= this.state.bids[0].price + 1 && $('#bid').val() !== '') {
  //     var context = this;
  //     var newBids = this.state.bids.slice();
  //     newBids.push($('#bid').val());
  //     $.ajax({
  //       method: 'GET',
  //       url: '/api/user_data',
  //       success: function(user) {
  //         $.ajax({
  //           method: 'POST',
  //           url: '/api/items/bids/' + context.props.params.id,
  //           headers: {'Content-Type': 'application/json'},
  //           data: JSON.stringify({
  //             user: user, 
  //             bid: $('#bid').val()}),
  //           success: function (res) {
  //             $('#bid').val('');
  //             console.log(res);
  //             context.getItem();
  //             context.getItemBids();
  //             context.setState({
  //               bids: newBids
  //             });
  //           }
  //         });
  //       }
  //     });
  //   } else {
  //     $('#bid-error').show();
  //   }
  // }

  redirectToFAQ() {
    return (
        <div>
          <ManageFAQ userId={this.state.userId}/>
        </div>
      );
  }

  render () {
    
    var thisItem = this.state.item || { userId: null };
    var thisId = this.state.userId || '';
    var startDate = new Date(Date.parse(thisItem.startDate));
    var startDateFormatted = startDate.getMonth() + '/' + startDate.getDate() + '/' + startDate.getFullYear() + '  ' + startDate.getHours() % 12 + ':' + ((startDate.getMinutes() < 10) ? '0' + startDate.getMinutes() : startDate.getMinutes()) + (startDate.getHours() > 12 ? ' PM' : ' AM');
    var endDate = new Date(Date.parse(thisItem.auctionEndDateByHighestBid));
    var endDateFormatted = endDate.getMonth() + '/' + endDate.getDate() + '/' + endDate.getFullYear() + '  ' + endDate.getHours() % 12 + ':' + ((endDate.getMinutes() < 10) ? '0' + endDate.getMinutes() : endDate.getMinutes()) + (endDate.getHours() >= 12 ? ' PM' : ' AM');
    $('.alert .close').on('click', function(e) {
      $(this).parent().hide();
    });

    return (
      <div className="container auction-item-container">
      <div className="row">
        <div className="col-md-4">
          <img className="img-fluid" src={thisItem.picture}></img>
        </div>

        <div className="auction-item-details col-md-6 off-set-2">
          <h2>{thisItem.title}</h2>
          <br />
          <hr className="col-md-12 auction-item-title-hr"/>
          <br />
          <div className="col-md-12 auctionTitle">
          <p>Description: {thisItem.description}</p>
          </div>
          <br />
          <div className="col-md-12 auctionTitle">
            <p>Start Date: {startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString()}</p>
          </div>
          <br />
          <div className="col-md-12 auctionTitle">
            <p>End Date: {endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString()}</p>
          </div>
          <br />
          <div className="col-md-12 auctionTitle">
            <p>Time Remaining: {this.state.timeRemaining}</p>
          </div>
          <br />
          <div className="col-md-12 auctionTitle">
            <p>Current Price: {this.state.currentPrice}</p> 
          </div>
          <br />
          <div className="col-md-12 auctionTitle">
            <p>Highest Bid: {this.state.bids[0] !== undefined ? '$ ' + this.state.bids[0].price.toFixed(2) : ' No Bids' }</p>
          </div>
          {(thisId === thisItem.userId) ? 
            <div>
              <button type="button" className="btn btn-primary pull-xs-left" onClick={this.redirectToFAQ}>Edit FAQ</button>
            </div>
            :
            <div>
              <BuyerItemView userId={thisId} item={thisItem}/>
            </div>
          }

        </div>
        </div>
      </div>
    );
  }
}
