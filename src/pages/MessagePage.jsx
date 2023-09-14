import React, { useState, useEffect } from "react";
import UserChatCard from "../components/UserChatCard";
import UserChat from "../components/UserChat"; // Replace with the correct path
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import nomsg from "../assets/nomsg.svg";
import styles from "./MessagePage.module.css";
import axios from "axios";
function MessagePage() {
  const { response, loading, error } = useAxios({
    method: "get",
    url: "api/v1/get-connections",
    headers: JSON.stringify({ accept: "*/*" }),
  });

  const { state } = useLocation();
  const { receiverId, receiverName } = state;
  const { user } = useAuthContext();
  const userA = user._id;

  const [userConnectionList, setUserConnectionList] = useState([]);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [userB, setUserB] = React.useState(receiverId);

  useEffect(() => {
    if (!loading) {
      console.log("Response", response?.data);
      setUserConnectionList(response?.data);
    }
  }, [loading]);

  useEffect(() => {
    if (currentConnection?.partnerDetails?._id) {
      setUserB(currentConnection.partnerDetails._id);
      console.log("userB set to", currentConnection.partnerDetails._id);
    }
  }, [currentConnection?._id]);

  useEffect(() => {
    if (userA && userB) {
      axios
        .get("api/v1/get-connection/" + userB)
        .then((res) => {
          console.log("Connection Data", res.data);
          if (res.data) {
            setCurrentConnection(res.data.data);
          } else {
            setCurrentConnection(null);
            console.log("No connection found");
          }
          // Force a re-render by toggling the forceUpdate state
        })
        .catch((err) => {
          console.log("Error fetching connection data:", err);
        });
    }
  }, [userA, userB]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className={styles.messagePageContainer}>
      {/* <h1>
        Chat between {user.name} and {receiverName}
      </h1> */}
      <div className={styles.messageContainer}>
        <div
          className={styles.messageContainerLeft}
          style={{
            display: userConnectionList.length > 0 ? "flex" : "none",
          }}>
          {console.log("userConnectionList", userConnectionList)}
          {userConnectionList?.map((item) => {
            return (
              <UserChatCard
                key={item.partnerDetails._id}
                handleOnSelect={() => setCurrentConnection(item)}
                partnerDetails={item.partnerDetails}
                userName={item.partnerDetails.name}
                connectionId={item._id}
                currentConnectionId={currentConnection?._id}
                // companyName={item.companyName}
                lastMessageDetails={item.lastMessageDetails}
                senderId={item.partnerDetails._id}
              />
            );
          })}
        </div>
        {console.log(
          "userA",
          userA,
          "userB",
          userB,
          "current",
          currentConnection
        )}
        {userA && userB && currentConnection && currentConnection._id ? (
          <div
            className={styles.messageContainerRight}
            style={{
              width: userConnectionList.length > 0 ? "70% " : "100%",
            }}>
            <UserChat
              key={currentConnection._id}
              userA={userA}
              userB={userB}
              connectionData={currentConnection}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "70%",
              height: "100%",
              gap: "3rem",
            }}>
            <img
              style={{
                width: "48%",
              }}
              src={nomsg}
              alt=''
            />
            <h2
              style={{
                color: "#38486e",
                fontSize: "1.5rem",
                fontWeight: "400",
                fontFamily: "Poppins",
                textAlign: "center",
                width: "40%",
              }}>
              Choose a contact to begin your conversation.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagePage;
