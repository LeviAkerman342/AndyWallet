import React from "react";
import { Card } from "antd"; // Импорт компонента Card из библиотеки antd
import { UserOutlined } from "@ant-design/icons"; // Импорт иконки пользователя из библиотеки antd
import matic from "../matic.png"; // Импорт изображения matic из локального файла

// Функция компонента AccountDetails, принимающая адрес, имя и баланс
function AccountDetails({ address, name, balance }) {
  
  // Возвращаемый JSX, представляющий детали аккаунта
  return (
    <Card title="Account Details" style={{ width: "100%" }}> {/* Карточка с заголовком "Account Details" */}
      <div className="accountDetailRow"> {/* Контейнер для строки деталей аккаунта */}
        <UserOutlined style={{ color: "#767676", fontSize: "25px" }} /> {/* Иконка пользователя */}
        <div>
          <div className="accountDetailHead"> {name} </div> {/* Имя аккаунта */}
          <div className="accountDetailBody">
            {" "}
            Address: {address.slice(0, 4)}...{address.slice(38)} {/* Адрес аккаунта */}
          </div>
        </div>
      </div>
      <div className="accountDetailRow"> {/* Контейнер для строки деталей баланса */}
        <img src={matic} alt="maticLogo" width={25} /> {/* Изображение matic */}
        <div>
          <div className="accountDetailHead"> Native Matic Tokens</div> {/* Заголовок для баланса Matic */}
          <div className="accountDetailBody">{balance} Matic</div> {/* Баланс Matic */}
        </div>
      </div>
      <div className="balanceOptions"> {/* Контейнер для дополнительных опций */}
        <div className="extraOption">Set Username</div> {/* Опция установки имени пользователя */}
        <div className="extraOption">Switch Accounts</div> {/* Опция смены аккаунтов */}
      </div>
    </Card>
  );
}

export default AccountDetails; // Экспорт компонента AccountDetails
