import styles from '../../search.module.scss';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResultsLodgings } from '../../../../../../store/slices/dashboard.js';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';

function AdminDashLodgingSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    const [name, setName] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    useEffect(() => {
        dispatch(setResultsLodgings([]));
        setMsg("");
        setName("");
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (name) {
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name})
            });
            const json = await res.json();
            if(res.status === 200){
                if (json.datas.length) {
                    dispatch(setResultsLodgings(json.datas));
                    setMsg("");
                } else {
                    dispatch(setResultsLodgings([]));
                    setMsg("Aucun résultat trouvé");
                }
            } else {
                console.log("res.status n'est pas OK!!!");
            }
        }
    }

    return <section>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="nameLodging" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Nom d'hébergement"/>

                <MainBtn type="submit" text="rechercher"/>
            </form>

            {msg && <p className={styles.msg_nok}>{msg}</p>}
        </section>
}

export default AdminDashLodgingSearch;