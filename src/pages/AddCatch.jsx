import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { MapContainer, Marker, TileLayer, useMapEvents,} from 'react-leaflet'
import "leaflet/dist/leaflet.css"

import marker from '../assets/svg/fish.svg';
import { Icon } from 'leaflet'



function AddCatch() {
  // eslint-disable-next-line
  const [position, setPosition] = useState([44.56975401408825, -83.81710052490236])

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    fishLength: 0,
    weight: 0,
    time: "",
    date: "",
    images: {},
    latitude: 0,
    longitude: 0,
    type: '',
    lure: '',
    lake: '',
    notes: '',
    offer: true,
    showMap: false
  })

  const {
    name,
    species,
    date,
    time,
    fishLength,
    weight,
    notes,
    images,
    latitude,
    longitude,
    type,
    lure,
    lake,
    offer,
    showMap
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const mapIcon = new Icon({
    iconUrl: marker,
    iconSize: [32,32]
   })
const LocationFinderDummy = () => {
  // eslint-disable-next-line
  const map = useMapEvents({
    click(e) {
      console.log(e.latlng);
      setPosition(e.latlng)
      setFormData((prevState) => ({
        ...prevState,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }))
    },
  });
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    if (images.length > 2) {
      setLoading(false)
      toast.error('Max 2 images')
      return
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

        const storageRef = ref(storage, 'images/' + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    if (images.length > 0) {
      console.log('has images')
      const imageUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false)
        toast.error('Images not uploaded')
        return
      })

      const formDataCopy = {
        ...formData,
        imageUrls,
        timestamp: serverTimestamp(),
      }
  
      formDataCopy.location = notes
      delete formDataCopy.images
      delete formDataCopy.notes
      
      const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
      setLoading(false)
      toast.success('Listing saved')
      navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    } else {
      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
      }
  
      formDataCopy.location = notes
      delete formDataCopy.notes
      
      const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
      setLoading(false)
      toast.success('Listing saved')
      navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

  }

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = false
    }
    if (e.target.value === 'false') {
      boolean = true
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }
  }

    if (loading) {
        console.log(loading)
    }
  return (
    <div className='profile'>
    <header>
      <p className='pageHeader'>Add Catch</p>
    </header>

    <main>
      <form onSubmit={onSubmit}>

        <label className='formLabel'>Name</label>
        <input
          className='formInputName'
          type='text'
          id='name'
          value={name}
          onChange={onMutate}
          placeholder='Name'
          required
        />

        <label data-longitude={longitude} data-latitude={latitude} className='formLabel'>Lake</label>
          <input
            className='formInputName'
            type='text'
            id='lake'
            value={lake}
            onChange={onMutate}
            placeholder='Lake'
            required
          />
        {lake.length > 0 ? <><input onChange={onMutate} type="checkbox" id="showMap" value={showMap}/> <label className='formLabel exactLocation'>Set Exact Location?</label></> : ""}
        {showMap ? 
          (                
          <div className="mapDetails" style={{height: '300px', overflow:'hidden'}}>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
              <TileLayer
              url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              subdomains={['mt1','mt2','mt3']}
              />
                <Marker position={position} icon={mapIcon}></Marker>
                <LocationFinderDummy/>
              </MapContainer> 
          </div>
          ) : ('')}

        <label className='formLabel'>Species</label>
        <select onChange={onMutate} className='formInputName' value={species} name={species} id="species">
          <option value="Largemouth Bass">Largemouth Bass</option>
          <option value="Smallmouth Bass">Smallmouth Bass</option>
          <option value="Walleye">Walleye</option>
          <option value="Northern Pike">Northern Pike</option>
          <option value="Perch">Perch</option>
          <option value="Blue Gill">Blue Gill</option>
          <option value="Crappie">Crappie</option>
          <option value="Other">Other</option>
        </select>


        <div className='formSize flex'>
          <div>
            <label className='formLabel'>Length</label>
            <input
              className='formInputName'
              type='number'
              id='fishLength'
              value={fishLength}
              onChange={onMutate}
              min='1'
              max='50'
              placeholder='Length'
              step=".01"
              required
            />
          </div>
          <div>
            <label className='formLabel'>Weight</label>
            <input
              className='formInputName'
              type='number'
              id='weight'
              value={weight}
              onChange={onMutate}
              min='1'
              max='50'
              placeholder='Weight'
              step=".01"
            />
          </div>
        </div>
        <div className='formSize flex'>
          <div>
            <label className='formLabel'>Date</label>
            <input
              className='formInputName'
              type='date'
              id='date'
              value={date}
              onChange={onMutate}
              min='1'
              max='50'
              required
            />
          </div>
          <div>
            <label className='formLabel'>Time</label>
            <input
              className='formInputName'
              type='time'
              id='time'
              value={time}
              onChange={onMutate}
              min='1'
              max='50'
            />
          </div>
        </div>

        <label className='formLabel'>Bait / Lure</label>
        <div className='formButtons'>
          <button
            className={lure === 'Crankbait' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value='Crankbait'
            onClick={onMutate}
            min='1'
            max='50'
          >
            Crank Bait
          </button>
          <button
            className={lure === 'Swimbait' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value="Swimbait"
            onClick={onMutate}
          >
            Swim Bait
          </button>
          <button
            className={lure === 'Spinner Bait' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value='Spinner Bait'
            onClick={onMutate}
          >
            Spinner Bait
          </button>
          <button
            className={lure === 'Chatter Bait' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value='Chatter Bait'
            onClick={onMutate}
          >
            Chatter Bait
          </button>
          <button
            className={lure === 'Ned Rig' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value='Ned Rig'
            onClick={onMutate}
          >
            Ned Rig
          </button>
          <button
            className={lure === 'Livebait' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value='Livebait'
            onClick={onMutate}
          >
            Live Bait
          </button>
          <button
            className={lure === 'Other' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='lure'
            value='Other'
            onClick={onMutate}
          >
            Other
          </button>
        </div>

        <label className='formLabel'>Fishing Type</label>
        <div className='formButtons'>
          <button
            className={type === 'Casting' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='type'
            value='Casting'
            onClick={onMutate}
          >
            Casting
          </button>
          <button
            className={type === 'Trolling' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='type'
            value='Trolling'
            onClick={onMutate}
          >
            Trolling
          </button>
          <button
            className={type === 'Vertical' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='type'
            value='Vertical'
            onClick={onMutate}
          >
            Vertical
          </button>
          <button
            className={type === 'Fly' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='type'
            value='Fly'
            onClick={onMutate}
          >
            Fly Fishing
          </button>
          <button
            className={type === 'Other' ? 'formButtonActive' : 'formButton'}
            type='button'
            id='type'
            value='Other'
            onClick={onMutate}
          >
            Other
          </button>
        </div>

        <label className='formLabel'>Notes</label>
        <textarea
          className='formInputAddress'
          type='text'
          id='notes'
          value={notes}
          onChange={onMutate}
        />

        <label className='formLabel'>Images</label>
        <p className='imagesInfo'>
          The first image will be the cover (max 2).
        </p>
        <input
          className='formInputFile'
          type='file'
          id='images'
          onChange={onMutate}
          max='2'
          accept='.jpg,.jpeg'
          multiple
        />

      <label className='formLabel'>Favorite?</label>
        <div className='formButtons'>
          <button
            className={offer ? 'formButtonActive' : 'formButton'}
            type='button'
            id='offer'
            value='true'
            onClick={onMutate}
          >
            Yes
          </button>
          <button
            className={!offer ? 'formButtonActive' : 'formButton'}
            type='button'
            id='offer'
            value='false'
            onClick={onMutate}
          >
            No
          </button>
        </div>

        <button type='submit' className='primaryButton createListingButton'>
          Add Catch
        </button>
      </form>
    </main>
  </div>
  )
}

export default AddCatch