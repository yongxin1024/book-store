import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../styles/Login.css';
import '../styles/ForgotPassword.css';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('邮箱格式不正确')
    .required('邮箱不能为空'),
});

function ForgotPassword() {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setStatus('重置密码链接已发送到您的邮箱，请查收');
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <Container 
      fluid
      className="login-container forgot-password d-flex justify-content-center align-items-center p-0"
    >
      <div className="login-form-container p-5 rounded">
        <h2 className="forgot-title text-center">重置密码</h2>
        {status && <Alert variant="success">{status}</Alert>}
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="email-input-group">
                <div className="input-group">
                  <span className="input-group-text input-icon">
                    <FaEnvelope />
                  </span>
                  <Field
                    name="email"
                    type="email"
                    className={`form-control login-input ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    placeholder="请输入您的邮箱"
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>

              <Button 
                type="submit" 
                className="login-button w-100 reset-button"
              >
                发送重置链接
              </Button>
              
              <Link to="/login" className="back-to-login">
                返回登录
              </Link>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default ForgotPassword;