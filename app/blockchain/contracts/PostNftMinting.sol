// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract PostNftMinting is ERC721, ERC721URIStorage, PullPayment,  PaymentSplitter {
	using Counters for Counters.Counter;
	Counters.Counter private tokenIdCounter;
	mapping(string=> bool) private tokenExists;
	
	address public seller;
	address public artist;
	address public projectOwner; 
	uint8 public royalities;

	 constructor(address[] memory _payees, uint256[] memory _shares, uint8 _royalities) PaymentSplitter(_payees, _shares)  ERC721("PostNftMint", "SFT") {
		 _payees[0] = seller;
		 _payees[1] = artist;
		 _payees[2] = projectOwner;
		 royalities = _royalities;
		 _shares[0] = 100 - 2 - royalities;
		 _shares[1] = royalities;
		 _shares[2] = 2;
	 }

	function safeMint(address _to, string memory _uri) external {
		// check if _uri doesn't exist
    require(!tokenExists[_uri], "The uri already exists");
		uint256 tokenId = tokenIdCounter.current();
		tokenIdCounter.increment();
		_safeMint(_to, tokenId);
		_setTokenURI(tokenId, _uri);
		tokenExists[_uri] = true;
	}

	function tokenTransferTo(address _to, uint256 _tokenId) external {
		safeTransferFrom(msg.sender, _to, _tokenId);
	}

	function transferTo(address _to, uint256 _price) external payable {
		// price is and must be in Wei
		require(msg.value == _price, "Sent value and price NOT equal");
		_asyncTransfer(_to, _price);
	}

	function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }

  function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(_tokenId);
  }
}
