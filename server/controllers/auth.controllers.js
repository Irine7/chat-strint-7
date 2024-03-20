import User from '../models/user.model.js';
import bcypt from 'bcryptjs';
import generateTokenAndSetCookie from '../ulils/generateToken.js';

export const signup = async (req, res) => {
	try {
		// req.body - объект, который содержит данные, отправленные клиентом через тело HTTP запроса (в инпуте)
		const { fullName, userName, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) { // Если пароли не совпадают
			return res.status(400).json({ error: 'Passwords do not match' });
		}

		const user = await User.findOne({ userName }); // Поиск пользователя по имени пользователя

		if (user) {
			return res.status(400).json({ error: 'User already exists' });
		}

		// Хэш пароля
		const salt = await bcypt.genSalt(10);
		const hashedPassword = await bcypt.hash(password, salt);
		// https://avatar-placeholder.iran.liara.run/

		const boyProfilePic =
			'https://avatar.iran.liara.run/public/boy?username=${userName}';
		const girlProfilePic =
			'https://avatar.iran.liara.run/public/girl?username=${userName}';

		const newUser = new User({
			fullName,
			userName,
			password: hashedPassword,
			gender,
			profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
		});

		if (newUser) {
			// Генерация JWT токена
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save(); // Сохранение нового пользователя в базе данных
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				userName: newUser.userName,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: 'Invalid user data' });
		}
	} catch (error) {
		console.log('Error in signup controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const login = async (req, res) => {
	try {
		const { userName, password } = req.body;
		const user = await User.findOne({ userName }); // Проверяем, есть ли пользователь с таким именем в базе данных
		const isPasswordCorrect = await bcypt.compare(password, user?.password || '');

		if (!user || !isPasswordCorrect) { // Если пользователь не найден или пароль неверен
			return res.status(400).json({ error: 'Invalid username or password' });
		}

		// Генерация JWT токена и установка его в куки
		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({ // Отправка JSON-ответа с данными пользователя
			_id: user._id,
			fullName: user.fullName,
			userName: user.userName,
			profilePic: user.profilePic,
		});

	} catch (error) {
		console.log('Error in login controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const logout = (req, res) => {
	try {
		// Устанавливает куки с именем jwt в пустое значение и устанавливает его максимальное время жизни (maxAge) в 0 миллисекунд. При установке времени жизни куки в 0, она немедленно удаляется
		res.cookie('jwt', '', { maxAge: 0 });
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (error) {
		console.log('Error in logout controller:', error.message);
		res.status(500).json({ error: 'Internal server error' });
	}
};
