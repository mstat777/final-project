// valider la saisie de l'utilisateur. On passe le nom de saisie et sa valeur :
function validateInput(name, userData){
    // on va retourne cet objet :
    const result = { isValid: true, msg: '' };

    //console.log("name = "+name);
    //console.log("userData = "+userData);

    // les inputs dont le nom contient 'Name/name'
    if (name.match(/Name/i)) {
        //console.log("name contains 'Name'");
        if (userData.length < 2) {
            result.msg +="Le nom/prénom doit être composé d'au moins 2 caractères.\n";
            result.isValid = false;
        } 
        if (userData.length > 40) {
            result.msg +="Le nom/prénom est trop long.\n";
            result.isValid = false;
        }
        /*  /^(?=.{1,50}$)[a-z]+(?:['-.\s][a-z]+)*$/i */
        if (!/^[a-zÀ-Ÿ]+(?:['-.\s][a-zÀ-Ÿ]+)*$/i.test(userData)) {
            result.msg +="Le nom/prénom doit commencer par une majuscule et ne doit pas contenir de chiffres ni de caractères spéciaux.\n";
            result.isValid = false;
        }
    }

    // les inputs dont le nom contient 'Password/password' 
    if (name.match(/Password/i)) {
        //console.log("name contains 'password'");
        if (userData.length < 8) { 
            result.msg +="Le mot de passe doit être composé d'au moins 8 caractères.\n";
            result.isValid = false;
        }
        if (!/[A-Z]/.test(userData)) {
            result.msg +="Le mot de passe doit contenir au moins une majuscule.\n";
            result.isValid = false;
        }
        if (!/[a-z]/.test(userData)) {
            result.msg +="Le mot de passe doit contenir au moins une minuscule.\n";
            result.isValid = false;
        }
        if (!/[0-9]/.test(userData)) {
            result.msg +="Le mot de passe doit contenir au moins un chiffre.\n";
            result.isValid = false; 
        }  
        if (/\s/.test(userData)) {
            result.msg +="Le mot de passe ne doit pas contenir des espaces.\n";
            result.isValid = false;
        }
        /*if (!/[^A-Za-z0-9]/.test(userData)) {
            result.msg +="Le mot de passe doit contenir au moins un caractère spécial.\n";
            result.isValid = false;     
        }*/
    }

    // les inputs dont le nom contient 'Tel/tel' 
    if (name.match(/Tel/i)) {
        //console.log("name contains 'tel'");
        if (userData.length < 10) {
            result.msg +="Le numéro de téléphone doit être composé d'au moins 10 chiffres.\n";
            result.isValid = false;
        } 
        if (userData.length > 15) {
            result.msg +="Le numéro de téléphone est trop long.\n";
            result.isValid = false;
        }
        if (!/^[+0]{1}\d{9,14}$/.test(userData)) {
            result.msg +="Le numéro de téléphone doit commencer par un zéro ou un plus et doit contenir uniquement des chiffres.\n";
            result.isValid = false;
        }
    } 

    // les inputs dont le nom contient 'Date/date' 
    if (name.match(/Date/i)) {
        //console.log("userData = "+userData);
        /*if (!userData){
            result.msg +="La date n'est pas renseignée.\n";
            result.isValid = false;
        } else*/ if (userData){
            const today = new Date(); // la date d'auj
            // convertir la date de naiss. d'util. (string) en date
            const birthDate = new Date(userData); 

            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }    
            //console.log("age = "+age);
            if (age < 0) {
                result.msg +="Vous n'avez pas saisi une date valide.\n";
                result.isValid = false;
            } else if (age < 18) {
                result.msg +="Vous n'avez pas 18 ans.\n";
                result.isValid = false;
            }
        }
    } 

    // les inputs dont le nom contient 'Address/address' 
    if (name.match(/Address/i)) {
        //console.log("name contains 'tel'");
        if (!/\w+(\s\w+){2,}/.test(userData)) {
            result.msg +="Veuillez modifier l'adresse postale.\n";
            result.isValid = false;
        }
    } 

    // les inputs dont le nom contient 'Price/price' 
    if (name.match(/Price/i)) {
        //console.log("name contains 'tel'");
        /*if (userData < 0) {
            result.msg +="Le prix ne peut pas être négatif.\n";
            result.isValid = false;
        } */
        //pattern="^(0(?!\.00)|[1-9]\d{0,6})\.\d{2}$"
        // 5 chiffres + 2 décimals
        if (!/^\d{0,5}(\.\d{1,2})?$/.test(userData)) {
            result.msg +="Le numéro de téléphone doit commencer par un zéro ou un plus et doit contenir uniquement des chiffres.\n";
            result.isValid = false;
        }
    } 

    return result;
}

// formatter la saisie de l'utilisateur, si besoin :
function sanitizeAllInputs(name, userData){

}

export { validateInput, sanitizeAllInputs }