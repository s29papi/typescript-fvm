// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;





library BytesAddress {

    /**
    * @dev Concatenates the delegated protocol `0x04` and namespace bytes `10 (0x0a)` with the specified sub address (ethereum address).
    * @param a The address to concatenate.
    * @return The F4 address bytes of the specified address.
    */
    function toF4AddressBytes(address a) internal pure returns (bytes memory) {
        return abi.encodePacked(hex'04', hex'0a', a);
    }

    /**
    * @dev Concatenates the delegated protocol `0x04` and namespace bytes `10 (0x0a)` with the specified sub address (ethereum address).
    * @return The F4 address bytes of the calling contract.
    */
    function contractF4AddressBytes()    internal view returns (bytes memory) {
        return abi.encodePacked(hex'04', hex'0a', address(this));
    }
}