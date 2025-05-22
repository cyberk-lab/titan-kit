import Markdown from 'react-markdown'

const UseChainDoc = () => {
	return (
		<div className="prose">
			<Markdown>{`
# Documentation
## 1.prerequisite
required provider: ChainProvider from @titan-kit/react
\`\`\`
<ChainProvider
	chains={_chains}
	wallets={_wallets}
	assetLists={_assetLists}
	signerOptions={{}}
	endpointOptions={{
		endpoints: {
		},
	}}
>
	<BrowserRouter>
		<App />
	</BrowserRouter>
</ChainProvider>
\`\`\`
## 2.parameters:
chainName: ChainName ( = string );

return type: ChainWalletContext
		`}</Markdown>
		</div>
	)
}

export default UseChainDoc