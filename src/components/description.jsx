import React,{Component} from 'react';

export default class Description extends Component {
  constructor(props) {
    super(props);
    this.getContent = this.getContent.bind(this);
  };
  getContent() {
    var content = null;
    const dict = {
      "Test Case Optimization": {
        "link":"https://github.com/datmemerboi/Test-Case-Optimization",
        "builtArr":['Python', 'Jupyter Notebook', 'Django', 'SASS', 'ChartJS']
      },
      "Movie Checklist": {
        "link":"https://github.com/datmemerboi/Movie-Checklist",
        "builtArr":['Python', 'PyQt', 'MongoDB', 'Firebase DB']
      },
      "Quick Notes":{
        "link":"https://github.com/datmemerboi/Quick-Notes",
        "builtArr":['NodeJS', 'ElectronJS', 'MongoDB']
      },
      "TDC":{
        "link":"https://github.com/datmemerboi/TDC",
        "builtArr":['NodeJS', 'ExpressJS']
      }
    };
    switch (this.props.whichDesc) {
      case "Test Case Optimization":
        content=<TCO link={dict["Test Case Optimization"]["link"]} builtArr={dict["Test Case Optimization"]["builtArr"]} />;
        break;
      case "Movie Checklist":
        content=<MC link={dict["Movie Checklist"]["link"]} builtArr={dict["Movie Checklist"]["builtArr"]} />;
        break;
      case "Quick Notes":
        content=<QN link={dict["Quick Notes"]["link"]} builtArr={dict["Quick Notes"]["builtArr"]} />;
        break;
      case "TDC":
        content=<TDC link={dict["TDC"]["link"]} builtArr={dict["TDC"]["builtArr"]} />;
        break;
      default:
        content=null;
    }
    return content;
  }
  render() {
    var content = this.getContent();
    return (content);
  }
}
const TCO = (props) => {
  let built = props.builtArr.map((item)=>
    <div className="softwares-list built-list" key={item}> {item} </div>
  );
  return(
    <div className="desc-container">
      <p className="desc-content">Optimizing test cases of a software project using meta-heuristic algorithms</p>
      {built}
      <p className="desc-content">Checkout the <a className="red-links" href={props.link} target="_blank">git repo</a></p>
    </div>
  );
}
const MC = (props) => {
  let built = props.builtArr.map((item)=>
    <div className="softwares-list built-list" key={item}> {item} </div>
  );
  return(
    <div className="desc-container">
      <p className="desc-content">A desktop application for your movie checklist</p>
      {built}
      <p className="desc-content">Checkout the <a className="red-links" href={props.link} target="_blank">git repo</a></p>
    </div>
  );
}
const QN = (props) => {
  let built = props.builtArr.map((item)=>
    <div className="softwares-list built-list" key={item}> {item} </div>
  );
  return(
    <div className="desc-container">
      <p className="desc-content">A dekstop application to save your notes in a DB</p>
      {built}
      <p className="desc-content">Checkout the <a className="red-links" href={props.link} target="_blank">git repo</a></p>
    </div>
  );
}
const TDC = (props) => {
  let built = props.builtArr.map((item)=>
    <div className="softwares-list built-list" key={item}> {item} </div>
  );
  return(
    <div className="desc-container">
      <p className="desc-content">Patient management system for a clinic</p>
      {built}
      <p className="desc-content">Checkout the <a className="red-links" href={props.link} target="_blank">git repo</a></p>
    </div>
  );
}
