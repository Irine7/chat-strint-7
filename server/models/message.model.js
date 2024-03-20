import mongoose from 'mongoose';

// Создание схемы для модели сообщений, в которой определяются поля сообщения
const messageSchema = new mongoose.Schema(
	{
		senderId: {
			// ObjectId - это уникальный идентификатор, который MongoDB автоматически назначает каждому добавленному документу
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true } // добавляет дату создания и обновления сообщения (createdAt и updatedAt)
);

// Создается модель Message, которая будет использоваться для работы с данными в MongoDB на основе схемы messageSchema
const Message = mongoose.model('Message', messageSchema);

export default Message;