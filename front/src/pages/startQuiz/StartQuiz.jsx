import React, { useEffect, useState } from "react";
import { Button, Radio, Form, Skeleton, Checkbox, Input } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { httpClient } from "../../lib/httpClient";


const StartQuiz = () => {
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState({});
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate()

  const id = useParams("")
  console.log(id.id);
  

  useEffect(() => {
    httpClient
      .get(`/quiz/byid/${id.id}`)
      .then((res) => {
        setQuizData(res.data);
       
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      
      });
  }, []);



  const handleFinish = (values) => {
    const answersArray = Object.entries(values).map(([key, value]) => {
      const questionId = key.split(":")[1]; // Extract questionId from the field name
      return {
        questionid: questionId,
        selectedOption: value,
      };
    });
  
    httpClient
      .post("/quiz/submit", {
        quizid: id.id, // Assuming you have a quizId in your quizData
        answers: answersArray,
      })
      .then((res) => {
        console.log("Quiz submitted successfully:", res.data);
        navigate(`/myresult/${quizData.quiz._id}`)
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error);
      });
  };
  

  const handleOptionChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <div className="bg-blue-100 pt-20 pb-[150px]">
          <div className='w-full max-w-[800px] mx-auto bg-slate-100 p-6 rounded-xl border-t-[20px] border-[#1677FF]'>
        <h2 className="text-4xl font-serif mb-4 text-gray-900 ">
          {!quizData ? <Skeleton active /> : quizData.quiz?.title || "Quiz Title"}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {quizData?.quiz?.description}
        </p>
      </div>
      <div className="max-w-[800px] mx-auto mt-8 bg-transparent p-6 rounded-lg bg-sw bg-white">
        {!quizData? (
          <Skeleton active  paragraph={{ rows: 10 }} /> // Show loading skeleton while fetching data
        ) : (
          <Form form={form} onFinish={handleFinish} layout="vertical">
            {quizData.questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-blue-100 p-6 mb-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  {index + 1}. {question.questionText}
                </h3>

                {question.optionType === "radio" && (
                  <Form.Item
                    name={`question:${question._id}`}
                    rules={[{ required: true, message: "Please select an option" }]}
                    className="mt-4"
                  >
                    <Radio.Group
                      onChange={(e) => handleOptionChange(question._id, e.target.value)}
                      className="space-y-2 flex flex-col"
                    >
                      {question.options.map((option) => (
                        <Radio key={option._id} value={option.optionid} className="text-gray-600 hover:text-gray-800">
                          {option.optionText}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                )}

                {question.optionType === "checkbox" && (
                  <Form.Item
                    name={`question:${question._id}`}
                    rules={[{ required: true, message: "Please select at least one option" }]}
                    className="mt-4"
                  >
                    <Checkbox.Group
                      onChange={(checkedValues) => handleOptionChange(question._id, checkedValues)}
                      className="space-y-2 flex flex-col"
                    >
                      {question.options.map((option) => (
                        <Checkbox key={option._id} value={option.optionid} className="text-gray-600 hover:text-gray-800">
                          {option.optionText}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                )}

                {question.optionType === "input" && (
                  <Form.Item
                    name={`question:${question._id}`}
                    rules={[{ required: true, message: "Please provide an answer" }]}
                    className="mt-4"
                  >
                    <Input
                      onChange={(e) => handleOptionChange(question._id, e.target.value)}
                      placeholder="Type your answer"
                      className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </Form.Item>
                )}
              </div>
            ))}

            <Form.Item className="text-center mt-8">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700 w-full text-white px-8 py-3 rounded-lg transform transition-all hover:scale-105"
              >
                Submit Quiz
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default StartQuiz;
