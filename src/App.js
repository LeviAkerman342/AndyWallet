import './App.css';
import { useState } from "react";
import { Select } from "antd";
import { Routes, Router, Route } from 'react-router-dom';
import Home from "./components/Home"
import CreateAccount from './components/createAccount/CreateAccount'
import RecoveryAccount from './components/recoveryAccount/recoveryAccount'
import WalletView from "./components/WalletView/WalletView"

function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x1");


  return (
    <div className="App">
      <header>
        <h3>Andy Wallet</h3>

        <Select
          onChange={(val) => setSelectedChain(val)}
          value={selectedChain}
          options={[
            {
              label: "Ethereum",
              value: "0x1"
            },
            {
              label: "Mumbai Testnet",
              value: "0x13881"
            },
            {
              label: "Polygon",
              value: "0x89"
            },
            {
              label: "Avalanche",
              value: "0xa86a"
            },

          ]}
          className="dropdown"
        >

        </Select>
      </header>
      {wallet && seedPhrase ? (
        <Routes>
          <Route path="/yourwallet"
            element={
              <WalletView
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />

            } />

        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recovery"
            element={<RecoveryAccount
              setSeedPhrase={setSeedPhrase}
              setWallet={setWallet}
            />} />
          <Route path="/yourwallet"
            element={
              <CreateAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet} />} />
        </Routes>
      )}


    </div>
  );
}

export default App;
