import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { GiFishBucket } from "react-icons/gi";
import { GiFishing } from "react-icons/gi";
import { GiDoubleFish } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

function Navbar() {
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  const openSub = () => {
    addOpen ? setAddOpen(false) : setAddOpen(true);
  };

  return (
    <>
      <ul
        className={
          addOpen
            ? "navbarListItems addSubNav open"
            : "navbarListItems addSubNav"
        }
      >
        <li
          className="navbarListItem subNavItem"
          onClick={() => {
            setAddOpen(false);
            navigate("/add-catch");
          }}
        >
          <GiFishing fill="white" width="155px" height="55px" />
          <p className="navbarListItemName">Add Catch</p>
        </li>
        <li
          className="navbarListItem subNavItem"
          onClick={() => {
            setAddOpen(false);
            navigate("/add-bag");
          }}
        >
          <GiDoubleFish fill="white" width="155px" height="55px" />
          <p className="navbarListItemName">Add Bag</p>
        </li>
      </ul>
      <footer className="navbar">
        <nav className="navbarNav">
          <ul className="navbarListItems">
            <li
              className="navbarListItem"
              onClick={() => {
                setAddOpen(false);
                navigate("/");
              }}
            >
              <GiFishBucket
                fill={pathMatchRoute("/") ? "#8EE4AF" : "white"}
                width="155px"
                height="55px"
              />
              <p
                className={
                  pathMatchRoute("/")
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                Catches
              </p>
            </li>
            <li className="navbarListItem" onClick={openSub}>
              <FaPlus
                fill={pathMatchRoute("/add-catch") ? "#8EE4AF" : "white"}
                width="55px"
                height="55px"
              />
              <p
                className={
                  pathMatchRoute("/add-catch")
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                Add
              </p>
            </li>
            <li
              className="navbarListItem"
              onClick={() => {
                setAddOpen(false);
                navigate("/offer");
              }}
            >
              <FaTrophy
                fill={pathMatchRoute("/offer") ? "#8EE4AF" : "white"}
                width="30px"
                height="30px"
              />
              <p
                className={
                  pathMatchRoute("/offer")
                    ? "navbarListItemNameActive"
                    : "navbarListItemName"
                }
              >
                Trophies
              </p>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  );
}

export default Navbar;
