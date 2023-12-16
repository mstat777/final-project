import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { fetchDestinationAllData } from "../../Functions/fetchData";
import { formatCoordinates } from "../../Functions/utils";

function WithFetchDetail({child}){
    const Child = child;

    const { pathname } = useLocation();

    const urlDestination = pathname.slice(8);
    //console.log("urlDestination = "+urlDestination);

    const { lodging, 
            lodgingImages,
            packs,
            activities } = useSelector((state) => state.allTravel);

    // on récupère les données de l'hébérgement si pas encore chargé :
    useEffect(() => {
        if (!lodging || !lodgingImages[0] || !packs[0] || !activities[0]) {
            fetchDestinationAllData(urlDestination);
        } 
    }, []);

    // formatter les coordonnées OpenStreetMaps de l'hébérgement :
    useEffect(() => {
        if (lodging.coordinates) {
            formatCoordinates(lodging.coordinates);
        }  
    },[lodging.coordinates]);
    
    return <> 
        {(lodging && lodgingImages[0] && packs[0] && activities[0]) && 
            <Child/>}
        </>
}

export default WithFetchDetail;