import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import style from './ChatBot.module.css';
import send from '../../assets/send.png';
import { useParams } from 'react-router-dom';
import profile from '../../assets/avatar.jpg';
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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
        console.log('Submitted at:', response.data.submittedAt); // Check the response
      } else {
        alert('Error submitting form responses');
      }
    } catch (error) {
      console.error('Error submitting form responses:', error);
    }
  }, [form]);

  const handleBubbleResponse = useCallback(() => {
    const currentField = form.fields[currentFieldIndex];
    const newResponse = {
      label: currentField.label,
      answer: currentField.value,
      type: 'bubble', 
    };

    const updatedResponses = [...responses, newResponse];

    setResponses(updatedResponses);

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

  const handleInputSubmit = async (value) => {
    const currentField = form.fields[currentFieldIndex];
    const newResponse = {
      label: currentField.label,
      answer: value,
      type: 'input',
    };

    const updatedResponses = [...responses, newResponse];

    if (currentFieldIndex === form.fields.length - 1) {
      setFormCompleted(true); 
      await submitForm(updatedResponses); 
    } else {
      setResponses(updatedResponses); 
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  };

  const handleRatingSubmit = async (value) => {
    const currentField = form.fields[currentFieldIndex];
    const newResponse = {
      label: currentField.label,
      answer: value,
      type: 'rating',
    };

    const updatedResponses = [...responses, newResponse];

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
  
  return (
    <div className={style.container}>
      <div className={style.chatContainer}>
        <h2>{form.name}</h2>
        <div>
          {responses.map((response, index) => (
            <div key={index}>
              {response.type === "bubble" ? (
                <div className={style.bubbleDiv}>
                  <img src={profile} alt="botimg" className={style.botImg} />
                  {/* Render different media types for bubble */}
                  {response.answer.startsWith("http") ? (
                      response.answer.includes("youtube.com") || response.answer.includes("youtu.be") ? (
                        <iframe 
                          className={style.bubbleMedia}
                          src={`https://www.youtube.com/embed/${response.answer.split("v=")[1]?.split("&")[0]}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : 
                      response.answer.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                      <video controls className={style.bubbleMedia}>
                        <source src={response.answer} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={response.answer} alt="Bubble Image/GIF" className={style.bubbleMedia} />
                    )
                  ) : (
                    <button className={style.bubbleStyle}>{response.answer}</button>
                  )}
                </div>
              ) : response.type === "rating" ? (
                <div className={style.ratingDiv}>
                  <p>{response.label}: {response.answer}</p>
                </div>
              ) : (
                <div className={style.inputDiv}>
                  <button className={style.inputStyle}>{response.answer}</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {currentField.type === "bubble" ? (
          <div>
            {/* <p>{currentField.label}</p> */}
            <p>{currentField.value}</p>
          </div>
        ) : currentField.type === "rating" ? (
          <div>
            {/* <p>{currentField.label}</p> */}
            <div>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingSubmit(rating)}
                  className={style.ratingButton}>
                  {rating}
                </button>
              ))}
            </div>
          </div>
        ) : currentField.type === "buttons" ? (
          <div>
            {/* <p>{currentField.label}</p> */}
            <button
              onClick={() => {
                submitForm(responses);
                setFormCompleted(true);
                toast.success("Form Submitted Successfully");
              }}
              className={style.submitButton}>
              Submit
            </button>
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
                setCurrentValue(""); 
              }}>
              <img src={send} alt="sendimg" />
            </button>
          </div>
        )}

        {formCompleted && (
          <div className={style.thankyouDiv}>
            <h3>Thank you for filling out the form!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotForm;
