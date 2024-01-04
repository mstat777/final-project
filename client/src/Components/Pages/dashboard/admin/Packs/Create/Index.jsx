import styles from '../../admindash.module.scss';
import { useState, useEffect } from 'react';

function AdminDashPackCreate(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

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

    const [okMsg, setOkMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // on récupère la liste de toutes les destinations (array of objects) présentes dans la BDD ('nom' et 'id') :
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

        const formData = new FormData();
        formData.append('reference', reference);
        formData.append('departure_date', departureDate);
        formData.append('return_date', returnDate);
        formData.append('duration', duration);
        formData.append('price_adults', priceAdults);
        formData.append('price_children', priceChildren);
        formData.append('discount', discount);
        formData.append('places_total', placesTotal);
        formData.append('places_left', placesLeft);
        formData.append('destination_id', destinationID);

        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/packs/create`, {
            method: "POST",
            body: formData
        });
        const json = await res.json();
        
        if ( res.status === 200) {
            setOkMsg(json.msg);
        } else {
            setErrMsg(json.msg);
        }
    }

    return (
        <div className={styles.admin_db_section}>
            <h2>Créer un nouveau pack</h2>

            <form onSubmit={handleSubmit} 
                    className={styles.db_create_form}
                    encType="multipart/form-data">

                <p className={styles.msg_instructions}>IMPORTANT : Veuillez associer d'abord la destination correspondante à ce pack. Si elle n'est pas encore créée, merci de la créer d'abord avant de créer ce nouveau pack.</p>
                <label className={styles.create_label}>
                    <span>Destination correspondant :</span>
                    <select value={destinationID} 
                            onChange={(e) => setDestinationID(e.target.value)}>
                        {destinations.map((dest) => (
                            <option value={dest.id} key={dest.id}>{dest.name}</option>
                        ))}
                    </select>
                </label>

                <label className={styles.create_label}>
                    <span>Référence du pack :</span>
                    <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Date de départ :</span>
                    <input type="date" 
                        name="departureDate" 
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}/> 
                </label>
                <label className={styles.create_label}>
                    <span>Date de retour :</span>
                    <input type="date" 
                        name="returnDate" 
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}/> 
                </label>
                <label className={styles.create_label}>
                    <span>Durée :</span>
                    <input type="text" 
                        name="duration" 
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Prix adultes :</span>
                    <input type="text" 
                        name="priceAdults" 
                        value={priceAdults}
                        onChange={(e) => setPriceAdults(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Prix enfants :</span>
                    <input type="text" 
                        name="priceChildren" 
                        value={priceChildren}
                        onChange={(e) => setPriceChildren(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Réduction :</span>
                    <input type="text" 
                        name="discount" 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Nombre de places total :</span>
                    <input type="text" 
                        name="placesTotal" 
                        value={placesTotal}
                        onChange={(e) => setPlacesTotal(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Nombre de places restantes :</span>
                    <input type="text" 
                        name="placesLeft" 
                        value={placesLeft}
                        onChange={(e) => setPlacesLeft(e.target.value)}/>  
                </label>
                
                <button type="submit">créer</button>
            </form>
            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

        </div>
    )
}

export default AdminDashPackCreate;