import styles from "./home.module.css";
import banner from '../../../assets/img/banner_02_big.jpg';

function Home() {

    async function handleSubmit(e) {
        e.preventDefault();
    }
    return (
        <main id="home">
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" id="destination" name="destination" placeholder="Destination (pays, ville)"/>
                <input type="date" id="departureDate" name="departureDate" placeholder="Date de départ"/>
                <input type="date" id="maxPrice" name="maxPrice" placeholder="Prix maximal"/>
                <button type="submit">rechercher</button>
            </form>
            <img src={banner} alt="banner" />
        </main>
    )
}

export default Home;