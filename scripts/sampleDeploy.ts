import { ethers, network } from "hardhat";


const ACCOUNT_NUMBER = 0;

async function main() {
  let gasData = await ethers.provider.getFeeData();


  const signers = await ethers.getSigners();
  console.log("Wallet FEVM Address: ", signers[ACCOUNT_NUMBER].address)

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  // deploy Lock
  const Lock = await ethers.getContractFactory("Lock", signers[ACCOUNT_NUMBER]);
  console.log('Deploying Lock...');
  const lock = await Lock.deploy(unlockTime, { 
      value: lockedAmount, 
      maxPriorityFeePerGas: gasData.maxPriorityFeePerGas?.toHexString()
  });
  await lock.deployed();
  console.log('Lock deployed to:', lock.address);

  console.log(`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
