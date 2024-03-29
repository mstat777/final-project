import styles from './Search.module.scss';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setDestination, 
            setPacks,
            setLodging, 
            setLodgingImages,
            setDestinationImages 
            } from "../../../store/slices/travel";
import { formatCoordinates } from '../../Functions/utils';
import Results from '../Results/Index';
import Suggestions from './Suggestions/Index';
import MainBtn from '../buttons/MainBtn/Index';

function Search() {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const { pathname } = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    // limiter les longueurs des inputs :
    const maxNameLength = 50;
    // limiter la date :
    const today = new Date().toISOString().slice(0,10);

    // on récupère du Store : la liste de toutes les destinations, les données de la destination fetchée et de l'hébergement fetché lié à cette destination
    const { allDestinations, 
            packs, 
            destination, 
            lodging,
            destinationImages } = useSelector((state) => state.allTravel);

    const [maxPrice, setMaxPrice] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    // afficher le placeholder de la date de naissance :
    const [inputDateType, setInputDateType] = useState("text");
    
    // le nom de la destination demandée, si vient de l'URL
    // c'est dans le cas on passe pas par la barre de recherche :
    const urlDestination = searchParams.get('destination');

    // stocker la valeur de l'input de la barre de recherche
    const [destinationInput, setDestinationInput] = useState("");

    // la destination à fetcher (soit venant de l'URL, soit de la barre de recherche) : 'urlDestination' ou 'destinationInput'. Une fois définie, on démarre la recherche :
    const [searchDestination, setSearchDestination] = useState("");

    const [searchDate, setSearchDate] = useState("");
    const [searchPrice, setSearchPrice] = useState("");

    // la destination est trouvée ? :
    const [isFound, setIsFound] = useState(false);

    // afficher le containeur des résultats :
    const [showResults, setShowResults] = useState(false);

    // afficher un message si la destination n'est pas trouvée  
    const [msg, setMsg] = useState("");

    // supprimer l'ancienne destination lors du rafraichissement, le message d'erreur, cacher les résultats, récupérer le nom de destination de la requête URL (si existe) pour le chercher :
    useEffect(() => {
        setIsFound(false);
        setMsg("");
        setShowResults(false);
        if (urlDestination){
            setSearchDestination(urlDestination);
        }
    }, []);

    // on cherche la destination dans la BDD, chaque fois 'searchDestination' est modifié :
    useEffect(() => {
        function checkDestination(){
            // si la destination existe dans la BDD :
            allDestinations.forEach((dest) => {
                if (dest.toLowerCase() === searchDestination) {
                    setIsFound(true);
                }
            }); 
            if (!isFound) {
                setMsg("Cette destination n'est pas disponible.");
                setShowResults(false);
            }
        }
        if (searchDestination){
            checkDestination();
        }
    },[searchDestination, searchDate, searchPrice]);

    // si destination trouvée, on cherche s'il y a des packs qui correspondent aux critères :
    useEffect(() => {
        async function searchPacks(){
            const res = await fetch(`${BASE_URL}/api/v.0.1/travel/destinations-and-packs`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    searchDestination,
                    departureDate,
                    maxPrice
                })
            });
            const json = await res.json();

            if(res.status === 200){
                // s'il y a des packs trouvés :
                if(json.datasPacks[0]){
                    dispatch(setDestination(json.datasDest[0]));
                    dispatch(setPacks(json.datasPacks));
                    dispatch(setLodging(json.datasLodg[0]));
                    dispatch(setDestinationImages(json.datasDestImg));
                    dispatch(setLodgingImages(json.datasLodgImg));
                } else {
                    setMsg("Aucun pack n'a été trouvé pour ces critères.\nVeuillez modifier la date ou le prix maximal.");
                    setShowResults(false);
                }
                navigate(`/search?destination=${searchDestination}`);
            } else {
                console.log(res.status);
            }
        }
        if (isFound) {
            setMsg('');
            searchPacks();
        } 
    },[isFound]);

    // formatter les coordonnées OpenStreetMaps de l'hébergement :
    useEffect(() => {
        if (lodging.coordinates) {
            formatCoordinates(lodging.coordinates);
        }  
    },[destination, lodging.coordinates]);

    // si on a les données de la destination et des packs enregistrées dans Store, on peut afficher les résultats :
    useEffect(() => {
        if (destination && packs[0] && destinationImages[0]) {
            setShowResults(true);
        }
    },[destination, packs[0], destinationImages[0]]);

    // pop-up erreur pour le champ maxPrice de la barre de recherche :
    function priceAlertMsg(e){
        e.target.setCustomValidity("Prix < 100000. Deux décimals max.");
    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsFound(false);
        setSearchDestination(destinationInput.trim().toLowerCase());
        setSearchDate(departureDate);
        setSearchPrice(maxPrice);
    }

    return <>
            <form onSubmit={handleSubmit} className={styles.search_form}>
                <div className={styles.inputs_ctn}>
                    <div>
                        <input type="text" 
                                name="destination" 
                                value={destinationInput}
                                onChange={(e) => setDestinationInput(e.target.value)}
                                onFocus={() => setMsg("")}
                                maxLength={maxNameLength}
                                placeholder="Destination"
                                required/>
                        <Suggestions 
                            destinationInput={destinationInput} 
                            setDestinationInput={setDestinationInput}/>     
                    </div>
                    <input type={inputDateType}  
                            name="departureDate" 
                            value={departureDate}
                            min={today}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            onFocus={() => {
                                setInputDateType("date"); 
                                setMsg("");}}
                            placeholder="Date de départ"/>
                    <input type="text" 
                            pattern="^\d{0,5}(\.\d{1,2})?$"
                            name="maxPrice" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onFocus={() => setMsg("")}
                            onInvalid={priceAlertMsg}
                            onInput={(e) => e.target.setCustomValidity("")}
                            placeholder="Prix max. / personne"/>
                </div>
                <div className={styles.button_ctn}>
                    <MainBtn type="submit" text="rechercher"/>
                </div>
            </form>

            {msg && <p className={styles.msg}>{msg}</p>}

            {/* Si on est sur la page d'accueil, on n'affiche pas "Results". On l'affiche si l'URL contient 'search' */}
            {(showResults && pathname.slice(1) === "search") && <Results/>}
        </>
}

export default Search;