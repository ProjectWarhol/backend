// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";

contract PostNftMinting is ERC721, ERC721URIStorage, PullPayment {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	constructor() ERC721("PostNftMint", "SFT") {}

	function safeMint(address to, string memory uri) external {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);
		_setTokenURI(tokenId, uri);
	}

	function tokenTransferTo(address to, uint256 tokenId) external {
		safeTransferFrom(msg.sender, to, tokenId);
	}

	function transferTo(address to, uint256 price) external payable {
		// price is and must be in Wei
		// 
		require(msg.value == price, "Sent value and price are NOT the same.");
		_asyncTransfer(to, price);
	}

	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }
}
