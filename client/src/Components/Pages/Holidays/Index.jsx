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
                <h2>Nos destinations</h2>
                {allContinents.length > 0 && 
                    <div className={styles.holidays_section}>
                        {allContinents.map((cont, index) => {
                            return <div key={index}>
                                <h3>{cont}</h3>
                                <ul key={index}>
                                    {destinationsWithContinents
                                    .filter((dest) => dest.continent === cont)
                                    .map((dest, index) => {
                                        return(
                                            <li key={index}>
                                                <Link to={`/search?destination=${dest.name.toLowerCase()}`} className={styles.holidays_destination}>{dest.name}</Link>        
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