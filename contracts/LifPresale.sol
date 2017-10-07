pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title LifPresale
 * @dev Contract to raise a max amount of Ether before TGE
 *
 * The token rate is 11 Lif per Ether, if you send 10 Ethers you will
 * receive 110 Lifs after TGE ends
 * The contract is pausable and it starts in paused state
 */

/**
 * TERMS AND CONDITIONS
 *
 * By sending Ether to this contract I agree to the following terms
 * and conditions:
 *
 * --- TERMS AND CONDITIONS HERE ---
 */
contract LifPresale is Ownable, Pausable {
  using SafeMath for uint256;

  // The address where all funds will be forwarded
  address public wallet;

  // The total amount of wei raised
  uint256 public weiRaised;

  // The maximun amount of wei to be raised
  uint256 public maxCap;

  /**
     @dev Constructor. Creates the LifPresale contract
     The contract can start with some wei already raised, it will
     also have a maximun amount of wei to be raised and a wallet
     address where all funds will be forwarded inmediatly.

     @param _weiRaised see `weiRaised`
     @param _maxCap see `maxCap`
     @param _wallet see `wallet`
   */
  function LifPresale(uint256 _weiRaised, uint256 _maxCap, address _wallet) {
    require(_weiRaised < _maxCap);

    weiRaised = _weiRaised;
    maxCap = _maxCap;
    wallet = _wallet;
    paused = true;
  }

  /**
     @dev Fallback function that will be executed every time the contract
     receives ether, the contract will accept ethers when is not paused and
     when the amount sent plus the wei raised is not higher than the max cap.
   */
  function () whenNotPaused payable {
    require(weiRaised.add(msg.value) <= maxCap);

    weiRaised = weiRaised.add(msg.value);
    wallet.transfer(msg.value);
  }

}
