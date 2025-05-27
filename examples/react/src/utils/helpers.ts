import { coins } from '@cosmjs/proto-signing';
import { SigningClient } from '@titan-kit/react';
import { createSend } from "interchainjs/cosmos/bank/v1beta1/tx.rpc.func";
import { createGetBalance } from "interchainjs/cosmos/bank/v1beta1/query.rpc.func";
export const sendToken = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  denom: string,
  signingClient: SigningClient,
  msg: string = 'test'
) => {
  const txSend = createSend(signingClient);
  const fee = {
    amount: coins(0, denom),
    gas: "1000000",
  };
  try {
    const tx = await txSend(
      fromAddress,
      {
        fromAddress,
        toAddress,
        amount: [
          { denom, amount },
        ],
      },
      fee,
      msg
    );
    console.log(tx);
  } catch (error) {
    console.error(error);
  }
}

export const getBalance = async (address: string, rpcEndpoint: string, denom: string) => {
  const balanceQuery = createGetBalance(rpcEndpoint as string);
  const balance = await balanceQuery({
    address,
    denom,
  });
  return balance
}