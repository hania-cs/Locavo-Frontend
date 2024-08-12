import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

const NavbarLinks = () => {
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="collapse navbar-collapse mt-lg-0 mt-4" id="navbarLinks">
      <Link className="navbar-brand" to="#">
        Locavo
      </Link>
      <ul className="navbar-nav">
       
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/login">
            {t("navbar.bookCars")}
          </Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/admin">
            Admin Page
          </Link>
        </li>
       
      </ul>
    </div>
  );
};

export default NavbarLinks;
