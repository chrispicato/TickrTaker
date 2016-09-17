import React, {Component} from 'react';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      message: '',
      toggleReply: false
    };
  }

  handleSubject(e) {
    this.setState({subject: e.target.value});
  }

  handleMessage(e) {
    this.setState({message: e.target.value});
  }

  sendMessage(e) {
    e.preventDefault();
    //if input is empty
    if (this.state.subject === undefined || this.state.message === undefined) {
      $('#message-error').show();
    } else {
      //send userId of buyer and seller
    var context = this;
      $.ajax({
        method: 'POST',
        url: '/api/convomessages',
        headers: {'Content-Type': 'application/json'},
        data: JSON.stringify({
          conversation: context.props.key,
          subject: context.state.subject,
          message: context.state.message,
          buyerId: context.props.convo.buyer,
          sellerId: context.props.convo.seller
        }),
        success: function(data) {
          context.setState({
            subject: '',
            message: ''
          })
          console.log("your message is posted to the server", data);
        },
        error: function(err) {
          console.log("There is an error. It\'s a sad day! D=")
        }
      });
    }
  }

  render() {
    return (
        <div className="col-md-12 msg-container">
          <br />
          <h6>Subject: {this.props.convo[0].subject}</h6>
          <br />
          {this.props.convo.map((message) => {
            return (
              <div>
                Message: {message.message}
                <br />              
              </div>
              )
            })
          }

        <div className="col-md-12 auctionTitle">
          <br />
          <button type="button" className="btn btn-primary pull-xs-left" onClick={() => this.setState({toggleReply: !this.state.toggleReply})}>Reply</button>
          <br />
        </div>
        
        {this.state.toggleReply ?
        <div className="col-md-12 auctionTitle">
          <form class = "form-inline" role = "form">
            <div class="form-group">
              <input class="form-control" id="inputdefault" type="text" placeholder="Enter the subject..." value={this.state.subject} onChange={this.handleSubject}/>
            </div>
            <br />
            <div class="form-group">
              <textarea class="form-control" id="inputdefault" type="text" placeholder="Enter your message..." value={this.state.message} onChange={this.handleMessage}/>
            </div>
            <button type="submit" className="btn-btn-default" onSubmit={this.sendMessage}>Send</button>
          </form>
        </div>
        : null}

        <div className="alert alert-danger fade in" role="alert" id="message-error">
          <button type="button" className="close">×</button>
          <strong>Woah! </strong>Subject or message input is missing!
        </div>

      </div>
    );
  }
}