import styles from '../General.module.scss';

function InfoCovid(){
    return <section className={styles.section}>
                <h1>Informations Voyage Covid-19</h1>
                <p>Informations mises à jour le 02/09/2022</p>
                <ol>
                    <li>Réouverture des frontières</li>
                    <li>Quelle preuve de vaccination fournir ?</li>
                    <li>Comment obtenir le document ?</li>
                    <li>Dose de rappel pour qui et quand ?</li>
                    <li>Les restrictions et modalités de voyage par destination</li>
                    <li>Informations générales</li>
                </ol>

                <article>
                    <h2>Réouverture des frontières</h2>
                    
                    <p>Le gouvernement a présenté une liste des pays classés en vert et orange. Ces codes couleurs, ainsi que le schéma vaccinal de chacun, déterminent les conditions de sortie et d’entrée sur le territoire français.</p>

                    <p>Les listes des pays sont susceptibles d’être adaptées selon les évolutions de leur situation épidémique. Nous vous recommandons <strong>AVANT</strong> de réserver et <strong>AVANT</strong> votre départ de vérifier que <strong>vous respectez bien ces modalités</strong>.</p>

                    <p>Vous trouverez toutes les informations sur le site du Gouvernement sur le lien suivant : <a href="https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/informations-pratiques/article/coronavirus-covid-19" target="_blank">https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/informations-pratiques/article/coronavirus-covid-19</a></p>

                    <p>Au 13 mars, la classification des pays est la suivante :</p>

                    <p>Pays/territoires « verts » : pays et territoires dans lesquels aucune circulation active du virus n’est observée et aucun variant préoccupant n’est recensé. Il s’agit des pays/territoires dans lesquels aucune circulation active du virus n’est observée et aucun variant préoccupant n’est recensé. Il s’agit des État membres de l’Union européenne ainsi qu’Andorre, l’Islande, Le Liechtenstein, Monaco, la Norvège, Saint-Marin, la Suisse et le Vatican. S’y ajoutent les pays suivants : l’Afrique du Sud, l’Albanie, l’Angola, Antigua-et-Barbuda, l’Arabie Saoudite, l’Argentine, Aruba, Azerbaïdjan, les Bahamas, le Bahreïn, le Bangladesh, Barbade, le Belize, le Bénin, la Bolivie, Bonaire, Saint-Eustache et Saba, la Bosnie-Herzégovine, le Botswana, le Bhoutan, le Burkina Faso, le Burundi, le Brésil, le Cambodge, le Cameroun, le Canada, Cap Vert, le Chili, la Colombie, les Comores, le Congo, la Côte d’Ivoire, la Corée du Sud, le Costa-Rica, Cuba, Curaçao, Djibouti, l’Égypte, les Émirats arabes unis, l’Équateur, Eswatini, les États-Unis, l’Éthiopie, les Fidji, le Gabon, la Gambie, le Ghana, la Guinée, la Guinée équatoriale, la Guinée Bissau, Grenade, le Groënland, le Guatemala, le Honduras, Hong-Kong, les Îles Féroé, l’Île Maurice, les Îles Salomon, les Îles Turques-et-Caïques, les Îles Vierges britanniques, les Îles Vierges des États-Unis, l’Inde, l’Indonésie, l’Irak, la Jamaïque, le Japon, la Jordanie, le Kazakhstan, le Kenya, Kiribati, le Kosovo, le Koweït, le Laos, le Lesotho, le Liban, le Libéria, la Macédoine du Nord, Madagascar, la Malaisie, le Malawi, les Maldives, le Maroc, la Mauritanie, le Mexique, la Moldavie, la Mongolie, le Monténégro, Montserrat, le Mozambique, Myanmar (ex-Birmanie), la Namibie, le Népal, le Nicaragua, le Niger, le Nigeria, la Nouvelle-Zélande, Oman, l’Ouganda, le Pakistan, le Panama, la Papouasie-Nouvelle-Guinée, le Paraguay, le Pérou, les Philippines, Porto-Rico, le Qatar, la République démocratique du Congo, la République dominicaine, le Royaume-Uni, le Rwanda, Saint-Christophe-et-Niévès, Sainte-Lucie, Saint-Vincent-et-les-Grenadines, le Salvador, les Samoa, Sao Tomé-et-Principe, le Sénégal, la Serbie, les Seychelles, le Soudan, le Soudan du Sud, le Sri Lanka, Taïwan, la Tanzanie, le Tchad, le Timor oriental, le Togo, la Tunisie, la Turquie, Trinité-et-Tobago, l’Ukraine, l’Uruguay, le Vanuatu, le Venezuela, le Vietnam, la Zambie et le Zimbabwe.</p>

                    <p>Pour en savoir plus sur les conditions de voyage de ou vers un pays « vert » cliquez <a href="https://www.gouvernement.fr/alerte/covid-19#section-b3152" target="_blank"><b>ici</b></a>.</p>
                </article>
                
            </section>
}

export default InfoCovid;