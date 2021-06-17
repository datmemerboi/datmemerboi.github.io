import React from 'react';
import { links } from '../constants';

const Links = () => {
  let linkRows = links.map((obj)=>
    <td key={obj.title}>
      <a
        className="blue-links"
        href={obj.url}
        title={obj.title}
        rel="noopener noreferrer"
        target="_blank"
      >
        <i className = {obj.icon} />
      </a>
    </td>
  );
  return (
    <div className="links-container">
      <table className="links-table">
        <tbody>
          <tr>
            {linkRows}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Links;
