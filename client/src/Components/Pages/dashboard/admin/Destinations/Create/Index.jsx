import styles from '../dashboard.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashDestinationsCreate(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [reference, setReference] = useState("");
    const [nameDest, setNameDest] = useState("");
    const [country, setCountry] = useState("");
    const [continent, setContinent] = useState("");
    const [overview, setOverview] = useState("");
    const [departurePlace, setDeparturePlace] = useState("");
    const [urlInitialImage, setUrlInitialImage] = useState("");
    const [lodgingID, setLodgingID] = useState("");

    const [msg, setMsg] = useState(null);

    // on récupère la liste de tous les hébergements (array of objects) présent dans la BDD ('nom' et 'id') :
    const [lodgings, setLodgings] = useState([]);
    useEffect(() => {
        async function getAllLodgings(){
            const result = await(await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/id/all`)).json();
            setLodgings(result.datas);
        }

        getAllLodgings();
    },[])

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Admin DB create form sent!");
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                reference,
                nameDest,
                country, 
                continent,
                overview,
                departurePlace,
                urlInitialImage,
                lodgingID})
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
                <p className={styles.msg_instructions}>IMPORTANT : Veuillez associer d'abord l'hébergement correspondant à cette destination. S'il n'est pas encore créé, merci de le créer d'abord avant de créer cette nouvelle destination.</p>

                <label>
                    <span>Hébergement correspondant :</span>
                    <select value={lodgingID} 
                            onChange={(e) => setLodgingID(e.target.value)}>
                        {lodgings.map((lodg) => (
                            <option value={lodg.id} key={lodg.id}>{lodg.name}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Nom de la destination :</span>
                    <input type="text" 
                        name="nameDest" 
                        value={nameDest}
                        onChange={(e) => setNameDest(e.target.value)}/>  
                </label>

                <label>  
                    <span>Numéro de référence :</span>
                    <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}/> 
                </label>

                <label>  
                    <span>Pays :</span>
                    <input type="text" 
                        name="country" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}/>
                </label>

                <label>  
                    <span>Continent :</span>
                    <input type="text" 
                        name="continent" 
                        value={continent}
                        onChange={(e) => setContinent(e.target.value)}/>
                </label>

                <label>  
                    <span>Description :</span>
                    <textarea name="overview" 
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)} />
                </label>

                <label>  
                    <span>Point(s) de départ :</span>
                    <textarea name="departurePlace" 
                        value={departurePlace}
                        onChange={(e) => setDeparturePlace(e.target.value)} />
                </label>

                <label>  
                    <input type="file" 
                        name="urlInitialImage" 
                        accept="image/jpg"
                        multiple={false}
                        value={urlInitialImage}
                        onChange={(e) => setUrlInitialImage(e.target.value)}/>
                </label>
                
                <button type="submit">créer</button>
            </form>
            {msg && <p className={styles.msg}>{msg}</p>}

        </main>
    )
}

export default AdminDashDestinationsCreate;