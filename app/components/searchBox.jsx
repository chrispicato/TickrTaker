import React, {Component} from 'react';
import Suggestion from './suggestions.jsx';

export default class SearchBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: '',
      focused: false,
      suggestions: []
    };
    this.enterText = this.enterText.bind(this);
    this.getTitles = this.getTitles.bind(this);
  }

  enterText () {
    var context = this;
    setTimeout(function () {
      context.setState({
        focused: !context.state.focused
      });
    }, 150);
  }

  getTitles () {
    this.setState({
      text: document.getElementById('search').value,
      suggestions: []
    });
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/api/allitems',
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        var filtered = res.filter(function (item) {
          return (item.title.includes(context.state.text));
        });
        context.setState({
          suggestions: filtered
        });
      }
    });
  }

  render () {
    return (
      <div onFocus={this.enterText} onBlur={this.enterText}>
        <form className="search-form" onSubmit={this.props.grabAuctions}>
          <input id="search" className="col-xs-6" onKeyDown={this.getTitles}/>
          <div className="col-xs-5 search-text">Search:</div>
          {this.state.focused ? 
            <div className="suggest col-xs-6">
              {this.state.suggestions.map((item) =>
                <Suggestion title={item}/>
              )}
            </div> : null
          }
        </form>
      </div>
    );
  }
}