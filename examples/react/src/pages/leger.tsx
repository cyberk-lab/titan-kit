import { useChain } from "@titan-kit/react";

const LedgerExample = () => {
  const juno = useChain("juno");
  const osmosis = useChain("osmosis");
  const stargaze = useChain("stargaze");
  return (
    <div>
      <table>
        <tr>
          <td>{juno.address}</td>
          <td onClick={juno.connect}>connect</td>
          <td onClick={juno.disconnect}>disconnect</td>
        </tr>
        <tr>
          <td>{osmosis.address}</td>
          <td onClick={osmosis.connect}>connect</td>
          <td onClick={osmosis.disconnect}>disconnect</td>
        </tr>
        <tr>
          <td>{stargaze.address}</td>
          <td onClick={stargaze.connect}>connect</td>
          <td onClick={stargaze.disconnect}>disconnect</td>
        </tr>
      </table>
    </div>
  );
};

export default LedgerExample;
