// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftMinting is ERC721 {
  uint256 public tokenCounter;
  constructor() ERC721 ("WarholToken","WT") {
    tokenCounter = 0;
  }

  function safeMint(string memory tokenURI) returns (uint256) {
    uint256 newTokenId = tokenCounter;
    _safeMint(msg.sender, tokenURI);
    _setTokenURI(newTokenId, tokenURI);
    tokenCounter += 1;
    return newTokenId;
  }
}