
var chai = require('chai');  
const chaiAsPromised = require('chai-as-promised')
const walletHelper = require('./helpers/wallet.js')
const TestToken = artifacts.require("TestToken");

const Rollup = artifacts.require("Rollup");
const TokenRegistry = artifacts.require("TokenRegistry");
chai.use(chaiAsPromised).should()

contract('Rollup', async function (accounts) {  
    let wallets;
    
    before(async function () {
      wallets = walletHelper.generateFirstWallets(walletHelper.mnemonics, 10)
    })

    it('set Rollup in token registry', async function () {
      let tokenRegistry = await TokenRegistry.deployed();
      let rollupInstance = await Rollup.deployed();
      let setRollup = await tokenRegistry.setRollupAddress(rollupInstance.address, { from: wallets[0].getAddressString() });
      assert(setRollup, 'setRollupNC failed');
    })

    it('should register a token', async function () {
      let testToken = await TestToken.deployed();
      let rollupInstance = await Rollup.deployed();
      let registerToken = await rollupInstance.requestTokenRegistration(testToken.address, { from: wallets[0].getAddressString() })
      const logs = registerToken.logs
      logs.should.have.lengthOf(1)
      logs[0].event.should.equal('RegistrationRequest')
      assert(registerToken, "token registration failed"); 
    })

  // ----------------------------------------------------------------------------------

  it("should finalise token registration", async () => {
      let testToken = await TestToken.deployed();
      let rollupInstance = await Rollup.deployed();
      let approveToken = await rollupInstance.finaliseTokenRegistration(testToken.address,{ from: wallets[0].getAddressString()} )
      assert(approveToken, "token registration failed");
  });

  // ----------------------------------------------------------------------------------
  it("should approve Rollup on TestToken", async () => {
    let rollupInstance = await Rollup.deployed();
    let testToken = await TestToken.deployed();
      let approveToken = await testToken.approve(
        rollupInstance.address, 1700,
        { from: wallets[0].getAddressString()}
      )
      assert(approveToken, "approveToken failed")
  });


  })