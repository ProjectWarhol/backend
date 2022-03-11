// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMinting is ERC721, AccessControl, ERC721URIStorage {
  bytes32 public constant MINTER = keccak256("MINTER");
  uint public tokenCounter;
  constructor() ERC721 ("WarholToken","WT")  {
    _setupRole(MINTER, msg.sender);
  }

  function mint(string memory _tokenURI) public onlyRole(MINTER){
    uint256 _id = tokenCounter;
    _safeMint(msg.sender, _id);
    // _setTokenURI is removed from prigma 0.8.0
    _setTokenURI(_id, _tokenURI);
    tokenCounter = tokenCounter + 1;
  }
}