import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { httpClient } from "../../lib/httpClient";


const MyResults = () => {
  const [currentResult, setCurrentResult] = useState(null);
  const [previousResults, setPreviousResults] = useState([]);
  const params = useParams();
  console.log(previousResults);
  

  const COLORS = ["#34D399", "#F87171"]; // Green for correct, Red for incorrect

  // Fetch the current quiz result only if the id parameter is present
  useEffect(() => {
    const fetchCurrentResult = async () => {
      if (params.id) {
        try {
          const response = await httpClient.get(`/result/byid/${params.id}`);
          setCurrentResult(response.data);
        } catch (error) {
          console.error("Error fetching current quiz result:", error);
        }
      }
    };

    // Fetch previous quiz results
    const fetchPreviousResults = async () => {
      try {
        const response = await httpClient.get(`/result/all`);
        setPreviousResults(response.data);
      } catch (error) {
        console.error("Error fetching previous quiz results:", error);
      }
    };

    fetchCurrentResult();
    fetchPreviousResults();
  }, [params.id]);

  const resultData = currentResult
    ? [
        { name: "Correct", value: currentResult?.quizResult.correctAnswers },
        {
          name: "Incorrect",
          value:
            currentResult?.quizResult.totalQuestions -
            currentResult?.quizResult.correctAnswers,
        },
      ]
    : [];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-8 p-8 bg-white border-t-[20px] border-blue-600 shadow-lg rounded-lg">
        {/* Current Quiz Result */}
        {params.id && currentResult ? (
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
              Quiz Result Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quiz Summary */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-600">
                  Summary
                </h3>
                <div className="space-y-2 text-lg">
                  <p>
                    <strong>Quiz ID:</strong> {currentResult?.quizResult.quizTitle}
                  </p>
                  <p>
                    <strong>Total Questions:</strong>{" "}
                    {currentResult?.quizResult.totalQuestions}
                  </p>
                  <p>
                    <strong>Correct Answers:</strong>{" "}
                    {currentResult?.quizResult.correctAnswers}
                  </p>
                  <p>
                    <strong>Total Marks:</strong>{" "}
                    {currentResult?.quizResult.totalMarks}
                  </p>
                  <p>
                    <strong>Obtained Marks:</strong>{" "}
                    {currentResult?.quizResult.obtainedMarks}
                  </p>
                  <p>
                    <strong>Score:</strong> {currentResult?.quizResult.score}%
                  </p>
                </div>
              </div>

              {/* Pie Chart for Correct vs Incorrect */}
              <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-600">
                  Result Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={resultData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {resultData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <span className="inline-block mr-2">
                    <span
                      className="inline-block w-3 h-3 mr-1 bg-green-400"
                      aria-hidden="true"
                    ></span>{" "}
                    Correct
                  </span>
                  <span className="inline-block">
                    <span
                      className="inline-block w-3 h-3 mr-1 bg-red-400"
                      aria-hidden="true"
                    ></span>{" "}
                    Incorrect
                  </span>
                </div>
              </div>
            </div>

            {/* Mistakes Section */}
            <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-600">
                Mistakes
              </h3>
              {currentResult?.quizResult.mistakes?.length > 0 ? (
                <ul className="list-disc list-inside text-lg">
                  {currentResult?.quizResult.mistakes.map((mistake, index) => (
                    <li key={index} className="mb-2">
                      <p>
                        <strong>Question:</strong> {mistake.question}
                      </p>
                      <p>
                        <strong>Your Answer:</strong> {mistake.yourAnswer}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {mistake.correctAnswer}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg">No mistakes made!</p>
              )}
            </div>
          </div>
        ) : null}

        {/* Previous Quiz Results */}
        <h2 className="text-3xl font-extrabold mt-10 mb-6 text-gray-800">
          All Quiz Results
        </h2>
        {previousResults.quizResult?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {previousResults.quizResult.map((result) => (
              <div
                key={result._id}
                className="p-6 bg-gray-200 border-l-8 border-blue-600 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Quiz Title: {result.quizTitle}
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
          <p className="text-lg">No previous quiz results found.</p>
        )}
      </div>
    </>
  );
};

export default MyResults;
