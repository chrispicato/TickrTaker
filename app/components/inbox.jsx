import React, {Component} from 'react';
import Message from './message.jsx';


export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyerMessages: [],
      sellerMessages: [],
      filteredSellerMessages: {},
      filteredBuyerMessages: {},
      noMessage: false
    };
      // this.createSellerConvo = this.createSellerConvo.bind(this);
      // this.createbuyerConvo = this.createbuyerConvo.bind(this);
  }

  componentWillMount() {
    var context = this;
    //console.log('user ID----->', this.props.userId);
    $.ajax({
      method: 'GET',
      url: 'api/messages/' + this.props.userId,
      success: function(messages) {
        //filter messages as a buyer and as a seller
        var buyer = [];
        var seller = [];
        if (messages.length === 0) {
          context.setState({noMessage: true})
        }
        messages.forEach(function(item) {
          //if i am the seller
          if (item.seller === context.props.userId) {
            seller.push(item);
          } else {
            //if i am the buyer
            buyer.push(item);
          }
        });
        context.setState({
          buyerMessages: buyer,
          sellerMessages: seller
        })
  
        var filteredSellerMessages = context.filterMessages(context.state.sellerMessages);
        var filteredBuyerMessages = context.filterMessages(context.state.buyerMessages);
        context.setState({
          filteredSellerMessages: filteredSellerMessages,
          filteredBuyerMessages: filteredBuyerMessages
        })
      },
      error: function(err) {
        console.log('There is an error, it\'s a sad day D=');
      }
    });
  }

  filterMessages(messages) {
    var convos = {};
    //arrage messages by conversations, if conversation# does not exist create one and push mesage to array
    //{ converation#: [{mes1}, {mes2}] }

    messages.forEach(function(item) {
      if (convos.hasOwnProperty(item.conversation)) {
        convos[item.conversation].push(item);
      } else {
        convos[item.conversation] = [item];
      }
    });

    return convos;
  }

  createSellerConvo(){
    for (var key in this.state.filteredSellerMessages) {
      return (
        <div>
          <Message userId={this.props.userId} convo={this.state.filteredSellerMessages[key]} key={key}/>
        </div>
        );
    }    
  }

  createBuyerConvo(){
    for (var key in this.state.filteredBuyerMessages) {
      return (
        <div>
          <Message userId={this.props.userId} convo={this.state.filteredBuyerMessages[key]} key={key}/>
        </div>
        );
    }    
  }

  render() {
    return (
        <div className="col-md-12">
        {this.state.noMessage ?

          <div>
          <br/ >
          <h6> You have no messages </h6>
          </div>
          :
          <div>
          {/* seller messages */}
          <h5 className="text-muted">Your Auction Listing</h5>
          {(this.state.sellerMessages.length === 0) ?
            <div>
              <br />
              <h6>you have zero message</h6>
              <br />
            </div> 
            :
            <div>
            {this.createSellerConvo()}
            </div>
          }

          {/* buyer messages */}
          <h5 className="text-muted">Auctions you are interested in</h5>
          {(this.state.buyerMessages.length === 0) ?
            <div>
            <br />
            <h6>you have zero message</h6>
            <br />
            </div> 
            :
            <div>
            {this.createBuyerConvo()}
            </div>
          }
          </div>

        }

        </div>
      );
  }
}