import React,{Component} from 'react';
import Description from './description.jsx';
import Fade from 'react-reveal/Fade';

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = { expandDesc: false }
    this.toggleDesc = this.toggleDesc.bind(this);
  }
  toggleDesc(e) {
    this.setState( current=>({
      expandDesc: !(current.expandDesc),
      whichDesc: e.whichDesc
    }));
  }
  render() {
    const projects = ["Test Case Optimization", "Movie Checklist", "Quick Notes", "TDC"]
    {var projectItems = projects.map((name)=>
        <div key={name}>
          <a
            className="project-links green-links"
            onClick={()=>{  this.toggleDesc({"whichDesc": name})  }}
          >
            {name}
          </a>
        </div>
    )};
    if(!(this.state.expandDesc)) {
      return(
        <div className="projects-container">
          <h2 className="heading">Projects</h2>
          <Fade>
          <div className="projects-link-div">
              {projectItems}
          </div>
          </Fade>
        </div>
      )
    }
    else {
      return(
        <div className="projects-container">
          <h2 className="heading">Projects</h2>
          <div className="projects-link-div">
            <Fade>
              <div className="project-split">
                <a
                  className="project-links green-links"
                  onClick={()=>{  this.toggleDesc({"whichDesc": this.state.whichDesc})  }}
                >
                  {this.state.whichDesc}
                </a>
                </div>
                <div className="project-split">
                <Description whichDesc={this.state.whichDesc}/>
                </div>
              </Fade>
          </div>
        </div>
      )
    }
  }
}
