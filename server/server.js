const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');
const IPAddress = require('./utils/ip');
const cors = require('cors');
const socketIo = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3006",  // FIX ME 前端地址
        methods: ["GET", "POST"]
    }
});
// 将 io 实例传递给路由
app.set('io', io);

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// 添加订单路由
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
// 路由
app.use('/api/books', bookRoutes);

// WebSocket 通信（例如，用来通知客户端刷新）
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    const ips = IPAddress();
    const host = `http://localhost:${PORT}`;

    if (ips.size > 0) {
        // 如果有多个IP地址，提供一个更好的提示信息
        console.log(`Server is running and can be accessed at the following addresses:`);
        for (const ip of ips) {
            console.log(`  - http://${ip}:${PORT} (External IP)`);
        }
    } else {
        console.log(`No external IPs found. The server can only be accessed locally.`);
    }

    console.log(`You can also access the server at: ${host}`);
});
