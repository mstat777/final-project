import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from "../../Containers/Loading/Index";
import styles from './holidays.module.css';

function Holidays(){

    const [allDestinations, setAllDestinations] = useState(null);

    useEffect( () => {
        async function getData() {
            try {
                const result = await (
                await fetch("/api/v.0.1/travel/destination/all") 
                ).json();
                setAllDestinations(result.datas);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, []);

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
                                <Link to={"/"}>{destination.name}</Link>        
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