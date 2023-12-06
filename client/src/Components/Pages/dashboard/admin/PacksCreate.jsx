import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPacksCreate(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [reference, setReference] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [duration, setDuration] = useState("");
    const [priceAdults, setPriceAdults] = useState("");
    const [priceChildren, setPriceChildren] = useState("");
    const [discount, setDiscount] = useState("");
    const [placesTotal, setPlacesTotal] = useState("");
    const [placesLeft, setPlacesLeft] = useState("");

    const [destinationID, setDestinationID] = useState("");

    const [msg, setMsg] = useState(null);

    // on récupère la liste de tous les hébérgements (array of objects) présent dans la BDD ('nom' et 'id') :
    const [destinations, setDestinations] = useState([]);
    useEffect(() => {
        async function getAllDestinations(){
            const result = await(await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/id/all`)).json();
            setDestinations(result.datas);
        }

        getAllDestinations();
    },[])

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Admin DB create form sent!");
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/packs/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                reference,
                departureDate,
                returnDate,
                duration,
                priceAdults,
                priceChildren,
                discount,
                placesTotal,
                placesLeft,
                destinationID})
        });
        const json = await res.json();
        
        if (res.status === 200) {
            setMsg(json.msg);
            //navigate("/db/admin/my-infos");
        } else {
            console.log("res.status = "+res.status);
        }
    }

    return(
        <main className={styles.user_db_main}>
            <h2>Créer une nouvelle destination</h2>

            <form onSubmit={handleSubmit} className={styles.db_create_form}>

                <p className={styles.msg_instructions}>IMPORTANT : Veuillez associer d'abord la destination correspondante à ce nouveau pack que vous voulez créer. Si elle n'est pas encore créée, merci de la créer d'abord avant de créer ce nouveau pack.</p>

                <label>
                    <span>Destination correspondante :</span>
                    <select value={destinationID} 
                            onChange={(e) => setDestinationID(e.target.value)}>
                        {destinations.map((dest) => (
                            <option value={dest.id} key={dest.id}>{dest.name}</option>
                        ))}
                    </select>
                </label>

                <label>  
                    <span>Numéro de référence :</span>
                    <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}/> 
                </label>

                <label>  
                    <span>Date de départ :</span>
                    <input type="date" 
                        name="departureDate" 
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}/>  
                </label>

                <label>  
                    <span>Date de retour :</span>
                    <input type="date" 
                        name="returnDate" 
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}/>  
                </label>

                <label>  
                    <span>Durée :</span>
                    <input type="text" 
                        name="duration" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}/>  
                </label>

                <label>  
                    <span>Prix/TTC/adulte :</span>
                    <input type="text" 
                        name="priceAdults" 
                        value={priceAdults}
                        onChange={(e) => setPriceAdults(e.target.value)}/>  
                </label>

                <label>  
                    <span>Prix/TTC/enfant :</span>
                    <input type="text" 
                        name="priceChildren" 
                        value={priceChildren}
                        onChange={(e) => setPriceChildren(e.target.value)}/>  
                </label>

                <label>  
                    <span>Réduction :</span>
                    <input type="text" 
                        name="discount" 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}/>  
                </label>

                <label>  
                    <span>Nombre de places total :</span>
                    <input type="text" 
                        name="placesTotal" 
                        value={placesTotal}
                        onChange={(e) => setPlacesTotal(e.target.value)}/>  
                </label>

                <label>  
                    <span>Nombre de places restantes :</span>
                    <input type="text" 
                        name="placesLeft" 
                        value={placesLeft}
                        onChange={(e) => setPlacesLeft(e.target.value)}/>  
                </label>
                
                <button type="submit">créer</button>
            </form>
            {msg && <p className={styles.msg}>{msg}</p>}

        </main>
    )
}

export default AdminDashboardPacksCreate;