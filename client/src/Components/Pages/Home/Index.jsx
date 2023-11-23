import styles from "./home.module.css";
import Search from "../../Containers/Search/Index";
import banner from '../../../assets/img/banner_02_big.jpg';
import Card from "../../Containers/Card/Index";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchBestPromoPack, fetchTopDestination } from '../../Functions/fetchData.js';

function Home() {
    const { pathname } = useLocation();
    //console.log(pathname);
    const {bestPromo} = useSelector((state) => state.allTravel);
    const {topDestination} = useSelector((state) => state.allTravel);

    useEffect(() => {
        fetchBestPromoPack();
    },[])
    useEffect(() => {
        fetchTopDestination();
    },[])

    return (
        <main id="home" className={styles.home_main}>
            <img src={banner} alt="banner"/>
            <Search/>
            {pathname.slice(1) !== "search" && 
                <>
                <h2>Offres promotionnelles</h2>
                <Card type="promo" data={bestPromo}/>
    
                <h2>Top destinations</h2>
                <Card type="topOffer" data={topDestination}/>
                </>
            }
        </main>
    )
}

export default Home;