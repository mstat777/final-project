import styles from './search.module.css';
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
            //setMsg("Vous n'avez rien rempli !");
            dispatch(setResultsLodgings([]));
        } else {
            console.log("handleSubmit() called");
            
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name})
            });
            const json = await res.json();
            if(res.status === 200){
                console.log(json.datas[0]);
                console.log("fetch successfull");
                dispatch(setResultsLodgings(json.datas));
            } else {
                console.log("res.status n'est pas OK!!!");
            }
        }
    }

    return <>
        <form onSubmit={handleSubmit} className={styles.search_form}>
            <input type="text" 
                    name="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom d'hébérgement"/>

            <button type="submit">rechercher</button>
        </form>

        { msg && <p className={styles.msg}>{msg}</p>}

    </>
}

export default AdminDashLodgingSearch;