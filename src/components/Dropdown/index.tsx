import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ConditionalLink from "@/components/ConditionalLink";
import menuIcon from "./link.png";
import "./index.scss";

type MenuItem = {
  key: string;
  label: string;
  path: string;
};

const Dropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
  }, []);

  const handleDropdownClick = () => setIsDropdownOpen((v) => !v);

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const items: MenuItem[] = [
    { key: "benefits",   label: "BENEFITS",   path: "/benefits" },
    { key: "privileges", label: "PRIVILEGES", path: "/privileges" },
    { key: "ambassadors",label: "AMBASSADORS",path: "/ambassadors" },
    { key: "sponsors",   label: "SPONSORS",   path: "/sponsorship" },
    { key: "corporate",  label: "CORPORATE",  path: "/membership/page" },
    { key: "contact",    label: "CONTACT US", path: "/contact" },
    { key: "about-us",   label: "ABOUT US",   path: "/about-us" },
  ];

  return (
    <div
      id="dropdown"
      className={`dropdown ${isDropdownOpen ? "open" : ""}`}
      onClick={handleDropdownClick}
    >
      <div className="selected-option" />

      <div
        className={`options-container ${isDropdownOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="options">
          <div className="spacer" />

          <ConditionalLink
            active={isActive("/communities")}
            to="/communities"
            onClick={() => setIsDropdownOpen(false)}
          >
            <div className="option">
              HOME
              <img src={menuIcon} className="menuIcon" alt="menu icon" />
            </div>
          </ConditionalLink>

          {items.map((item) => (
            <ConditionalLink
              key={item.key}
              active={isActive(item.path)}
              to={item.path}
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="option">
                {item.label}
                <img src={menuIcon} className="menuIcon" alt="menu icon" />
              </div>
            </ConditionalLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
