import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // Import your authentication context here
import styles from "./ApplyModal.module.css"; // Define CSS for your modal
import axios from "axios";
import { BiSolidFilePdf } from "react-icons/bi";
import check from "../assets/bigcheck-green.svg";
import star from "../assets/starpremium.svg";
import { BsCheck } from "react-icons/bs";
import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router";

let cashfree;
const initializeSDK = async function () {
  cashfree = await load({
    mode: "sandbox",
  });
};

const ApplyModal = ({
  jobTitle,
  screeningQuestions,
  onClose,
  onSubmit,
  jobId,
}) => {
  const { user, dispatch } = useAuthContext();
  const [answers, setAnswers] = useState([]);
  const [userResume, setUserResume] = useState(null);
  const [premiumStatus, setPremiumStatus] = useState(false); // New state for premium status
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress
  const [modalStatus, setModalStatus] = useState(0); // 0 - Form, 1 - Success, 2 - Error, 3 - Pay for premium

  initializeSDK();
  const navigate = useNavigate();

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleDone = () => {
    if (premiumStatus) {
      onClose();
    } else {
      setModalStatus(3);
    }
  };

  function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes === 0) return "0 Byte";

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  const handleFileChange = async (event) => {
    console.log(event.target.files[0]);
    setUserResume(null); // Reset user resume state
    const selectedFile = event.target.files[0];

    console.log(selectedFile);

    const formdata = new FormData();
    formdata.append("resume", selectedFile);

    const url = `${import.meta.env.VITE_API_URL}/api/v1/user/upload-resume`;
    try {
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update upload progress
        },
      };
      const upload_response = await axios.post(url, formdata, config);
      console.log(upload_response.data.data);
      setUserResume(upload_response.data.data);
      setUploadProgress(0); // Reset upload progress when finished
    } catch (error) {
      console.log(error);
      setUploadProgress(0); // Reset upload progress on error
    }
  };

  const getUserResume = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/v1/user/resume`;
      const request = await axios.get(url);
      setUserResume(request.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserResume();
  }, []);

  const handleSubmit = () => {
    const applicationData = {
      answers,
      userResume,
    };

    applyForJob(applicationData);
  };

  const applyForJob = async (applicationData) => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/apply/${jobId}`;
    await axios
      .post(url, {
        applicationData,
      })
      .then(function (response) {
        console.log("res", response.data);
        // toast.success("🎉 Application Submitted!");
        setModalStatus(1);
        setPremiumStatus(response.data.premiumStatus); // Set premium status
      })
      .catch(function (error) {
        console.log(error);
        setModalStatus(2);
        // toast.error(error.response.data.message);
      });
  };

  const verifyPayment = async (order_id) => {
    const url = `${
      import.meta.env.VITE_API_URL
    }/api/v1/verifyPayment/${order_id}`;
    try {
      const response = await axios.get(url);
      console.log(response.data.data);

      if (response.data.data.order_status === "PAID") {
        localStorage.setItem(
          "minervauser",
          JSON.stringify({
            ...user,
            isPremiumActivated: response.data.userData.isPremiumActivated,
            paymentHistory: response.data.userData.paymentHistory,
            premiumExpiry: response.data.userData.premiumExpiry,
          })
        );
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...user,
            isPremiumActivated: response.data.userData.isPremiumActivated,
            paymentHistory: response.data.userData.paymentHistory,
            premiumExpiry: response.data.userData.premiumExpiry,
          },
        });
        navigate(`/payment/${order_id}`);
        onClose();
      } else {
        // toast.error("Payment Failed!");
        console.log("Payment Failed!");
        onClose();
      }
    } catch (error) {
      console.log(error);
      // toast.error("Payment Failed!");
      onClose();
    }
  };

  const checkoutPayment = async (e) => {
    e.preventDefault();
    try {
      const orderUrl = `${import.meta.env.VITE_API_URL}/api/v1/createOrder`;
      const orderResponse = await axios.post(orderUrl, {
        amount: 11,
        currency: "INR",
        orderType: "SUBSCRIPTION_MONTHLY",
        userId: user._id,
        orderId: Math.floor(Math.random() * 1000000000),
      });

      console.log(orderResponse.data);
      const orderId = orderResponse.data.data.order_id;
      let checkoutOptions = {
        paymentSessionId: orderResponse.data.data.payment_session_id,
        redirectTarget: "_modal",
      };
      console.log("checkoutOptions", checkoutOptions);

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("payment initialized");
        console.log(res);

        if (orderId) {
          verifyPayment(orderId);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        {modalStatus === 0 && (
          <>
            <h2>{jobTitle}</h2>
            <form className={styles.form}>
              <h3>Screening Questions:</h3>
              {screeningQuestions.map((question, index) => (
                <div key={index}>
                  <p>{question}</p>
                  <input
                    type='text'
                    placeholder='Enter your answer'
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(e, index)}
                  />
                </div>
              ))}
              <h3>Resume</h3>
              <div className={styles.formGroup}>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <input
                      type='file'
                      id='resume'
                      name='resume'
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className={styles.formColumn}>
                    {userResume &&
                    userResume.fileName &&
                    userResume.fileName.length > 0 ? (
                      <>
                        {uploadProgress > 0 ? ( // Display "Uploading" during upload
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                              padding: "5px",
                              width: "100%",
                              height: "100%",
                              border: "2px solid #0F6AF5",
                              borderRadius: "4px",
                            }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "40px",
                                height: "40px",
                              }}>
                              <div className={styles.loadingAnimation}></div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "calc(100% - 30px)",
                                height: "40px",
                              }}>
                              <div
                                className={styles.uploadProgress}
                                style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          </div>
                        ) : (
                          <p
                            className={styles.uploadedFileData}
                            onClick={() =>
                              window.open(userResume.secure_url, "_blank")
                            }>
                            <BiSolidFilePdf size={34} color='#0F6AF5' />

                            {`${userResume.fileName}` +
                              `(${bytesToSize(userResume.fileSize)})`}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className={styles.uploadedFileDataBlank}>
                        {uploadProgress > 0 ? ( // Display "Uploading" during upload
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                              padding: "5px",
                              width: "100%",
                              height: "100%",
                              border: "2px solid #0F6AF5",
                              borderRadius: "4px",
                            }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "40px",
                                height: "40px",
                              }}>
                              <div className={styles.loadingAnimation}></div>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "calc(100% - 30px)",
                                height: "40px",
                              }}>
                              <div
                                className={styles.uploadProgress}
                                style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <BiSolidFilePdf size={34} color='#8897ad' />
                            No Resume
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <br />
            </form>
            <div className={styles.buttons}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={handleSubmit}>Apply</button>
            </div>
          </>
        )}

        {modalStatus === 1 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px 0px",
            }}>
            <img src={check} alt='success' />
            <br />
            <h2>Application Submitted!</h2>
            <p
              style={{
                textAlign: "center",
                color: "#8897ad",
                fontSize: "16px",
                lineHeight: "24px",
                margin: "0px",
                width: "88%",
              }}>
              Congratulations! Your application has been successfully submitted.
              Thank you for applying, and we'll be in touch soon.
            </p>
            <br />
            <button
              onClick={() => {
                handleDone();
              }}
              style={{
                padding: "14px 40px",
                backgroundColor: "#20BE79",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
              }}>
              Done
            </button>
          </div>
        )}

        {modalStatus === 2 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px 0px",
            }}>
            <h2>Application Failed!</h2>
            <p
              style={{
                textAlign: "center",
                color: "#8897ad",
                fontSize: "16px",
                lineHeight: "24px",
                margin: "0px",
                width: "88%",
              }}>
              Sorry, something went wrong. Please try again later.
            </p>
            <br />
            <button
              onClick={() => {
                handleDone();
              }}
              style={{
                padding: "14px 40px",
                backgroundColor: "#20BE79",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
              }}>
              Done
            </button>
          </div>
        )}

        {modalStatus === 3 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "60px 0px",
            }}>
            <img src={star} alt='success' />
            <br />

            <h2
              style={{
                width: "60%",
                textAlign: "center",
              }}>
              Boost Your Profile with{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: "gold",
                }}>
                Pro
              </span>{" "}
              & Get Hired
              <span
                style={{
                  fontWeight: "bold",
                  color: "#0061FE",
                }}>
                {" "}
                18x
              </span>{" "}
              Faster
            </h2>
            <ul
              style={{
                listStyle: "none",
                color: "#8897ad",
                fontSize: "16px",
                textAlign: "center",
                lineHeight: "24px",
                margin: "0px",
                width: "88%",
              }}>
              <li
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "6px",
                }}>
                <BsCheck size={24} /> Your profile gets priority for relevant
                job matches.
              </li>
              <li
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "6px",
                }}>
                <BsCheck size={24} /> Enjoy priority customer support
              </li>
              <li
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <BsCheck size={24} /> Get personal mentor and grow your
                Professional career
              </li>
            </ul>
            <br />
            <button
              onClick={checkoutPayment}
              style={{
                padding: "14px 40px",
                backgroundColor: "#0061FE",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
              }}>
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
