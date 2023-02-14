import { ethers, network } from "hardhat";

// yarn hardhat run --network hyperspace scripts/deploy.ts
const ACCOUNT_NUMBER = 0;

async function main() {
  let gasData = await ethers.provider.getFeeData();


  const signers = await ethers.getSigners();
  console.log("Wallet FEVM Address: ", signers[ACCOUNT_NUMBER].address)

  // deploy AddBalance
  // const AddBalance = await ethers.getContractFactory("AddBalance", signers[ACCOUNT_NUMBER]);
  // console.log('Deploying AddBalance...');
  // const addBalance = await AddBalance.deploy({  maxPriorityFeePerGas: gasData.maxPriorityFeePerGas?.toHexString() });
  // await addBalance.deployed();
  // console.log(`Add Balance deployed to: ${addBalance.address} on FEVM`);
  const amount = ethers.utils.parseEther("1");

  // call AddBalance
  const AddBalance = await ethers.getContractFactory("AddBalance", signers[ACCOUNT_NUMBER]);
  console.log('Calling Market Deposits...');
  const addBalance = await AddBalance.attach("0xcc53b9983eE786481164a94CbdF6D5c0059879C0");
  const marketActorDeposits = await addBalance.marketActorDeposits("0x8296CE3497A9b8e6aB6F48d36551eeF42a7b0E48", amount, { 
    value: amount,
    maxPriorityFeePerGas: gasData.maxPriorityFeePerGas?.toHexString() }
    );
  let tx = await marketActorDeposits.wait();
  let events = await tx.events
  console.log(events)

  console.log(`Complete!`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
