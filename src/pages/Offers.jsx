import {useEffect, useState} from 'react'
// import {useParams} from 'react-router-dom'

import {collection, getDocs, query, where, orderBy, limit} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import ListingItem from './../components/ListingItem'

function Offers() {
    const [listings, setListings] = useState(null)
    const loading = false

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, 'listings')
                console.log(listingsRef)

                const q = query(
                    listingsRef, 
                    where('offer', '==', true), 
                    orderBy('timestamp', 'desc'), 
                    limit(10)
                )
                const querySnap = await getDocs(q)

                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
            } catch (error) {
                toast.error("Could not fetch listings")
            }
        }
        fetchListings()
    }, [])

    console.log(listings)
  return (
   <div className="category">
       <header>
           <p className="pageHeader">
               Fish
           </p>
       </header>

        {loading ? (
            console.log('loading')
        ) : listings && listings.length > 0 ? (
            <>
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => (
                            <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                        ))}
                    </ul>
                </main>
            </>
        ) : (
            <p>There are no current fish</p>
        )}

   </div>
  )
}

export default Offers