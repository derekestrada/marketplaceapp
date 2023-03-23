import {useState} from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc} from 'firebase/firestore' 
import {db} from '../firebase.config'
import { toast } from 'react-toastify'
import {Link} from 'react-router-dom'
 
import {useNavigate} from 'react-router-dom'
import { async } from '@firebase/util'

import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'


function Profile() {
    const auth = getAuth()
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const {name, email} = formData

    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }
    const onSubmit = async() => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                    <button onClick={onLogout} type='button' className="logOut">Logout</button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p 
                        className="changePersonalDetails" 
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails((prevState) => !prevState)
                        }}>
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>
                <div className="profileCard">
                    <form action="">
                        <input 
                            id="name"
                            className={!changeDetails ? 'profileName' : 'profileNameActive'} 
                            type="text" 
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input 
                            id="email"
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} 
                            type="text" 
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>

                <Link to="/add-catch" className="createListing">
                    <img src={homeIcon} alt="home"/>
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt=""/>
                </Link>
            </main>
        </div>
    ) 
  }
  
  export default Profile