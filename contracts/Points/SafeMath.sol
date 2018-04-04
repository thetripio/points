pragma solidity ^0.4.21;
/**
Safe maths
 */
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        // b >= 0
        require(c >= a); 
    }

    function sub(uint a, uint b) internal pure returns (uint c) {
        // c >= 0
        require(b <= a);
        c = a - b;
    }

    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        // Avoid overflow 
        require(a == 0 || c / a == b);
    }

    function div(uint a, uint b) internal pure returns (uint c) {
        // Avoid zero denominator
        require(b > 0);     
        c = a / b;  
    }
}