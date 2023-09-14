import React from "react";
import styles from "../pages/MessagePage.module.css";

const Avatar = ({ fullName }) => {
  const avatarColors = [
    "#F06292",
    "#BA68C8",
    "#64B5F6",
    "#81C784",
    "#FFD54F",
    "#FF8A65",
  ];
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
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: avatarColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "14px",
      }}>
      {initials}
    </div>
  );
};

function formatTimeWithAMPM(dateTimeString) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // This includes AM/PM
  };

  const dateTime = new Date(dateTimeString);
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    dateTime
  );

  return formattedTime;
}

const UserChatCard = ({
  userName,
  companyName,
  partnerDetails,
  lastMessageDetails,
  senderId,
  handleOnSelect,
  connectionId,
  currentConnectionId,
}) => {
  return (
    <div
      className={`${styles.userChatCard} ${
        connectionId === currentConnectionId && styles.userChatCardActive
      }`}
      onClick={() => {
        handleOnSelect();
      }}>
      <div>
        <Avatar fullName={userName ? userName : "Anonymous"} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "85%",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <h5>{userName}</h5>
          {lastMessageDetails && lastMessageDetails?.timestamp ? (
            <p>{formatTimeWithAMPM(lastMessageDetails.timestamp)}</p>
          ) : null}
        </div>
        <div
          style={{
            width: "100%",
          }}>
          {lastMessageDetails && lastMessageDetails?.message ? (
            <p className={styles.lastMsg}>{lastMessageDetails.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default UserChatCard;
