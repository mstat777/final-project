import styles from '../../search.module.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setResultsPacks } from '../../../../../../store/slices/dashboard.js';

function AdminDashPackSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    const [name, setName] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");
    
    // en cliquant le bouton "RECHERCHER" :
    async function handleSubmit(e) {
        e.preventDefault();
        if (!name) {
            //setMsg("Vous n'avez rien rempli !");
            dispatch(setResultsPacks([]));
        } else {
            console.log("handleSubmit() called");
            
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name})
            });
            const json = await res.json();
            if(res.status === 200){
                console.log("fetch successfull");
                dispatch(setResultsPacks(json.datas));
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
                        placeholder="Nom d'hébérgement"/>

                <button type="submit">rechercher</button>
            </form>

            { msg && <p className={styles.msg}>{msg}</p>}
        </div>
}

export default AdminDashPackSearch;