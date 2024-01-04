import styles from './Holidays.module.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Loading from "../../Containers/Loading/Index";

function Holidays(){
    const IMG_URL = process.env.REACT_APP_IMG_URL;
    const { allContinents, 
            destinationsWithContinents } = useSelector((state) => state.allTravel);

    // remonter au top de la page lors de chargement
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return <main id="holidays">
            {!allContinents[0] ? 
                <Loading /> :
                <section className={styles.holidays_section}>
                    <h1>Nos destinations</h1>

                    {allContinents.map((cont, i) => 
                        <ul key={i} className={styles.continent_ctn}>
                            <h2>{cont}</h2>

                            {destinationsWithContinents
                            .filter((dest) => dest.continent === cont)
                            .map((dest, i) => 
                                <li key={i}>
                                    <Link to={`/search?destination=${dest.name.toLowerCase()}`} className={styles.destination_ctn}>
                                        <img src={`${IMG_URL}/img/destinations/${dest.url_initial_image}`} 
                                                alt="image de la destination"/>
                                    
                                        <div className={styles.info_ctn}>
                                            <p>{dest.country}</p>
                                            <h3>{dest.name}</h3> 
                                        </div>
                                    </Link>  
                                </li>
                            )}
                        </ul>
                    )}
                </section>
            }
            </main>
}

export default Holidays;