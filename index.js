const express = require("express"); // Импорт библиотеки Express для создания сервера
const Moralis = require("moralis").default; // Импорт библиотеки Moralis для взаимодействия с блокчейном
const app = express(); // Создание экземпляра приложения Express
const cors = require("cors"); // Импорт библиотеки CORS для разрешения междоменных запросов
require("dotenv").config(); // Импорт dotenv для работы с переменными окружения
const port = 3001; // Порт, на котором будет запущен сервер
const ABI = require("./abi.json"); // Импорт ABI (интерфейса) смарт-контракта

app.use(cors()); // Использование CORS middleware
app.use(express.json()); // Использование middleware для обработки JSON данных

// Функция для конвертации массива транзакций в объекты с необходимыми полями
function convertArrayToObjects(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(), // Уникальный ключ для каждого объекта
    type: transaction[0], // Тип транзакции
    amount: transaction[1], // Сумма транзакции
    message: transaction[2], // Сообщение
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(-4)}`, // Адрес с сокращением
    subject: transaction[4], // Субъект транзакции
  }));

  return dataArray.reverse(); // Переворачивание массива для обратного порядка
}

// Обработчик GET-запроса для получения имени и баланса пользователя
app.get("/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query; // Получение адреса пользователя из параметров запроса

  // Вызов смарт-контракта для получения имени пользователя
  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: "Your Smart Contract",
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseName = response.raw;

  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "0x13881",
    address: userAddress,
  });

  const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);

  const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  });

  const jsonResponseDollars = (
    thirResponse.raw.usdPrice * jsonResponseBal
  ).toFixed(2);

  const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: "Your Smart Contract",
    functionName: "getMyHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseHistory = convertArrayToObjects(fourResponse.raw);


  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: "Your Smart Contract",
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;


  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    dollars: jsonResponseDollars,
    history: jsonResponseHistory,
    requests: jsonResponseRequests,
  };

  return res.status(200).json(jsonResponse);
});



Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
