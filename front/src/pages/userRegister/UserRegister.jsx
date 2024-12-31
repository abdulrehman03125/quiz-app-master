import React, { useEffect } from "react";
import { Button, Form, notification, Input } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerAsyncCall } from "../../store/authSlice";
import { persistor } from '../../store/store';

const UserRegister = () => {
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => state.authSlice);
  const error = authSlice.error;
  const errorMessage = authSlice.errorMessage;
const isRegister =authSlice.isRegister
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // Handle form submission
  const onFinish = (values) => {
    dispatch(registerAsyncCall(values));
    console.log("Received values of form: ", values);
  };

  useEffect(() => {
    if (isRegister === true) {
      notification.success({
        message: "Registration Successful",
        description: "You have successfully registered! Redirecting to homepage...",
        duration: 2,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000); 
    }

    if (error) {
      notification.error({
        message: "Registration Failed",
        description: errorMessage || "An error occurred during registration. Please try again.",
      });
    }
  }, [isRegister, error, errorMessage, navigate]);

  return (
    <>
      <div className="bg-blue-200 pt-20 pb-[150px] h-screen">
        <div className="w-full max-w-[600px] mx-auto bg-slate-100 p-12 rounded-xl border-t-[20px] border-blue-700 ">
          <div>
            <h1 className="text-center text-5xl mb-14">Sign Up</h1>
          </div>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{}}
            style={{ maxWidth: 600 }}
            scrollToFirstError
          >
            <Form.Item
              name="username"
              tooltip="What do you want others to call you?"
              rules={[
                { required: true, message: "Please input your name!", whitespace: true },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="User name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "The input is not valid E-mail!" },
                { required: true, message: "Please input your E-mail!" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="E-mail" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button
                loading={authSlice.isLoading}
                className="w-full"
                type="primary"
                htmlType="submit"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center">
            You have already an account?{" "}
            <Link to="/" className="font-medium underline text-blue-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UserRegister;
