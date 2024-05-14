// Импорт библиотеки React из модуля "react"
import React from "react";
// Импорт компонента Card из библиотеки antd
import { Card } from "antd";

// Функция компонента CurrentBalance, принимающая количество долларов
function CurrentBalance({dollars}) {
  // Возвращаемый JSX, представляющий текущий баланс
  return (
    <Card title="Current Balance" style={{ width: "100%" }}>
      <div className="currentBalance"> {/* Контейнер для текущего баланса */}
        <div style={{ lineHeight: "70px" }}>$ {dollars}</div> {/* Количество долларов */}
        <div style={{ fontSize: "20px" }}>Available</div> {/* Доступный баланс */}
      </div>
      <div className="balanceOptions"> {/* Контейнер для дополнительных опций */}
        <div className="extraOption">Swap Tokens</div> {/* Опция обмена токенов */}
        <div className="extraOption">Bridge Tokens</div> {/* Опция моста для токенов */}
      </div>
    </Card>
  );
}

export default CurrentBalance; // Экспорт компонента CurrentBalance
