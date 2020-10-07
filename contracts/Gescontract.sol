pragma solidity >=0.4.21 <0.6.0;

import "./Ownable.sol";

contract Gescontract is Ownable {

    event hashAdded(string hashValue);

    string[] public certifiedArray;

    function newCertified(string memory hashValue) public onlyOwner {
        certifiedArray.push(hashValue);
        emit hashAdded(hashValue);
    }

    function isCertified(string memory targetHash) public view returns (bool) {
        bytes32 hashBytes = keccak256(abi.encodePacked(targetHash));
        for (uint i = 0; i < certifiedArray.length; i++) {
            if(keccak256(abi.encodePacked(certifiedArray[i])) == hashBytes){
                return true;
            }
        }
        return false;
    }
}
