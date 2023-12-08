import styles from "./home.module.css";
import Search from "../../Containers/Search/Index";
//import banner from '../../../assets/img/banner_02_big.jpg';
import banner from '../../../assets/img/bg/pexels-asad-photo-maldives-1430677.jpg';
import Card from "../../Containers/Card/Index";
import Loading from "../../Containers/Loading/Index";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchBestPromoPack, fetchTopDestination } from '../../Functions/fetchData.js';

function Home() {
    const { pathname } = useLocation();
    //console.log(pathname);
    const {bestPromos} = useSelector((state) => state.allTravel);
    const {topDestinations} = useSelector((state) => state.allTravel);

    const [showBestPromo, setShowBestPromo] = useState(false);
    const [showTopDestination, setShowTopDestination] = useState(false);

    useEffect(() => {
        const fetchPromo = async () => {
            await fetchBestPromoPack();
            setShowBestPromo(true);
        }
        fetchPromo();
    },[])
    useEffect(() => {
        const fetchTop = async () => {
            await fetchTopDestination();
            setShowTopDestination(true);
        }
        fetchTop();
    },[])

    return (
        <main id="home" className={styles.home_main}>


            {(!showBestPromo && !showTopDestination && !bestPromos[0] && !topDestinations[0]) ? 
                <Loading /> : 
            <>
                <img src={banner} className={styles.home_banner} alt="banner"/>
                <Search/>
                {/* Ne pas afficher les offes Promo et Top, si on a déjà cherché une destination */}
                {pathname.slice(1) !== "search" && 
                    <>
                        {showBestPromo && <>
                            <h2>Offres promotionnelles</h2>
                            {bestPromos[0] &&
                                <div className={styles.cards_ctn}> 
                                {bestPromos.map((promo, index) => 
                                    <Card type="promo" data={promo} key={index}/>
                                )} 
                                </div>
                            }
                        </>}
            
                        {showTopDestination && <>
                            <h2>Top destinations</h2>
                            {topDestinations[0] &&
                                <div className={styles.cards_ctn}> 
                                {topDestinations.map((dest, index) => 
                                    <Card type="topOffer" data={dest} key={index}/>
                                )} 
                                </div>
                            }
                        </>}

                        {showTopDestination && <>
                            <h2>Top destinations</h2>
                            {topDestinations[0] &&
                                <div className={styles.cards_ctn}> 
                                {topDestinations.map((dest, index) => 
                                    <Card type="topOffer" data={dest} key={index}/>
                                )} 
                                </div>
                            }
                        </>}

                    </>
                }
            </>}

        </main>
    )
}

export default Home;