import styles from '../dashboard.module.css';
import { useState } from 'react';

function AdminDashboardLodgingsCreate(){

    const [nameHeb, setNameHeb] = useState("");
    const [typeHeb, setTypeHeb] = useState("");
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
        console.log("Signup form sent!");
        const res = await fetch("/api/v.0.1/user/signup", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nameHeb,
                typeHeb,
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
        setMsg(json.msg);
        
        if ( res.status === 201) {
            
        }
    }

    return(
        <main className={styles.user_db_main}>
            <h2>Créer un nouveau hébérgement</h2>

            <form onSubmit={handleSubmit} className={styles.db_create_form}>
                <input type="text" 
                        name="nameHeb" 
                        placeholder="Nom de l'hébérgement"
                        value={nameHeb}
                        onChange={(e) => setNameHeb(e.target.value)}/>     
                <input type="text" 
                        name="typeHeb" 
                        placeholder="Type de l'hébérgement"
                        value={typeHeb}
                        onChange={(e) => setTypeHeb(e.target.value)}/> 

                <textarea name="overview" 
                        placeholder="Présentation (description générale)"
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)}></textarea>
                <textarea name="facilities" 
                        placeholder="Equipement"
                        value={facilities}
                        onChange={(e) => setFacilities(e.target.value)}></textarea>
                <textarea name="rooms" 
                        placeholder="Logement"
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)}></textarea>    
                <textarea name="foodDrink" 
                        placeholder="Restauration"
                        value={foodDrink}
                        onChange={(e) => setFoodDrink(e.target.value)}></textarea>   
                <textarea name="mealPlans" 
                        placeholder="Formules"
                        value={mealPlans}
                        onChange={(e) => setMealPlans(e.target.value)}></textarea>   
                <textarea name="entertainment" 
                        placeholder="Loisirs"
                        value={entertainment}
                        onChange={(e) => setEntertainment(e.target.value)}></textarea>   
                <textarea name="children" 
                        placeholder="Enfants"
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}></textarea> 

                <input type="file" 
                        name="urlInitialImage" 
                        accept="image/jpg"
                        multiple={false}
                        value={urlInitialImage}
                        onChange={(e) => setUrlInitialImage(e.target.value)}/>

                <input type="text" 
                        name="tripadvisor" 
                        placeholder="La note Tripadvisor"
                        value={tripadvisor}
                        onChange={(e) => setTripadvisor(e.target.value)}/>
                <input type="text" 
                        name="coordinates" 
                        placeholder="Les coordonnées (latitude, longitude) en format décimal"
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}/>
                
                <button type="submit">créer</button>
            </form>
            {msg && <p className={styles.msg}>{msg}</p>}

        </main>
    )
}

export default AdminDashboardLodgingsCreate;