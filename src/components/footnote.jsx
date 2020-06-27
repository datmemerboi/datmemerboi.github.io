import React,{Component} from 'react';

export default class Footnote extends Component {
  constructor(props){
    super(props);
    this.state={
      note:"Thank you for attending my TED talk"
    }
    this.changeNote = this.changeNote.bind(this)
  }
  changeNote() {
    const randomArray = ["See you soon!", "Catch ya later!", "That's all folks!", "EndOfPage Error!", "Thank you for attending my TED talk"]
    this.setState({
      note:randomArray[Math.floor(Math.random() * randomArray.length)]
    })
  }
  componentDidMount() {
    this.changeInterval = setInterval( this.changeNote, 3000 )
  }
  componentWillUnmount() {
    clearInterval(this.changeInterval);
  }
  render() {
    return(
      <div className="footnote-container no-select">
        {this.state.note}
      </div>
    );
  }
}
