import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

function BookRating({ orderId, bookTitle, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [message, setMessage] = useState({ show: false, variant: '', text: '' });

  useEffect(() => {
    // 获取书籍列表
    axios.get('/api/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error('获取书籍列表失败:', err));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/rating', { 
        bookId: selectedBook, 
        rating, 
        comment 
      });
      setRating(0);
      setComment('');
      setSelectedBook('');
      setMessage({ show: true, variant: 'success', text: '评价提交成功！' });
      
      // 3秒后自动隐藏消息
      setTimeout(() => {
        setMessage({ show: false, variant: '', text: '' });
      }, 2000);
    } catch (error) {
      console.error('评价提交失败:', error);
      setMessage({ show: true, variant: 'danger', text: '评价提交失败，请稍后重试' });
    }
  };

  return (
    <div className="book-rating p-4">
      {message.show && (
        <Alert 
          variant={message.variant} 
          onClose={() => setMessage({ show: false, variant: '', text: '' })} 
          dismissible
          className="mb-3"
        >
          {message.text}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>选择书籍</Form.Label>
          <Form.Select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
          >
            <option value="">请选择要评价的书籍</option>
            {books.map(book => (
              <option key={book._id} value={book._id}>
                {book.title} - {book.author}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="stars mb-3">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <FaStar
                key={index}
                size={24}
                style={{
                  marginRight: '5px',
                  cursor: 'pointer',
                  transition: 'color 200ms'
                }}
                color={(hover || rating) >= ratingValue ? "#ffc107" : "#e4e5e9"}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(ratingValue)}
              />
            );
          })}
        </div>
        
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="写下您的评价..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
        </Form.Group>
        
        <Button 
          type="submit" 
          disabled={!rating || !selectedBook}
          style={{
            background: 'linear-gradient(45deg, #6ac1c5, #2980b9)',
            border: 'none'
          }}
        >
          提交评价
        </Button>
      </Form>
    </div>
  );
}

export default BookRating;