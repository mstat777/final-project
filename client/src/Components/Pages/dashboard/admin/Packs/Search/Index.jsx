import styles from '../../search.module.scss';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResultsPacks } from '../../../../../../store/slices/dashboard.js';
import MainBtn from '../../../../../Containers/buttons/MainBtn/Index';

function AdminDashPackSearch(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const dispatch = useDispatch();

    const [name, setName] = useState("");

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    useEffect(() => {
        dispatch(setResultsPacks([]));
        setMsg("");
        setName("");
    }, [])
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (name) {
            const res = await fetch(`${BASE_URL}/api/v.0.1/admin/packs`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name})
            });
            const json = await res.json();
            if(res.status === 200){
                dispatch(setResultsPacks(json.datas));
                setMsg("");
            } else if(res.status === 404) {
                dispatch(setResultsPacks([]));
                setMsg(json.msg);
            } else {
                console.log(res.status);
            }
        }
    }

    return <section>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <input type="text" 
                        name="namePack" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setMsg("")}
                        placeholder="Nom de destination"/>

                <MainBtn type="submit" text="rechercher"/>
            </form>

            { msg && <p className={styles.msg_nok}>{msg}</p>}
        </section>
}

export default AdminDashPackSearch;