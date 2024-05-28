import { AppContext } from '@/store';
import { useContext, useState } from 'react';
/**
 * App
 */

function App() {
  const {
    localeData,
    abc
  } = useContext(AppContext);
  const title = localeData('intl1');
  const desc = localeData('intl2');
  const desc2 = `desc`;
  const desc3 = localeData('intl3', title + desc, desc2);
  return <div className='app' title={'测试'}>
      <img src={Logo} />
      <h1>{title}</h1>
      <p>{desc}</p>
      <div>{'中文'}</div>
      <div>{localeData('intl4')}</div>
    </div>;
}