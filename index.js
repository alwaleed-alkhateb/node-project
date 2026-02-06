require('dotenv').config()
const express = require('express');
const courseRoutes = require('./routes/courses.routes');
const usersRoutes = require('./routes/users.routes');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
app.use(express.json());



app.use(cors());
app.use('/api/courses', courseRoutes);
app.use('/api/users', usersRoutes);
app.use(express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));




// app.all('*', (req, res) => {
//     res.status(404).json({ status: httpStatus.ERROR, message: 'Route not found' });
// });

app.use((err, req, res, next) => {
    res.status(500).json({ status: err.statusText, message: err.message });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'reg.html'));
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});

