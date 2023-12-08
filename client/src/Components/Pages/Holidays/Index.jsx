import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from "../../Containers/Loading/Index";
import styles from './holidays.module.css';

function Holidays(){
    const { allContinents, 
            destinationsWithContinents } = useSelector((state) => state.allTravel);

    return (
        <main id="holidays">

        {!allContinents ? (
            <Loading />
        ) : ( 
            <>
            {allContinents.length > 0 && 
            <div className={styles.holidays_section}>

                <h2>Nos destinations</h2>

                {allContinents.map((cont, index) => {
                    return <div key={index}>

                        <h3 className={styles.continent_txt}>{cont}</h3>

                        <ul key={index} className={styles.continent_ctn}>
                            {destinationsWithContinents
                            .filter((dest) => dest.continent === cont)
                            .map((dest, index) => {
                                return(
                                    <li key={index}>
                                    <Link to={`/search?destination=${dest.name.toLowerCase()}`}
                                          className={styles.destination_ctn}>
                                        <img src={`../../img/destinations/${dest.url_initial_image}`} alt="" />
                                    
                                        <div className={styles.info_ctn}>
                                            <p>{dest.country}</p>
                                            <p className={styles.holidays_destination}>{dest.name}</p>                    
                                        </div>
                                    </Link>  
                                    </li>
                                )
                            })}
                        </ul>

                    </div>
                })}

            </div>
            }
            </>
        )}

        </main>
    )
}

export default Holidays;