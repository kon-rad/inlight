const hre = require('hardhat');

async function main() {
  const Market = await hre.ethers.getContractFactory('InLightMarket');
  const market = await Market.deploy();
  await market.deployed();
  console.log('InLightMarket deployed to: ', market.address);

  const NFT = await hre.ethers.getContractFactory('InLightNFT');
  const nft = await NFT.deploy(market.address);
  await nft.deployed();
  console.log('InLightNFT deployed to: ', nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
