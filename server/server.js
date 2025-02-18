const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');
const IPAddress = require('./utils/ip');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// 添加订单路由
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);
// 路由
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
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
