import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

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
      className="d-flex justify-content-center align-items-center p-0"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #6ac1c5, #bda5ff)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
      <div className="p-5 rounded" style={{ 
        width: '100%', 
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease',
        ':hover': {
          transform: 'translateY(-5px)'
        }
      }}>
        <h2 className="text-center mb-4" style={{ color: '#333' }}>图书销售系统</h2>
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
                  <span className="input-group-text" style={{
                    background: 'transparent',
                    border: '1px solid #ddd',
                    color: '#555'
                  }}>
                    <FaUser />
                  </span>
                  <Field
                    name="username"
                    type="text"
                    className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                    placeholder="用户名"
                    style={{
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      transition: 'border-color 0.3s ease',
                      ':focus': {
                        borderColor: '#6ac1c5',
                        outline: 'none'
                      }
                    }}
                  />
                </div>
                {errors.username && touched.username && (
                  <div className="invalid-feedback d-block">{errors.username}</div>
                )}
              </div>

              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text" style={{
                    background: 'transparent',
                    border: '1px solid #ddd',
                    color: '#555'
                  }}>
                    <FaLock />
                  </span>
                  <Field
                    name="password"
                    type="password"
                    className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                    placeholder="密码"
                    style={{
                      padding: '0.8rem',
                      border: '1px solid #ddd',
                      transition: 'border-color 0.3s ease',
                      ':focus': {
                        borderColor: '#6ac1c5',
                        outline: 'none'
                      }
                    }}
                  />
                </div>
                {errors.password && touched.password && (
                  <div className="invalid-feedback d-block">{errors.password}</div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-100"
                style={{
                  padding: '0.8rem',
                  background: 'linear-gradient(45deg, #6ac1c5, #bda5ff)',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease',
                  ':hover': {
                    opacity: '0.9'
                  }
                }}
              >
                登录
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

export default Login;