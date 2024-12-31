import { Button, Form, Input, Select } from 'antd';
import Quiz from '../quiz/Quiz';
import { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';

const QuizForm = () => {
  const [formData, setFormData] = useState({
    formtitle: null,
    formdescription: null
  });

  const onFinish = (values) => {
    console.log('Success:', values);
    setFormData({
      formtitle: values.formtitle,
      formdescription: values.formdescription
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
    <Navbar/>
      <div className="bg-blue-200 pt-20 pb-[150px]">
        {/* Quiz Title Form */}
        <div className="w-full max-w-[800px] mx-auto bg-slate-100 p-6 rounded-xl border-t-[20px] border-[#1677FF]">
          <h1 className="text-3xl sm:text-5xl mb-6 text-center">Quiz Form</h1>
          <Form
            className="m-auto"
            name="basic"
            initialValues={{ remember: true  ,}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            
            
          >
            <Form.Item
              name="formtitle"
              rules={[{ required: true, message: 'Please input your form title!' }]}

            >
              <Input
                className="w-full p-2 bg-transparent border-0 border-b-2"
                placeholder="Form Title"
                onChange={ e => setFormData({...formData, formtitle: e.target.value})}
              />
            </Form.Item>
        
            <Form.Item
              name="formdescription"
              rules={[{ required: true, message: 'Please input the form description!' }]}
            >
              <textarea
                className="w-full p-2 bg-transparent border-0 border-b-2"
                placeholder="Form Description"
                onChange={ e => setFormData({...formData, formdescription: e.target.value})}
              />
            </Form.Item>
          </Form>
        </div>

        {/* Quiz Questions form */}
        <div className="w-full max-w-[800px] mx-auto bg-slate-100 p-6 mt-5 rounded-xl">
          <Quiz formtitle={formData.formtitle} formdescription={formData.formdescription} />
        </div>
      </div>
    </>
  );
};

export default QuizForm;
