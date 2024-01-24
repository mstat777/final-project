import styles from './General.module.scss';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NotFound from '../NotFound/Index';
import Recruitment from './Recruitment/Index';
import TermsOfUse from './TermsOfUse/Index';
import InfoCovid from './InfoCovid/Index';

function General() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[pathname]);

    return <main id="general" className={styles.main_ctn}>
                {   pathname.slice(9) === "recruitment" ? <Recruitment/> :
                    pathname.slice(9) === "terms-of-use" ? <TermsOfUse/> :
                    pathname.slice(9) === "info-covid" ? <InfoCovid/> : null }
           </main>
}

export default General;