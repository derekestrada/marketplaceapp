import {Link} from 'react-router-dom'
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathTubIcon from '../assets/svg/bathtubIcon.svg'

function ListingItem({listing, id, onDelete}) {
  return (
   <li className="categoryListing">
       <Link to={`/category/${listing.type}/${id}`} className="categoryListingLink">
            {listing.imageUrls === undefined ?
             <div style={{width: '100px', height: '100px', background: '#777', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><p>No Image</p></div>
            :
            <img 
                src={listing.imageUrls[0]}
                alt={listing.name} 
                className="categoryListingImg"    
            />
            }

            <div className="categoryListingDetails">
               
                <p className="categoryListingName">
                    {listing.name}
                </p>
                <p className="categoryListingName">
                    {listing.lake}
                </p>
                <p className="categoryListingLocation listingSpecies">
                    {listing.species}
                </p>
                <div className="categoryListingInfoDiv noJustify">
                    <p className="categoryListingInfoName">{listing.fishLength} inches</p>
                    <p className="categoryListingInfoName listingWeight">{listing.weight === undefined ? '' : '- ' + listing.weight + 'lbs'}</p>
                </div>
                <div className="categoryListingInfoDiv noJustify">
                    <p className="listingType">{listing.type}</p>
                    <p className="listingType">{listing.lure}</p>
                    <p className="listingType">{listing.date}</p>
                </div>
            </div>
       </Link>

       {onDelete && ( 
           <DeleteIcon 
                className='removeIcon'
                fill='rgb(231, 76, 60' 
                onClick={() => onDelete(listing.id, listing.name)}    
            />
       )}
   </li>
  )
}

export default ListingItem