import { useState, useEffect, useCallback } from "react";
import style from "./Workspace.module.css";
import axios from "axios";
import { useTheme } from "../theme-context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Workspace = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [forms, setFormResponses] = useState([]);
  const [showResponse, setShowResponse] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0); 
  const formId = localStorage.getItem("formId");

  const headers = Object.keys(forms[0] || {});

// Assuming viewCount and submittedCount are present in the form data

//   const totalViews = forms[0]?.form?.viewCount || 0;
//   const totalSubmissions = forms[0]?.form?.submittedCount || 0;

//   const submissionPercentage = totalViews
//     ? Math.round((totalSubmissions / totalViews) * 100)
//     : 0;

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (viewCount > 0) {
      return ((submittedCount / viewCount) * 100).toFixed(2); 
    }
    return 0; 
  };

  // Fetch responses function
  const fetchResponses = useCallback(async () => {
    try {
      if (formId) {
        const responsesResponse = await axios.get(
          `${BACKEND_URL}/api/forms/responses/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        if (responsesResponse.data.success && responsesResponse.data.data) {
          const transformedResponses = responsesResponse.data.data.map((entry) => {
            let submissionTime = "Unknown";
            if (entry.createdAt) {
              const date = new Date(entry.createdAt);
              if (!isNaN(date)) {
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute:'numeric',second:'numeric'};
                submissionTime = date.toLocaleDateString('en-US', options); 
              }
            }
            const responseObj = { submissionTime };
  
            entry.responses.forEach((response) => {
              responseObj[response.label] = response.answer;
            });
            return responseObj;
          });
  
          setFormResponses(transformedResponses);
        } else {
          console.error("Invalid response data:", responsesResponse.data);
          toast.error("No responses found.");
        }
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast.error("Error fetching responses.");
    }
  }, [formId]);
  
  
  
  useEffect(() => {
    const fetchFormData = async () => {
        try {
          if (formId) {
            const response = await axios.get(
              `${BACKEND_URL}/api/folders/form/${formId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            
            if (response.data.success) {
              const form = response.data.form;
              console.log('Fetched Form:', form);   
              setFormName(form.name);
              setFields(form.fields);
              setViewCount(form.viewCount);
              setSubmittedCount(form.submittedCount);   
            }
          }
        } catch (error) {
          console.error("Error fetching form data:", error);
          toast.error("Error fetching form data");
        }
      };
      
    fetchFormData();
  }, [formId, fetchResponses]);

  
  const addBubble = (type) => {
    const newField = {
      label: `${type}`,
      type: "bubble",
      sequence: fields.length + 1,
      prefilled: true,
      value: "",
    };
    setFields([...fields, newField]);
  };

  const addInput = (inputType) => {
    const newField = {
      label: `${inputType.charAt(0).toUpperCase() + inputType.slice(1)}`,
      type: "input",
      inputType: inputType,
      sequence: fields.length + 1,
      value: "",
    };
    setFields([...fields, newField]);
  };

  const handleFieldChange = (index, newValue) => {
    const updatedFields = [...fields];
    updatedFields[index].value = newValue;
    setFields(updatedFields);
  };

  const updateForm = async () => {
    try {
      const selectedFolderId = localStorage.getItem("folderId");
      const token = localStorage.getItem("token");

      if (!formId) {
        toast.error("Form ID is missing.");
        return;
      }
      if (!token) {
        toast.error("User not authenticated.");
        return;
      }

      const response = await axios.put(
        `${BACKEND_URL}/api/folders/form/${formId}`,
        {
          folderId: selectedFolderId,
          formBotName: formName,
          fields: fields.map((field) => ({
            ...field,
            value: field.value.trim(),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Form updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update form.");
      }
    } catch (error) {
      console.error("Error updating form:", error);
      toast.error(error.response?.data?.message || "Error updating form");
    }
  };

  const shareForm = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/forms/share/${formId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        const link = response.data.link;
        localStorage.setItem("linkId", link);
        navigator.clipboard
          .writeText(link)
          .then(() => toast.success("Link has been copied to the clipboard"))
          .catch((err) => console.error("Error copying link:", err));
        navigate(`/chatbot/${response.data.linkId}`);
      } else {
        toast.error("Failed to generate form link.");
      }
    } catch (error) {
      console.error("Error sharing form:", error);
      toast.error("Error generating form share link.");
    }
  };

  const handleCross = () => {
    setFields([]);
    setFormName("");
    localStorage.removeItem("formId");
    const userId = localStorage.getItem("userId");
    navigate(`/formdashboard/${userId}`);
  };

  const deleteField = (index) => {
    const updatedFields = fields.filter(
      (_, fieldIndex) => fieldIndex !== index
    );
    setFields(updatedFields);
  };

  return (
    <>
      <div className={style.Workspace_Main_Container}>
        <div className={style.Workspace_Navbar}>
          <div className={style.Workspace_input}>
            <input
              type="text"
              name="name"
              placeholder="Enter Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          <div className={style.Workspace_Theme}>
            <button  className={style.Workspace_flowbtn}  onClick={() => setShowResponse(true)} >  Flow </button>
            <button
              className={style.Workspace_Responsebtn}
              onClick={() => {
                fetchResponses(); 
                setShowResponse(false);
              }}
            >
              Response
            </button>
          </div>

          <div className={style.Workspace_NavbarBtns}>
            <div className={style.dark}>
              <p>Light</p>
              <label className={style.switch}>
                <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
                <span className={`${style.slider} ${style.round}`}></span>
              </label>
              <p>Dark</p>
            </div>
            <div className={style.Workspace_NavbarButton}>
                <button className={style.Workspace_shareBtn} onClick={shareForm}>  Share </button>
                <button className={style.Workspace_saveBtn} onClick={updateForm}>  Save </button>
                <button className={style.Workspace_XBtn} onClick={handleCross}>  x </button>
            </div>
          </div>
        </div>

        {showResponse ? (
          <div className={style.Workspace_content}>
            <div className={style.Workspace_Leftpanel}>
              <div className={style.sidebar}>
                <div className={style.bubble}>
                    <h3>Bubbles</h3>
                    <button onClick={() => addBubble("Text")}>  <i className="fa-regular fa-message"></i>Text  </button>
                    <button onClick={() => addBubble("Image")}>  <i className="fa-regular fa-image"></i>Image  </button>
                    <button onClick={() => addBubble("Video")}>  <i className="fa-solid fa-film"></i>Video  </button>
                    <button onClick={() => addBubble("GIF")}>  <i className="fa-solid fa-gif"></i>GIF  </button>
                </div>
                <div className={style.inputes}>
                  <h3>Input Fields</h3>
                    <button onClick={() => addInput("text")}>    <i className="fa-regular fa-message"></i>      Text     </button>
                    <button onClick={() => addInput("number")}>  <i className="fa-regular fa-hashtag"></i>      Number   </button>
                    <button onClick={() => addInput("email")}>   <i className="fa-regular fa-at"></i>           Email    </button>
                    <button onClick={() => addInput("number")}>  <i className="fa-solid fa-phone"></i>          Phone    </button>
                    <button onClick={() => addInput("date")}>    <i className="fa-regular fa-calendar"></i>     Date     </button>
                    <button onClick={() => addInput("Rating")}>  <i className="fa-regular fa-star"></i>         Rating   </button>
                    <button onClick={() => addInput("Buttons")}> <i className="fa-regular fa-square-check"></i> Buttons  </button>
                </div>
              </div>
            </div>

            <div className={style.Workspace_Rightpanel}>
              <div className={style.Workspace_Rightpanel_Container}>
                <div className={style.startFlag}>
                    <h4> <i className="fa-regular fa-flag"></i>Start  </h4>
                </div>
                {fields.map((field, index) => (
                  <div key={index} className={style.Workspace_FormField}>
                    <label>{field.label}</label>
                    {field.type === "input" ? (
                      <input
                        type={field.inputType}
                        placeholder={`Enter ${field.inputType}`}
                        value={field.value}
                        onChange={(e) =>
                          handleFieldChange(index, e.target.value)
                        }
                      />
                    ) : (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter bubble data"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                          }
                        />
                      </div>
                    )}
                    <div className={style.deleteBtn}>
                      <button onClick={() => deleteField(index)}>
                        {" "}
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
        <div className={style.Response_Container}>
            <div className={style.Status_Container}>
                <p>  <strong> Views    </strong> {viewCount}       </p>
                <p>  <strong>Submitted </strong> {submittedCount}  </p>
            </div>

            {/* Responses Table */}
            <table className={style.Response_Table}>
              <thead>
                <tr>
                  <th>#</th>
                  {headers.map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forms.map((response, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {headers.map((key, i) => (
                      <td key={i}>{response[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Circular Progress Bar */}
            <div className={style.Analysis_Container}>
              <div className={style.Progress_Chart}>
                <CircularProgressbar
                  value={calculateCompletionRate()}
                  text={`${calculateCompletionRate()}%`}
                  styles={buildStyles({
                    textColor: "white",
                    pathColor: "cyan",
                    trailColor: "#ddd",
                    textSize: "16px",
                  })}
                />
                {/* <div> Completed  {`${calculateCompletionRate()}`}</div> */}
              </div>
              <div className={style.Status_Container}>
                    <p>  <strong>Completion Rate</strong> {calculateCompletionRate()}%  </p>
              </div>
            </div>
        </div>
        )}
      </div>
    </>
  );
};

export default Workspace;

// original








































// original chatbot.jsx


import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import style from './ChatBot.module.css';
import send from '../../assets/send.png';
import { useParams } from 'react-router-dom';
import profile from '../../assets/avatar.jpg';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ChatbotForm = () => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]); // Store chat history
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formCompleted, setFormCompleted] = useState(false);
  const [currentValue, setCurrentValue] = useState(''); // To store current input value
  const { linkId } = useParams();
  
  useEffect(() => {
    if (!linkId) {
      console.error("Error: linkId is undefined");
      alert("Invalid link ID. Please check the URL.");
      return; 
    }
  
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/forms/share/${linkId}`,
        );
        if (response.data.success && response.data.form) {
          setForm(response.data.form);
        } else {
          console.error("Invalid response data:", response.data);
          alert("Form not found");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        alert("Failed to fetch form data. Please try again.");
      }
    };
  
    fetchFormData();
  }, [linkId]);

  // Wrap submitForm in useCallback to ensure stability across renders
  const submitForm = useCallback(async (finalResponses) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/forms/save-response`,
        {
          formId: form._id,
          responses: finalResponses,
          submittedAt: new Date(),   // this is the submitted time
        }
      );
  
      if (response.data.success) {
        // alert('Thank you for completing the form!'); 
        console.log('Submitted at:', response.data.submittedAt); // Check the response
      } else {
        alert('Error submitting form responses');
      }
    } catch (error) {
      console.error('Error submitting form responses:', error);
    }
  }, [form]);
  
  // Function to handle bubble field progression
  const handleBubbleResponse = useCallback(() => {
    const currentField = form.fields[currentFieldIndex];
    const newResponse = {
      label: currentField.label,
      answer: currentField.value,
      type: 'bubble', 
    };

    const updatedResponses = [...responses, newResponse];

    setResponses(updatedResponses);

    // Check if it's the last field and mark as completed
    if (currentFieldIndex === form.fields.length - 1) {
      setFormCompleted(true);
      submitForm(updatedResponses);
    } else {
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  }, [currentFieldIndex, form, responses, submitForm]);

  useEffect(() => {
    if (form && form.fields.length > 0) {
      const currentField = form.fields[currentFieldIndex];

      if (currentField.type === 'bubble') {
        setTimeout(() => {
          handleBubbleResponse();
        }, 1000); 
      }
    }
  }, [currentFieldIndex, form, handleBubbleResponse]); 

  // Function to handle input field submission
  const handleInputSubmit = async (value) => {
    const currentField = form.fields[currentFieldIndex];
    const newResponse = {
      label: currentField.label,
      answer: value,
      type: 'input', // Mark it as an input
    };

    const updatedResponses = [...responses, newResponse];

    // Check if it's the last field and mark as completed
    if (currentFieldIndex === form.fields.length - 1) {
      setFormCompleted(true); 
      await submitForm(updatedResponses); 
    } else {
      setResponses(updatedResponses); 
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  if (!form) {
    return <div>Loading form...</div>;
  }

  const currentField = form.fields[currentFieldIndex];
  
  console.log("Current Field Index:", currentFieldIndex);
  console.log("Form Fields:", form.fields);
  console.log("Current Field:", currentField);

  return (
    <div className={style.container}>
      <div className={style.chatContainer}>
        <h2>{form.name}</h2>
        <div>
          {/* Render all previous responses as a chat */}
          {responses.map((response, index) => (
<div key={index}>
  {response.type === "bubble" ? (
    <div className={style.bubbleDiv}>
      <img src={profile} alt="botimg" className={style.botImg} />
      <button className={style.bubbleStyle}>{response.answer}</button>
    </div>
  ) : (
    <div className={style.inputDiv}>
      <button className={style.inputStyle}>{response.answer}</button>
    </div>
  )}
            </div>
          ))}
        </div>

        {/* Render the current field based on its type */}
        {currentField.type === "bubble" ? (
          <div>
            <p>{currentField.label}</p>
            <p>{currentField.value}</p>
          </div>
        ) : (
          <div className={style.inputContainer}>
            <input
              type={currentField.inputType}
              placeholder={`Enter your ${currentField.label.toLowerCase()}`}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
            <button
              onClick={() => {
                handleInputSubmit(currentValue);
                setCurrentValue(""); // Clear input field after submission
              }}>
              <img src={send} alt="sendimg" />
            </button>
          </div>
        )}

        {/* Show Thank You message only if form is completed */}
        {formCompleted && (
          <div className={style.thankyouDiv}>
            <h3>Thank you for filling out the form!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// export default ChatbotForm;


// why the rating is not between 1 to 5 and buttons is a input  instead of submit button which is only available at the end when clicked it will save response and ahow the message  " <h3>Thank you for filling out the form!</h3>"  
