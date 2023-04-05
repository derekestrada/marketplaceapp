import React from 'react'
import { useState, useEffect } from 'react'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import { TailSpin } from  'react-loader-spinner'
import "leaflet/dist/leaflet.css"
import BagItem from '../components/BagItem'


function Bags() {

    const [loading, setLoading] = useState(true)
    const [bags, setBags] = useState(null)

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const bagRef = collection(db, 'bags')

                const q = query(
                    bagRef, 
                    orderBy('totalWeight', 'desc'), 
                    limit(10)
                )
                const querySnap = await getDocs(q)

                const bags = []

                querySnap.forEach((doc) => {
                    return bags.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setBags(bags)
                setLoading(false)
            } catch (error) {
                console.log(error)
                toast.error("Could not fetch listings")
            }
        }
        fetchListings()
    }, [])
    console.log(bags)

  return (
    <div>
        {loading ? (
            <div className="loadingScreen">
                <TailSpin
                    height="80"
                    width="80"
                    color="#fff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
            </div>
            ) : (
                <ul className="categoryListings">
                    {bags.map((bag) => (
                        <BagItem bag={bag.data} id={bag.id} key={bag.id} />
                    ))}
                </ul>
            )
        }
    </div>
  )
}

export default Bags