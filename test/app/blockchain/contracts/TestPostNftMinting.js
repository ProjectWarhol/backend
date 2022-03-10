/* eslint-disable prefer-destructuring */
const PostNftMinting = artifacts.require('PostNftMinting')

contract('PostNftMinting', accounts => {
	const URI = 'https://gist.githubusercontent.com/mrcgrhrdt/05dbcb0feaa64ba287977b9065395a52/raw/7b6e63d6fb5444902ac7710f8df16355066a62da/example-metadata.json'
	const ETH_DIVIDER = 1000000000000000000
	let acc0
	let acc1
	let instance

	before(async () => {
		instance = await PostNftMinting.deployed()
	})
	
	beforeEach(()=> {
		acc0 = accounts[0]
		acc1 = accounts[1]
	})

	it('Owner of NFT is receiver', async () => {		
		await instance.safeMint(acc1, URI)
		assert.strictEqual(await instance.ownerOf(0), acc1, 'Owner of NFT should be the receiver')
	})

	it('NFT gets added to wallet', async () => {
		const balance = await instance.balanceOf(acc1)
		const amountTokensBefore = balance.words[0]

		await instance.safeMint(acc1, URI)
		
		const newBalance = await instance.balanceOf(acc1)
		const amountTokensAfter = newBalance.words[0]
		assert.isAbove(amountTokensAfter, amountTokensBefore, 'Amount of tokens should be higher than before trasfer')
	})

	it('ETH should be deducted from senders wallet', async () => {
		const senderBalance = await web3.eth.getBalance(acc0) / ETH_DIVIDER

		await instance.safeMint(acc1, URI)

		const newSenderBalance = await web3.eth.getBalance(acc0) / ETH_DIVIDER
		assert.isBelow(newSenderBalance, senderBalance, 'The senders ETH should be lower than before')
	})

	it('If sender and receiver are different wallets, receivers ETH should be untouched', async () => {
		const receiverBalance = await web3.eth.getBalance(acc1) / ETH_DIVIDER
		
		await instance.safeMint(acc1, URI)
		const newReceiverBalance = await web3.eth.getBalance(acc1) / ETH_DIVIDER
		assert.strictEqual(newReceiverBalance, receiverBalance, 'The receiver ETH should be untouched')
	})

	it('URI of NFT is correct', async () => {
		await instance.safeMint(acc1, URI)
		assert.strictEqual(await instance.tokenURI(0), URI, 'The uri should be ours')
	})
})
