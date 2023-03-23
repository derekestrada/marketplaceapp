import {Link} from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        {/* slider  */}

        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to='/category/size'>
            <img src={rentCategoryImage} className="exploreCategoryImg" alt="size" />
            <p className="exploreCategoryName">Fish By Size</p>
          </Link>
          <Link to='/category/species'>
            <img src={sellCategoryImage} className="exploreCategoryImg" alt="species" />
            <p className="exploreCategoryName">Fish By Species</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore