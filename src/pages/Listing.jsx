import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import shareIcon from "../assets/svg/shareIcon.svg";
import { TailSpin } from "react-loader-spinner";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import marker from "../assets/svg/fish.svg";
import { Icon } from "leaflet";

function Listing() {
  let position = "";

  const mapIcon = new Icon({
    iconUrl: marker,
    iconSize: [32, 32],
  });

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  // const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return (
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
    );
  }

  if (listing.showMap) {
    position = [listing.latitude, listing.longitude];
    console.log(position);
  } else {
    position = [44.569694, -83.804545];
  }

  return (
    <main className="mainListing">
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="Share Icon" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <img
        alt={listing.name}
        style={{ width: "100%" }}
        src={listing.imageUrls}
      />
      <div>
        <div className="listingDetails">
          <div className="flex">
            <h4 className="listingInfo">{listing.species}</h4>
            <span> - </span>
            <div className="flex">
              <p className="listingInfo">{listing.fishLength} inches</p>
              {listing.weight > 0 && (
                <p className="listingInfo">{listing.weight}lbs</p>
              )}
            </div>
          </div>
          <div className="flex">
            <h4 className="listingInfo">{listing.lake}</h4>
            <span> - </span>
            <h4 className="listingInfo">{listing.name}</h4>
          </div>
          <div className="flex">
            <p className="listingInfo time">{listing.date}</p>
            <p className="listingInfo time">{listing.time}</p>
          </div>
          <div className="flex listingTags">
            <p className="listingType">{listing.type}</p>
            <p className="listingType">{listing.lure}</p>
          </div>
        </div>
        {listing.notes !== "" ? (
          <div className="listingDetails">
            <p>Notes: {listing.location}</p>
          </div>
        ) : (
          ""
        )}
        {listing.showMap && (
          <>
            <div
              className="mapDetails"
              style={{ height: "300px", overflow: "hidden" }}
            >
              <MapContainer center={position} zoom={16} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  subdomains={["mt1", "mt2", "mt3"]}
                />
                <Marker position={position} icon={mapIcon}></Marker>
              </MapContainer>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Listing;
