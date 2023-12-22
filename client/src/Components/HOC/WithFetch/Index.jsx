import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllContinents, 
        fetchAllDestinations, 
        fetchAllContinentsAndDestinations } from "../../Functions/fetchData";

function WithFetch({child}){

    const Child = child;

    const { allContinents, 
            allDestinations, 
            destinationsWithContinents } = useSelector((state) => state.allTravel);

    // on récupère les listes des continents et des destinations :
    useEffect(() => {
        !allContinents[0] && fetchAllContinents();
        !allDestinations[0] && fetchAllDestinations();
        !destinationsWithContinents[0] && fetchAllContinentsAndDestinations();
    }, []);
    
    return (allContinents[0] && allDestinations[0] && destinationsWithContinents[0]) && <Child/>
}

export default WithFetch;