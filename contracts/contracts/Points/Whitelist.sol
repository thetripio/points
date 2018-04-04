pragma solidity ^0.4.21;

import "./Creation.sol";

/**
 * Whitelist contract 
 */
contract Whitelist is Creation {
    // whitelist length
    uint private limit;
    address[] private _whitelist;
    uint private num;
    mapping (address=>uint) private _whitelistmap;
    function Whitelist() public {
        // The whitelist's length is limited to 1000
        limit = 1000;
        num = 0;
    }

    /**
     * Show the whitelist
     */
    function whitelist() public onlyOwner view returns (address[]) {
        return _whitelist;
    }

    /**
     * Add the 'account' to whitelist
     */
    function addToWhitelist(address account) public onlyOwner returns (bool) {
        require(num < limit && !whitelisted(account));
        _whitelist.push(account);
        _whitelistmap[account] = uint16(_whitelist.length);
        num++;
        return true;
    }

    /**
     * Whether the 'account' is whitelisted
     */
    function whitelisted(address account) public onlyOwner view returns (bool) {
        if(_whitelistmap[account] == 0) {
            return false;
        }
        uint index = _whitelistmap[account] - 1;
        return (index >= 0 && _whitelist.length > index && _whitelist[index] == account);
    }

    /**
     * Remove 'account' from whitelist
     */
    function removeFromWhitelist(address account) public onlyOwner returns (bool) {
        require(whitelisted(account));
        uint index = _whitelistmap[account] - 1;
        delete _whitelist[index];
        delete _whitelistmap[account];
        num--;
        return true;
    }

    /**
     * Whether the whitelist is empty
     */
    function whitelistIsEmpty() public view returns (bool) {
        return !(num > 0);
    }

    /**
     * Clear the whitelist
     */
    function clearWhitelist() public onlyOwner returns(bool) {
        delete num;
        delete _whitelist;
    }
}