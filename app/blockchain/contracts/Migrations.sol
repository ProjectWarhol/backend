// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Migrations {
  address public owner = msg.sender;
  uint public lastCompletedMigration;
  uint public test;

  modifier restricted() {
    require(
      msg.sender == owner,
      "Function is restricted to owner"
    );
    _;
  }

  function setCompleted(uint completed) public restricted {
    lastCompletedMigration = completed;
  }
}
