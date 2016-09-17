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
    if (this.state.subject === '' || this.state.message === '') {
      $('#message-error').show();
    } else {
      //send userId of buyer and seller
      $.ajax({
        method: 'POST',
        url: 'api/messages',
        data: {
          item: this.props.item,
          subject: this.state.subject,
          message: this.state.message,
          fromUser: this.props.userId
        },
        success: function(data) {
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
          <h4>{this.props.convo[0].subject}</h4>
          {this.props.convo.forEach(function(message) {
            return (
              <div>
                {this.props.message}
              </div>
              )
            })
          }

        <div className="col-md-12 auctionTitle">
          <button type="button" className="btn btn-primary pull-xs-left" onClick={() => this.setState({toggleReply: !this.state.toggleReply})}>Reply</button>
          <br />
        </div>
        
        {this.state.toggleReply ?
        <div className="col-md-12 auctionTitle">
          <form class = "form-inline" role = "form">
            <div class="form-group">
              <label class="sr-only" for="subject">Subject</label>
              <input class="form-control" id="inputdefault" type="text" placeholder="Enter the subject..." value={this.state.subject} onChange={this.handleSubject}/>
            </div>
            <div class="form-group">
              <label class="sr-only" for="message">Message</label>
              <textarea class="form-control" id="inputdefault" type="text" rows='10' placeholder="Enter your message..." value={this.state.message} onChange={this.handleMessage}/>
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