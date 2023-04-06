import { Link } from "react-router-dom";
import { ReactComponent as StarIcon } from "../assets/svg/starIcon.svg";

function ListingItem({ listing, id, onDelete, trophy }) {
  return (
    <>
      {listing.trophyRating > 0 && (
        <li className="categoryListing">
          <Link
            to={`/category/${listing.type}/${id}`}
            className="categoryListingLink"
          >
            {listing.imageUrls === undefined ? (
              <div className="noImage">
                <p>No Image</p>
              </div>
            ) : (
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className="categoryListingImg"
              />
            )}

            <div className="categoryListingDetails">
              <p className="categoryListingName listingLake">{listing.lake}</p>
              <p className="categoryListingLocation listingSpecies">
                {listing.species}
              </p>
              <div className="categoryListingInfoDiv listingSize noJustify">
                <p className="categoryListingInfoName">
                  {listing.fishLength} inches
                </p>
                <p className="categoryListingInfoName listingWeight">
                  {listing.weight === "" ? "" : "- " + listing.weight + "lbs"}
                </p>
              </div>
              {!trophy && (
                <div className="categoryListingInfoDiv infoTags noJustify">
                  <p className="listingType">{listing.type}</p>
                  <p className="listingType">{listing.lure}</p>
                  <p className="listingType">{listing.date}</p>
                </div>
              )}
            </div>
            {trophy ? (
              <div className="trophyRating">
                {"+" + listing.trophyRating.toFixed(2) + '"'}
              </div>
            ) : (
              listing.offer && (
                <StarIcon
                  className="starIcon"
                  fill="#0351a5"
                  width="15px"
                  height="15px"
                />
              )
            )}
          </Link>

          {/* {onDelete && ( 
               <DeleteIcon 
                    className='removeIcon'
                    fill='rgb(231, 76, 60' 
                    onClick={() => onDelete(listing.id, listing.name)}    
                />
           )} */}
        </li>
      )}
    </>
  );
}

export default ListingItem;
