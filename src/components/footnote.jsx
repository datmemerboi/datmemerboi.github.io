import React, { Component } from 'react';

export default class Footnote extends Component {
  constructor(props){
    super(props);
    this.state={
      note:"Thank you for attending my TED talk"
    }
    this.changeNote = this.changeNote.bind(this)
  }
  changeNote() {
    const quotes = [
      "See you soon!", "Catch ya later!",
      "That's all folks!", "EndOfPage Error!",
      "Thank you for attending my TED talk"
    ];
    this.setState({
      note: quotes[Math.floor(Math.random() * quotes.length)]
    });
  }
  componentDidMount() {
    this.changeInterval = setInterval(this.changeNote, 3000)
  }
  componentWillUnmount() {
    clearInterval(this.changeInterval);
  }
  render() {
    return(
      <div className="footnote-container no-select">
        <em>{this.state.note}</em>
      </div>
    );
  }
}
