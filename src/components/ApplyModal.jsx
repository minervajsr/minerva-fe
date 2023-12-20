import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext"; // Import your authentication context here
import styles from "./ApplyModal.module.css"; // Define CSS for your modal
import axios from "axios";
import { BiSolidFilePdf } from "react-icons/bi";

const ApplyModal = ({ jobTitle, screeningQuestions, onClose, onSubmit }) => {
  const { user } = useAuthContext();
  const [answers, setAnswers] = useState([]);
  const [userResume, setUserResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
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

    onSubmit(applicationData);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
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
      </div>
    </div>
  );
};

export default ApplyModal;
