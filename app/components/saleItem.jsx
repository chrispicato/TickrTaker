import React, {Component} from 'react';
import {Link} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';


export default class SaleItem extends Component {   //  This components displays items on sale
                                                    //  structure is used for losingBid.jsx and winnigBid.jsx
  constructor (props) {
    super(props);
    this.state = {
      currentBid: undefined,
      currentPrice: undefined
    };
    this.calcPrice = this.calcPrice.bind(this);
    console.log(this.props.item);
  }

  componentWillMount () {
    $('img').on('error', function(){ //  Replace broken image links with the sample image
        $(this).attr('src', 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg');
    });
    
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime(),
    });
    this.interval = setInterval(() => this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime()
    }), 1000);
    this.calcPrice = this.calcPrice.bind(this);
    this.calcTime = this.calcTime.bind(this);

  }
  componentWillUnmount () {
    this.interval && clearInterval(this.interval);
    this.interval = false;
  }


  calcPrice () {
    var thisItem = this.props.item; //  it's passed in differently..
    if (thisItem) {
      //  only run calculations when item is loaded
      return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
    } else {
      return 0;
    }
  }

  calcTime () {
    if (this.props.item) {
      return calcTime(this.props.item.auctionEndDateByHighestBid);
    } else {
      return '...';
    }
  }

  render () {
    var button;
  //console.log(this.props.item);
    var id = '/item/' + this.props.item.id;
    return (
      <div className={this.props.parity ? 'bid-entry auction-entry-odd col-xs-12' : 'bid-entry auction-entry-even col-xs-12'}>
        <div className="col-xs-3">
          <img className="img-fluid" src={this.props.item.picture}></img>
        </div>
        <div className="col-xs-4">
          <div className="row">
            <h3>{this.props.item.title || 'Sample Title'}</h3>
          </div>
          <div className="row item-description">
            {this.props.item.description.length > 90 ? this.props.item.description.slice(0, 90) + '...' : this.props.item.description}
          </div>
        </div>
        <div className="col-xs-3 item-ticker">
          <div className="row current-price"> Current Price: <span>{this.state.currentPrice}</span> </div>
          {
            this.props.old ? (
              <div className="row time-remaining"> Completed On: <span>{this.props.item.endDate}</span> </div> 
            ) : <div className="row time-remaining"> Time remaining: <span>{this.state.timeRemaining}</span> </div> 
          }
        </div>
        <div className = "col-xs-2">

          <div className="bid-button-container">
            <div className="bid-button">
              <Link className='btn btn-info' to={id}>Details</Link></div>
            </div>
        </div>
      </div>
    );
  }
}
