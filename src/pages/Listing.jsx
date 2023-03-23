import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getDoc, doc } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import shareIcon from '../assets/svg/shareIcon.svg'

import LakeMap from '../assets/jpg/map.png'

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
            <div>
                <div className="listingDetails">
                    <div className="flex">
                        <h4 className='listingInfo'>{listing.species}</h4> 
                        <span> - </span> 
                        <div className="flex">
                            <p className='listingInfo'>{listing.fishLength} inches</p> 
                            <p className='listingInfo'>{listing.weight} pounds</p> 
                        </div>
                    </div>   
                    <div className="flex">
                        <h4 className='listingInfo'>{listing.lake}</h4>  
                        <span> - </span> 
                        <h4 className='listingInfo'>{listing.name}</h4>                      
                    </div> 
                    <div className="flex">
                        <p className='listingInfo time'>{listing.date}</p>   
                        <p className='listingInfo time'>{listing.time}</p>  
                    </div>
                    <div className="flex listingTags">
                        <p className='listingType'>{listing.type}</p>
                        <p className='listingType'>{listing.lure}</p>  
                    </div>
                </div>
                <div className="mapDetails">
                <img alt="Lake Map" style={{width: '100%'}} src={LakeMap} />

                </div>
            </div>
    </main>
  )
}

export default Listing