import React, {Component} from 'react';

export default class Suggestion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      title: props.title.title
    };
  }

  selectSuggestion (e) {
    document.getElementById('search').value = e.target.innerHTML;
    document.getElementById('search').focus();
  }

  render () {
    return (
      <div className="suggestion-item" onClick={this.selectSuggestion}>
        {this.state.title}
      </div>
    );
  }
}