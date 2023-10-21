import { useState, useEffect } from 'react';
import Loading from "../../Containers/Loading/Index";
import styles from './holidays.module.css';

function Holidays(){

    const [allDestinations, setAllDestinations] = useState(null);

    useEffect( () => {
        async function getData() {
            try {
                const result = await (
                await fetch("/api/v.0.1/travel/all-destinations") 
                ).json();
                setAllDestinations(result.data);
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
                <ul>
                    {allDestinations.length > 0 && (
                    <ul>
                        {allDestinations.map(destination => {
                            return(
                                <li key={destination.id}>
                                    {destination.nom}
                                </li>
                            )
                        })}
                    </ul>
                    )}
                </ul>
            </div>
            )}
        </main>
    )
}

export default Holidays;