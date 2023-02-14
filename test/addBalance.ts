import { expect } from "chai";
import { ethers } from "hardhat";
import { AddBalance } from "../typechain-types";
import { Signer } from "ethers";
import { FeeData } from "@ethersproject/providers";

describe("marketActorDeposits", function () {
  const ACCOUNT_NUMBER = 0;
  let signers : Signer[];
  let addBalance : AddBalance;
  const amount = ethers.utils.parseEther("1");
  let gasData : FeeData;

  it("Should initialize the variables above", async function () {
    gasData = await ethers.provider.getFeeData();
    signers = await ethers.getSigners();
    const AddBalance = await ethers.getContractFactory("AddBalance", signers[ACCOUNT_NUMBER]);
    addBalance = await AddBalance.attach("0xcc53b9983eE786481164a94CbdF6D5c0059879C0");
  });
  
  describe("Events", function () {
    it("Should emit an event on marketActorDeposits", async function () {
        const marketActorDeposits = await addBalance.marketActorDeposits("0x8296CE3497A9b8e6aB6F48d36551eeF42a7b0E48", amount, { 
          value: amount,
          maxPriorityFeePerGas: gasData.maxPriorityFeePerGas?.toHexString() }
          );
          let tx = await marketActorDeposits.wait();
           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          let event = await tx.events[0].topics[1]
        await expect(event, "marketActorDeposited").to.emit(addBalance, 'MarketActorDeposited')
      });
  });
});
