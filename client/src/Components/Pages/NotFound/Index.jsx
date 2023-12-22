import notfound from '../../../assets/img/404_img_01.jpg';

function NotFound(){

    return <main id="notFound">
                <img src={notfound} alt="Image 'Page non trouvée'" />
            </main>
}

export default NotFound;