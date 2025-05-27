import { Chain } from '@chain-registry/v2-types';
import { HttpEndpoint } from '@titanlabjs/types';

export type RpcInfo = {
  endpoint: string | HttpEndpoint;
  chainType: Chain['chainType'];
};

export const isValidRpcEndpoint = async (
  endpoint: string | HttpEndpoint,
  chainType: Chain['chainType']
) => {
  let requestBody;
  const rpcToCheck = typeof endpoint === 'string' ? endpoint : endpoint.url;
  if (chainType === 'cosmos') {
    requestBody = {
      jsonrpc: '2.0',
      method: 'status',
      params: [],
      id: 1,
    };
  } else if (chainType === 'eip155') {
    requestBody = {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1,
    };
  } else {
    throw new Error('unsupported chain type');
  }
  try {
    const response = await fetch(rpcToCheck, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const timeoutCheck = (ms: number) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  );

export const getValidRpcEndpoint = async (endpoints: RpcInfo[]) => {
  let rpc: string | HttpEndpoint = '';
  for (const endpoint of endpoints) {
    try {
      const isValid = (await Promise.race([
        isValidRpcEndpoint(endpoint.endpoint, endpoint.chainType),
        timeoutCheck(1500),
      ])) as { status: number };
      if (isValid) {
        rpc = endpoint.endpoint;
        break;
      }
    } catch (error) {
      // console.error(error)
    }
  }
  return rpc;
};
