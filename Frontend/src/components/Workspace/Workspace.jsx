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
  const [isFormSaved, setIsFormSaved] = useState(false);

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
    if (fields.some(field => field.type === "buttons")) {
      toast.warn("You cannot add more fields after adding buttons.");
      return;
    }
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
    if (fields.some(field => field.type === "buttons")) {
      toast.warn("You cannot add more fields after adding buttons.");
      return;
    }
    const newField = {
      label: `${inputType.charAt(0).toUpperCase() + inputType.slice(1)}`,
      type: "input",
      inputType: inputType,
      sequence: fields.length + 1,
      value: "",
    };
    setFields([...fields, newField]);
  };
  
  const addPhoneInput = () => {
    if (fields.some(field => field.type === "buttons")) {
      toast.warn("You cannot add more fields after adding buttons.");
      return;
    }
    const newField = {
      label: "Phone Number",
      type: "input",
      inputType: "number",
      sequence: fields.length + 1,
      value: "",
    };
    setFields([...fields, newField]);
  };
  
  const addRatingInput = () => {
    if (fields.some(field => field.type === "buttons")) {
      toast.warn("You cannot add more fields after adding buttons.");
      return;
    }
    const newField = {
      label: "Rating",
      type: "rating",
      sequence: fields.length + 1,
      value: 1,  
    };
    setFields([...fields, newField]);
  };
  
  const addButtonsInput = () => {
    if (fields.some(field => field.type === "buttons")) {
      toast.info("Buttons input already exists.");
      return;
    }
    const newField = {
      label: "Buttons",
      type: "buttons",
      sequence: fields.length + 1,
      options: ["Submit"], 
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
          fields: fields.map(field => ({
            label: field.label,
            type: field.type,
            sequence: field.sequence,
            value: field.type === "rating" ? parseInt(field.value, 10) || 1 : field.value || "",
            ...(field.type === "input" && { inputType: field.inputType || "text" }),
            ...(field.type === "buttons" && { options: field.options || ["Submit"] })
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.success) {
        toast.success("Form updated successfully!");
        setIsFormSaved(true);  // Disable fields after save
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
          {/* <button  className={style.Workspace_flowbtn}  onClick={() => setShowResponse(true)} >  Flow </button>
            <button
              className={style.Workspace_Responsebtn}
              onClick={() => {
                fetchResponses(); 
                setShowResponse(false);
              }}
            >
              Response
            </button> */}

            <button className={`${style.Workspace_flowbtn} ${showResponse ? style.activeButton : ""}`} 
            onClick={() => setShowResponse(true)}
            >
                Flow
            </button>
            <button
              className={`${style.Workspace_Responsebtn} ${!showResponse ? style.activeButton : ""}`}
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
                    <button onClick={() => addBubble("GIF")}>  <i className="fa-regular fa-file-video"></i>GIF  </button>
                </div>
                <div className={style.inputes}>
                  <h3>Input Fields</h3>
                  <button onClick={() => addInput("text")}><i className="fa-regular fa-message"></i> Text</button>
                  <button onClick={() => addInput("number")}><i className="fa-regular fa-hashtag"></i> Number </button>
                  <button onClick={() => addInput("email")}> <i className="fa-regular fa-at"></i> Email</button>
                  <button onClick= {addPhoneInput}> <i className="fa-solid fa-phone"></i> Phone</button>
                  <button onClick={() => addInput("date")}><i className="fa-regular fa-calendar"></i> Date</button>
                  <button onClick= {addRatingInput}><i className="fa-regular fa-star"></i> Rating </button>
                  <button onClick={addButtonsInput}><i className="fa-regular fa-square-check"></i> Buttons</button>
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
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                        disabled={isFormSaved}
                        />
                      ) : field.type === "rating" ? (
                      <input    
                      type="number"
                      min="1"
                      max="5"
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, Math.max(1, Math.min(5, e.target.value)))}
                      placeholder="Give rating (1-5)"
                      disabled={isFormSaved}
                      />
                    ) : field.type === "buttons" ? (
                    <div>
                      {field.options.map((option, i) => (
                        <button key={i} onClick={() => handleFieldChange(index, option)}>{option}</button>
                      ))}
                    </div>
                    ) : field.type === "bubble" && field.value ? (
                      // Check for specific media types and render accordingly
                      // field.label === "Image" ? (
                      //   <img src={field.value} alt="Bubble Image" className={style.BubbleImage} />
                      // ) :
                      //  field.label === "Video" ? (
                      //   <video controls className={style.BubbleVideo}>
                      //     <source src={field.value} type="video/mp4" />
                      //     Your browser does not support the video tag.
                      //   </video>
                      // ) : field.label === "GIF" ? (
                      //   <img src={field.value} alt="Bubble GIF" className={style.BubbleGIF} />
                      // ) 
                      // :
                      (
                       <input
                       type="text"
                       placeholder="Enter bubble data"
                       value={field.value}
                       onChange={(e) => handleFieldChange(index, e.target.value)}
                       disabled={isFormSaved}
                       />
                      )
                    ) : (
                        <input
                        type="text"
                        placeholder="Enter bubble data"
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                        disabled={isFormSaved}
                        />
                      )}

                      <div className={style.deleteBtn}>
                        <button onClick={() => deleteField(index)}>
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
                    textColor: "gray",
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

