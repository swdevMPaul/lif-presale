
var LifPresale = artifacts.require("./LifPresale.sol");

it("Should log presale constructor data", async function() {

  const weiRaised = web3.toWei(1850, 'ether');
  const maxCap = web3.toWei(5000, 'ether');
  const wallet = '0xDAD697274F95F909ad12437C516626d65263Ce47';

  const constructorData = await web3.eth.contract(LifPresale.abi)
    .new.getData(weiRaised, maxCap, wallet,
      {data: LifPresale.unlinked_binary}
    );

  console.log('Bytecode for deploy:', constructorData);
  console.log('Constructor params encoded:',
    constructorData.replace(LifPresale.unlinked_binary, ''));

  let presale = await LifPresale.new(
    weiRaised, maxCap, wallet
  );

});