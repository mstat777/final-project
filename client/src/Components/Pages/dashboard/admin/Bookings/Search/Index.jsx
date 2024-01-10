import styles from '../../search.module.scss';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResultsBookings } from '../../../../../../store/slices/dashboard.js';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';

function AdminDashBookingsSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const TOKEN = localStorage.getItem("auth");
    const dispatch = useDispatch();

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [reference, setReference] = useState("");
    const [bookingDate, setBookingDate] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    useEffect(() => {
        dispatch(setResultsBookings([]));
        setMsg("");
        setLastName("");
        setFirstName("");
        setEmail("");
        setReference("");
        setBookingDate("");
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (lastName || firstName || email || reference || bookingDate) {  
            const res = await fetch(`${BASE_URL}/api/v.0.1/booking/find`, {
                method: "post",
                headers: { "Content-Type": "application/json",
                            Authentication: "Bearer " + TOKEN },
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
                if (json.datas.length) {
                    dispatch(setResultsBookings(json.datas));
                    setMsg("");
                } else {
                    dispatch(setResultsBookings([]));
                    setMsg("Aucun résultat trouvé");
                }
            } else {
                console.log(res.status);
            }
        }
    }

    return <section>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="lastName" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Nom de famille"/>
                <input type="text" 
                        name="firstName" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Prénom"/>  
                <input type="email" 
                        name="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Email"/>     
                <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Num. réf. pack"/> 
                <input type="date" 
                        name="bookingDate"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        onFocus={() => setMsg("")}/>

                <MainBtn type="submit" text="rechercher"/>
            </form>

            { msg && <p className={styles.msg_nok}>{msg}</p>}
        </section>
}

export default AdminDashBookingsSearch;