import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setAllDestinations } from "../../../store/slices/travel";

function WithFetch({child}){

    const Child = child;
    const dispatch = useDispatch();
    const { allDestinations } = useSelector((state) => state.allTravel);

    // on récupère les noms de 
    useEffect( () => {
        async function getData() {
            try {
                const result = await (await fetch("/api/v.0.1/travel/destination/all")).json();
                //console.log(result.datas);
                const resultArray = result.datas.map(el => el.name);
                //console.log(resultArray);
                dispatch(setAllDestinations(resultArray));
            } catch (error) {
                console.log(error);
            }
        }
        !allDestinations[0] && getData();
    }, []);
    
    return <>{allDestinations[0] && <Child/>}</>
}

export default WithFetch;