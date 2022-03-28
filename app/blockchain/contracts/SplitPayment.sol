// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract SplitPayment is PaymentSplitter {
  uint256 private royalties;
  constructor(address[] memory _payees, uint256[] memory _shares) PaymentSplitter(_payees, _shares) {
  }

  function setRoyalties(address payable _artistAddress, uint256 _royalties) external{
    require(0<=_royalties && _royalties<=10, "should be between 0 and 10");
    royalties = _royalties;
    emit PayeeAdded(_artistAddress, royalties);
  }
  
  function setSellerShare(address payable _sellerAddress) external {
    require(0<=royalties && royalties<=10, "should be between 0 and 10");
    emit PayeeAdded(_sellerAddress, 100 -2 - royalties);
  }

  function payeeAddress(uint256 index) external view returns (address) {
    return payee(index);
  }
  
  // function releasePayment(address payable _to) external {
  //   release(_to);
  // }
}