import styles from '../../search.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setResultsLodgings } from '../../../../../../store/slices/dashboard.js';

function AdminDashLodgingSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    // le champ de la barre de recherche :
    const [name, setName] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");
    
    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        if (!name) {
            dispatch(setResultsLodgings([]));
        } else {
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name})
            });
            const json = await res.json();
            if(res.status === 200){
                dispatch(setResultsLodgings(json.datas));
            } else {
                console.log("res.status n'est pas OK!!!");
            }
        }
    }

    return <div className={styles.admin_db_section}>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="nameLodging" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom d'hébergement"/>

                <button type="submit">rechercher</button>
            </form>

            { msg && <p className={styles.msg}>{msg}</p>}
        </div>
}

export default AdminDashLodgingSearch;