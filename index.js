// Подключение модулей и настройка переменных
const express = require("express"); // Подключение Express.js для создания сервера
const Moralis = require("moralis").default; // Подключение Moralis SDK для работы с блокчейнами
const app = express(); // Создание экземпляра приложения Express
const cors = require("cors"); // Подключение CORS для разрешения кросс-доменных запросов
require("dotenv").config(); // Подключение dotenv для загрузки переменных среды из файла .env
const port = 3001; // Порт, на котором будет запущен сервер

// Использование middleware
app.use(cors()); // Использование CORS middleware для разрешения всех кросс-доменных запросов
app.use(express.json()); // Использование middleware для разбора тела запроса в формате JSON

// Маршрут для получения токенов и NFT
app.get("/getTokens", async (req, res) => {
    // Извлечение параметров запроса
    const { userAddress, chain } = req.query;

    // Получение балансов токенов пользователя
    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
        chain: chain,
        address: userAddress,
    });

    // Получение NFT пользователя
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: chain,
        address: userAddress,
        mediaItems: true,
    });

    // Фильтрация и обработка NFT
    const myNfts = nfts.raw.result.map((e, i) => {
        if (e?.media?.media_collection?.hight?.url && !e.possible_spam && e?.media?.catalog !== "video") {
            return e["media"]["media_collection"]["hight"]["url"];
        }
    });

    // Получение баланса пользователя
    const balance = await Moralis.EvmApi.balance.getNativeBalance({
        chain: chain,
        address: userAddress
    });

    // Формирование JSON-ответа
    const jsonResponse = {
        tokens: tokens.raw,
        nfts: myNfts,
        balance: balance.raw.balance / (10 ** 18) // Преобразование баланса в ETH
    };

    // Отправка JSON-ответа
    return res.status(200).json(jsonResponse);
});

// Запуск сервера после инициализации Moralis
Moralis.start({
    apiKey: process.env.MORALIS_KEY,
}).then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`); // Вывод сообщения о запуске сервера
    });
});
