import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Login from './components/Login';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { OrderPage } from './pages/order';
import { RankPage } from './pages/rank';


function PrivateRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function Layout() {
  const navigate = useNavigate();

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
              <Nav.Link as={Link} to="/order">订单管理</Nav.Link>
              <Nav.Link as={Link} to="/rank">销售排名</Nav.Link>
            </Nav>
            <Nav>
              <Button 
                variant="outline-secondary" 
                onClick={handleLogout}
                size="sm"
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
        <Route index element={<Navigate to="/order" />} />
      </Route>
    </Routes>
  );
}

export default App;
