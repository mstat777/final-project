import { useNavigate } from 'react-router-dom';
import styles from '../../admindash.module.css';
import { useState } from 'react';

function AdminDashPackCreate(){
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [nameLodg, setNameLodg] = useState("");
    const [typeLodg, setTypeLodg] = useState("");
    const [overview, setOverview] = useState("");
    const [facilities, setFacilities] = useState("");
    const [rooms, setRooms] = useState("");
    const [foodDrink, setFoodDrink] = useState("");
    const [mealPlans, setMealPlans] = useState("");
    const [entertainment, setEntertainment] = useState("");
    const [children, setChildren] = useState("");

    const [urlInitialImage, setUrlInitialImage] = useState("");

    const [tripadvisor, setTripadvisor] = useState("");
    const [coordinates, setCoordinates] = useState("");

    const [msg, setMsg] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Admin DB create form sent!");
        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nameLodg,
                typeLodg,
                overview, 
                facilities,
                rooms,
                foodDrink,
                mealPlans,
                entertainment,
                children,
                urlInitialImage,
                tripadvisor,
                coordinates})
        });
        const json = await res.json();
        
        if ( res.status === 200) {
            setMsg(json.msg);
            //navigate("/db/admin/my-infos");
        } else {
            console.log("res.status = "+res.status);
        }
    }

    return(
        <main className={styles.user_db_main}>
            <h2>Créer un nouveau hébérgement</h2>

            <form onSubmit={handleSubmit} className={styles.db_create_form}>
                <label>
                    <span>Nom de l'hébérgement :</span>
                    <input type="text" 
                        name="nameLodg" 
                        value={nameLodg}
                        onChange={(e) => setNameLodg(e.target.value)}/>  
                </label>
                <label>  
                    <span>Type de l'hébérgement :</span>
                    <input type="text" 
                        name="typeLodg" 
                        value={typeLodg}
                        onChange={(e) => setTypeLodg(e.target.value)}/> 
                </label>
                <label>  
                    <span>Présentation (description générale) :</span>
                    <textarea name="overview" 
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)} />
                </label>
                <label>  
                    <span>Equipement :</span>
                    <textarea name="facilities" 
                        value={facilities}
                        onChange={(e) => setFacilities(e.target.value)} />
                </label>
                <label>  
                    <span>Logement :</span>
                    <textarea name="rooms" 
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)} />
                </label>
                <label>  
                    <span>Restauration :</span>
                    <textarea name="foodDrink" 
                        value={foodDrink}
                        onChange={(e) => setFoodDrink(e.target.value)} />
                </label>
                <label>  
                    <span>Formules :</span>
                    <textarea name="mealPlans" 
                        value={mealPlans}
                        onChange={(e) => setMealPlans(e.target.value)} />
                </label>
                <label>  
                    <span>Loisirs :</span>
                    <textarea name="entertainment" 
                        value={entertainment}
                        onChange={(e) => setEntertainment(e.target.value)} />
                </label>
                <label>  
                    <span>Enfants :</span>
                    <textarea name="children" 
                        value={children}
                        onChange={(e) => setChildren(e.target.value)} />
                </label>
                <label>  
                    <input type="file" 
                        name="urlInitialImage" 
                        accept="image/jpg"
                        multiple={false}
                        value={urlInitialImage}
                        onChange={(e) => setUrlInitialImage(e.target.value)}/>
                </label>
                <label>  
                    <span>Note Tripadvisor :</span>
                    <input type="text" 
                        name="tripadvisor" 
                        value={tripadvisor}
                        onChange={(e) => setTripadvisor(e.target.value)}/>
                </label>
                <label>  
                    <span>Les coordonnées (format décimal) :</span>
                    <input type="text" 
                        name="coordinates" 
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}/>
                </label>
                
                <button type="submit">créer</button>
            </form>
            {msg && <p className={styles.msg}>{msg}</p>}

        </main>
    )
}

export default AdminDashPackCreate;