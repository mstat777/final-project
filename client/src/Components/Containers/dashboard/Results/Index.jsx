import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './results.module.css';

function DashboardResults(){
    const { results } = useSelector((state) => state.dashboard);
    const navigate = useNavigate();

    return <>
        { console.log(results)}
        { results[0] !== undefined && 
        <>
        <h3>Results</h3>
        <table>
            <thead>
                <tr>
                    <th>Réf. pack</th>
                    <th>Destination</th>
                    <th>Pays</th>
                    <th>Date départ</th>
                    <th>Date retour</th>
                    <th>Durée</th>
                    <th>Montant total</th>
                    <th>Nom client</th>
                    <th>Prénom client</th>
                    <th>Tél. client</th>
                    <th>Mail client</th>
                    <th>Statut</th>
                    <th>Date réservation</th>
                    <th>Modifier</th>
                </tr>
            </thead>
            <tbody>
            {console.log(results)}
            {results.map((result, index) => 
                <tr key={index}>
                    <td>&num;{result.p.reference}</td> 
                    <td>{result.d.name}</td> 
                    <td>{result.d.country}</td> 
                    <td>{result.p.departure_date.slice(0, result.p.departure_date.indexOf('T'))}</td>
                    <td>{result.p.return_date.slice(0, result.p.return_date.indexOf('T'))}</td>
                    <td>{result.p.duration+1}J/{result.p.duration}N</td>  
                    <td>{result.p.price_total_booking} &euro;</td> 
                    <td>{result.u.last_name}</td> 
                    <td>{result.u.first_name}</td> 
                    <td>{result.u.tel}</td> 
                    <td>{result.u.email}</td> 
                    <td>{result.b.status}</td> 
                    <td>{result.b.date_created.slice(0, result.b.date_created.indexOf('T'))}</td>
                    <td>
                        <button 
                        onClick={() => {
                            navigate(`/dashboard/admin/bookings/modify/${result.id}`);
                        }} 
                        className={styles.book_btn}>modifier</button>
                    </td> 
                </tr>
                )}
            </tbody>
        </table>
        </>}
    </>
}

export default DashboardResults;