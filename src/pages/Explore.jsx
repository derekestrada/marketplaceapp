import { Link } from 'react-router-dom'
import lengthCategory from './../assets/jpg/pike.JPG'
import speciesCategory from './../assets/jpg/brown.JPG'
import lakeCategory from './../assets/jpg/alconaMap.png'
import bagLimit from './../assets/jpg/bass.JPG'
import { TailSpin } from  'react-loader-spinner'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  collection,
  getDocs,
  query,
  startAfter,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'

function Explore() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
        try {
            const listingsRef = collection(db, 'listings')

            const q = query(
                listingsRef,
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
            setLoading(false)
            setListings(listings)
        } catch (error) {
            toast.error("Could not fetch listings")
        }
    }
    fetchListings()
}, [])

const onFetchMoreListings = async () => {
  try {
    // Get reference
    const listingsRef = collection(db, 'listings')

    // Create a query
    const q = query(
      listingsRef,
      orderBy('timestamp', 'desc'), 
      startAfter(lastFetchedListing),
      limit(10)
    )

    // Execute query
    const querySnap = await getDocs(q)

    const lastVisible = querySnap.docs[querySnap.docs.length - 1]
    setLastFetchedListing(lastVisible)

    const listings = []

    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    setListings((prevState) => [...prevState, ...listings])
    setLoading(false)
  } catch (error) {
    toast.error('Could not fetch listings')
  }
}

  return (
    <div className="explore">
      <main>
        <h2 className="exploreCategoryHeading">Fish Tracker</h2>
        <div className="exploreCategories">
          <Link to='/category/size'>
            <img src={lengthCategory} className="exploreCategoryImg" alt="size" />
            <p className="exploreCategoryName">Fish By Filter</p>
          </Link>
          <Link to='/category/lake'>
            <img src={lakeCategory} className="exploreCategoryImg" alt="lake" />
            <p className="exploreCategoryName">Fish By Lake</p>
          </Link>
          <Link to='/bags'>
            <img src={bagLimit} className="exploreCategoryImg" alt="lake" />
            <p className="exploreCategoryName">Biggest Bags</p>
          </Link>
          <Link to='/category/species'>
            <img src={speciesCategory} className="exploreCategoryImg" alt="species" />
            <p className="exploreCategoryName">Fish Of The Year</p>
          </Link>
        </div>

        <div>

        {loading ? (
            <div className="loadingScreen"><TailSpin
                height="80"
                width="80"
                color="#fff"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            /></div>  
        ) : listings && listings.length > 0 ? (
          <>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
            {lastFetchedListing && (
              <p className='loadMore' onClick={onFetchMoreListings}>
                Load More
              </p>
            )}
          </>
        ) : (
          <p>No listings for {params.categoryName}</p>
        )}
        </div>
      </main>
    </div>
  )
}

export default Explore