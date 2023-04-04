import {useNavigate, useLocation} from 'react-router-dom'

import { GiFishBucket } from "react-icons/gi"
import { GiFishing } from 'react-icons/gi'
import { FaTrophy } from 'react-icons/fa'

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
                    <GiFishBucket fill={pathMatchRoute('/') ? '#2c2c2c' : 'white'} width="155px" height="55px"/> 
                    <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Catches</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/add-catch')}>
                    <GiFishing fill={pathMatchRoute('/add-catch') ? '#2c2c2c' : 'white'} width="55px" height="55px"/>
                    <p className={pathMatchRoute('/add-catch') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Add Fish</p>
                </li>
                <li className="navbarListItem" onClick={() => navigate('/offer')}>
                    <FaTrophy fill={pathMatchRoute('/offer') ? '#2c2c2c' : 'white'} width="30px" height="30px"/>
                    <p className={pathMatchRoute('/offer') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Trophies</p>
                </li>

            </ul>
        </nav>
    </footer>
  )
}

export default Navbar