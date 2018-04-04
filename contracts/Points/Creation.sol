pragma solidity ^0.4.21;
/**
Owned contract
 */
contract Creation {
    address public creator;
    address public owner;

    function Creation() public {
        owner = msg.sender;
        creator = msg.sender;
    }

    /**
     * Only the owner of contract
     */ 
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    /**
     * Only the creator of contract
     */
    modifier onlyCreator {
        require(msg.sender == creator);
        _;
    }

    /**
     * Assign the owner
     */
    function assignOwner(address _owner) public onlyCreator {
        owner = _owner;
    }
}