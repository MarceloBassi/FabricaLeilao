const AisthisiToken = artifacts.require('BassiToken');
const truffleAssert = require('truffle-assertions');

let correctUnlockCode = web3.utils.sha3('test'); //test is the password
let timestampLockedFrom = Math.round(Date.now() / 1000) + 3; //lock it in 3 seconds to test unlock
let unlockCodeHash = web3.utils.sha3(correctUnlockCode); //double hashed

contract('AisthisiToken: test mint and lock', (accounts) => {
    const [deployerAddress, tokenHolderOneAddress, tokenHolderTwoAddress] = accounts;

    it('is possible to mint tokens for the minter role', async () => {
        let token = await AisthisiToken.deployed();

        await token.award(tokenHolderOneAddressh , {from:"0xC0086782EB39cC13b7Aa0263Db0bcc9230292C6c"}); //minting works
        await truffleAssert.fails(token.transferFrom(deployerAddress, tokenHolderOneAddress, 0)); //transferring for others doesn't work

        //but transferring in general works
        await truffleAssert.passes(
            token.transferFrom(tokenHolderOneAddress, tokenHolderTwoAddress, 0, { from: "0xC0086782EB39cC13b7Aa0263Db0bcc9230292C6c" }),
        );
    });


    it('is possible to retrieve the correct token URI', async () => {
        let token = await AisthisiToken.deployed();
        let metadata = await token.tokenURI(0);
        assert.equal('https://app.i4d.com.br/Files/NFT/0.json', metadata);
    })
});