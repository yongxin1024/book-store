import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

export default function OrderForm() {
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState({variant: 'success', msg: ''});

    useEffect(() => {
        axios.get('/api/books')
            .then(res => setBooks(res.data))
            .catch(err => setMessage({variant: 'danger', msg: '无法加载书籍列表'}));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/orders', {bookId, quantity})
            .then(() => {
                setMessage({variant: 'success', msg: '创建订单成功'});
            })
            .catch(err => {
                console.log(err);
                setMessage({variant: 'danger', msg: '创建订单失败'});
            });
    };

    return (
        <div className="mb-4">
            <h3>创建新订单</h3>
            {message.msg && <Alert dismissible={true} variant={message.variant}>{message.msg}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>选择书籍</Form.Label>
                    <Form.Select
                        value={bookId}
                        onChange={e => setBookId(e.target.value)}
                        required
                    >
                        <option value="">请选择书籍</option>
                        {books.map(book => (
                            <option key={book._id} value={book._id}>
                                {book.title} - {book.author}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>数量</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">提交订单</Button>
            </Form>
        </div>
    );
}
