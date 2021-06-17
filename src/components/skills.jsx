import React from 'react';
import { software } from '../constants';

export default function Skills() {
  return (
    <div>
      <div className="softwares-container">
        {
          software.map(item =>
            <div className="softwares-list" key={item}>
              {item}
            </div>
          )
        } etc.
      </div>
    </div>
  );
}
