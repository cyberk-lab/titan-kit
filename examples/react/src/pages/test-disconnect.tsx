import { useChain, useWalletManager } from "@titan-kit/react";
import { useEffect } from "react";

const TestDisconnect = () => {
  const { disconnect, connect, status } = useChain("osmosistestnet");
  const { isReady } = useWalletManager();

  useEffect(() => {
    setTimeout(() => {
      disconnect();
    }, 200);
  }, []);

  useEffect(() => {
    if (isReady) {
      console.log("Wallet is ready");
    } else {
      console.log("Wallet is not ready");
    }
  }, [isReady]);

  return (
    <div>
      <h1>Test Disconnect</h1>
      <p>{status}</p>
      <p>{isReady ? "Wallet is ready" : "Wallet is not ready"}</p>
      <button
        onClick={() => {
          connect();
        }}
      >
        Connect
      </button>

      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};
export default TestDisconnect;
