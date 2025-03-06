import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Add Link to the import
import { FaUser, FaLock } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import '../styles/Login.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('用户名不能为空'),
  password: Yup.string().required('密码不能为空'),
});

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    // 这里添加实际的登录逻辑
    if (values.username === 'admin' && values.password === 'admin') {
      sessionStorage.setItem('isAuthenticated', 'true');
      navigate('/rank');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <Container 
      fluid
      className="login-container d-flex justify-content-center align-items-center p-0"
    >
      <div className="login-form-container p-5 rounded">
        <h2 className="login-title text-center mb-4">图书销售系统</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text login-input-group">
                    <FaUser />
                  </span>
                  <Field
                    name="username"
                    type="text"
                    className={`form-control login-input ${errors.username && touched.username ? 'is-invalid' : ''}`}
                    placeholder="用户名"
                  />
                </div>
                {errors.username && touched.username && (
                  <div className="invalid-feedback d-block">{errors.username}</div>
                )}
              </div>

              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text login-input-group">
                    <FaLock />
                  </span>
                  <Field
                    name="password"
                    type="password"
                    className={`form-control login-input ${errors.password && touched.password ? 'is-invalid' : ''}`}
                    placeholder="密码"
                  />
                </div>
                {errors.password && touched.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>

              <Button 
                type="submit" 
                className="login-button w-100 mb-3"
              >
                登录
              </Button>
              
              <div className="text-center">
                <Link to="/forgot-password" className="forgot-password-link">
                  忘记密码？
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default Login;