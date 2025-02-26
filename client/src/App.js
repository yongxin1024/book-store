import OrderForm from './components/OrderForm';
import SalesRanking from './components/SalesRanking';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.css';

function App() {

    return (
        <Container className="py-4">
            <h1 className="mb-4">图书销售系统</h1>
            <OrderForm/>
            <SalesRanking/>
        </Container>
    );
}

export default App;
