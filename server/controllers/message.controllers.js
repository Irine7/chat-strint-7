import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

// Экспорт функции sendMessage в качестве обработчика маршрута
export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body; // Получение сообщения из тела запроса
		const { id: receiverId } = req.params; // Получение идентификатора пользователя параметров запроса (id) и его переименование в receiverId
		const senderId = req.user._id; // Получение идентификатор получателя из параметров запроса

		// Проверяется наличие существующего чата между отправителем и получателем
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Создание нового сообщения
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		// Если сообщение было успешно создано, его идентификатор добавляется в массив сообщений чата
		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// SOCKET IO HERE

		// Сохранение разговора и сообщения в базу данных
		await Promise.all([conversation.save(), newMessage.save()]);

		// Отправление JSON-ответа с данными нового сообщения
		res.status(201).json(newMessage);
	} catch (error) {
		console.log('Error in sendMessage controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatWithId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatWithId] },
		}).populate('messages'); // Загрузка сообщений внутри разговора

		// 
		if (!conversation) {
			return res.status(200).json([]);
		}

		const messages = conversation.messages;
		res.status(200).json(messages);

	} catch (error) {
		console.log('Error in getMessage controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};
