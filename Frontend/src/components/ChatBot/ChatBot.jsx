  import { useState, useEffect, useCallback } from 'react';
  import axios from 'axios';
  import style from './ChatBot.module.css';
  import send from '../../assets/send.png';
  import { useParams } from 'react-router-dom';
  import profile from '../../assets/avatar.jpg';

<<<<<<< HEAD
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

=======
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
            `http://localhost:4000/api/forms/share/${linkId}`,

>>>>>>> 92f3087 (Your descriptive commit message here)
  
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
<<<<<<< HEAD
          `${BACKEND_URL}/api/forms/save-response`,
=======
          `http://localhost:4000/api/forms/save-response`,
>>>>>>> 92f3087 (Your descriptive commit message here)
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

  export default ChatbotForm;


