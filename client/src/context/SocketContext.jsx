import { createContext, useState, useEffect, useContext } from 'react';
import { useAuthContext } from '../context/AuthContext';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null); // соединение сокета с сервером приложения по-умолчанию = null
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io('http://localhost:4000', {
				query: { userId: authUser._id },
			});
			setSocket(socket);
			socket.on('getOnlineUsers', (users) => {
				setOnlineUsers(users);
			});
			return () => socket.close(); // закрытие соединения при размонтировании компонента
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
