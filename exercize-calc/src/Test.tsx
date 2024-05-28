import React from 'react';

const Test: React.FC = () => {
  return (
    <>
      <div>0.1 + 0.2 = {0.1 + 0.2}</div>
      <div>0.1 + 0.2 + 0.3 = {0.1 + 0.2 + 0.3}</div>
      <br />
      <div>0.3 - 0.1 = {0.3 - 0.1}</div>
      <div>0.3 - 0.1 - 0.1 = {0.3 - 0.1 - 0.1}</div>
      <br />
      <div>0.1 * 0.1 = {0.1 * 0.1}</div>
      <div>0.1 * 0.1 * 0.1 = {0.1 * 0.1 * 0.1}</div>
      <br />
      <div>0.3 / 0.1 = {0.3 / 0.1}</div>
    </>
  );
};

export default Test;
