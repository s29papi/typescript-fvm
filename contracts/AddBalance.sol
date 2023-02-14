// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { BytesAddress} from "./address.sol";
import { MarketAPI } from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import { BytesCBOR } from  "@zondax/filecoin-solidity/contracts/v0.8/cbor/BytesCbor.sol";
import { MarketTypes } from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import { Misc } from "@zondax/filecoin-solidity/contracts/v0.8/utils/Misc.sol";
import { Actor } from "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";


contract AddBalance {
    using BytesCBOR for bytes;
    

    address constant CALL_ACTOR_ADDRESS = 0xfe00000000000000000000000000000000000003;
    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    string constant CALL_ERROR_MESSAGE = "actor call failed";

    uint64 constant CALL_ACTOR_PRECOMPILE_ADDR = 0x0e;
    uint64 constant MAX_RAW_RESPONSE_SIZE = 0x300;
    uint64 constant READ_ONLY_FLAG = 0x00000001; // https://github.com/filecoin-project/ref-fvm/blob/master/shared/src/sys/mod.rs#L60
    uint64 constant DEFAULT_FLAG = 0x00000000;
  

    event MarketActorDeposited(bool indexed success);

    function marketActorDeposits(address onBehalf, uint256 amount) public payable  {
       bytes memory bytesOnBehalf =  BytesAddress.toF4AddressBytes(onBehalf);
       bool success =  addBalance(bytesOnBehalf, amount);
       emit MarketActorDeposited(success);
    }


    function call(
        uint256 method_num,
        bytes memory actor_address,
        bytes memory raw_request,
        uint64 codec,
        uint256 amount,
        bool read_only
    ) internal returns (bool, bytes memory) {
        require(actor_address[0] == 0x00 || actor_address[0] == 0x01 || actor_address[0] == 0x02 || actor_address[0] == 0x03 || actor_address[0] == 0x04, "actor_address address should be bytes format");

        (bool success, bytes memory data) = address(CALL_ACTOR_ADDRESS).delegatecall(
            abi.encode(uint64(method_num), amount, read_only ? READ_ONLY_FLAG : DEFAULT_FLAG, codec, raw_request, actor_address)
        );
        return (success, data);
    }

    // use for prototyping, this doesn't follow the docs
    function addBalance(bytes memory provider_or_client, uint256 value) internal returns (bool) {
        require(msg.value == value, "amount sent and amount specified not equal");

        bytes memory raw_request = provider_or_client.serializeAddress();

        (bool success, bytes memory raw_response) = call(MarketTypes.AddBalanceMethodNum, MarketTypes.ActorID, raw_request, Misc.CBOR_CODEC, value, false);

        bytes memory result = Actor.readRespData(raw_response);

        require(result.length == 0, "unexpected response received");

        return success;
    }

   

   
}