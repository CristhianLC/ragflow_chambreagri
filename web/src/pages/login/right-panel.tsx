import SvgIcon from '@/components/svg-icon';
import styles from './index.less';

const LoginRightPanel = () => {
  return (
    <section className={styles.rightPanel}>
      <SvgIcon name="login-star" width={80}></SvgIcon>
    </section>
  );
};

export default LoginRightPanel;
