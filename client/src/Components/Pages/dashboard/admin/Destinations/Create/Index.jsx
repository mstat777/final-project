import styles from '../../admindash.module.scss';
import { useState, useEffect } from 'react';

function AdminDashDestinationsCreate(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [reference, setReference] = useState("");
    const [nameDest, setNameDest] = useState("");
    const [country, setCountry] = useState("");
    const [continent, setContinent] = useState("");
    const [overview, setOverview] = useState("");
    const [departurePlace, setDeparturePlace] = useState("");

    const [imageInitial, setImageInitial] = useState(null);
    const [imagesAll, setImagesAll] = useState([]);

    const [lodgingID, setLodgingID] = useState("");

    const [okMsg, setOkMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

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

        const formData = new FormData();
        formData.append('reference', reference);
        formData.append('name', nameDest);
        formData.append('country', country);
        formData.append('continent', continent);
        formData.append('overview', overview);
        formData.append('departure_place', departurePlace);
        formData.append('lodging_id', lodgingID);
        formData.append('file', imageInitial);
        [...imagesAll].forEach((file, idx) => {
            formData.append(`file-${idx}`, file, file.name);
        });

        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinations/create`, {
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

    return(
        <div className={styles.admin_db_section}>
            <h2>Créer une nouvelle destination</h2>

            <form onSubmit={handleSubmit} 
                    className={styles.db_create_form} 
                    encType="multipart/form-data">

                <p className={styles.msg_instructions}>IMPORTANT : Veuillez associer d'abord l'hébergement correspondant à cette destination. S'il n'est pas encore créé, merci de le créer d'abord avant de créer cette nouvelle destination.</p>
                <label className={styles.create_label}>
                    <span>Hébergement correspondant :</span>
                    <select value={lodgingID} 
                            onChange={(e) => setLodgingID(e.target.value)}>
                        {lodgings.map((lodg) => (
                            <option value={lodg.id} key={lodg.id}>{lodg.name}</option>
                        ))}
                    </select>
                </label>

                <label className={styles.create_label}>
                    <span>Nom de la destination :</span>
                    <input type="text" 
                        name="nameDest" 
                        value={nameDest}
                        onChange={(e) => setNameDest(e.target.value)}/>  
                </label>

                <label className={styles.create_label}>
                    <span>Numéro de référence :</span>
                    <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}/> 
                </label>

                <label className={styles.create_label}>
                    <span>Pays :</span>
                    <input type="text" 
                        name="country" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}/>
                </label>

                <label className={styles.create_label}> 
                    <span>Continent :</span>
                    <input type="text" 
                        name="continent" 
                        value={continent}
                        onChange={(e) => setContinent(e.target.value)}/>
                </label>

                <label className={styles.create_label}>
                    <span>Description :</span>
                    <textarea name="overview" 
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)} />
                </label>

                <label className={styles.create_label}>
                    <span>Point(s) de départ :</span>
                    <textarea name="departurePlace" 
                        value={departurePlace}
                        onChange={(e) => setDeparturePlace(e.target.value)} />
                </label>

                <label className={styles.create_label}> 
                    <span>Image initiale :</span>
                    <input type="file" 
                        name="imageInitial" 
                        accept="image/jpg"
                        onChange={(e) => setImageInitial(e.target.files[0])}
                        />
                </label>
                <label className={styles.create_label}>
                    <span>Images pour slideshow :</span>
                    <input type="file" 
                        name="imageAll" 
                        accept="image/jpg"
                        multiple
                        onChange={(e) => setImagesAll(e.target.files)}
                        />
                </label>
                
                <button type="submit">créer</button>
            </form>
            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

        </div>
    )
}

export default AdminDashDestinationsCreate;