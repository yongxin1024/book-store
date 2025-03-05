import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Login from './components/Login';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { OrderPage } from './pages/order';
import { RankPage } from './pages/rank';
import { CommentsPage } from './pages/comments';  // 添加导入
import ForgotPassword from './components/ForgotPassword';


function PrivateRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();  // 添加这行来获取当前路径

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>图书销售系统</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/order" 
                active={location.pathname === '/order'}
                style={{
                  position: 'relative',
                  margin: '0 10px',
                  padding: '8px 16px',
                  color: location.pathname === '/order' ? '#fff' : '#666',
                  background: location.pathname === '/order' 
                    ? 'linear-gradient(45deg, #6ac1c5, #2980b9)' 
                    : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/order'
                    ? '0 4px 15px rgba(106, 193, 197, 0.3)'
                    : 'none'
                }}
              >
                订单管理
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/rank" 
                active={location.pathname === '/rank'}
                style={{
                  position: 'relative',
                  margin: '0 10px',
                  padding: '8px 16px',
                  color: location.pathname === '/rank' ? '#fff' : '#666',
                  background: location.pathname === '/rank' 
                    ? 'linear-gradient(45deg, #6ac1c5, #2980b9)' 
                    : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/rank'
                    ? '0 4px 15px rgba(106, 193, 197, 0.3)'
                    : 'none'
                }}
              >
                销售排名
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/comments" 
                active={location.pathname === '/comments'}
                style={{
                  position: 'relative',
                  margin: '0 10px',
                  padding: '8px 16px',
                  color: location.pathname === '/comments' ? '#fff' : '#666',
                  background: location.pathname === '/comments' 
                    ? 'linear-gradient(45deg, #6ac1c5, #2980b9)' 
                    : 'transparent',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  boxShadow: location.pathname === '/comments'
                    ? '0 4px 15px rgba(106, 193, 197, 0.3)'
                    : 'none'
                }}
              >
                书籍评论
              </Nav.Link>
            </Nav>
            <Nav>
              <Button 
                variant="outline-secondary" 
                onClick={handleLogout}
                size="sm"
                style={{
                  borderRadius: '4px',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease',
                  background: 'transparent',
                  border: '1px solid #6ac1c5',
                  color: '#6ac1c5',
                  ':hover': {
                    background: 'linear-gradient(45deg, #6ac1c5, #2980b9)',
                    color: '#fff',
                    border: '1px solid transparent'
                  }
                }}
              >
                退出登录
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="order" element={<OrderPage />} />
        <Route path="rank" element={<RankPage />} />
        <Route path="comments" element={<CommentsPage />} />
        <Route index element={<Navigate to="/order" />} />
      </Route>
    </Routes>
  );
}

export default App;
