// function pour trouver le prix du pack le moins cher :
function cheapestPack(packs) {
    return Math.min(...packs.map(pack => parseInt(pack.price_adults)))
}

export { cheapestPack }