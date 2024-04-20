import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { BiCheck } from "react-icons/bi";

const PaymentPageItem = ({ title, value }) => {
  return (
    <div
      style={{
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}>
      <p
        style={{
          color: "#707070",
          fontSize: "18px",
          marginBottom: "0 !important",
        }}>
        {title}
      </p>
      <p
        style={{
          color: "#121212",
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "0 !important",
        }}>
        {value}
      </p>
    </div>
  );
};

const PaymentPage = () => {
  const { orderId } = useParams(); // Read the orderId param from the URL

  const url = "/api/v1/getPayment/" + orderId;
  console.log(url);
  const { response, error, loading } = useAxios({
    method: "get",
    url: url,
  });

  const navigate = useNavigate();

  console.log(response, error, loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 80px)",
        backgroundColor: "#F8F8F8",
        width: "100%",
        padding: "20px",
      }}>
      <div
        style={{
          boxShadow: "1px 1px 4px 0 rgba(0, 0, 0, 0.05)",
          width: "35%",
          minWidth: "500px",
          height: "100%",
          backgroundColor: "#fff",
          padding: "0px 35px",
          paddingTop: "18px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <div
          style={{
            marginBottom: "20px",
            width: "90px",
            height: "90px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "100%",
            backgroundColor: "rgba(35, 162, 109, 0.12)",
          }}>
          <div
            style={{
              padding: "10px",
              width: "50px",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "100%",
              backgroundColor: "#23A26D",
            }}>
            <BiCheck color='#fff' style={{ fontSize: "2rem" }} />
          </div>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#474747",
            marginBottom: "20px",
          }}>
          Payment Success
        </p>
        <h2>
          {" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(response.data.paymentAmount)}
        </h2>
        <div
          style={{
            backgroundColor: "#EDEDED",
            borderRadius: "5px",
            width: "100%",
            height: "1px",
            margin: "20px 0",
          }}
        />
        <PaymentPageItem title='Ref Number' value={response.data._id} />
        <PaymentPageItem
          title='Payment Time'
          value={response.data.paymentDate}
        />
        <PaymentPageItem
          title='Payment Type'
          value={response.data.paymentType}
        />
        <PaymentPageItem
          title='Payment Status'
          value={response.data.paymentStatus}
        />
        <div
          style={{
            borderRadius: "5px",
            width: "100%",
            border: "2px dashed  #ededed",
            margin: "20px 0",
          }}></div>

        <PaymentPageItem
          title='Total Amount'
          value={new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(response.data.paymentAmount)}
        />

        <div
          style={{
            borderRadius: "5px",
            width: "100%",
            border: "2px dashed  #ededed",
            margin: "20px 0",
            marginTop: "10px",
          }}></div>

        <div
          style={{
            color: "#707070",
            fontSize: "11px",
            marginTop: "7px",
            marginBottom: "0 !important",
          }}>
          Transaction Id: {response.data.paymentId}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
