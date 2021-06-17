import React, { lazy } from 'react';
import './static/css/App.css';
import Fade from 'react-reveal/Fade';

const Links = lazy(() => import('./components/links.jsx')),
      Projects = lazy(() => import('./components/projects.jsx')),
      Footnote = lazy(() => import('./components/footnote.jsx')),
      Skills = lazy(() => import('./components/skills.jsx'));

function App() {
  return (
    <div>
      <header>
        <h1 className="title">SHRAVAN S DAVE</h1>
      </header>
      <hr className="seperator"/>
      <div className="container">
        <Fade delay={100}>
          <p>Full stack developer interested in Software Development, Database Management, Cinema, Music and more</p>
        </Fade>
        <br className="no-select"/>
        <Fade delay={250}>
          <Skills />
        </Fade>
        <br className="no-select"/>
        <Fade delay={250}>
          <Projects/>
        </Fade>
        <br className="no-select"/>
        <Fade delay={250}>
          <Links />
        </Fade>
        <br className="no-select"/>
        <Footnote/>
      </div>
    </div>
  );
}

export default App;
