pragma solidity ^0.4.21;

import "./Creation.sol";

/**
 * Blacklist contract 
 */
contract Blacklist is Creation {
    // blacklist length
    uint private limit;
    address[] private _blacklist;
    uint private num;
    mapping (address=>uint) private _blacklistmap;
    function Blacklist() public {
        // The blacklist's length is limited to 1000
        limit = 1000;
        num = 0;
    }

    /**
     * Show the blacklist
     */
    function blacklist() public onlyOwner view returns (address[]) {
        return _blacklist;
    }

    /**
     * Add the 'account' to blacklist
     */
    function addToBlacklist(address account) public onlyOwner returns (bool) {
        require(num < limit && !blacklisted(account));
        _blacklist.push(account);
        _blacklistmap[account] = uint(_blacklist.length);
        num++;
        return true;
    }

    /**
     * Whether the 'account' is blacklisted
     */
    function blacklisted(address account) public view returns (bool) {
        if (_blacklistmap[account] == 0) {
            return false;
        }
        uint index = _blacklistmap[account] - 1;
        return (index >= 0 && _blacklist.length > index && _blacklist[index] == account);
    }

    /**
     * Remove 'account' from blacklist
     */
    function removeFromBlacklist(address account) public onlyOwner returns (bool) {
        require(blacklisted(account));
        uint index = _blacklistmap[account] - 1;
        delete _blacklist[index];
        delete _blacklistmap[account];
        num--;
        return true;
    }

    /**
     * Whether the blacklist is empty
     */
    function blacklistIsEmpty() public view returns (bool) {
        return !(num > 0);
    }

    /**
     * Clear the blacklist
     */
    function clearBlacklist() public onlyOwner returns(bool) {
        delete num;
        delete _blacklist;
    }
}