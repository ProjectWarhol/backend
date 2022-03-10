// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftMinting is ERC721 {
  constructor() public ERC721 ("WarholToken","WT") {
    
  }
}