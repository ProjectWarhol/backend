// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../../node_modules/@openzeppelin/contracts/access/AccessControl.sol";

contract NftMinting is ERC721, AccessControl {
  
  bytes32 public constant MINTER = keccak256("MINTER");
  constructor() ERC721 ("WarholToken","WT")  {
    _setupRole(MINTER, msg.sender);
  }

  function mint(string memory _tokenURI) public onlyRole(MINTER){
  }
}