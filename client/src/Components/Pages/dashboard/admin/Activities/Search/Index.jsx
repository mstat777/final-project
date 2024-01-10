import styles from '../../search.module.scss';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResultsActivities } from '../../../../../../store/slices/dashboard.js';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';

function AdminDashActivitiesSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [type, setType] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    useEffect(() => {
        dispatch(setResultsActivities([]));
        setMsg("");
        setName("");
        setType("");
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (name || type) {
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/activities`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    type
                })
            });
            const json = await res.json();
            if(res.status === 200){
                if (json.datas.length) {
                    dispatch(setResultsActivities(json.datas));
                    setMsg("");
                } else {
                    dispatch(setResultsActivities([]));
                    setMsg("Aucun résultat trouvé");
                }
            } else {
                console.log("res.status n'est pas OK!!!");
            }
        }
    }

    return <section className={styles.admin_db_section}>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Nom d'activité"/>
                <input type="text" 
                        name="type" 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Type"/>  

                <MainBtn type="submit" text="rechercher"/>
            </form>

            { msg && <p className={styles.msg_nok}>{msg}</p>}
        </section>
}

export default AdminDashActivitiesSearch;