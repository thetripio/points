pragma solidity ^0.4.21;

contract TripioToken {

    function transfer(address _to, uint256 _value) public returns (bool);

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
}