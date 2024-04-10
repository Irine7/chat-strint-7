import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { notStrictEqual } from 'assert';

const app = express(); // создание экземпляра приложения на основе Express
const server = http.createServer(app); // создание экземпляра HTTP-сервера
// создание экземпляра WebSocket-сервера
const io = new Server(server, {
	cors: {
		origin: ['http://localhost:3000'],
		methods: ['GET', 'POST'],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // хранилище соединений сокетов для каждого пользователя (userId: socketId)

// socket.on - обработчик события, который вызывается при подключении нового клиента. Может быть использован на стороне сервера или клиента.
io.on('connection', (socket) => {
	console.log('New client connected', socket.id);

	console.log('userId', socket.handshake.query.userId)
	const userId = socket.handshake.query.userId; // извлечение userId из параметров запроса

	if (userId != 'undefined') {
		userSocketMap[userId] = socket.id;
	}
	io.emit('getOnlineUsers', Object.keys(userSocketMap)); // отправка всем пользователям сокетов, связанных с текущим пользователем

	// Обработчик события для получения новых сообщений
	socket.on('newMessage', async (message) => {	
		console.log('New message received', message);
		const receiverSocketId = getReceiverSocketId(message.receiverId);
		if (receiverSocketId) {
				console.log('Receiver found', receiverSocketId);
				socket.to(receiverSocketId).emit('newMessage', message); // Отправляем новое сообщение только конкретному получателю
		} else {
				console.log('Receiver not found');
		}
	});


	socket.on('disconnect', () => {
		console.log('Client disconnected', socket.id);
		delete userSocketMap[userId];
		io.emit('getOnlineUsers', Object.keys(userSocketMap));
	});
});

export { app, io, server };
