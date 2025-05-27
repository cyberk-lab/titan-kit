import { useEffect, useState } from 'react'
import { useWalletManager } from '@titan-kit/react'

const UseWalletManager = () => {
	const walletManager = useWalletManager()

	console.log(walletManager)
  return (
    <div className="space-y-4 mx-auto max-w-3xl mt-20">
      <h1 className="text-2xl font-semibold">useWalletManager usage:</h1>
      
    </div>
  )
}
export default UseWalletManager