import styles from '../../search.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setResultsDestinations } from '../../../../../../store/slices/dashboard.js';

function AdminDashDestinationSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    const [reference, setReference] = useState("");
    const [name, setName] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");
    
    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        if (!name && !reference) {
            //setMsg("Vous n'avez rien rempli !");
            dispatch(setResultsDestinations([]));
        } else {
            console.log("handleSubmit() called");
            
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/destinations`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    reference
                })
            });
            const json = await res.json();
            if(res.status === 200){
                console.log("fetch successfull");
                dispatch(setResultsDestinations(json.datas));
            } else {
                console.log("res.status n'est pas OK!!!");
            }
        }
    }

    return <div className={styles.admin_db_section}>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Destination"/>   
                <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Num. Réf."/> 

                <button type="submit">rechercher</button>
            </form>

            { msg && <p className={styles.msg}>{msg}</p>}
        </div>
}

export default AdminDashDestinationSearch;