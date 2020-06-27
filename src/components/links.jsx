import React from 'react';

const Links = () => {
  const links = [
    {"title":"Github Profile","href":"https://github.com/datmemerboi","inner":"fa fa-github"},
    {"title":"View Resume","href":"https://tinyurl.com/MemerBoiResume","inner":"fa fa-link"},
    {"title":"Linkedin Profile","href":"https://www.linkedin.com/in/datmemerboi/","inner":"fa fa-linkedin"}
  ]

  let links_obj = links.map( (dict, ind)=>
    <td key={dict.title}>
      <a
        className="blue-links"
        href={dict.href}
        target="_blank"
        title={dict.title}
      >
      <i className={dict.inner}></i>
      </a>
    </td>
  );
  return (
    <div className="links-container">
      <table className="links-table">
        <tbody>
          <tr>
            {links_obj}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Links;
