// Этот код выполняет подключение к базе данных MongoDB с использованием библиотеки Mongoose в среде Node.js
import mongoose from 'mongoose';

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB_URI);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.log('Error connecting to MongoDB:', error.message);
	}
};

export default connectToMongoDB;
