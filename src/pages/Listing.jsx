import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getDoc, doc } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import shareIcon from '../assets/svg/shareIcon.svg'

function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)
  
    const navigate = useNavigate()
    const params = useParams()
    // const auth = getAuth()
  
    useEffect(() => {
      const fetchListing = async () => {
        const docRef = doc(db, 'listings', params.listingId)
        const docSnap = await getDoc(docRef)
  
        if (docSnap.exists()) {
          setListing(docSnap.data())
          setLoading(false)
        }
      }
  
      fetchListing()
    }, [navigate, params.listingId])
  
    if (loading) {
      return <h1>Spinner</h1>
    }


  return (
    <main>
            <div className="shareIconDiv" onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setShareLinkCopied(true)
                        setTimeout(() => {
                            setShareLinkCopied(false)
                        }, 2000) 
                    }}>
                <img src={shareIcon} alt="Share Icon" />
            </div>
            {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
            
            <img alt={listing.name} style={{width: '100%'}} src={listing.imageUrls} />
            <p className='listingName'>
                {listing.name} 
                </p>
            <div className="listingDetails">
                <p className='listingLocation'>{listing.lake}</p>
                <p className='listingType'>{listing.species}</p>                
                <p className='listingType'>{listing.weight}</p>  
                <p className='listingType'>{listing.type}</p>
                <p className='listingType'>{listing.lure}</p>  
                <p className='listingType'>{listing.time}</p>  
            </div>
    </main>
  )
}

export default Listing