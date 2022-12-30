const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  console.log(`Token deployed to ${token.address}`);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log(`NFT deployed to ${nft.address}`);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(nft.address, token.address, token.address);
  await marketplace.deployed();
  console.log(`Marketplace deployed to ${marketplace.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
