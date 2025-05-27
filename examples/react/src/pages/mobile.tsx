import { useWalletManager } from "@titan-kit/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { WCWallet } from "@titan-kit/core";

const Mobile = () => {
  const instance = useRef<WCWallet>(null);
  const { chains } = useWalletManager();

  const [uri, setUri] = useState("");

  const [account, setAccount] = useState("");

  useEffect(() => {
    const init = async () => {
      instance.current = new WCWallet();
      await instance.current.init();
    };
    init();
  }, []);

  const handleConnect = useCallback(async () => {
    instance.current?.setChainMap(chains);

    instance.current?.setOnPairingUriCreatedCallback((uri) => {
      setUri(uri);
      // window.location.href = `intent://wcV2?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
      // window.location.href = `https://link.trustwallet.com/wcV2?uri=${uri}`;
      window.location.href = `intent://wcV2?${encodeURIComponent(
        uri
      )}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
    });

    await instance.current?.connect("");

    const accountfrom = await instance.current?.getAccount("juno-1");

    if (accountfrom) {
      setAccount(accountfrom.address);
    }
  }, [instance.current]);
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button onClick={handleConnect}>connect</button>
      <p>{uri}</p>
      <p>{account}</p>
    </div>
  );
};

export default Mobile;
