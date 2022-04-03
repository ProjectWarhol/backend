// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";

contract PostNftMinting is ERC721, ERC721URIStorage, PullPayment {
	using Counters for Counters.Counter;
	Counters.Counter private tokenIdCounter;
	Counters.Counter private payeeCounter;
	mapping(string=> bool) private tokenExists;
	mapping (uint256 => Payee) private payees;
	uint256 private totalshares = 100;
	struct Payee {
			address payeeAddress;
			uint256 shares;
	}

	constructor() ERC721("PostNftMint", "SFT") {}

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

	function addPayee(address _payeeAddress, uint256 _shares) external{
			totalshares -= _shares;
			require(totalshares>=0, "Share should not be over 100");
			Payee memory newPayee = Payee(_payeeAddress, _shares);
			payees[payeeCounter._value] = newPayee;
			payeeCounter.increment();
	}
	function getPayee(uint256 _id) external view returns(Payee memory){
			return payees[_id];
	}

	function payOut(uint256 _price) external payable {
		require(msg.value == _price, "Sent value and price NOT equal");
        require(payeeCounter._value > 0, "No payees");
        for (uint256 i = 0; i < payeeCounter._value; i++) {
            address currentPayeeAddress = payees[i].payeeAddress;
            uint256 currentAmount = msg.value * payees[i].shares / 100;
            payable(currentPayeeAddress).transfer(currentAmount);
        }
    }

    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(_tokenId);
  }

  function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(_tokenId);
  }
}
