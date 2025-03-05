import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { FaStar } from 'react-icons/fa'; 
import '../styles/Common.css';
export default function OrderForm() {
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState({variant: 'success', msg: ''});
    const [selectedBookRating, setSelectedBookRating] = useState(0);

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
            setTimeout(() => {
                setMessage({variant: 'success', msg: ''});
            }, 2000);
    };

    // 在选择书籍时获取评分
    const handleBookSelect = (e) => {
        const selectedId = e.target.value;
        setBookId(selectedId);
        
        if (selectedId) {
            const selectedBook = books.find(book => book._id === selectedId);
            setSelectedBookRating(selectedBook?.averageRating || 0);
        } else {
            setSelectedBookRating(0);
        }
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
                        onChange={handleBookSelect}
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

                {bookId && (
                    <div className="mb-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2">平均评分：</span>
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    size={16}
                                    style={{ marginRight: '2px' }}
                                    color={index < Math.round(selectedBookRating) ? "#ffc107" : "#e4e5e9"}
                                />
                            ))}
                            <span className="ms-2">({selectedBookRating.toFixed(1)})</span>
                        </div>
                    </div>
                )}

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

                <Button variant="primary" type="submit" className='gradient-button'>提交订单</Button>
            </Form>
        </div>
    );
}
