import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import useAxios from "../hooks/useAxios";
import axios from "axios";
import Select from "react-select"; // Import react-select
import skillOptions from "../constants/skillOptions.js";
import countryList from "../constants/countryList.js";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiSolidFilePdf } from "react-icons/bi";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../components/Spinner.jsx";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineUser, AiOutlineAudit, AiOutlineSafety } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";

import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatStatus = (status) => {
  switch (status) {
    case "SHORTLISTED":
      return (
        <span
          style={{
            color: "#F17400",
            backgroundColor: "#FFF5CA",
            padding: "5px 20px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "13px",
          }}>
          Shortlisted
        </span>
      );
    case "REJECTED":
      return (
        <span
          style={{
            color: "#D91A1A",
            backgroundColor: "#FFF3F2",
            padding: "5px 20px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "13px",
          }}>
          Rejected
        </span>
      );

    case "HIRED":
      return (
        <span
          style={{
            color: "#00974F",
            backgroundColor: "#D2FDE6",
            padding: "5px 20px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "13px",
          }}>
          Hired
        </span>
      );
    default:
      return (
        <span
          style={{
            color: "#004FCF",
            backgroundColor: "#DDEBFF",
            padding: "5px 20px",
            borderRadius: "50px",
            fontWeight: "600",
            fontSize: "13px",
          }}>
          Applied
        </span>
      );
  }
};

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

const ApplicationDashboardCard = ({ applicationData }) => {
  return (
    <div className={styles.ApplicationDashboardCard}>
      <div>
        <span>{applicationData.jobTitle}</span>
      </div>
      <div>
        <span>{applicationData.jobCompany.companyName}</span>
      </div>
      <div
        style={{
          textAlign: "center",
        }}>
        <span>{formatDate(applicationData.jobAppliedOn)}</span>{" "}
      </div>
      <div
        style={{
          textAlign: "center",
        }}>
        {formatStatus(applicationData.jobApplicationStatus)}
      </div>
    </div>
  );
};

