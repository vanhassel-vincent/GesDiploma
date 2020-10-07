pragma solidity >=0.4.21 <0.6.0;

import "./Ownable.sol";

contract Migrations is Ownable {

  event migrationsUpgraded(address new_address);

  uint public last_completed_migration;

  function setCompleted(uint completed) public onlyOwner {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public onlyOwner {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
    emit migrationsUpgraded(new_address);
  }
}
