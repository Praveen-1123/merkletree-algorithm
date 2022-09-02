// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleTreeProof {
    bytes32 public root1;
    bytes32 public root2;

    constructor(bytes32 _root1, bytes32 _root2) {
        root1 = _root1;
        root2 = _root2;
    }

    function verification(uint256 _phase, bytes32[] calldata _proof)
        public
        view
        returns (bool verified)
    {
        if (_phase == 1) {
            verified = verify(leaf(msg.sender), _proof, root1);
        } else if (_phase == 2) {
            verified = verify(leaf(msg.sender), _proof, root2);
        } else {
            revert("Invalid phase");
        }
    }

    function leaf(address _address) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address));
    }

    function verify(
        bytes32 _leaf,
        bytes32[] memory _proof,
        bytes32 _root
    ) internal pure returns (bool) {
        return MerkleProof.verify(_proof, _root, _leaf);
    }
}
