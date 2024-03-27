import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import SignUp from './pages/signup/Signup';
import { useAuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
	const { authUser } = useAuthContext();

	return (
		<div className="p-4 h-screen flex items-center justify-center">
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/signup"
					element={<SignUp />}
				/>
				{/* <Route
					path="/"
					element={authUser ? <Home /> : <Navigate to="/login" />}
				/>
				<Route
					path="/login"
					element={authUser ? <Navigate to="/" /> : <Login />}
				/>
				<Route
					path="/signup"
					element={authUser ? <Navigate to="/" /> : <SignUp />}
				/> */}
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
