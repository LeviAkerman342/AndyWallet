import React, { useEffect, useState } from "react";
import "../home.css";
import {
    Divider,
    Tooltip,
    List,
    Avatar,
    Tabs,
    Input,
    Button,
    Spin,
} from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CHAIN_CONFIG } from "../../chains";
import { ethers } from "ethers";
import { useSelector } from 'react-redux';


export default function WalletView  ({
    wallet,
    setWallet,
    seedPhrase,
    setSeedPhrase,
    selectedChain,

})  {
    const navigate = useNavigate();
    const [tokens, setTokens] = useState(null);
    const [nfts, setNfts] = useState(null);
    const [balance, setBalance] = useState(0);
    const [fetching, setFetching] = useState(true);
    const [amountToSend, setAmountSend] = useState(null);
    const [sendToAddress, setSendToAddress] = useState("");
    const [processing, setProcessing] = useState(false);
    const [hash, setHash] = useState(null);
    const [activeKey, setActiveKey] = useState("1");
    const { email, firstName, lastName } = useSelector(state => state.userProfile);


    useEffect(() => {
        if (!wallet || !selectedChain) return;
        setNfts(null);
        setTokens(null);
        setBalance(0);
        getAccountToken();
    }, [wallet, selectedChain]);

    async function getAccountToken() {
        setFetching(true);
        try {
            const res = await axios.get(`http://localhost:3001/getTokens`, {
                params: {
                    userAddress: wallet,
                    chain: selectedChain,
                },
            });
            const response = res.data;
            if (response.tokens.length > 0) {
                setTokens(response.tokens);
            }
            if (response.nfts.length > 0) {
                setNfts(response.nfts);
            }
            setBalance(response.balance);
        } catch (error) {
            console.error('Error fetching account token:', error);
            setTokens(null);
            setNfts(null);
            setBalance(0);
        } finally {
            setFetching(false);
        }
    }

    function logout() {
        setSeedPhrase(null);
        setWallet(null);
        setNfts(null);
        setTokens(null);
        setBalance(0);
        navigate("/");
    }




    const items = [
        {
            key: "4",
            label: "Профиль",
            children: (
                <>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Avatar size={128} icon={<UserOutlined />} />
      <Divider>Редактировать профиль</Divider>
      <div>
        <p>Email: {email}</p>
        <p>Имя: {firstName}</p>
        <p>Фамилия: {lastName}</p>
      </div>
    </div>
                </>
            ),
        },

        {
            key: "3",
            label: "Token",
            style: { color: "white" },
            children: (
                <>
                    {tokens ? (
                        <List
                            bordered
                            itemLayout="horizontal"
                            dataSource={tokens}
                            renderItem={(item, index) => (
                                <List.Item style={{ textAlign: "left" }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.logo || "default logo"} title={item.symbol} description={item.name} />}
                                    />
                                    <div>
                                        {(Number(item.balance) / 10 ** Number(item.decimals)).toFixed(2)}
                                    </div>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <>
                            <span>You seem to not have any tokens yet</span>
                            <p className="frontPageBottom">
                                Find Alt Coin Gems:{" "}
                                <a href="#" target="_blank" rel="noreferrer">
                                    Pixel Wizard
                                </a>
                            </p>
                        </>
                    )}
                </>
            ),
        },
        {
            key: "2",
            label: "NFTs",
            children: (
                <>
                    {nfts ? (
                        <>
                            {nfts.map((e, i) => (
                                <img key={i} className="nftImage" alt="nftImage" src={e} />
                            ))}
                        </>
                    ) : (
                        <>
                            <span>You seem to not have any NFTs</span>
                            <p className="frontPageBottom">
                                Find Alt Coin Gems:{" "}
                                <a href="#" target="_blank" rel="noreferrer">
                                    Pixel Wizard
                                </a>
                            </p>
                        </>
                    )}
                </>
            ),
        },
        {
            key: "1",
            label: `Transfer`,
            children: (
                <>
                    <h3>Native Balance</h3>
                    <h1>{balance.toFixed(2)} {CHAIN_CONFIG[selectedChain]?.ticker}</h1>
                    <div className="sendRow">
                        <p style={{ width: "90px", textAlign: "left" }}>To</p>
                        <Input value={sendToAddress} onChange={(e) => setSendToAddress(e.target.value)} placeholder="0x..." />
                    </div>
                    <div className="sendRow">
                        <p style={{ width: "90px", textAlign: "left" }}>Amount:</p>
                        <Input value={amountToSend} onChange={(e) => setAmountSend(e.target.value)} placeholder="Native tokens you wish to send" />
                    </div>
                    <Button style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} type="primary" onClick={() => sendTransaction(sendToAddress, amountToSend)}>
                        Send Tokens
                    </Button>

                    {processing && (
                        <>
                            <Spin />
                            {hash && (
                                <Tooltip title={hash}>
                                    <p>Hover hor Tx</p>
                                </Tooltip>
                            )}
                        </>
                    )}
                </>
            ),
        },
    ];

    async function sendTransaction(to, amount) {
        const chain = CHAIN_CONFIG[selectedChain];
        const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
        const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
        const wallet = new ethers.Wallet(privateKey, provider);

        const tx = {
            to: to,
            value: ethers.parseEther(amount.toString()),
        };

        setProcessing(true);

        try {
            const transaction = await wallet.sendTransaction(tx);

            setHash(transaction.hash);
            const receipt = await transaction.wait();

            setHash(null);
            setProcessing(false);
            setAmountSend(null);
            setSendToAddress("");

            if (receipt.status === 1) {
                getAccountToken();
            } else {
                console.log("failed");
            }
        } catch (err) {
            console.error('Error sending transaction:', err);
            setHash(null);
            setProcessing(false);
            setAmountSend(null);
            setSendToAddress("");
        }
    }

    return (
        <>
            <div className="content">
                <div className="logoutButton" onClick={logout}>
                    <LogoutOutlined />
                </div>
                <div className="walletName">Кошелёк</div>
                <Tooltip title={wallet}>
                    <div>
                        <p>
                            {wallet.slice(0, 4)}...{wallet.slice(38)}
                        </p>
                    </div>
                </Tooltip>
                <Divider />
                {fetching ? (
                    <Spin />
                ) : (
                    <Tabs
                        defaultActiveKey={activeKey}
                        items={items}
                        className="walletView"
                        onChange={(key) => setActiveKey(key)}
                    />
                )}
            </div>
        </>
    );
}

