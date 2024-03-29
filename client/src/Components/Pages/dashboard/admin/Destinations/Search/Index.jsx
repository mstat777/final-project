import styles from '../../search.module.scss';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResultsDestinations } from '../../../../../../store/slices/dashboard.js';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';

function AdminDashDestinationSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [reference, setReference] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");
    
    useEffect(() => {
        dispatch(setResultsDestinations([]));
        setMsg("");
        setName("");
        setReference("");
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (name || reference) {
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
                if (json.datas.length) {
                    dispatch(setResultsDestinations(json.datas));
                    setMsg("");
                } else {
                    dispatch(setResultsDestinations([]));
                    setMsg("Aucun résultat trouvé");
                }
            } else {
                console.log(res.status);
            }
        }
    }

    return <section>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Nom de destination"/>   
                <input type="text" 
                        name="reference" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Num. Réf."/> 

                <MainBtn type="submit" text="rechercher"/>
            </form>

            {msg && <p className={styles.msg_nok}>{msg}</p>}
        </section>
}

export default AdminDashDestinationSearch;