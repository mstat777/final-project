import styles from './search.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBookings } from '../../../Functions/adminFetchData';
import { setResults } from '../../../../store/slices/dashboard';

function Search(){
    const dispatch = useDispatch();

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
        if (!lastName && !firstName && !email && !reference && !bookingDate) {
            //setMsg("Vous n'avez rien rempli !");
            dispatch(setResults([]));
        } else {
            console.log("handleSubmit() called");
            console.log(lastName);
            console.log(firstName);
            console.log(email);
            console.log(reference);
            console.log(bookingDate);

            const res = await fetch("/api/v.0.1/admin/bookings", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lastName,
                    firstName,
                    email,
                    reference,
                    bookingDate
                })
            });
            const json = await res.json();
            if(res.status === 200){
                console.log("fetch successfull");
                dispatch(setResults(json.datas));
            } else {
                console.log("res.status n'est pas OK!!!");
            }
        }
    }

    return <>
        <form onSubmit={handleSubmit} className={styles.search_form}>
            <input type="text" 
                    name="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom de famille"/>
            <input type="text" 
                    name="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"/>  
            <input type="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"/>     
            <input type="text" 
                    name="reference" 
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Num. Réf."/> 
            <input type="date" 
                    name="bookingDate"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}/>

            <button type="submit">rechercher</button>
        </form>

        { msg && <p className={styles.msg}>{msg}</p>}

    </>
}

export default Search;