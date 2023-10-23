import styles from "./home.module.css";
import Search from "../../Containers/Search/Index";
import banner from '../../../assets/img/banner_02_big.jpg';

function Home() {

    return (
        <main id="home" className={styles.home_main}>
            <Search />
            <img src={banner} alt="banner" />
        </main>
    )
}

export default Home;