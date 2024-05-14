import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Импорт стилей
import App from './App'; // Импорт основного компонента приложения
import { configureChains, mainnet, WagmiConfig, createClient } from "wagmi"; // Импорт необходимых функций и объектов из библиотеки wagmi
import { publicProvider } from "wagmi/providers/public"; // Импорт публичного провайдера
import { polygonMumbai } from '@wagmi/chains'; // Импорт конфигурации сети Polygon Mumbai

// Настройка цепочек (сетей) и провайдеров
const { provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai], // Указание используемых сетей (mainnet и Polygon Mumbai)
  [publicProvider()] // Использование публичного провайдера
);

// Создание клиента Wagmi
const client = createClient({
  autoConnect: true, // Автоматическое подключение при загрузке страницы
  provider, // Провайдер для взаимодействия с блокчейном
  webSocketProvider, // Веб-сокет провайдер для реального времени
});

// Создание корневого элемента React и рендеринг приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Конфигурация Wagmi с использованием созданного клиента */}
    <WagmiConfig client={client}>
      {/* Рендеринг основного компонента приложения */}
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
