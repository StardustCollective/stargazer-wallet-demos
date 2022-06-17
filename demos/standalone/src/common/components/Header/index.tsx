import logo from 'src/res/stargazer.svg';

import styles from './index.module.scss';

const Header = (): JSX.Element => {
  return (
    <header className={styles.main}>
      <div>
        <img src={logo}></img>
      </div>
      <div>Stargazer Integration Demos (standalone)</div>
      <div></div>
    </header>
  );
};

export {Header};
