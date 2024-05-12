import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../actions';
import { useSelector } from 'react-redux';
import { ethers } from "ethers";
import { Button, Input, Card, Upload, message } from "antd";
import { ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import WalletView from "../WalletView/WalletView";

export default function CreateAccount({ setWallet, setSeedPhrase }) {
    const [newSeedPhrase, setNewSeedPhrase] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [navigate, setNavigate] = useState(false);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const wallet = useSelector(state => state.wallet);
    const selectedChain = useSelector(state => state.selectedChain);

    function generateWallet() {
        const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
        setNewSeedPhrase(mnemonic);
        console.log(mnemonic);
    }
    function setWalletAndMneomic() {
        setSeedPhrase(newSeedPhrase);
        setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
        dispatch(setUserProfile({ email, firstName, lastName }));
        setNavigate(true);
    }


    const handleUpload = (file) => {
        if (file.size > 2 * 1024 * 1024) {
            message.error("Изображение должно быть менее 2MB!");
            return false;
        }
        setAvatar(file);
        return false;
    };

    return (
        <>
            <div className="content">
                <div className="mnemonic">
                    <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
                    <div>
                        <p>Как только вы сгенерируете Sid Praze, сохраните и обезопасьте себя, чтобы восстановить свой кошелек в будущем</p>
                    </div>
                </div>
                <Button className="frontPageButton" type="primary" onClick={() => generateWallet()}>
                    Сгенерировать Sid Praze
                </Button>
                <Card className="seedPhraseContainer">
                    {newSeedPhrase && <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>}
                </Card>
                <div style={{ marginBottom: "16px" }}>
                    <Input
                        placeholder="Введите вашу почту"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: "16px" }}>
                    <Input
                        placeholder="Введите ваше имя"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: "16px" }}>
                    <Input
                        placeholder="Введите вашу фамилию"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <Upload
                    beforeUpload={handleUpload}
                    maxCount={1}
                    accept="image/*"
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Загрузить аватарку</Button>
                </Upload>
                <Button
                    className="frontPageButton"
                    type="default"
                    onClick={() => setWalletAndMneomic()}
                >
                    Открыть новый кошелёк
                </Button>
                {wallet && newSeedPhrase && (
                    <WalletView
                        wallet={wallet}
                        seedPhrase={newSeedPhrase}
                        email={email}
                        firstName={firstName}
                        lastName={lastName}
                        selectedChain={selectedChain}
                    />
                )}
                <p className="frontPageBottom" onClick={() => navigate("/")}>
                    Вернуться назад
                </p>

            </div>
        </>
    );
}
