function ShowSuggestions(props) {
    const { destinations,
            destinationInput,
            maxResults,
            selectedDestination,
            setSelectedDestination} = props;

    console.log(destinations);

    // on convertit le texte entré en RegExp. Le 'i' est pour ignorer Uppercase
    const textEntered = new RegExp(destinationInput, 'i');

    let resultsFound = 0;

    async function handleClick(nom) {
        try {
            const result = await (
                await fetch(`/api/v.0.1/travel/destination/${nom}`) 
            ).json();
            setSelectedDestination(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    function showList(destination, index) {
        if (destinationInput.trim() !== '') {
            if (textEntered.test(destination.name)) {
                resultsFound++; 
                return (
                    <li key={index} 
                        onClick={() => handleClick(destination.name)}
                        >
                        {destination.name}
                    </li> 
                )
            }
        }
    }

    return (
        <ul>
            {destinations.length > 0 && 
            destinations.map((destination, index) => showList(destination, index))
            }
        </ul>
    )
}

export default ShowSuggestions;