import React from "react";
import styles from "./NavBar.module.css";
import logo from "../assets/logo.svg";

import { BsEnvelope, BsBell } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const avatarColors = [
  "#F06292",
  "#BA68C8",
  "#64B5F6",
  "#81C784",
  "#FFD54F",
  "#FF8A65",
];
const Avatar = ({ fullName }) => {
  const getInitials = (name) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .slice(0, 2) // You can modify this to display more initials if needed
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const nameHashCode = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[nameHashCode % avatarColors.length];
  };

  const initials = getInitials(fullName);
  const avatarColor = getAvatarColor(fullName);

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: avatarColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "20px",
      }}>
      {initials}
    </div>
  );
};

const NavBar = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className={styles.NavBarContainer}>
      <img
        src={logo}
        alt=''
        style={{
          cursor: "pointer",
        }}
        width='150px'
        onClick={() => navigate("/dashboard")}
      />
      <div className={styles.NavBarItemsContainer}>
        <div className={styles.NavBarItem}>{/* <BiSupport size={20} /> */}</div>
        <div className={styles.NavBarItem}>
          <BsEnvelope
            size={20}
            onClick={() =>
              navigate("/message", {
                state: {
                  receiverId: "",
                  receiverName: "",
                },
              })
            }
          />
        </div>
        <div className={styles.NavBarItem}>
          <BsBell size={20} />
        </div>
        <div className={styles.NavBarItem}>
          <Link to='/profile'>
            <Avatar fullName={user?.name ? user.name : "Anonymous"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
