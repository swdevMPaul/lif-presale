
var BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

var LifPresale = artifacts.require("./LifPresale.sol");

contract('Lif Token Presale', function(accounts) {

  it("Should create a crowdsale", async function() {

    let weiRaised = new BigNumber(0);
    const maxCap = web3.toWei(10, 'ether');
    const wallet = accounts[1];
    const initialWalletBalance = await web3.eth.getBalance(accounts[1]);

    let presale = await LifPresale.new(
      weiRaised, maxCap, wallet
    );

    weiRaised.should.be.bignumber.equal(await presale.weiRaised());
    assert.equal(maxCap, await presale.maxCap());
    assert.equal(wallet, await presale.wallet());
    assert.equal(true, await presale.paused());

    // Unpause the presale

    await presale.unpause({from: accounts[0]});

    assert.equal(false, await presale.paused());

    // Send some ether ans test the forwarding to the wallet address

    await web3.eth.sendTransaction({
      to: presale.address,
      value: web3.toWei(1.5, 'ether'),
      from: accounts[2]
    });

    weiRaised = weiRaised.plus(web3.toWei(1.5, 'ether'));

    weiRaised.should.be.bignumber.equal(await presale.weiRaised());
    initialWalletBalance.plus(weiRaised)
      .should.be.bignumber.equal(await web3.eth.getBalance(accounts[1]));

    // Pause the presale and dont allow to receive ether

    await presale.pause({from: accounts[0]});

    try {
      await web3.eth.sendTransaction({
        to: presale.address,
        value: web3.toWei(1.5, 'ether'),
        from: accounts[2]
      });
    } catch (e) {
      if (e.message.search('invalid opcode') == 0) throw e;
    }

    weiRaised.should.be.bignumber.equal(await presale.weiRaised());
    initialWalletBalance.plus(weiRaised)
      .should.be.bignumber.equal(await web3.eth.getBalance(accounts[1]));

    // Dont allow to receive more than max cap

    try {
      await web3.eth.sendTransaction({
        to: presale.address,
        value: web3.toWei(8.5, 'ether')+1,
        from: accounts[2]
      });
    } catch (e) {
      if (e.message.search('invalid opcode') == 0) throw e;
    }

    weiRaised.should.be.bignumber.equal(await presale.weiRaised());
    initialWalletBalance.plus(weiRaised)
      .should.be.bignumber.equal(await web3.eth.getBalance(accounts[1]));

    // Unpause it and finish

    await presale.unpause({from: accounts[0]});

    await web3.eth.sendTransaction({
      to: presale.address,
      value: web3.toWei(8.5, 'ether'),
      from: accounts[2]
    });

    weiRaised = weiRaised.plus(web3.toWei(8.5, 'ether'));

    weiRaised.should.be.bignumber.equal(await presale.weiRaised());
    initialWalletBalance.plus(weiRaised)
      .should.be.bignumber.equal(await web3.eth.getBalance(accounts[1]));

    // Dont allow to receive more than max cap once is it reached

    try {
      await web3.eth.sendTransaction({
        to: presale.address,
        value: 1,
        from: accounts[2]
      });
    } catch (e) {
      if (e.message.search('invalid opcode') == 0) throw e;
    }

    weiRaised.should.be.bignumber.equal(await presale.weiRaised());
    initialWalletBalance.plus(weiRaised)
      .should.be.bignumber.equal(await web3.eth.getBalance(accounts[1]));
  });

});
