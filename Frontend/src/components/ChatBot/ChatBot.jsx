import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import style from './ChatBot.module.css';
import send from '../../assets/send.png';
import { useParams } from 'react-router-dom';
import profile from '../../assets/avatar.jpg';

const ChatbotForm = () => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]); // Store chat history
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formCompleted, setFormCompleted] = useState(false);
  const [currentValue, setCurrentValue] = useState(''); // To store current input value

  // const apiUrl = import.meta.env.VITE_API_URI;

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

          // `${apiUrl}/api/forms/share/${linkId}`
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
        `http://localhost:4000/api/forms/save-response`,
        {
          formId: form._id,
          responses: finalResponses, // Submit the final set of responses
        }
      );

      if (response.data.success) {
        alert('Thank you for completing the form!');
      } else {
        alert('Error submitting form responses');
      }
    } catch (error) {
      console.error('Error submitting form responses:', error);
    }
  }, [form]);  // Make sure to include form in the dependency array

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
  }, [currentFieldIndex, form, responses, submitForm]); // Now using stable submitForm

  useEffect(() => {
    if (form && form.fields.length > 0) {
      const currentField = form.fields[currentFieldIndex];

      if (currentField.type === 'bubble') {
        setTimeout(() => {
          handleBubbleResponse();
        }, 1000); 
      }
    }
  }, [currentFieldIndex, form, handleBubbleResponse]); // Handle other dependencies but not submitForm

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
      setFormCompleted(true); // Form completed
      await submitForm(updatedResponses); // Pass the updated responses array
    } else {
      setResponses(updatedResponses); // Update responses state
      setCurrentFieldIndex(currentFieldIndex + 1); // Move to the next field  
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





















// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import style from './ChatBot.module.css';

// const ChatbotForm = () => {
//   const [form, setForm] = useState(null);
//   const [responses, setResponses] = useState([]); // Store chat history
//   const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
//   const [formCompleted, setFormCompleted] = useState(false);
//   const [currentValue, setCurrentValue] = useState(''); 
//   const linkId = localStorage.getItem('linkId'); 

//   useEffect(() => {
//     const linkId = localStorage.getItem('linkId'); 

//     const fetchFormData = async () => {
//         try {
//             const response = await axios.get(           `http://localhost:4000/api/forms/share/${linkId}`,
//             );
//             if (response.data.success) {
//                 setForm(response.data.form); 
//             } else {
//                 alert('Form not found');
//             }
//         } catch (error) {
//             console.error('Error fetching form data:', error);
//         }
//     };

//     fetchFormData();
// }, [linkId]); 


//   // Wrap submitForm in useCallback to stabilize its reference
//   const submitForm = useCallback(async (finalResponses) => {
//     try {
//       const response = await axios.post('http://localhost:4000/api/forms/save-response', {
//         formId: form._id,
//         responses: finalResponses, 
//       });

//       if (response.data.success) {
//         alert('Thank you for completing the form!');
//       } else {
//         alert('Error submitting form responses');
//       }
//     } catch (error) {
//       console.error('Error submitting form responses:', error);
//     }
//   }, [form._id]);

//   // Wrap handleBubbleResponse in useCallback to ensure it has stable dependencies

//   const handleBubbleResponse = useCallback(() => {
//     const currentField = form.fields[currentFieldIndex];
//     const newResponse = {
//       label: currentField.label,
//       answer: currentField.value,
//       type: 'bubble', 
//     };

//     const updatedResponses = [...responses, newResponse];

//     setResponses(updatedResponses);

//     // Check if it's the last field and mark as completed
//     if (currentFieldIndex === form.fields.length - 1) {
//       setFormCompleted(true);
//       submitForm(updatedResponses);
//     } else {
//       setCurrentFieldIndex(currentFieldIndex + 1);
//     }
//   }, [currentFieldIndex, form, responses, submitForm]);

//   // Function to handle input field submission
//   const handleInputSubmit = async (value) => {
//     const currentField = form.fields[currentFieldIndex];
//     const newResponse = {
//         label: currentField.label,
//         answer: value,
//         type: 'input', 
//     };

//     const updatedResponses = [...responses, newResponse];

//     // Check if it's the last field and mark as completed
//     if (currentFieldIndex === form.fields.length - 1) {
//         setFormCompleted(true);
//         await submitForm(updatedResponses);
//     } else {
//         setResponses(updatedResponses); 
//         setCurrentFieldIndex(currentFieldIndex + 1); 
//     }
// };


//   useEffect(() => {
//     if (form && form.fields.length > 0) {
//       const currentField = form.fields[currentFieldIndex];

//       if (currentField.type === 'bubble') {
//         setTimeout(() => {
//           handleBubbleResponse();
//         }, 1000); 
//       }
//     }
//   }, [currentFieldIndex, form, handleBubbleResponse]);

//   if (!form) {
//     return <div>Loading form...</div>;
//   }

//   const currentField = form.fields[currentFieldIndex];

//   return (
//     <div className={style.chatbotContainer}>
//       <div className={style.chatbot_innerContainer}>
//         {responses.map((response, index) => (
//           <div key={index} className={style.bot}>
//             <span>{response.type === 'bubble' ? '' : 'You'}: </span>
//             <p>{response.answer}</p>
//           </div>
//         ))}

//         {currentField.type === 'bubble' ? (
//           <div>
//             <p>{currentField.label}</p>
//             <p>{currentField.value}</p>
//           </div>
//         ) : (
//           <div className={style.userChat_content}>
//             <input
//               type={currentField.inputType}
//               placeholder={`Enter your ${currentField.label.toLowerCase()}`}
//               style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
//               value={currentValue}
//               onChange={(e) => setCurrentValue(e.target.value)}
//             />
//             <button
//               onClick={() => {
//                 handleInputSubmit(currentValue);
//                 setCurrentValue(''); 
//               }}
//               style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}
//             >
//               Send
//             </button>
//           </div>
//         )}

  
//         {formCompleted && (
//           <div style={{ marginTop: '20px' }}>
//             <h3>Thank you for filling out the form!</h3>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatbotForm;

