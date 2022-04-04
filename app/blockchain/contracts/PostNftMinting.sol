// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";

contract PostNftMinting is ERC721, ERC721URIStorage, ERC721Enumerable, PullPayment {
	using Counters for Counters.Counter;
	Counters.Counter private tokenIdCounter;
	mapping(string=> bool) private tokenExists;

	constructor() ERC721("PostNftMint", "SFT") {}

	function safeMint(address _to, string memory _uri) external {
		// check if _uri doesn't exist
    require(!tokenExists[_uri], "The uri already exists");
		uint256 tokenId = tokenIdCounter.current();
		tokenIdCounter.increment();
		tokenExists[_uri] = true;
		_safeMint(_to, tokenId);
		_setTokenURI(tokenId, _uri);
	}

	function tokenTransferTo(address _to, uint256 _tokenId) external {
		safeTransferFrom(msg.sender, _to, _tokenId);
	}

	function transferTo(address _to, uint256 _price) external payable {
		// price is and must be in Wei
		require(msg.value == _price, "Sent value and price NOT equal");
		_asyncTransfer(_to, _price);
	}

	function getTokens(address _from) external view returns(uint256[] memory){
		uint256 balance = super.balanceOf(_from);
		uint256[] memory tokenIds = new uint[](balance);
		for (uint256 i = 0; i < balance; i++) {
			tokenIds[i] = tokenOfOwnerByIndex(_from, i);
		}
		return tokenIds;
	}

	function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }

  function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(_tokenId);
  }

	function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
  }
}
