import styles from './search.module.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../../Functions/adminFetchData';
import { setResults } from '../../../../store/slices/dashboard';

function Search(){
    const dispatch = useDispatch();
    const { results } = useSelector((state) => state.dashboard);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [reference, setReference] = useState("");
    const [bookingDate, setBookingDate] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");
    
    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("handleSubmit() called");

        const res = await fetch("/api/v.0.1/admin/bookings", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({lastName})
        });
        const json = await res.json();
        if(res.status === 200){
            console.log("fetch successfull");
            dispatch(setResults(json));
            setShowResults(true);
        } else {
            console.log("res.status n'est pas OK!!!");
        }
    }

    return <>
        <form onSubmit={handleSubmit} className={styles.search_form}>
            <input type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom de famille"/>
            <input type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"/>  
            <input type="email" 
                    id="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"/>     
            <input type="number" 
                    id="reference" 
                    name="reference" 
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Num. Réf."/> 
            <input type="date" 
                    id="bookingDate" 
                    name="bookingDate"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}/>

            <button type="submit">rechercher</button>
        </form>

        { msg && <p className={styles.msg}>{msg}</p>}

    </>
}

export default Search;