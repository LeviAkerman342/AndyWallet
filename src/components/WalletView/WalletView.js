import React, { useEffect, useState } from "react";
import "../home.css";
import { Divider, Tooltip, List, Avatar, Tabs, Input, Button, Spin } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios"

export default function WalletView({
    wallet,
    setWallet,
    seedPhrase,
    setSeedPhrase,
}) {
    const navigate = useNavigate();
    const [tokens, setTokens] = useState(null);
    const [nfts, setNfts] = useState(null);
    const [balance, setBalance] = useState(100); // Устанавливаем начальный баланс в 100 токенов
    const [fetching, setFetching] = useState(false); // Устанавливаем fetching в false, так как данные баланса теперь получаем локально
    const [amountToSend, setAmountToSend] = useState("");
    const [sendToAddress, setSendToAddress] = useState("");
    const [processing, setProcessing] = useState(false);
    const [activeKey, setActiveKey] = useState("1");
    const { email, firstName, lastName } = useSelector(state => state.userProfile);

    useEffect(() => {
        if (!wallet) return;

        const socket = new WebSocket('ws://localhost:3002');
        
        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.type === 'balanceUpdate' && response.payload.wallet === wallet) {
                setBalance(response.payload.balance);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => socket.close();
    }, [wallet]);

    const handleSend = () => {
        setProcessing(true);
        const socket = new WebSocket('ws://localhost:3002');
        const payload = {
            type: 'transfer',
            payload: {
                from: wallet,
                to: sendToAddress,
                amount: parseFloat(amountToSend)
            }
        };

        socket.onopen = () => {
            socket.send(JSON.stringify(payload));
        };

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === 'success') {
                setBalance(response.balance);
                alert(response.message);
            } else {
                alert(response.message);
            }
            setProcessing(false);
            socket.close();
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            alert("Ошибка при отправке транзакции");
            setProcessing(false);
            socket.close();
        };
    };

    const checkWallet = async (walletAddress) => {
        const response = await fetch(`http://localhost:3001/checkWallet?walletAddress=${walletAddress}`);
        const data = await response.json();
        return data.exists;
    };

 // Функция начисления бонуса
const handleReward = async () => {
    try {
        const response = await axios.post("http://localhost:3001/reward", {
            userAddress: wallet,
            amount: 100 // Количество бонусных токенов для начисления
        });
        console.log(response.data);
        // Обновление баланса после начисления бонуса
        setBalance(response.data.balance);
    } catch (error) {
        console.error("Ошибка при начислении бонуса:", error);
    }
};

// Функция обнуления баланса
const handleResetBalance = async () => {
    try {
        const response = await axios.post("http://localhost:3001/resetBalance", {
            userAddress: wallet
        });
        console.log(response.data);
        // Обновление баланса после обнуления
        setBalance(response.data.balance);
    } catch (error) {
        console.error("Ошибка при обнулении баланса:", error);
    }
};

    return (
        <div style={{ color: 'white' }}>
            {wallet && (
                <>
                    <p>Привет, {firstName} {lastName}!</p>
                    <p>Баланс: {balance} ANDYS</p>
                    <p>Стоимость: ${(balance * 0.50).toFixed(2)}</p>
                    <Divider />
                    <p>
                        Адрес кошелька:{" "}
                        <Tooltip title="Click to copy">
                            <span
                                style={{ cursor: "pointer" }}
                                onClick={() => navigator.clipboard.writeText(wallet)}
                            >
                                {wallet}
                            </span>
                        </Tooltip>
                    </p>
                    <Divider />
                    <Tabs
                        defaultActiveKey="1"
                        activeKey={activeKey}
                        onChange={(key) => setActiveKey(key)}
                        items={[
                            {
                                label: "Баланс",
                                key: "1",
                                children: (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={[{ name: "$ANDY", balance }]} // Используем локальные данные для отображения баланса
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src="https://cryptovotelist.com/images/Binance%20Smart%20Chain.png" />} // Нужно добавить логотип токена
                                                    title={item.name}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ),
                            },
                            {
                                label: "NFTs",
                                key: "2",
                                children: (
                                    fetching ? <Spin /> :
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={nfts || []}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item} />}
                                                    title={item.title}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ),
                            },
                            {
                                label: "Отправить ANDYS",
                                key: "3",
                                children: (
                                    <>
                                        <Input
                                            placeholder="Адрес получателя"
                                            value={sendToAddress}
                                            onChange={(e) => setSendToAddress(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Сумма"
                                            value={amountToSend}
                                            onChange={(e) => setAmountToSend(e.target.value)}
                                        />
                                        <Button
                                            type="primary"
                                            loading={processing}
                                            onClick={async () => {
                                                const recipientExists = await checkWallet(sendToAddress);
                                                if (!recipientExists) {
                                                    alert('Адрес получателя не найден');
                                                    return;
                                                }
                                                handleSend();
                                            }}
                                        >
                                            Отправить
                                        </Button>
                                    </>
                                ),
                            },
                        ]}
                    />
                    <Button
                        type="default"
                        onClick={handleReward}
                    >
                        Получить бонус
                    </Button>
                    <Button
                        type="default"
                        onClick={handleResetBalance}
                    >
                        Обнулить баланс
                    </Button>
                    <Button
                        type="default"
                        icon={<LogoutOutlined />}
                        onClick={() => {
                            setWallet(null);
                            setSeedPhrase(null);
                            navigate("/");
                        }}
                    >
                        Выйти
                    </Button>
                </>
            )}
        </div>
    );
}
