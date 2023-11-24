import styles from './search.module.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchBookingByLastName } from '../../../Functions/adminFetchData';

function Search(){
    const { results } = useSelector((state) => state.dashboard);

    const [inputStates, setInputStates] = useState({
        lastName: "",
        firstName: "",
        email: "",
        reference: "",
        bookingDate: ""
    })
    
    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    async function searchBooking(){
        console.log("searchBooking() called");
        console.log("inputStates.lastName = "+inputStates.lastName);
        await fetchBookingByLastName(inputStates.lastName);
    }

    // lors du changement du texte dans la barre de recherche :
    function handleChange(e){
        setInputStates({
            ...inputStates,
            [e.target.name]: e.target.value
        });
    }
    
    // en cliquant le bouton "RECHERCHER" :
    function handleSubmit(e) {
        e.preventDefault();
        console.log("handleSubmit() called");
        searchBooking();
    }

    return <>
        <form onSubmit={handleSubmit} className={styles.search_form}>
            <input type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={inputStates.lastName}
                    onChange={handleChange}
                    placeholder="Nom de famille"/>
            <input type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={inputStates.firstName}
                    onChange={handleChange}
                    placeholder="Prénom"/>  
            <input type="email" 
                    id="email" 
                    name="email" 
                    value={inputStates.email}
                    onChange={handleChange}
                    placeholder="Prénom"/>     
            <input type="number" 
                    id="reference" 
                    name="reference" 
                    value={inputStates.reference}
                    onChange={handleChange}
                    placeholder="Num. Réf."/> 
            <input type="date" 
                    id="bookingDate" 
                    name="bookingDate"
                    value={inputStates.bookingDate}
                    onChange={handleChange}/>

            <button type="submit">rechercher</button>
        </form>

        { msg && <p className={styles.msg}>{msg}</p>}

    </>
}

export default Search;