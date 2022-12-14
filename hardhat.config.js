require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "List of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        local: {
            url: process.env.LOCAL_URL || "http://0.0.0.0:7545",
            accounts:
                process.env.LOCAL_PRIVATE_KEY !== undefined
                    ? [
                        process.env.LOCAL_PRIVATE_KEY,
                        process.env.LOCAL_PRIVATE_KEY_2,
                        process.env.LOCAL_PRIVATE_KEY_3
                    ]
                    : []
        },
        live: {
            url: process.env.LIVE_URL || "",
            accounts:
                process.env.LIVE_PRIVATE_KEY !== undefined
                    ? [
                        process.env.LIVE_PRIVATE_KEY,
                        process.env.LIVE_PRIVATE_KEY_2
                    ]
                    : []
        },
        matic: {
            url: process.env.MATIC_LIVE_URL || "",
            accounts:
                process.env.LIVE_PRIVATE_KEY !== undefined
                    ? [
                        process.env.LIVE_PRIVATE_KEY,
                        process.env.LIVE_PRIVATE_KEY_2
                    ]
                    : []
        },
        rinkeby: {
            url: process.env.RINKEBY_URL || "",
            accounts:
                process.env.TEST_PRIVATE_KEY !== undefined
                    ? [
                        process.env.TEST_PRIVATE_KEY,
                        process.env.TEST_PRIVATE_KEY_2,
                        process.env.TEST_PRIVATE_KEY_3
                    ]
                    : []
        },
        mumbai: {
            url: process.env.MATIC_TESTNET_URL || "",
            accounts:
                process.env.TEST_PRIVATE_KEY !== undefined
                    ? [
                        process.env.TEST_PRIVATE_KEY,
                        process.env.TEST_PRIVATE_KEY_2,
                        process.env.TEST_PRIVATE_KEY_3
                    ]
                    : []
        },
    },
    gasReporter: {
        enabled: true,//process.env.REPORT_GAS !== undefined,
        currency: "USD",
        gasPrice: 120,
        coinmarketcap: process.env.COINMARKETCAP_KEY || undefined
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};
