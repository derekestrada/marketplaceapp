import {useNavigate, useLocation} from 'react-router-dom'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true
        }
    }

  return (
    <footer className='navbar'>
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li className="navbarListItem" onClick={() => navigate('/')}>
                    <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : 'white'} width="36px" height="36px"/> 
                    <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Catches</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/add-catch')}>
                    <PersonOutlineIcon fill={pathMatchRoute('/add-catch') ? '#2c2c2c' : 'white'} width="36px" height="36px"/>
                    <p className={pathMatchRoute('/add-catch') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Add Fish</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/offer')}>
                    <OfferIcon fill={pathMatchRoute('/offer') ? '#2c2c2c' : 'white'} width="36px" height="36px"/>
                    <p className={pathMatchRoute('/offer') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Favorites</p>
                </li>

            </ul>
        </nav>
    </footer>
  )
}

export default Navbar