import { useState, useEffect } from 'react';
import style from './Workspace.module.css';
import axios from 'axios';
import { useTheme } from '../theme-context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Workspace = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [fields, setFields] = useState([]);
    const [formName, setFormName] = useState("");
    // const [isFormSaved, setIsFormSaved] = useState(false); // Initially set to false
    const formId = localStorage.getItem("formId");

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                if (formId) {
                    const response = await axios.get(
                        `http://localhost:4000/api/folders/form/${formId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (response.data.success) {
                        const form = response.data.form;
                        setFormName(form.name);
                        setFields(form.fields);
                        // setIsFormSaved(true);  // If form exists, mark as saved
                    }
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
                toast.error("Error fetching form data");
            }
        };

        fetchFormData();
    }, [formId]);

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
            const response = await axios.put(
                `http://localhost:4000/api/folders/form/${formId}`,
                {
                    folderId: selectedFolderId,
                    formBotName: formName,
                    fields: fields,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
    
            if (response.data.success) {
                toast.success("Form updated successfully!");
                // Redirect to chatbot with the form ID
                navigate(`/chatbot/${response.data.form._id}`);
            }
        } catch (error) {
            console.error("Error updating form:", error);
            toast.error("Error updating form");
        }
    };

    
    const shareForm = async () => {
        try {
            const response = await axios.post(
                `http://localhost:4000/api/form/generate-share-link`,
                { formId },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            if (response.data.success) {
                const link = response.data.link;
                localStorage.setItem("linkId", link);
                alert("Form link generated!");
    
                // Copy link to clipboard
                navigator.clipboard.writeText(link).then(() => {
                    console.log("Form link copied to clipboard!");
                }).catch(err => {
                    console.error("Error copying link:", err);
                });
    
                // Redirect to /chatbot
                navigate(`/chatbot/${link}`);
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
        navigate("/formdashboard");
    };

    const deleteField = (index) => {
        const updatedFields = fields.filter((_, fieldIndex) => fieldIndex !== index);
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
                        <button className={style.Workspace_flowbtn}>Flow</button>
                        <button className={style.Workspace_Responsebtn}>Response</button>
                    </div>

                    <div className={style.Workspace_NavbarBtns}>
                        <div className={style.dark}>
                            <p>Light</p>
                            <label className={style.switch}>
                                <input
                                    type="checkbox"
                                    onChange={toggleTheme}
                                    checked={theme === 'dark'}
                                />
                                <span className={`${style.slider} ${style.round}`}></span>
                            </label>
                            <p>Dark</p>
                        </div>
                        <div className={style.Workspace_NavbarButton}>
                            <button
                                className={style.Workspace_shareBtn}
                                onClick={shareForm}
                                // disabled={!isFormSaved} // Share button enabled only when form is saved
                            >
                                Share
                            </button>
                            <button className={style.Workspace_saveBtn} onClick={updateForm}>Save</button>
                            <button className={style.Workspace_XBtn} onClick={handleCross}>x</button>
                        </div>
                    </div>
                </div>

                <div className={style.Workspace_content}>
                    <div className={style.Workspace_Leftpanel}>
                        <div className={style.sidebar}>
                            <div className={style.bubble}>
                                <h3>Bubbles</h3>
                                <button onClick={() => addBubble("Text")}><i className="fa-regular fa-message"></i>Text</button>
                                <button onClick={() => addBubble("Image")}><i className="fa-regular fa-image"></i>Image</button>
                                <button onClick={() => addBubble("Video")}><i className="fa-solid fa-film"></i>Video</button>
                                <button onClick={() => addBubble("GIF")}><i className="fa-solid fa-gif"></i>GIF</button>
                            </div>
                            <div className={style.inputes}>
                                <h3>Input Fields</h3>
                                <button onClick={() => addInput("text")}>Text</button>
                                <button onClick={() => addInput("number")}><i className="fa-regular fa-hashtag"></i>Number</button>
                                <button onClick={() => addInput("email")}><i className="fa-regular fa-at"></i>Email</button>
                                <button onClick={() => addInput("Phone")}><i className="fa-solid fa-phone"></i>Phone</button>
                                <button onClick={() => addInput("date")}><i className="fa-regular fa-calendar"></i>Date</button>
                                <button onClick={() => addInput("Rating")}><i className="fa-regular fa-star"></i>Rating</button>
                                <button onClick={() => addInput("Buttons")}><i className="fa-regular fa-square-check"></i>Buttons</button>
                            </div>
                        </div>
                    </div>

                    <div className={style.Workspace_Rightpanel}>
                        <div className={style.Workspace_Rightpanel_Container}>
                            <div className={style.startFlag}>
                                <h4><i className="fa-regular fa-flag"></i>Start</h4>
                            </div>
                            {fields.map((field, index) => (
                                <div key={index} className={style.Workspace_FormField}>
                                    <label>{field.label}</label>
                                    {field.type === 'input' ? (
                                        <input
                                            type={field.inputType}
                                            placeholder={`Enter ${field.inputType}`}
                                            value={field.value}
                                            onChange={(e) => handleFieldChange(index, e.target.value)}
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Enter bubble data"
                                                value={field.value}
                                                onChange={(e) => handleFieldChange(index, e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className={style.deleteBtn}>
                                        <button onClick={() => deleteField(index)}> <i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Workspace;


// why the share is not working