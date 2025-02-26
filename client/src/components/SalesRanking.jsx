import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AnimatedNumber } from "./AnimatedNumber";
import io from 'socket.io-client';

export default function SalesRanking() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchRanking = () => {
        axios.get('/api/books/rank')
            .then(res => {
                setRanking(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchRanking();
        // FIX ME:建立 WebSocket 连接, move server address into configuration
        const socket = io('http://127.0.0.1:3100', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000
        });

        // 监听更新事件
        socket.on('orderPlaced', (update) => {
            console.log('Received update:', update);
            fetchRanking(); // 重新获取最新数据
        });

        return () => {
            socket.disconnect(); // 清理连接
        };
    }, []);

    return (
        <div>
            <h3>实时销量排行</h3>
            {loading ? (
                <Spinner animation="border"/>
            ) : (
                <ListGroup>
                    {ranking.map((book, index) => (
                        <ListGroup.Item key={book._id}>
                            #{index + 1} 《{book.title}》 - {book.author}
                            <span className="float-end">销量: <AnimatedNumber value={book.saleCount}/></span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}
