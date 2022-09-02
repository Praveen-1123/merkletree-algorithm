const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256');
const {ethers} = require('ethers');

let addresses1 = [
    "0x1652149105D6d5F41844B1104499d0C2E4930ee7",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
];

let addresses2 = [
    "0x7417177E4E9a16eF3B3C7093ae65d3E19116f8b5",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
];

const getRoot = async function (phase) {

    let addresses;
    if (phase === 1) {
        addresses = addresses1;
    } else if (phase === 2) {
        addresses = addresses2;
    } else {
        throw new Error("Invalid phase")
    }
    
    let merkleTree = getMerkleTree(addresses);
    try {
        var root = merkleTree.getHexRoot()
    }catch (err) {
        throw err;
    }
    
    return root
}

const getProof = async function (phase, address) {

    let addresses;
    if (phase === 1) {
        addresses = addresses1;
    } else if (phase === 2) {
        addresses = addresses2;
    } else {
        throw new Error("Invalid phase")
    }
    
    let merkleTree = getMerkleTree(addresses);
    try {
        var proof = merkleTree.getHexProof(addressToBytes(address))
    }catch (err) {
        throw err;
    }
    
    return proof
}

const getMerkleTree = (addresses) => {
    return new MerkleTree(
        addresses.map(a => addressToBytes(a)),
        keccak256,
        {sortPairs: true}
    )
}

function addressToBytes(address) {
    return ethers.utils.solidityKeccak256(['address'], [address])
}

module.exports = {
    getProof,
    getRoot
}
