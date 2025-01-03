import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import style from './ChatBot.module.css';

const ChatbotForm = () => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]); // Store chat history
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formCompleted, setFormCompleted] = useState(false);
  const [currentValue, setCurrentValue] = useState(''); // To store current input value
  const linkId = localStorage.getItem('linkId'); // Get linkId from localStorage

  useEffect(() => {
    // Get form ID from the URL or localStorage
    const linkId = localStorage.getItem('linkId'); // Or get it from the URL if needed

    const fetchFormData = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/forms/share/${linkId}`);
            if (response.data.success) {
                setForm(response.data.form); // Set form state with the fetched form
            } else {
                alert('Form not found');
            }
        } catch (error) {
            console.error('Error fetching form data:', error);
        }
    };

    fetchFormData();
}, [linkId]); // Fetch form when component mounts


  // Wrap submitForm in useCallback to stabilize its reference
  const submitForm = useCallback(async (finalResponses) => {
    try {
      const response = await axios.post('http://localhost:4000/api/forms/save-response', {
        formId: form._id,
        responses: finalResponses, // Submit the final set of responses
      });

      if (response.data.success) {
        alert('Thank you for completing the form!');
      } else {
        alert('Error submitting form responses');
      }
    } catch (error) {
      console.error('Error submitting form responses:', error);
    }
  }, [form._id]);

  // Wrap handleBubbleResponse in useCallback to ensure it has stable dependencies
  const handleBubbleResponse = useCallback(() => {
    const currentField = form.fields[currentFieldIndex];
    const newResponse = {
      label: currentField.label,
      answer: currentField.value, // Bubble value is static
      type: 'bubble', // Mark it as a bubble
    };

    const updatedResponses = [...responses, newResponse];

    setResponses(updatedResponses);

    // Check if it's the last field and mark as completed
    if (currentFieldIndex === form.fields.length - 1) {
      setFormCompleted(true);
      submitForm(updatedResponses); // Save responses to the backend
    } else {
      setCurrentFieldIndex(currentFieldIndex + 1);
    }
  }, [currentFieldIndex, form, responses, submitForm]);

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


  useEffect(() => {
    if (form && form.fields.length > 0) {
      const currentField = form.fields[currentFieldIndex];

      // If it's a bubble field, proceed to the next one automatically after a short delay
      if (currentField.type === 'bubble') {
        setTimeout(() => {
          handleBubbleResponse();
        }, 1000); // Delay before moving to the next bubble field
      }
    }
  }, [currentFieldIndex, form, handleBubbleResponse]);

  if (!form) {
    return <div>Loading form...</div>;
  }

  const currentField = form.fields[currentFieldIndex];

  return (
    <div className={style.chatbotContainer}>
      {/* <h2>{form.name}</h2> */}
      <div className={style.chatbot_innerContainer}>
        {/* Render all previous responses as a chat */}
        {responses.map((response, index) => (
          <div key={index} className={style.bot}>
            <span>{response.type === 'bubble' ? '' : 'You'}: </span>
            <p>{response.answer}</p>
          </div>
        ))}

        {/* Render the current field based on its type */}
        {currentField.type === 'bubble' ? (
          <div>
            <p>{currentField.label}</p>
            {/* The field will automatically proceed without clicking */}
            <p>{currentField.value}</p>
          </div>
        ) : (
          <div className={style.userChat_content}>
            {/* <label>{currentField.label}</label> */}
            <input
              type={currentField.inputType}
              placeholder={`Enter your ${currentField.label.toLowerCase()}`}
              style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
            <button
              onClick={() => {
                handleInputSubmit(currentValue);
                setCurrentValue(''); // Clear input field after submission
              }}
              style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}
            >
              Send
            </button>
          </div>
        )}

        {/* Show Thank You message only if form is completed */}
        {formCompleted && (
          <div style={{ marginTop: '20px' }}>
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
//   const [currentValue, setCurrentValue] = useState(''); // To store current input value

//   const linkId = localStorage.getItem('linkId'); // Get linkId from localStorage

//   useEffect(() => {
//     // Fetch form data from the backend using Axios
//     const fetchFormData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4000/api/forms/share/${linkId}`);
//         if (response.data.success) {
//           setForm(response.data.form);
//         } else {
//           alert('Form not found');
//         }
//       } catch (error) {
//         console.error('Error fetching form data:', error);
//       }
//     };

//     fetchFormData();
//   }, [linkId]);

//   // useCallback for submitForm to prevent unnecessary re-creation on each render
//   const submitForm = useCallback(async (finalResponses) => {
//     try {
//       const response = await axios.post('http://localhost:4000/api/forms/save-response', {
//         formId: form._id,
//         responses: finalResponses, // Submit the final set of responses
//       });

//       if (response.data.success) {
//         alert('Thank you for completing the form!');
//       } else {
//         alert('Error submitting form responses');
//       }
//     } catch (error) {
//       console.error('Error submitting form responses:', error);
//     }
//   }, [form]); // Dependencies: form, because submitForm uses form._id

//   // useCallback for handleBubbleResponse to prevent unnecessary re-creation
//   const handleBubbleResponse = useCallback(() => {
//     const currentField = form.fields[currentFieldIndex];
//     const newResponse = {
//       label: currentField.label,
//       answer: currentField.value, // Bubble value is static
//       type: 'bubble', // Mark it as a bubble
//     };

//     const updatedResponses = [...responses, newResponse];

//     setResponses(updatedResponses);

//     // Check if it's the last field and mark as completed
//     if (currentFieldIndex === form.fields.length - 1) {
//       setFormCompleted(true);
//       submitForm(updatedResponses); // Save responses to the backend
//     } else {
//       setCurrentFieldIndex(currentFieldIndex + 1);
//     }
//   }, [currentFieldIndex, form, responses, submitForm]);

//   // Function to handle input field submission
//   const handleInputSubmit = async (value) => {
//     const currentField = form.fields[currentFieldIndex];
//     const newResponse = {
//       label: currentField.label,
//       answer: value,
//       type: 'input', // Mark it as an input
//     };

//     const updatedResponses = [...responses, newResponse];

//     // Check if it's the last field and mark as completed
//     if (currentFieldIndex === form.fields.length - 1) {
//       setFormCompleted(true); // Form completed
//       await submitForm(updatedResponses); // Pass the updated responses array
//     } else {
//       setResponses(updatedResponses); // Update responses state
//       setCurrentFieldIndex(currentFieldIndex + 1); // Move to the next field
//     }
//   };

//   useEffect(() => {
//     if (form && form.fields.length > 0) {
//       const currentField = form.fields[currentFieldIndex];

//       // If it's a bubble field, proceed to the next one automatically after a short delay
//       if (currentField.type === 'bubble') {
//         setTimeout(() => {
//           handleBubbleResponse();
//         }, 1000); // Delay before moving to the next bubble field
//       }
//     }
//   }, [currentFieldIndex, form, handleBubbleResponse]);

//   if (!form) {
//     return <div>Loading form...</div>;
//   }

//   const currentField = form.fields[currentFieldIndex];

//   return (
//     <div className={style.chatbotContainer}>
//       {/* <h2>{form.name}</h2> */}
//       <div className={style.chatbot_innerContainer}>
//         {/* Render all previous responses as a chat */}
//         {responses.map((response, index) => (
//           <div key={index} className={style.bot}>
//             <span>{response.type === 'bubble' ? '' : 'You'}: </span>
//             <p>{response.answer}</p>
//           </div>
//         ))}
//         {/* Render the current field based on its type */}
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
//                 setCurrentValue(''); // Clear input field after submission
//               }}
//               style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}
//             >
//               Send
//             </button>
//           </div>
//         )}
//         {/* Show Thank You message only if form is completed */}
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
 