import { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import ListingItem from "../components/ListingItem";

import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import marker from "../assets/svg/fish.svg";
import { Icon } from "leaflet";

function reducer(state, action) {
  switch (action.type) {
    case "Alcona Dam Pond": {
      return {
        coords: [44.569829, -83.816926],
      };
    }
    case "Lotus Lake": {
      return {
        coords: [42.700203, -83.429972],
      };
    }
    case "Saginaw River": {
      return {
        coords: [43.481767, -83.912449],
      };
    }
    case "Au Sable River": {
      return {
        coords: [44.569829, -83.816926],
      };
    }
    case "Williams Lake": {
      return {
        coords: [42.675612, -83.422961],
      };
    }
    // eslint-disable-next-line
    default: {
      return;
    }
  }
}

function Category() {
  let mapCenter = [44.569829, -83.816926];
  let zoom = 13;

  const mapIcon = new Icon({
    iconUrl: marker,
    iconSize: [32, 32],
  });
  const [lakes, setLakes] = useState(null);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [bagParam, setBagParam] = useState(false);
  const [trophyParam, setTrophyParam] = useState(false);
  const [state, dispatch] = useReducer(reducer, { coords: mapCenter });

  const params = useParams();

  const handleChange = (e) => {
    dispatch({ type: e.target.value });
  };
  useEffect(() => {
    params.categoryName === "bag" ? setBagParam(true) : setBagParam(false);
    params.categoryName === "trophy"
      ? setTrophyParam(true)
      : setTrophyParam(false);

    const fetchListings = async () => {
      try {
        let filterParam = "";
        if (params.categoryName === "trophy") {
          filterParam = "trophyRating";
        } else {
          filterParam = "fishLength";
        }
        const listingsRef = collection(db, "listings");

        const q = query(listingsRef, orderBy(filterParam, "desc"), limit(10));
        const querySnap = await getDocs(q);

        const listings = [];
        const lakes = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        listings.forEach((doc) => {
          return lakes.push(doc.data.lake);
        });

        setLoading(false);
        setListings(listings);
        setLakes(lakes);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };
    fetchListings();
    // eslint-disable-next-line
  }, []);

  const onFetchMoreListings = async () => {
    try {
      let filterParam = "";
      if (params.categoryName === "trophy") {
        filterParam = "trophySize";
      } else {
        filterParam = "fishLength";
      }
      const listingsRef = collection(db, "listings");

      // Create a query
      const q = query(
        listingsRef,
        orderBy(filterParam, "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  function SetViewOnClick({ coords }) {
    console.log(coords);
    const map = useMap();
    map.setView(coords, map.getZoom());
  }

  const uniquesLakes = [...new Set(lakes)];

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "size"
            ? "Sorted By Size"
            : params.categoryName === "species"
            ? "Sorted By Species"
            : params.categoryName === "lake"
            ? "Sorted By Lake"
            : params.categoryName === "trophy"
            ? "Fish Of The Year"
            : "Fish"}
        </p>
      </header>

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
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            {params.categoryName === "lake" && (
              <>
                <select className="lakeList" onChange={handleChange}>
                  {uniquesLakes.map((listing, key) => (
                    <option key={key}>{listing}</option>
                  ))}
                </select>
                <div
                  id="map"
                  className="mapDetails"
                  style={{ height: "300px", overflow: "hidden" }}
                >
                  <MapContainer
                    center={state.coords}
                    zoom={zoom}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                      subdomains={["mt1", "mt2", "mt3"]}
                    />
                    {listings.map((listing) => (
                      // console.log(listing.data.longitude)
                      <Marker
                        key={listing.id}
                        position={[
                          listing.data.latitude,
                          listing.data.longitude,
                        ]}
                        icon={mapIcon}
                      >
                        <Popup>
                          <img
                            alt={listing.data.name}
                            style={{ width: "100%" }}
                            src={listing.data.imageUrls[0]}
                          />
                          <p>{listing.data.species}</p>
                          <p>{listing.data.fishLength}</p>
                        </Popup>
                      </Marker>
                    ))}
                    <SetViewOnClick coords={state.coords} />
                  </MapContainer>
                </div>
              </>
            )}

            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                  trophy={trophyParam ? true : false}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;
