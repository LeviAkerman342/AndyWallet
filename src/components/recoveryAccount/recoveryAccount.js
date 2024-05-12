import React from "react"
import { BulbOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { ethers } from "ethers"

const { TextArea } = Input;
export default function RecoveryAccount({ setWallet, setSeedPhrase }) {
    const navigate = useNavigate();
    const [typeSeed, setTypeSeed] = useState("");
    const [nonValid, setNonValid] = useState(false);

    function SeedAjust(e){
        setNonValid(false);
        setTypeSeed(e.target.value);
    }

    function recoverWallet(){
        let recoverWallet;
        try{
            recoverWallet = ethers.Wallet.fromPhrase(typeSeed);
        }
        catch(err){
            setNonValid(true);
            return;
        }

        setSeedPhrase(typeSeed);
        setWallet(recoverWallet.address);
        navigate("/yourwallet")
        return;
    }

    return (
        <>
            <div className="content">
                <div className="mneomic">
                    <BulbOutlined style={{ fontSize: "20px" }} />
                    <div>
                        <p>
                            Введите в поле ниже свою начальную фразу для восстановления кошелька (она должна содержать
                            должна состоять из 12 слов, разделенных пробелами)
                        </p>
                    </div>
                </div>
                <TextArea 
                value={typeSeed}
                onChange={SeedAjust}
                rows={4}
                className="seedPhraseContainer"
                placeholder="Впешите свою Seed Phrase"
                />
                <Button 
                disabled={typeSeed.split(" ").length !== 12 || typeSeed.slice(-1) === " "}
                className="frontPageButton" type="primary">
                 Востановление кошелька
                </Button>
                {!nonValid && <p style={{color:"red"}}>Неправильная Фраза </p>}
                <p className="frontPageBottom" onClick={()=>navigate("/")}>
                <span>Вернутся назад</span>
                </p>
            </div>
        </>
    )
}