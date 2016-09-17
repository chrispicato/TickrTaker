import React, {Component} from 'react';

export default class ManageFAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question:'',
      answer: '',
      faq: [{question: 'how are you?', answer: 'i am very sleepy'}]
    }
  }

  componentWillMount() {
    //fetch FAQ, picture and title passing itemId
    // this.props.itemsForSale.forEach(function(item) {
    //   $.ajax({
    //     method: 'GET',
    //     url: '/api/faq/' + item.id,
    //     success: function(data) {
    //       this,state.faq.push(data);
    //     },
    //     error: function(err) {
    //       console.log('There is an error, it\'s a sad day! D=');
    //     }
    //   })     
    // })
  }

  //edit data
  editFAQ() {
    $.ajax({
      method: 'POST',
      url: '/api/faqupdate',
      data: {
        question: this.state.question,
        answer: this.state.answer,
      },
      success: function(data) {
        console.log('FAQ updated =D')
      },
      error: function(err) {
        console.log('There is an error, it\'s a sad day! D=');
      }
    })
  }

  //delete data
  deleteFAQ() {

  }

  render() {
    if (false) {
      //no messages return null
    } else {

    return (
      <div className="container auction-item-container">
      <div className="row">
        {this.props.itemsForSale.map((item, index) => {
          return (
            <div>
            <div className="col-md-4">
              <img className="img-fluid" src={item.picture}></img>
            </div>
            <div className="auction-item-details col-md-6 off-set-2">
              <h2>{item.title}</h2>
              <br />
              <hr className="col-md-12 auction-item-title-hr"/>
              <br />
              <div className="col-md-12 auctionTitle">
                <h3>FAQ</h3>
                    <div>
                      <p><strong>{this.state.faq[index].questions}</strong></p>
                      <p>{this.state.faq[index].answer}</p>
                    </div>
                <h5>Add a FAQ</h5>
                <form class = "form-inline" role = "form">
                  <div class="form-group">
                    <label class="sr-only" for="question">Question</label>
                    <input class="form-control" id="inputdefault" type="text" placeholder="Enter the question..." value={this.state.question} onChange={this.handleQuestion}/>
                  </div>
                  <div class="form-group">
                    <label class="sr-only" for="answer">Answer</label>
                    <textarea class="form-control" id="inputdefault" type="text" rows='10' placeholder="Enter your answer..." value={this.state.answer} onChange={this.handleAnswer}/>
                  </div>
                  <button type="submit" className="btn-btn-default" onSubmit={this.sendMessage}>Send</button>
                </form>
              </div>
            </div>  
          </div>  
            )
          })
        }
        </div>
    </div>
    )}
  }
}