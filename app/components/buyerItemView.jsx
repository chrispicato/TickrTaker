import React, {Component} from 'react';

export default class BuyerItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newSubject: '',
      newMessage: '',
      toggleInput: false,
      faqMessages: [],
      bids: []
    };
    this.handleSubject = this.handleSubject.bind(this);
    this.handleSubject = this.handleSubject.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this._onClick = this._onClick.bind(this);
    this.sendItemBid = this.sendItemBid.bind(this);
  }

  _onClick() {
    this.setState({toggleInput: !this.state.toggleInput});
  }

  componentWillMount() {
    var context = this;
    //getFAQ from server
    $.ajax({
      method: 'GET',
      url: '/api/faq/' + this.props.item.id,
      success: function(data) {
        context.setState({
          faqMessages: data
        });
      },
      error: function(err) {
        console.log('There is an error. It\'s a sad day! D=');
      }
    });
  }

  handleSubject(e) {
    this.setState({newSubject: e.target.value});
  }

  handleMessage(e) {
    this.setState({newMessage: e.target.value});
  }

  sendMessage(e) {
    e.preventDefault();
    //if input is empty
    if (this.state.newSubject === '' || this.state.newMessage === '') {
      $('#faq-error').show();
    } else {
      //send userId of buyer and seller
      $.ajax({
        method: 'POST',
        url: 'api/messages',
        data: {
          item: this.props.item,
          subject: this.state.newSubject,
          message: this.state.newMessage,
          fromUser: this.props.userId
        },
        success: function(data) {
          console.log("your message is posted to the server", data);
        },
        error: function(err) {
          console.log("There is an error. It\'s a sad day! D=");
        }
      });
    }
  }

  sendItemBid(e) {     // Ajax request to bid on an item
    e.preventDefault();
    if (this.props.bids[0] === undefined || $('#bid').val() >= this.props.bids[0].price + 1 && $('#bid').val() !== '') {
      var context = this;
      var newBids = context.props.bids.slice();
      newBids.push($('#bid').val());
      $.ajax({
        method: 'GET',
        url: '/api/user_data',
        success: function(user) {
          $.ajax({
            method: 'POST',
            url: '/api/items/bids/' + context.props.item.id,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
              user: user, 
              bid: $('#bid').val()}),
            success: function (res) {
              $('#bid').val('');
              console.log(res);
              context.props.getItem();
              context.props.getItemBids();
              context.setState({
                bids: newBids
              });
            }
          });
        }
      });
    } else {
      $('#bid-error').show();
    }
  }


  render() {    
  return (
    <div>
      <div className="col-md-12 auctionTitle">
        <form id="bid-form" onSubmit={this.props.sendItemBid}>
          <div >Enter Bid <input id="bid" type="number" step = "0.01" placeholder="Enter a bid"></input> </div>
          <button type="button" className="btn btn-primary pull-xs-right" onClick={this.sendItemBid}> Submit Bid</button>
        </form>
        </div>
        
        <div className="alert alert-danger fade in" role="alert" id="bid-error">
            <button type="button" className="close">×</button>
            <strong>Woah! </strong>Please place a valid bid. <small>Tip: Try value higher than the current highest bid!</small>
        </div>

        <div className="col-md-12 auctionTitle">
          <h4>FAQ</h4>
          {this.state.faqMessages.map((item) => {
            return (
                <div>
                  <h6>{item.question}</h6>
                  <p>{item.answer}</p>
                </div>
              )
            })
          }
        </div>

        <div className="col-md-12 auctionTitle">
          <p>Still have questions about this item?</p>
          <button type="button" className="btn btn-primary pull-xs-left" onClick={this._onClick}>Contact Seller</button>
          <br />
        </div>
        

        <div className="col-md-12 auctionTitle">
          <form class = "form-inline" role = "form">
          <div class="form-group">
          <input type="text" width="500" placeholder="Subject line" value={this.state.newSubject} onChange={this.handleSubject}/>
          </div>
          <div class="form-group">
          <textarea type="text" rows='10' col="500" name="message"  placeholder="Enter your message..." value={this.state.newMessage} onChange={this.handleMessage}/>
          </div>
          <button type="submit" className="btn-btn-default" onSubmit={this.sendMessage}>Send</button>
          </form>
        </div>


        <div className="alert alert-danger fade in" role="alert" id="faq-error">
            <button type="button" className="close">×</button>
            <strong>Woah! </strong>Subject or message input is missing!
        </div>

      </div>
    );
  }
} 
