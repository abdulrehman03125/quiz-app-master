import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { httpClient } from "../../lib/httpClient";


const QuizResults = () => {
 
  const [previousResults, setPreviousResults] = useState([]);
  const params = useParams();
  console.log(previousResults);
  

  
  // Fetch the current quiz result only if the id parameter is present
  useEffect(() => {
   
    // Fetch previous quiz results
    const fetchPreviousResults = async () => {
      try {
        const response = await httpClient.get(`/result/byid/${params.id}`);
        setPreviousResults(response.data);
      } catch (error) {
        console.error("Error fetching previous quiz results:", error);
      }
    };

   
    fetchPreviousResults();
  }, [params.id]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg border-t-[20px] border-blue-600">
      

        {/* Previous Quiz Results */}
        <h2 className="text-3xl font-extrabold mt-10 mb-6 text-gray-800">
         Quiz Title: {previousResults.quizTitle}
        </h2>
        {previousResults.quizResult?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {previousResults.quizResult.map((result) => (
              <div
                key={result._id}
                className="p-6 bg-gray-200 border-l-8 border-blue-600  rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Student Name: {result.studentName}
                </h3>
                <div className="space-y-1 text-lg">
                  <p>Total Questions: {result.totalQuestions}</p>
                  <p>Correct Answers: {result.correctAnswers}</p>
                  <p>Total Marks: {result.totalMarks}</p>
                  <p>Obtained Marks: {result.obtainedMarks}</p>
                  <p>Score: {result.score}%</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg">No quiz results found.</p>
        )}
      </div>
    </>
  );
};

export default QuizResults;
