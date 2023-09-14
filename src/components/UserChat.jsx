import React, { useState, useEffect, useRef } from "react";
import useAxios from "../hooks/useAxios";
import styles from "./UserChat.module.css";
import socket from "../socket"; // Import the socket connection from your socket module
import { BiCheckDouble } from "react-icons/bi";

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

function UserChat({ userA, userB, connectionData }) {
  const messageContainerRef = useRef(null);
  const { response, loading, error } = useAxios({
    method: "get",
    url: "api/v1/get-all-messages/" + connectionData?._id,
    headers: JSON.stringify({ accept: "*/*" }),
  });
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }, 0);
    }
  };

  useEffect(() => {
    if (!loading) {
      console.log("Response", response?.data);
      setChatHistory(response?.data);
      setChatPartner(response.userBDetails);

      // Scroll to the bottom after setting chat history
      scrollToBottom();
    }
  }, [loading]);

  // Listen for incoming messages
  useEffect(() => {
    let roomId = connectionData?._id;
    if (connectionData?._id && userA && userB) {
      roomId = connectionData?._id;
      console.log("userB: ", userB);
      console.log("Establishing Connection to :", roomId);
      socket.emit("joinRoom", { userA, roomId });

      // Get room and users
      socket.on("roomUsers", ({ userA, roomId }) => {
        console.log("Room Users", userA, roomId);
      });

      // Listen for message read events
      socket.on("messageRead", ({ messageId }) => {
        console.log("Message Read Triggered", messageId);
        // Update the last message read when the event is received

        // Update the chat history to mark the message as read
        setChatHistory((prevChatHistory) => {
          const updatedChatHistory = prevChatHistory.map((chat) => {
            if (chat._id === messageId) {
              return { ...chat, isRead: true };
            }
            return chat;
          });
          return updatedChatHistory;
        });
      });

      // Message from server
      socket.on("message", (message) => {
        console.log("new msg", message);
        setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
        // Scroll to the bottom when a new message arrives
        scrollToBottom();
      });
    }

    return () => {
      socket.emit("leaveRoom", {
        userA: userA,
        roomId: roomId,
      });

      // Clean up socket listeners
      socket.off("roomUsers");
      socket.off("message");
    };
  }, []);

  // Scroll to the bottom when the chat history changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Automatically mark messages as read when they become visible
  useEffect(() => {
    const markMessagesAsRead = () => {
      if (messageContainerRef.current) {
        console.log("markMessagesAsRead is called");

        // Get the messages that are currently in the viewport
        const visibleMessages = chatHistory.filter((chat) => {
          const element = document.getElementById(`message-${chat._id}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            // console.log(`Message ${chat._id} rect:`, rect); // Debugging
            // console.log("Chat:", chat); // Debugging

            return rect.top >= 0 && rect.bottom <= window.innerHeight;
          }
          return false;
        });

        console.log("Visible Messages:", visibleMessages);

        // Mark visible messages as read
        const unreadMessages = visibleMessages.filter((chat) => {
          console.log("User Matched:", userA === chat.receiverID);

          return !chat.isRead && chat.receiverID === userA;
        });

        console.log("Unread Messages:", unreadMessages);

        unreadMessages.forEach((chat) => {
          socket.emit("messageRead", {
            roomId: connectionData?._id,
            messageId: chat._id,
          });
        });
      }
    };

    // Listen for scroll events to detect when messages become visible
    const handleScroll = () => {
      markMessagesAsRead();
    };

    if (messageContainerRef.current) {
      messageContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Remove the scroll event listener when the component unmounts
      if (messageContainerRef.current) {
        messageContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatHistory, connectionData, userA]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const payload = {
        sender: userA,
        receiver: userB,
        message: message,
        time: new Date().toLocaleTimeString(),
        roomId: connectionData?._id,
      };
      console.log("Payload", payload);

      socket.emit("chatMessage", payload);

      setMessage("");
    }
  };

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

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "column",
          width: "100%",
          margin: "auto",
          borderLeft: "1px solid rgba(0, 0, 0, 0.2)",
        }}>
        <div className={styles.headerContainer}>
          <div className={`${styles.userChatCard}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                padding: "10px 1rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                gap: "1rem",
              }}>
              <Avatar
                fullName={chatPartner?.name ? chatPartner.name : "Anonymous"}
              />
              <div>
                <h3
                  style={{
                    color: "#38486e",
                    fontSize: "1.3rem",
                    fontWeight: "600",
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    lineHeight: "24px",
                  }}>
                  {chatPartner?.name ? chatPartner.name : "Anonymous"}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={messageContainerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "calc(100vh - 232px)",
            overflowY: "scroll",
            padding: "0 1rem",
          }}>
          {chatHistory.map((chat, index) =>
            chat.senderID === userA ? (
              <div
                key={chat._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: "14px",
                }}>
                <div
                  key={chat._id}
                  id={`message-${chat._id}`} // Add an ID to each message element
                  className={`${styles.chatBubble} ${styles.userA}`}>
                  <p>{chat.message}</p>
                </div>
                <p
                  style={{
                    color: "rgba(56, 66, 96, 0.70)",
                    fontFamily: "Poppins",
                    fontSize: "11px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "4px",
                  }}>
                  {formatTimeWithAMPM(chat.timestamp)}
                  <span
                    style={{
                      marginTop: "5px",
                    }}>
                    {" "}
                    {chat.isRead && <BiCheckDouble size={16} />}
                  </span>
                </p>
              </div>
            ) : (
              <div
                key={chat._id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "14px",
                }}>
                <div
                  key={chat._id}
                  id={`message-${chat._id}`} // Add an ID to each message element
                  className={`${styles.chatBubble} ${styles.receivedUser}`}>
                  <p>{chat.message}</p>
                </div>
                <p
                  style={{
                    color: "rgba(56, 66, 96, 0.70)",
                    fontFamily: "Poppins",
                    fontSize: "11px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "24px",
                  }}>
                  {formatTimeWithAMPM(chat.timestamp)}
                </p>
              </div>
            )
          )}
        </div>
        <div className={styles.chatInputContainer}>
          <input
            type='text'
            value={message}
            placeholder='Type a message...'
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    );
  }
}

export default UserChat;
