import { Divider } from 'antd';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <div className="search-content" style={{ marginTop: 20 }}>
            </div>
            <Divider />
            <div style={{ margin: 50 }}></div>
            <Divider />
        </div>
    )
}

export default HomePage;