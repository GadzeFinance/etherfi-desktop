const dappUrl = process.env.NODE_ENV === 'production'
  ? 'https://mainnet.ether.fi'
  : 'https://goerli.etherfi.vercel.app'

module.exports = {
  dappUrl,
}
