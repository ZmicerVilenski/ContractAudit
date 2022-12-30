const { time, loadFixture, } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Test marketplace", function () {

  let nftToken, paymentToken, rewardToken, account0, account1, account2;

  async function deploy() {
    [account0, account1, account2] = await ethers.getSigners();
    const NFTToken = await ethers.getContractFactory("NFT");
    nftToken = await NFTToken.deploy();
    const PaymentToken = await ethers.getContractFactory("Token");
    paymentToken = await PaymentToken.deploy();
    const RewardToken = await ethers.getContractFactory("Token");
    rewardToken = await RewardToken.deploy();  
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
  }

  describe("Deployment, fill the balances", function () {

    it("Set parameters", async function () {

      await loadFixture(deploy);

      for (let i=1; i <= 3; i++) {
        await nftToken.safeMint(account0);
        await nftToken.safeMint(account1);
        await nftToken.safeMint(account2);
      }

    });

    it("Should set the right owner for Tokens", async function () {
      expect(await nftToken.owner()).to.equal(account0.address);
      expect(await paymentToken.owner()).to.equal(account0.address);
      expect(await rewardToken.owner()).to.equal(account0.address);
    });

    it("Should get the right balances", async function () {

      const amount = hre.ethers.utils.parseEther("1000000000");
      await paymentToken.transfer(account1.address, amount);
      await paymentToken.transfer(account2.address, amount);
      await rewardToken.transfer(marketplace.address, amount);
      expect(await paymentToken.balanceOf(account1.address)).to.equal(amount);
      expect(await paymentToken.balanceOf(account2.address)).to.equal(amount);
      expect(await marketplace.balanceOf(marketplace.address)).to.equal(amount);

    });

  });


});
