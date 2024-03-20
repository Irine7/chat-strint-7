import express from 'express';
import dotenv from 'dotenv'; // библиотека для загрузки переменных среды из файла .env
import connectToMongoDB from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express(); // создание экземпляра приложения на основе Express
const PORT = process.env.PORT || 3000;

dotenv.config(); // загрузка переменных среды

// Регистрирует промежуточное ПО (middleware) для обработки запросов из req.body
app.use(express.json());
// Регистрирует промежуточное ПО (middleware) для обработки запросов из cookie
app.use(cookieParser());

app.use('/api/auth', authRoutes); // подключает маршруты аутентификации, которые определены в файле auth.routes.js
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// app.get('/', (req, res) => {
// 	//определяет маршрут для обработки GET запросов по корневому URL (/)
// 	// root route http://localhost:3000
// 	res.send('Hello World');
// });


app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server is running on port ${PORT}`);
});
