import React, {Component} from 'react';
import Message from './message.jsx';


export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyerMessages: [],
      sellerMessages: []
    };
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: 'api/messages' + this.props.userId,
      success: function(messages) {
        //filter messages as a buyer and as a seller
        console.log('what is messages like? ------>', messages);
        messages.forEach(function(item) {
          //if i am the seller
          if (item.seller === this.props.userId) {
            this.state.sellerMessages.push(item);
          } else {
            //if i am the buyer
            this.state.buyerMessages.push(item);
          }
        });
      },
      error: function(err) {
        console.log('There is an error, it\'s a sad day D=');
      }
    });
    var filteredSellerMessages = this.filterMessages(this.state.sellerMessages);
    var filteredBuyerMessages = this.filterMessages(this.state.buyerMessages);
    this.setState({
      filteredSellerMessages: filteredSellerMessages,
      filteredBuyerMessages: filteredBuyerMessages
    })
  }

  filterMessages(messages) {
    //find out number of convos
    var convos = [];
    var results = [];
    messages.forEach(function(item) {
      if (convos.indexOf(item.conversation) === -1) {
        convos.push(item.conversation);
      }
    });
    //filter by convo
    convos.forEach(function(convo) {
      results.push(messages.filter(function(message) {
          return messages.conversation === convo;
        })
      );
    });
    //return array of array messages object [ [ {convo1 mes1}, {convo1 mes2} ], [ {convo2 mes1} ] ]
    return results;
  }

  render() {
    return (
        <div className="col-md-12">
          {/* seller messages */}
          <h5>Your Auction Listing</h5>
            {this.state.filteredSellerMessages.map((convo, index) => {
              return (
                <Message convo={convo} key={index} parity={index % 2}/>
                );
              })
            }

          {/* buyer messages */}
          <h5>Auctions you are interested in</h5>
            {this.state.buyerMessages.map((convo, index) => {
              return (
                  <Message convo={convo} key={index} parity={index % 2}/>
                );
            })
          }

        </div>
      );
  }
}