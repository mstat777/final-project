import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loading from "../../Containers/Loading/Index";
import styles from './holidays.module.css';

function Holidays(){

    const { allDestinations } = useSelector((state) => state.allTravel);

    return (
        <main id="holidays">
            {!allDestinations ? (
                <Loading />
            ) : (
            <div className={styles.holidays_section}>
                <h2>Nos destinations</h2>
                {allDestinations.length > 0 && (
                <ul>
                    {allDestinations.map((destination, index) => {
                        return(
                            <li key={index}>
                                <Link to={"/"}>{destination}</Link>        
                            </li>
                        )
                    })}
                </ul>
                )}
            </div>
            )}
        </main>
    )
}

export default Holidays;