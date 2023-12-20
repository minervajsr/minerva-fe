import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import useAxios from "../hooks/useAxios";
import axios from "axios";
import Select from "react-select"; // Import react-select
import skillOptions from "../constants/skillOptions.js";
import countryList from "../constants/countryList.js";
import { useAuthContext } from "../hooks/useAuthContext";
import { BiSolidFilePdf } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const { user, dispatch } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
    userSkills: [], // Array for multi-select
    mobile: {
      countryCode: "",
      phone: "",
    },
    userResume: {
      id: "",
      secure_url: "",
      fileName: "",
      fileSize: 0,
    },
  });

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
        });
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

        <div className={styles.profileContainer}>
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
                        mobile: { ...formData.mobile, phone: e.target.value },
                      })
                    }
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
                  {formData.userResume && (
                    <p
                      className={styles.uploadedFileData}
                      onClick={() =>
                        window.open(formData.userResume.secure_url, "_blank")
                      }>
                      <BiSolidFilePdf size={34} color='#0F6AF5' />
                      {formData.userResume.fileName} (
                      {bytesToSize(formData.userResume.fileSize)})
                    </p>
                  )}
                </div>
              </div>
            </div>

            <br />
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <button type='submit'>Update Profile</button>
                </div>
              </div>
            </div>
            <div
              className={styles.formColumn}
              style={{
                marginTop: "10px",
              }}>
              <button
                style={{
                  backgroundColor: "#F2F2F2 ",
                  color: "#38486E",
                }}
                onClick={() => {
                  handleLogOut();
                }}>
                Log Out
              </button>
            </div>
          </form>
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
