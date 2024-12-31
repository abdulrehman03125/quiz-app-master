import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar.jsx';
import { Pencil, Trash2, Share2 , Download,ChartNoAxesCombined } from 'lucide-react';
import { Modal, message,notification,Input } from 'antd';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { httpClient } from '../../lib/httpClient.js';




const { TextArea } = Input;

const QuizDetail = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');
  const [emails, setEmails] = useState('');
  const navigate = useNavigate()


  const { id } = useParams();
  const contentRef = useRef(null); 

  const showModal = () => {
    setModalText(`http://localhost:5173/startquiz/${quiz?._id}`);
    setOpen(true);
  };

  const handleCopy = async () => {
    setConfirmLoading(true);
    try {
      await navigator.clipboard.writeText(modalText);
      message.success('Link copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy link.');
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

// Handle Send Email
  const handleSendEmail = async () => {
    setConfirmLoading(true);
    try {
      await httpClient.post('/api/send-quiz-link', {
        emails: emails.split(',').map(email => email.trim()),
        quizLink: modalText,
      });
      message.success('Quiz link sent successfully!');
      setOpen(false);
    } catch (error) {
      console.error("Error sending emails:", error);
      message.error('Failed to send emails');
    }
    setConfirmLoading(false);
  };


  // Handle Download Quiz
  const downloadQuiz = () => {
    const doc = new jsPDF();
  
    // Define constants for margins, fonts, and layout
    const margin = 15;
    const lineSpacing = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Add the quiz title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(quiz.title, margin, 20);
  
    // Add a divider line under the title
    doc.setLineWidth(0.5);
    doc.line(margin, 25, pageWidth - margin, 25);
  
    // Add the quiz description
    doc.setFontSize(12);
    doc.setTextColor(60);
    const descriptionText = quiz.description || 'No description available.';
    doc.text(descriptionText, margin, 35);
  
    // Prepare the questions and options
    let yPosition = 50; 
    questions.forEach((question, index) => {
      // Add question number and text
      doc.setFontSize(14);
      doc.setTextColor(0);
      const questionText = `${index + 1}. ${question.questionText}`;
      doc.text(questionText, margin, yPosition);
      yPosition += lineSpacing;
  
      // Add the options for the question
      question.options.forEach((option, optionIndex) => {
        doc.setFontSize(12);
        doc.setTextColor(100);
        const optionText = `${String.fromCharCode(97 + optionIndex)}. ${option.optionText}`;
        doc.text(optionText, margin + 10, yPosition); 
        yPosition += lineSpacing;
        
        // Handle page breaks if content overflows
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      });
  
      // Add some space between questions
      yPosition += lineSpacing;
      
      // Handle page breaks between questions
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    });
  
    // Save the PDF with the quiz title as the filename
    doc.save(`${quiz.title}-Quiz.pdf`);
  };
  
  
// Get Quiz data byid
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`/quiz/byid/${id}`);
        setQuiz(response.data.quiz);
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz details:", err);
        setError(`Error: ${err.response?.data?.message || err.message}`);
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [id]);


  const handleDeleteQuiz = async () => {
    try {
      await httpClient.delete(`/quiz/delete/${id}`);
  
      // Show success notification
      notification.success({
        message: 'Quiz Deleted',
        description: 'The quiz has been deleted successfully.',
        duration: 2,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // 2000ms = 2 seconds delay
    } catch (error) {
      message.error('Failed to delete quiz.');
      console.error("Error deleting quiz:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
 
      <div className='bg-blue-100'>
        <div className="p-6 md:p-10 lg:p-16">
          {quiz && (
            <div>
              {/* Quiz Header */}
              <div className="w-full max-w-[800px] mx-auto bg-gray-100 p-6 rounded-xl border-t-[20px] border-blue-600 flex justify-between">
                <span>
                  <h1 className="text-3xl font-semibold text-gray-800 mb-4">{quiz.title}</h1>
                  <p className="text-lg text-gray-600 mb-6">{quiz.description || 'No description available.'}</p>
                </span>
                <span className='flex gap-3 flex-col'>
                  <Link  to={`/editquiz/${quiz._id}`}><Pencil strokeWidth={1.5} /></Link>
                  <Share2 className='cursor-pointer' onClick={showModal} strokeWidth={1.5} />
                  <Download className='cursor-pointer' onClick={downloadQuiz} />
                 <Link to={`/quizresults/${quiz._id}`}><ChartNoAxesCombined className='cursor-pointer' strokeWidth={1.5} /></Link> 
                 <Trash2 className='cursor-pointer' onClick={handleDeleteQuiz} strokeWidth={1.5} />
                </span>
              </div>

              {/* Quiz Questions */}
              <div className="max-w-[800px] mx-auto mt-5 bg-gray-100 rounded-lg shadow-lg p-6" ref={contentRef}>
                {questions.length > 0 ? (
                  <ul className="pl-6 space-y-4">
                    {questions.map((question, index) => (
                      <li key={question._id} className="bg-blue-100 p-6 mb-6 rounded-lg shadow-md">
                        <p className="text-lg font-medium text-gray-800">
                          {index + 1}. {question.questionText}
                        </p>
                        <ul className="list-lower-alpha pl-6 mt-2 space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <li key={option._id}>
                              <p className="text-gray-700">
                                {String.fromCharCode(97 + optionIndex)}. {option.optionText}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No questions available for this quiz.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal for Sharing Quiz Link */}
        <Modal
          title={<h2 className="text-xl font-bold text-gray-800">Share Quiz Link</h2>}
          open={open}
          onCancel={handleCancel}
          footer={[
            <button
              key="copy"
              onClick={handleCopy}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
              disabled={confirmLoading}
            >
              {confirmLoading ? 'Copying...' : 'Copy Link'}
            </button>,
            <button
              key="send"
              onClick={handleSendEmail}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition ml-2"
              disabled={confirmLoading || !emails}
            >
              {confirmLoading ? 'Sending...' : 'Send Email'}
            </button>,
          ]}
          bodyStyle={{
            padding: '20px',
          }}
          className="rounded-xl shadow-lg"
        >
          <p className="text-gray-600 mb-2">Share this link with others:</p>
          <div className="bg-gray-200 p-2 rounded mb-4 break-all">{modalText}</div>
          <TextArea
            rows={4}
            placeholder="Enter comma-separated emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded"
          />
        </Modal>
      </div>
    </>
  );
};

export default QuizDetail;
