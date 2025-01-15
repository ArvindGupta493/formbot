// // import React from 'react';
// import PropTypes from 'prop-types';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import style from './Response.module.css';

// const Responses = ({ forms }) => {
//     if (!forms || forms.length === 0) {
//         return (
//             <div className={style.Response_Container}>
//                 <p>No responses available for this form.</p>
//             </div>
//         );
//     }

//     // Assuming viewCount and submittedCount are present in the form data
//     const totalViews = forms[0]?.form?.viewCount || 0;
//     const totalSubmissions = forms[0]?.form?.submittedCount || 0;

//     // Calculate percentage of submissions
//     const submissionPercentage = totalViews
//         ? Math.round((totalSubmissions / totalViews) * 100)
//         : 0;

//     const headers = Object.keys(forms[0] || {});

//     return (
//         <div className={style.Response_Container}>
//             <h2>Form Responses</h2>


//             {/* Responses Table */}
//             <table className={style.Response_Table}>
//                 <thead>
//                     <tr>
//                         <th>#</th>
//                         {headers.map((key, index) => (
//                             <th key={index}>{key}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {forms.map((response, index) => (
//                         <tr key={index}>
//                             <td>{index + 1}</td>
//                             {headers.map((key, i) => (
//                                 <td key={i}>{response[key]}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>




//             {/* Add Circular Progress Bar */}
//             <div className={style.Analysis_Container}>
//                 <div className={style.Progress_Chart}>
//                     <CircularProgressbar
//                         value={submissionPercentage}
//                         text={`${submissionPercentage}%`}
//                         styles={buildStyles({
//                             textColor: '#333',
//                             pathColor: '#007bff',
//                             trailColor: '#ddd',
//                             textSize: '16px',
//                         })}
//                     />
//                     {/* <p>Submission Rate</p> */}
//                 </div>
//                 <div className={style.Analysis_Details}>
//                     {/* <p><strong>Views:</strong> {totalViews}</p>
//                     <p><strong>Submissions:</strong> {totalSubmissions}</p> */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// Responses.propTypes = {
//     forms: PropTypes.arrayOf(
//         PropTypes.object
//     ).isRequired,
// };

// export default Responses;


















// // // import React from 'react';
// // import PropTypes from 'prop-types';
// // import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// // import 'react-circular-progressbar/dist/styles.css';
// // import style from './Response.module.css';

// // const Responses = ({ forms, viewCount, submittedCount }) => {
// //   if (!forms || forms.length === 0) {
// //       return (
// //           <div className={style.Response_Container}>
// //               <p>No responses available for this form.</p>
// //           </div>
// //       );
// //   }

// //   const submissionPercentage = viewCount
// //       ? Math.round((submittedCount / viewCount) * 100)
// //       : 0;

// //   return (
// //       <div className={style.Response_Container}>
// //           <h2>Form Responses</h2>

// //           {/* Responses Table */}
// //           <table className={style.Response_Table}>
// //               <thead>
// //                   <tr>
// //                       <th>#</th>
// //                       {Object.keys(forms[0] || {}).map((key, index) => (
// //                           <th key={index}>{key}</th>
// //                       ))}
// //                   </tr>
// //               </thead>
// //               <tbody>
// //                   {forms.map((response, index) => (
// //                       <tr key={index}>
// //                           <td>{index + 1}</td>
// //                           {Object.keys(forms[0] || {}).map((key, i) => (
// //                               <td key={i}>{response[key]}</td>
// //                           ))}
// //                       </tr>
// //                   ))}
// //               </tbody>
// //           </table>

// //           {/* Add Circular Progress Bar */}
// //           <div className={style.Analysis_Container}>
// //               <div className={style.Progress_Chart}>
// //                   <CircularProgressbar
// //                       value={submissionPercentage}
// //                       text={`${submissionPercentage}%`}
// //                       styles={buildStyles({
// //                           textColor: '#333',
// //                           pathColor: '#007bff',
// //                           trailColor: '#ddd',
// //                           textSize: '16px',
// //                       })}
// //                   />
// //               </div>
// //               <div className={style.Analysis_Details}>
// //                   <p><strong>Views:</strong> {viewCount}</p>
// //                   <p><strong>Submissions:</strong> {submittedCount}</p>
// //               </div>
// //           </div>
// //       </div>
// //   );
// // };


// // Responses.propTypes = {
// //     forms: PropTypes.arrayOf(
// //         PropTypes.object
// //     ).isRequired,
// // };

// // export default Responses;


// // // why the submission and views are showing 0 then the actual