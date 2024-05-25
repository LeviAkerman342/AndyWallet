const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();
const port = 3001;
const wsPort = 3002;

app.use(cors());
app.use(express.json());

// Объект для хранения пользователей и их данных
const users = {};

// Маршрут для регистрации нового пользователя и создания кошелька
app.post("/register", async (req, res) => {
    const { email, firstName, lastName } = req.body;

    // Генерация нового адреса кошелька с помощью ethers.js
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;

    // Начисление начального баланса 100 токенов ANDY
    const initialBalance = 100;
    const tokenPrice = 0.50; // Стоимость одного токена в долларах
    const balanceInDollars = initialBalance * tokenPrice;

    // Добавление нового пользователя в объект users
    users[walletAddress] = {
        email,
        firstName,
        lastName,
        wallet: walletAddress,
        balance: initialBalance, // Начальный баланс в токенах ANDY
        balanceInDollars // Начальный баланс в долларах
    };

    console.log(`User registered: ${JSON.stringify(users[walletAddress])}`); // Логируем данные о пользователе

    // Отправка ответа с данными о зарегистрированном пользователе и его кошельке
    return res.status(200).json({ status: 'success', user: users[walletAddress] });
});

// Маршрут для получения токенов и NFT
app.get("/getTokens", async (req, res) => {
    const { userAddress } = req.query;

    // Получение данных пользователя из объекта users
    const user = users[userAddress];

    if (!user) {
        console.log(`User not found: ${userAddress}`); // Логируем если пользователь не найден
        return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
    }

    // Формирование JSON-ответа
    const jsonResponse = {
        tokens: [], // Заглушка для токенов
        nfts: [], // Заглушка для NFT
        balance: user.balance, // Баланс пользователя в токенах
        balanceInDollars: user.balanceInDollars // Баланс пользователя в долларах
    };

    // Отправка JSON-ответа
    return res.status(200).json(jsonResponse);
});

// Маршрут для начисления бонуса
app.post("/reward", async (req, res) => {
    const { userAddress, amount } = req.body;

    // Проверка существования пользователя
    if (!users[userAddress]) {
        return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
    }

    // Начисление бонусов
    users[userAddress].balance += amount;
    users[userAddress].balanceInDollars = users[userAddress].balance * 0.50;

    console.log(`Rewarded ${amount} ANDYS to ${userAddress}`);

    return res.status(200).json({ status: 'success', balance: users[userAddress].balance, balanceInDollars: users[userAddress].balanceInDollars });
});
// Маршрут для проверки существования кошелька
app.get("/checkWallet", async (req, res) => {
    const { walletAddress } = req.query;

    // Проверка существования пользователя с указанным кошельком
    const userExists = !!users[walletAddress];

    // Отправка JSON-ответа
    return res.status(200).json({ exists: userExists });
});

// Маршрут для обнуления баланса
app.post("/resetBalance", async (req, res) => {
    const { userAddress } = req.body;

    // Проверка существования пользователя
    if (!users[userAddress]) {
        return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
    }

    // Обнуление баланса
    users[userAddress].balance = 0;
    users[userAddress].balanceInDollars = 0;

    console.log(`Balance reset for ${userAddress}`);

    return res.status(200).json({ status: 'success', balance: 0, balanceInDollars: 0 });
});


// WebSocket сервер
const wss = new WebSocket.Server({ port: wsPort });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'transfer') {
            const { from, to, amount } = data.payload;

            // Проверка существования адресов кошельков отправителя и получателя
            if (!users[from] || !users[to]) {
                ws.send(JSON.stringify({ status: 'error', message: 'Invalid sender or recipient address' }));
                return;
            }

            // Проверка баланса отправителя
            if (users[from].balance < amount) {
                ws.send(JSON.stringify({ status: 'error', message: 'Insufficient balance' }));
                return;
            }

            // Выполнение перевода токенов
            users[from].balance -= amount;
            users[to].balance += amount;

            // Логирование успешного перевода
            console.log(`Transfer successful: ${amount} ANDYS from ${from} to ${to}`);

            // Отправка ответа отправителю
            ws.send(JSON.stringify({
                status: 'success',
                message: `Transferred ${amount} ANDYS from ${from} to ${to}`,
                balance: users[from].balance
            }));

            // Уведомление получателя о получении токенов
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(JSON.stringify({
                        type: 'balanceUpdate',
                        payload: {
                            wallet: to,
                            balance: users[to].balance
                        }
                    }));
                }
            });
        }
    });

    ws.on('error', (error) => {
        console.error("WebSocket error:", error);
    });
});

// Запуск Express сервера
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

console.log(`WebSocket server started on port ${wsPort}`);