const PaymentDashboardCard = ({ paymentData }) => {
  return (
    <div className={styles.ApplicationDashboardCard}>
      <div>
        <span>
          {paymentData._id.slice(0, 6) + "..." + paymentData._id.slice(-4)}
        </span>{" "}
      </div>
      <div>
        <span>
          {paymentData.paymentType === "SUBSCRIPTION_MONTHLY"
            ? "Pro Subscription"
            : "Purchase"}
        </span>
      </div>
      <div
        style={{
          textAlign: "center",
        }}>
        <span>{new Date(paymentData.paymentDate).toLocaleDateString()}</span>{" "}
      </div>
      <div
        style={{
          textAlign: "center",
        }}>
        <span>{paymentData.paymentStatus}</span>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, dispatch } = useAuthContext();
  const [activeItem, setActiveItem] = useState("Profile");
  const [applicationList, setApplicationList] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    userSkills: [], // Array for multi-select
    mobile: {
      countryCode: "",
      phone: "",
    },
    dob: {
      date: "",
      month: "",
      year: "",
    },
    userResume: {
      id: "",
      secure_url: "",
      fileName: "",
      fileSize: 0,
    },
  });

  const updatePassword = async () => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/user/password-update`;
    try {
      const response = await axios.post(url, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        userId: user._id,
      });
      console.log(response);
      toast.success("Password Updated!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const { response, loading, error } = useAxios({
    method: "get",
    url:
      user?.userType === "USER"
        ? `api/v1/user`
        : `api/v1/company/${user.companyId}`,
    headers: JSON.stringify({ accept: "*/*" }),
  });

  const handleLogOut = () => {
    dispatch({ type: "LOGOUT", payload: null });
    localStorage.removeItem("minervauser");
    window.open("/", "_self");
  };

  function bytesToSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes === 0) return "0 Byte";

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    console.log(selectedFile);

    const formdata = new FormData();
    formdata.append("resume", selectedFile);

    const url = `${import.meta.env.VITE_API_URL}/api/v1/user/upload-resume`;
    try {
      const upload_response = await axios.post(url, formdata);
      console.log(upload_response.data.data);
      console.log(formData);
      setFormData({
        ...formData,
        userResume: {
          id: upload_response.data.data.id,
          secure_url: upload_response.data.data.secure_url,
          fileName: upload_response.data.data.fileName,
          fileSize: upload_response.data.data.fileSize,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (response) {
      if (user.userType === "USER") {
        setFormData({
          name: response.data.name,
          email: response.data.email,
          userSkills: response.data.userSkills,
          userType: response.data.userType,
          mobile: {
            countryCode: response?.data?.mobile?.countryCode || "",
            phone: response?.data?.mobile?.phone || "",
          },
          userResume: {
            id: response?.data?.userResume?.id || "",
            secure_url: response?.data?.userResume?.secure_url || "",
            fileName: response?.data?.userResume?.fileName || "",
            fileSize: response?.data?.userResume?.fileSize || 0,
          },
          dob: {
            date: response?.data?.dob?.date || "",
            month: response?.data?.dob?.month || "",
            year: response?.data?.dob?.year || "",
          },
        });

        setApplicationList(response.data.jobApplications);
      }

      if (user.userType === "COMPANY") {
        setCompanyFormData({
          name: response.data.name,
          email: response.data.email,
          userType: response.data.userType,
          companyName: response.data.companyName,
          companyEmail: response.data.companyEmail,
          companyPhone: response.data.companyPhone,
          companyWebsite: response.data.companyWebsite,
          companyAddress: response.data.companyAddress,
          companyCategory: response.data.companyCategory,
        });
      }
    }
  }, [response]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    const url = `${import.meta.env.VITE_API_URL}/api/v1/user/update`;

    try {
      const response = await axios.post(url, formData);
      console.log(formData);
      toast.success("Profile Updated!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const updateCompanyProfile = async () => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/update-company/${
      user.companyId
    }`;
    try {
      const response = await axios.post(url, companyFormData);
      console.log(response);
      toast.success("Profile Updated!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  //Company part
  const [step, setStep] = useState(1);
  const [companyFormData, setCompanyFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyAddress: "",
    companyDescription: "",
    companyCategory: "",
  });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const companyCategories = [
    "IT",
    "FINANCE",
    "MARKETING",
    "SALES",
    "HR",
    "DESIGN",
    "OTHERS",
    "ANALYTICS",
    "ENGINEERING",
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          width: "100%",
        }}>
        <Spinner />
      </div>
    );
  }

  if (formData.userType === "USER") {
    return (
      <div className={styles.profilePageContainer}>
        <ToastContainer
          className='customToast'
          position='top-center'
          hideProgressBar
          autoClose={2000}
          closeButton={false}
        />
        <div className={styles.profileSidebar}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}>
            <div>
              <Avatar fullName={user?.name ? user.name : "Anonymous"} />
            </div>
            <div>
              <h3
                style={{
                  color: "#38486E",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}>
                {user?.name ? user.name : "Anonymous"}
              </h3>
              <p
                style={{
                  color: "#6F6C90",
                  fontSize: "13px",
                }}>
                {user?.email ? user.email : "Anonymous"}
              </p>
            </div>
          </div>
          <br />
          <div>
            {/* <p
              style={{
                color: "#6F6C90",
                fontSize: "13px",
              }}>
              {user?.isPremiumActivated ? "Premium User" : "Free User"}
            </p>
            <p
              style={{
                color: "#6F6C90",
                fontSize: "13px",
              }}>
              {user?.premiumExpiry
                ? `Premium Expiry: ${formatDate(new Date(user.premiumExpiry))}`
                : ""}
            </p> */}
          </div>

          <div className={styles.profileSidebarMenu}>
            <ul>
              <li
                className={activeItem === "Profile" ? styles.current : ""}
                onClick={() => setActiveItem("Profile")}>
                <AiOutlineUser size={20} />
                Profile
              </li>
              <li
                className={
                  activeItem === "My Applications" ? styles.current : ""
                }
                onClick={() => setActiveItem("My Applications")}>
                <AiOutlineAudit size={20} />
                My Applications
              </li>
              <li
                className={activeItem === "Security" ? styles.current : ""}
                onClick={() => setActiveItem("Security")}>
                <AiOutlineSafety size={20} />
                Security
              </li>
              <li
                className={activeItem === "Order History" ? styles.current : ""}
                onClick={() => setActiveItem("Order History")}>
                <CiCreditCard1 size={20} />
                Order History
              </li>
            </ul>
            <div
              style={{
                marginTop: "205px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
              {/* <button onClick={checkoutPayment}>Pay Premium</button> */}

              <button onClick={handleLogOut}>Log Out</button>
            </div>
          </div>
        </div>

        <div className={styles.profileContainer}>
          {activeItem === "Profile" && (
            <>
              <h2>Edit Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='name'>Name</label>
                      <input
                        type='text'
                        id='name'
                        placeholder='Your Name'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyEmail'>Email</label>
                      <input
                        disabled
                        style={{
                          cursor: "not-allowed",
                        }}
                        type='email'
                        id='companyEmail'
                        placeholder='Your Email'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='phone'>Phone Number</label>
                      <div className={styles.phoneSection}>
                        <select
                          style={{
                            width: "35%",
                          }}
                          id='countryCode'
                          value={formData.mobile.countryCode}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              mobile: {
                                ...formData.mobile,
                                countryCode: e.target.value,
                              },
                            });
                          }}>
                          <option value='' disabled>
                            Select Country Code
                          </option>
                          {countryList.map((country) => (
                            <option
                              key={country.code}
                              value={country.dial_code}>
                              {`(${country.dial_code}) ${country.name} `}
                            </option>
                          ))}
                        </select>
                        <input
                          className={styles.phoneInput}
                          style={{
                            width: "60%",
                            padding: "12px",
                            borderRadius: "12px",
                            border: "2px solid #eff0f6",
                            background: "#fff",
                            color: "#8897ad",
                            fontFeatureSettings: "'clig' off, 'liga' off",
                            fontFamily: "Poppins",
                            fontSize: "13px",
                            fontStyle: "normal",
                            fontWeight: "400",
                            lineHeight: "100%",
                            letterSpacing: "0.16px",
                            marginLeft: "10px",
                          }}
                          type='text'
                          id='phone'
                          placeholder='Phone Number'
                          value={formData.mobile.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobile: {
                                ...formData.mobile,
                                phone: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.formColumn}>
                      {console.log(
                        `${formData.dob.year}-${formData.dob.month}-${formData.dob.date}`
                      )}
                      <label htmlFor='dob'>Date of Birth</label>
                      <input
                        type='date'
                        placeholder='DD/MM/YYYY'
                        id='dob'
                        value={`${formData.dob.year}-${formData.dob.month}-${formData.dob.date}`}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setFormData({
                            ...formData,
                            dob: {
                              date: e.target.value.split("-")[2],
                              month: e.target.value.split("-")[1],
                              year: e.target.value.split("-")[0],
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='userSkills'>Skills</label>
                      <Select
                        id='userSkills'
                        isMulti
                        options={skillOptions}
                        value={formData.userSkills.map((skill) => ({
                          value: skill,
                          label: skill,
                        }))}
                        onChange={(values) =>
                          setFormData({
                            ...formData,
                            userSkills: values.map((value) => value.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='resume'>Resume</label>
                      <input
                        type='file'
                        id='resume'
                        name='resume'
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className={styles.formColumn}>
                      {formData.userResume &&
                      formData.userResume.fileSize > 0 ? (
                        <div
                          style={{
                            position: "relative",
                          }}>
                          <div
                            onClick={() =>
                              setFormData({
                                ...formData,
                                userResume: {
                                  id: "",
                                  secure_url: "",
                                  fileName: "",
                                  fileSize: 0,
                                },
                              })
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              position: "absolute",
                              right: "-13px",
                              top: "20px",
                              cursor: "pointer",
                              backgroundColor: "#F44336",
                              padding: "6px",
                              borderRadius: "50%",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            }}>
                            <AiOutlineDelete size={20} color='#fff' />
                          </div>
                          <p
                            className={styles.uploadedFileData}
                            onClick={() =>
                              window.open(
                                formData.userResume.secure_url,
                                "_blank"
                              )
                            }>
                            <BiSolidFilePdf size={34} color='#0F6AF5' />
                            {formData.userResume.fileName} (
                            {bytesToSize(formData.userResume.fileSize)})
                          </p>
                        </div>
                      ) : (
                        <p
                          className={styles.uploadedFileData}
                          style={{
                            cursor: "not-allowed",
                            color: "#6F6C90",
                            padding: "14px 0px",
                          }}>
                          <BiSolidFilePdf size={34} color='#0F6AF5' />
                          No Resume
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <br />
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <button
                        style={{
                          backgroundColor: "#F2F2F2 ",
                          color: "#38486E",
                        }}
                        onClick={() => {
                          window.open("/dashboard", "_self");
                        }}>
                        Go To Home
                      </button>
                    </div>
                    <div className={styles.formColumn}>
                      <button type='submit'>Update Profile</button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
          {activeItem === "My Applications" && (
            <>
              <div className={styles.ApplicationDashboardContainer}>
                <div className={styles.ApplicationDashboardTable}>
                  <div className={styles.TableHeader}>
                    <div>
                      <span>Job Title</span>
                    </div>
                    <div>
                      <span>Company</span>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                      }}>
                      <span>Applied</span>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                      }}>
                      <span>Status</span>
                    </div>
                  </div>
                  <div className={styles.TableBody}>
                    {applicationList?.map((application) => (
                      <ApplicationDashboardCard
                        key={application._id}
                        applicationData={application}
                        // Add any other props you need
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.ApplicationDashboardPaging}></div>
              </div>
            </>
          )}
          {activeItem === "Security" && (
            <div
              style={{
                height: "calc(100vh - 160px)",
              }}>
              <h2>Security</h2>
              <div className={styles.formGroup}>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <label htmlFor='password'>Currrent Password</label>
                    <input
                      type='password'
                      id='password'
                      placeholder='Current Password'
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <label htmlFor='newPassword'>New Password</label>
                    <input
                      type='password'
                      id='newPassword'
                      placeholder='New Password'
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <button onClick={updatePassword}>Update Password</button>
                </div>
              </div>
            </div>
          )}
          {activeItem === "Order History" && (
            <>
              <>
                <div className={styles.ApplicationDashboardContainer}>
                  <div className={styles.ApplicationDashboardTable}>
                    <div className={styles.TableHeader}>
                      <div>
                        <span>Order No</span>
                      </div>
                      <div>
                        <span>Payment Type</span>
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                        }}>
                        <span>Applied</span>
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                        }}>
                        <span>Status</span>
                      </div>
                    </div>
                    <div className={styles.TableBody}>
                      {response.data.paymentHistoryData?.map((payment) => (
                        <PaymentDashboardCard
                          key={payment._id}
                          paymentData={payment}
                          // Add any other props you need
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.ApplicationDashboardPaging}></div>
                </div>
              </>
            </>
          )}
        </div>
      </div>
    );
  } else if (companyFormData.userType == "COMPANY") {
    return (
      <div className={styles.authContainer}>
        <ToastContainer
          className='customToast'
          position='top-center'
          hideProgressBar
          autoClose={2000}
          closeButton={false}
        />

        <div className={styles.authContainerLeft}>
          <h3>Edit Profile</h3>

          <div className={styles.progressHeader}>
            <div className={styles.activeStep}>1</div>
            <div
              style={{
                width: "14%",
                height: "6px",
                backgroundColor: "#EFF0F6",
                borderRadius: "40px",
              }}>
              <div
                className={
                  step === 1
                    ? styles.progressBarHalf
                    : styles.progressBarComplete
                }></div>
            </div>
            <div className={step === 2 ? styles.activeStep : styles.step}>
              2
            </div>
          </div>
          {step === 1 && (
            <div className={styles.authForm}>
              {/* Step 1 Form */}
              <form>
                <div className={styles.formGroup}>
                  <div className={styles.formColumn}>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      id='name'
                      placeholder='Your Name'
                      value={companyFormData.name}
                      onChange={(e) =>
                        setCompanyFormData({
                          ...companyFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formColumn}>
                    <label htmlFor='companyEmail'>Email</label>
                    <input
                      type='email'
                      id='companyEmail'
                      placeholder='Your Email'
                      value={companyFormData.email}
                      onChange={(e) =>
                        setCompanyFormData({
                          ...companyFormData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='countryCode'>Country Code</label>
                      <select
                        id='countryCode'
                        value={formData.mobile.countryCode}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            mobile: {
                              ...formData.mobile,
                              countryCode: e.target.value,
                            },
                          });
                        }}>
                        <option value='' disabled>
                          Select Country Code
                        </option>
                        {countryList.map((country) => (
                          <option key={country.code} value={country.dial_code}>
                            {`${country.name} (${country.dial_code})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='phone'>Phone Number</label>
                      <input
                        type='text'
                        id='phone'
                        placeholder='Phone Number'
                        value={formData.mobile.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobile: {
                              ...formData.mobile,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className={styles.btnContainer}>
                  <button onClick={nextStep}>Next</button>
                </div>
              </form>
            </div>
          )}
          {step === 2 && (
            <div className={styles.authForm}>
              {/* Step 2 Form */}
              <form>
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyName'>Company Name</label>
                      <input
                        type='text'
                        id='companyName'
                        placeholder='Your Company Name'
                        value={companyFormData.companyName}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyEmail'>Company Email</label>
                      <input
                        type='email'
                        id='companyEmail'
                        placeholder='Company Official Email'
                        value={companyFormData.companyEmail}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyPhone'>Company Phone</label>
                      <input
                        type='text'
                        id='companyPhone'
                        placeholder='Company official phone number'
                        value={companyFormData.companyPhone}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyCategory'>Company Category</label>
                      <select
                        id='companyCategory'
                        value={companyFormData.companyCategory}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyCategory: e.target.value,
                          })
                        }>
                        <option value=''>Select a category</option>
                        {companyCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyWebsite'>Company Website</label>
                      <input
                        type='text'
                        id='companyWebsite'
                        placeholder='Official Website'
                        value={companyFormData.companyWebsite}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyWebsite: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyAddress'>Company Address</label>
                      <input
                        type='text'
                        id='companyAddress'
                        placeholder='Company Address'
                        value={companyFormData.companyAddress}
                        onChange={(e) =>
                          setCompanyFormData({
                            ...companyFormData,
                            companyAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.btnContainer}>
                    <button className={styles.btnOutline} onClick={prevStep}>
                      Back
                    </button>
                    <button onClick={() => updateCompanyProfile()}>
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* Signin banner */}
        </div>
      </div>
    );
  }
};

export default ProfilePage;
