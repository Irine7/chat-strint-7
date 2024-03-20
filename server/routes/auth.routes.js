import express from 'express';
import { signup, login, logout } from '../controllers/auth.controllers.js';

const router = express.Router(); // создает новый экземпляр маршрутизатора Express, который будет использоваться для определения маршрутов.

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
