const {expect} = require("chai");
const {ethers} = require("hardhat");
const {Min} = require("mocha/lib/reporters");
const {getProof, getRoot} = require("../merkletree");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Merkle Tree contract", function () {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for tests, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.
    let owner;
    let user1;
    let user2;

    let provider1
    let provider2
    
    let merkleTree
    let MerkleTreeProof

    // `beforeEach` will run before each test, re-deploying the contract every time.
    // It receives a callback, which can be async.
    before(async function () {

        [owner, user1, user2] = await ethers.getSigners();
        let ownerBalance = await ethers.provider.getBalance(owner.address)
        console.log("Owner Address:", owner.address);
        console.log('Owner Balance:', ownerBalance.toString());

        // user1 = ethers.Wallet.createRandom();
        // user2 = ethers.Wallet.createRandom();

        console.log(`User1: ${user1.address}, User2: ${user2.address}`);

        // provider1 = user1.connect(ethers.provider);
        // provider2 = user2.connect(ethers.provider);

        // let transferAmount = ethers.utils.parseEther("10");
        // await owner.sendTransaction({to: user1.address, value: transferAmount});
        // await owner.sendTransaction({to: user2.address, value: transferAmount});

        MerkleTreeProof = await ethers.getContractFactory("MerkleTreeProof");

        let root1 = await getRoot(1);
        let root2 = await getRoot(2);

        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens once its transaction has been
        // mined.
        merkleTree = await MerkleTreeProof.deploy(
            root1,
            root2
        );

        await merkleTree.deployed();
    });

    let proof1, proof2;
    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        it("Should able to get proofs", async function () {
            
            proof1 = await getProof(1, user1.address);
            proof2 = await getProof(2, user2.address);
            
            expect(proof1).to.not.be.null;
            expect(proof2).to.not.be.null;
            expect(proof1).to.not.be.empty;
            expect(proof2).to.not.be.empty;
            
        });
        
        it("Should able to pass verification 1", async function () {
            
            let status = await merkleTree.connect(user1).verification(1, proof1)
            expect(status).to.be.true;
            
        });
        
        it("Should able to pass verification 2", async function () {
            
            let status = await merkleTree.connect(user2).verification(2, proof2)
            expect(status).to.be.true;
            
        });
        
        it("Should fail on verification 1", async function () {
            
            let status = await merkleTree.connect(user1).verification(2, proof1)
            expect(status).to.not.be.true;
            
        });
        
        it("Should fail on verification 2", async function () {
            
            let status = await merkleTree.connect(user2).verification(1, proof2)
            expect(status).to.not.be.true;
            
        });
        
        it("Should fail on wrong phase", async function () {
            
            await expect(merkleTree.connect(user1).verification(3, proof1)).to.be.reverted
            
        });
    });
});
