import React, { useState } from 'react';
import Fade from 'react-reveal/Fade';
import { projects } from '../constants';

export default function Projects(props) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState(null);
  var toggleDesc = (e) => {
    setExpanded(!expanded);
    setContent(e);
  }
  const getTechStack = () => {
    return content.stack.map((item) => {
      return (
        <div className="softwares-list built-list" key={item}> {item} </div>
      );
    });
  }
  const projectItems = projects.map((project) => {
    return (
      <div key={project.title}>
        <a className="project-links green-links" href="/" onClick={() => { toggleDesc(project) }}>
          {project.title}
        </a>
      </div>
    );
  });
  if (expanded) {
    return (
      <div className="projects-container">
        <h2 className="heading">Projects</h2>
        <div className="projects-link-div">
          <Fade>
            <div className="project-split">
              <a className="project-links green-links" href="/" onClick={() => { toggleDesc(content) }}>
                {content.title}
              </a>
            </div>
            <div className="project-split">
              <div className="desc-container">
                <p className="desc-content">{content.description}</p>
                {getTechStack()}
                <p className="desc-content">
                  Checkout the <a className="red-links" href={content.url} target="_blank" rel="noopener noreferrer">repo</a>
                </p>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    );
  } else {
    return (
      <div className="projects-container">
        <h2 className="heading">Projects</h2>
        <Fade>
          <div className="projects-link-div">
            {projectItems}
          </div>
        </Fade>
      </div>
    );
  }
}
