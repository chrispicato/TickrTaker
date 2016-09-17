import React, {Component} from 'react';
import {Link} from 'react-router';
import {calcPrice, calcTime} from '../helpers.js';

export default class WinningBid extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentBid: undefined,
      currentPrice: undefined
    };
    this.calcPrice = this.calcPrice.bind(this);
  }

  componentDidMount () {
    $('img').on('error', function(){ //  Replace broken image links with the sample image
        $(this).attr('src', 'http://res.cloudinary.com/dijpyi6ze/image/upload/v1473715896/item_photos/zfaehmp20xculww4krs6.jpg');
    });
    
    this.setState({
      currentPrice: '$  ' + this.calcPrice().toFixed(2),
      timeRemaining: this.calcTime(),
      currentBid: '$ ' + this.props.item.myBid.price.toFixed(2)
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
    var thisItem = this.props.item.item; //it's passed in differently..
    if (thisItem) {
      //only run calculations when item is loaded
      return calcPrice(thisItem.startPrice, thisItem.endPrice, thisItem.startDate, thisItem.endDate);
    } else {
      return 0;
    }
  }

  calcTime () {
    if (this.props.item.item) {
      return calcTime(this.props.item.item.auctionEndDateByHighestBid);
    } else {
      return '...';
    }
  }
  
  render () {
    var button;
    var id = '/item/' + this.props.item.item.id;
    return (

      <div className={this.props.parity ? 'bid-entry auction-entry-odd col-xs-12' : 'bid-entry auction-entry-even col-xs-12'}>
        <div className="col-md-3 col-sm-12">
          <img className="img-fluid m-x-auto" src={this.props.item.item.picture}></img>
        </div>
        <div className="col-md-4 col-sm-12">
          <div className="row">
            <h3>{this.props.item.item.title || 'Sample Title'}</h3>
          </div>
          <div className="row item-description">
            {this.props.item.item.description.length > 90 ? this.props.item.item.description.slice(0, 90) + '...' : this.props.item.item.description}
          </div>
        </div>
        <div className="col-md-3 col-sm-12 item-ticker">
          {
            this.props.old ? ( ''
            ) : <div className="row current-price"> Current Price: <span id="winning-bid-price">{this.state.currentPrice}</span> </div>
          } 
          {
            this.props.old ? (
            <div className="row current-bid"> My Bid: <span>{this.state.currentBid}</span> </div>
            ) : <div className="row current-bid">Current Bid: <span>{this.state.currentBid}</span> </div>
          } 
          {
            this.props.old ? (
              <div className="row time-remaining"> Completed On: <span>{this.props.item.item.endDate}</span> </div> 
            ) : <div className="row time-remaining"> Time remaining: <span>{this.state.timeRemaining}</span> </div>
          }        
        </div>
        <div className = "col-md-2 col-sm-12">

          <div className="bid-button-container">
            <div className="bid-button">
          {
            this.props.old ? (
              <div>
                <Link className='btn btn-success' to={id}>Details</Link>
                <Link className='btn btn-success' to={id}> Pay </Link>
              </div>
            ) : 
              <div>
                <Link className='btn btn-success' to={id}> Review Item </Link>
                <Link className='btn btn-success' to={id}> Pay </Link>
              </div>
          }   
            </div>
          </div>
        </div>
      </div>
    );
  }
}