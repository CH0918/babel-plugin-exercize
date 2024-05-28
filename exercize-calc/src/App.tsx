import React, { useState } from 'react';
import Test from './Test';
import { testAdd, testSub, testMul, testDiv } from '@/util/tool';

const App: React.FC = () => {
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
      <h4>==========测试组件中浮点数操作=========</h4>
      <Test />
      <h4>==========测试工具函数中浮点数操作</h4>
      <button onClick={testAdd}>0.1 + 0.2</button>
      <br />
      <button onClick={testSub}>0.3 - 0.1</button>
      <br />
      <button onClick={testMul}>0.1 * 0.1</button>
      <br />
      <button onClick={testDiv}>0.3 / 0.1</button>
    </>
  );
};

export default App;
