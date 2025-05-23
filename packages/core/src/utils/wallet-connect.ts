const WALLET_CONNECT_PROJECT_ID = '15a12f05b38b78014b2bb06d77eecdc3'; // Replace with your actual project ID
const WALLET_EXPLORER_API_URL = 'https://explorer-api.walletconnect.com/v3';

export const getWCInfoByProjectId = async (id: string) => {
  return fetch(
    `${WALLET_EXPLORER_API_URL}/wallets?projectId=${WALLET_CONNECT_PROJECT_ID}&ids=${id}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const wallets = data.listings;
      return wallets[id];
    })
    .catch((error) => {
      console.error('Error fetching wallet info:', error);
      throw error;
    });
};
