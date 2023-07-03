import server from "./server";
import { useEffect, useState } from "react";
import Transfer from "./Transfer";
import Wallets from "./Wallets";
import Instructions from "./Instructions";
import "./App.scss";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [connected, setConnected] = useState("");

  useEffect(() => {
    async function getAccounts() {
      const {
        data: { wallets },
      } = await server.get("/accounts");
      setProfiles(wallets);
    }

    getAccounts();
  }, []);

  return (
    <div className="app">
      <Instructions />
      <div className="bottom-app">
        <Wallets
          profiles={profiles}
          connected={connected}
          setConnected={setConnected}
        />
        <Transfer
          profiles={profiles}
          setProfiles={setProfiles}
          connected={connected}
        />
      </div>
    </div>
  );
}

export default App;
