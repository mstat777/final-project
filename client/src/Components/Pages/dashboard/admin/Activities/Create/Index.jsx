import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashActivitiesCreate(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [nameAct, setNameAct] = useState("");
    const [typeAct, setTypeAct] = useState("");
    const [overview, setOverview] = useState("");
    const [priceAdults, setPriceAdults] = useState("");
    const [priceChildren, setPriceChildren] = useState("");
    const [placesTotal, setPlacesTotal] = useState("");
    const [placesLeft, setPlacesLeft] = useState("");
    // pour associer l'activité à une destination :
    // (à passer dans le body pour le 2ème Write)
    const [destinationID, setDestinationID] = useState("");
    const [destinations, setDestinations] = useState([]);

    const [msg, setMsg] = useState(null);
    
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
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/activities/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nameAct,
                typeAct, 
                overview,
                priceAdults,
                priceChildren,
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

    return (
        <div className={styles.admin_db_section}>
            <h2>Créer une nouvelle destination</h2>

            <form onSubmit={handleSubmit} className={styles.db_create_form}>
                <p className={styles.msg_instructions}>IMPORTANT : Cette nouvelle activité doit d'abord être associée à une destination correspondante. Si la destination n'est pas encore créée, merci de la créer d'abord avant de créer cette nouvelle activité.</p>

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
                    <span>Nom de l'activité :</span>
                    <input type="text" 
                        name="nameAct" 
                        value={nameAct}
                        onChange={(e) => setNameAct(e.target.value)}/>  
                </label>

                <label>  
                    <span>Type de l'activité :</span>
                    <input type="text" 
                        name="typeAct" 
                        value={typeAct}
                        onChange={(e) => setTypeAct(e.target.value)}/> 
                </label>

                <label>  
                    <span>Description :</span>
                    <textarea name="overview" 
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)} />
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
                    <span>Nombre de places total :</span>
                    <input type="text" 
                        name="placesTotal" 
                        value={placesTotal}
                        onChange={(e) => setPlacesTotal(e.target.value)}/> 
                </label>

                <label>  
                    <span>Nombre de places disponibles :</span>
                    <input type="text" 
                        name="placesLeft" 
                        value={placesLeft}
                        onChange={(e) => setPlacesLeft(e.target.value)}/> 
                </label>

                <button type="submit">créer</button>
            </form>
            {msg && <p className={styles.msg}>{msg}</p>}

        </div>
    )
}

export default AdminDashActivitiesCreate;