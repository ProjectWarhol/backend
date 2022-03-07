// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../app/blockchain/contracts/PostNftMinting.sol";

contract TestPostNftMinting {
  PostNftMinting private pnm = PostNftMinting(DeployedAddresses.PostNftMinting());
  
  address private receiver = address(this);
  string private uri = "https://gist.githubusercontent.com/mrcgrhrdt/05dbcb0feaa64ba287977b9065395a52/raw/7b6e63d6fb5444902ac7710f8df16355066a62da/example-metadata.json";
  
  function testOwnerOfNewNftIsReceiver() public {
    pnm.safeMint(receiver, uri);
    Assert.equal(pnm.ownerOf(1), receiver, "Owner of NFT should be the receiver");
  }
}
