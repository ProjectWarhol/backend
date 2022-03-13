// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../../../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMinting is ERC721, AccessControl, ERC721URIStorage {
  bytes32 public constant MINTER = keccak256("MINTER");
  uint public tokenCounter;
  mapping(string=> bool) tokenExists;

  constructor() ERC721 ("WarholToken","WT")  {
    _setupRole(MINTER, msg.sender);
  }

  function safeMint(address _to, string memory _tokenURI) public onlyRole(MINTER){
    // check tokenURI doesn't exist
    require(!tokenExists[_tokenURI]);
    uint256 _id = tokenCounter;
    _safeMint(_to, _id);
    // _setTokenURI is removed from prigma 0.8.0
    _setTokenURI(_id, _tokenURI);
    tokenCounter = tokenCounter + 1;
    tokenExists[_tokenURI] = true;
  }

  // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}