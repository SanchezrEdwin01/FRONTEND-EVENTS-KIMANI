import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ConditionalLink from "@/components/ConditionalLink";

import menuIcon from "./link.png";

import "./index.scss";

const Dropdown: React.FC = () => {
    const [selectedOption] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(Boolean);
    const { pathname } = useLocation();

    useEffect(() => {
        if (selectedOption !== null) {
            setIsDropdownOpen(false);
        }
    }, [selectedOption]);

    function handleDropdownClick() {
        setIsDropdownOpen(!isDropdownOpen); 
    }

    return (
        <div
            id="dropdown"
            className={`dropdown ${isDropdownOpen ? "open" : ""}`}
            onClick={handleDropdownClick}>
            <div className="selected-option">
                {selectedOption || ""}
            </div>
            {
                <div
                    className={`options-container ${
                        isDropdownOpen ? "open" : ""
                    }`}>
                    <div className="options">
                        <div className="spacer" />

                        <ConditionalLink
                            active={pathname === "/"}
                            to="/communities">
                            <div key="a001" className="option">
                                {"HOME"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </ConditionalLink>
                        <a
                            href="https://www.kimanilife.com/member-benefits-platform"
                            key="a3">
                            <div className="option">
                                {"BENEFITS"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </a>
                        <a
                            href="https://www.kimanilife.com/privileges"
                            key="a4">
                            <div className="option">
                                {"PRIVILEGES"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </a>
                        <a
                            href="https://www.kimanilife.com/ambassadors"
                            key="a9">
                            <div id="disabled" className="option">
                                {"AMBASSADORS"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </a>
                        <a
                            href="https://www.kimanilife.com/sponsorship"
                            key="a10">
                            <div id="disabled" className="option">
                                {"SPONSORS"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </a>
                        <a
                            href="https://www.kimanilife.com/membership/corporate"
                            key="a11">
                            <div id="disabled" className="option">
                                {"CORPORATE"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </a>
                        <a href="https://www.kimanilife.com/hiring" key="a12">
                            <div id="disabled" className="option">
                                {"JOIN OUR TEAM"}
                                <img src={menuIcon} className="menuIcon" />
                            </div>
                        </a>
                        <div className="menuWrap">
                            <a
                                href="https://www.kimanilife.com/contact"
                                key="a13">
                                <div className="option">
                                    <p>{"CONTACT US"}</p>
                                    <img src={menuIcon} className="menuIcon" />
                                </div>
                            </a>
                            <a
                                href="https://www.kimanilife.com/about-us"
                                key="a14">
                                <div className="option">
                                    <p>{"ABOUT US"}</p>
                                    <img src={menuIcon} className="menuIcon" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Dropdown;
