import styles from '../../admindash.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AdminDashLodgingCreate(){
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

    const [imageInitial, setImageInitial] = useState(null);
    const [imagesAll, setImagesAll] = useState([]);

    const [tripadvisor, setTripadvisor] = useState("");
    const [coordinates, setCoordinates] = useState("");

    const [okMsg, setOkMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', nameLodg);
        formData.append('type', typeLodg);
        formData.append('overview', overview);
        formData.append('facilities', facilities);
        formData.append('rooms', rooms);
        formData.append('food_drink', foodDrink);
        formData.append('meal_plans', mealPlans);
        formData.append('entertainment', entertainment);
        formData.append('children', children);
        formData.append('tripadvisor', tripadvisor);
        formData.append('coordinates', coordinates);
        formData.append('file', imageInitial);
        [...imagesAll].forEach((file, idx) => {
            formData.append(`file-${idx}`, file, file.name);
        });

        const res = await fetch(`${BASE_URL}/api/v.0.1/admin/lodgings/create`, {
            method: "POST",
            body: formData
        });
        const json = await res.json();
        
        if ( res.status === 200) {
            setOkMsg(json.msg);
        } else {
            setErrMsg(json.msg);
        }
    }

    return <section className={styles.admin_db_section}>
            <h1>Créer un nouveau hébergement</h1>

            <form onSubmit={handleSubmit} 
                    className={styles.db_create_form} 
                    encType="multipart/form-data">
                <label className={styles.create_label}>
                    <span>Nom de l'hébergement :</span>
                    <input type="text" 
                        name="nameLodg" 
                        value={nameLodg}
                        onChange={(e) => setNameLodg(e.target.value)}/>  
                </label>
                <label className={styles.create_label}>
                    <span>Type de l'hébergement :</span>
                    <input type="text" 
                        name="typeLodg" 
                        value={typeLodg}
                        onChange={(e) => setTypeLodg(e.target.value)}/> 
                </label>
                <label className={styles.create_label}>
                    <span>Présentation (description générale) :</span>
                    <textarea name="overview" 
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)} />
                </label>
                <label className={styles.create_label}>
                    <span>Equipement :</span>
                    <textarea name="facilities" 
                        value={facilities}
                        onChange={(e) => setFacilities(e.target.value)} />
                </label>
                <label className={styles.create_label}>
                    <span>Logement :</span>
                    <textarea name="rooms" 
                        value={rooms}
                        onChange={(e) => setRooms(e.target.value)} /> 
                </label>
                <label className={styles.create_label}>
                    <span>Restauration :</span>
                    <textarea name="foodDrink" 
                        value={foodDrink}
                        onChange={(e) => setFoodDrink(e.target.value)} /> 
                </label>
                <label className={styles.create_label}>
                    <span>Formules :</span>
                    <textarea name="mealPlans" 
                        value={mealPlans}
                        onChange={(e) => setMealPlans(e.target.value)} /> 
                </label>
                <label className={styles.create_label}>
                    <span>Loisirs :</span>
                    <textarea name="entertainment" 
                        value={entertainment}
                        onChange={(e) => setEntertainment(e.target.value)} />
                </label>
                <label className={styles.create_label}>
                    <span>Enfants :</span>
                    <textarea name="children" 
                        value={children}
                        onChange={(e) => setChildren(e.target.value)} />
                </label>

                <label className={styles.create_label}>
                    <span>Image initiale :</span>
                    <input type="file" 
                        name="imageInitial" 
                        accept="image/jpg"
                        onChange={(e) => setImageInitial(e.target.files[0])}
                        />
                </label>
                <label className={styles.create_label}>
                    <span>Images pour slideshow :</span>
                    <input type="file" 
                        name="imageAll" 
                        accept="image/jpg"
                        multiple
                        onChange={(e) => {
                            setImagesAll(e.target.files);
                        }}
                        />
                </label>
                       
                <label className={styles.create_label}>
                    <span>Note Tripadvisor :</span>
                    <input type="text" 
                        name="tripadvisor" 
                        value={tripadvisor}
                        onChange={(e) => setTripadvisor(e.target.value)}/>
                </label>

                <label className={styles.create_label}>
                    <span>Les coordonnées :</span>
                    <input type="text" 
                        name="coordinates" 
                        value={coordinates}
                        onChange={(e) => setCoordinates(e.target.value)}
                        placeholder="(format décimal)"/>
                </label>
                
                <button type="submit">créer</button>
            </form>
            { errMsg && <p className={styles.err_msg}>{errMsg}</p> }
            { okMsg && <p className={styles.ok_msg}>{okMsg}</p> }

        </section>
}

export default AdminDashLodgingCreate;