import React from 'react';

export default function Skills() {
  let skill_arr = ["Python", "Django", "Node.JS", "ReactJS", "ExpressJS", "MongoDB", "SQlite", "SASS"]
  let skill_obj = skill_arr.map((item)=>
    <div className="softwares-list" key={item}> {item} </div>
  );
  return(
    <div>
      <div className="softwares-container"> {skill_obj} etc.</div>
    </div>
  );
}
