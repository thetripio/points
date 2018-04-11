pragma solidity ^0.4.21;

contract Lock {
    struct Node {
        uint next;
        uint prev;
        uint tokens;
        uint time;
        uint locktime;
    }
    struct LinkedList {
        uint id;
        uint head;
        uint tail;
        mapping (uint=>Node) nodes;
    }
    
    mapping (address=>LinkedList) private lockedlist;

    function Lock() public {

    }

    /**
     * Record the locked 'tokens' of '_contract'
     */
    function pushLockedTokens(address _contract, uint _tokens, uint _seconds) internal {
        require(_tokens > 0);
        if (lockedlist[_contract].id == 0) {
            lockedlist[_contract] = LinkedList(1, 1, 1);
            lockedlist[_contract].nodes[1] = Node(0, 0, _tokens, now, _seconds);
        }else {
            uint prev = lockedlist[_contract].tail;
            lockedlist[_contract].id++;
            uint id = lockedlist[_contract].id;

            lockedlist[_contract].nodes[id] = Node(0, prev, _tokens, now, _seconds);
            lockedlist[_contract].nodes[prev].next = id;
            lockedlist[_contract].tail = id;
        }
    }

    /**
     * Remove nodes of the 'lockedlist' before the 'id' node and the 'id' node itself
     */
    function removeLockedNode(address _contract, uint _id) private {
        require(lockedlist[_contract].nodes[_id].time > 0);
        uint next = 0;
        if(lockedlist[_contract].nodes[_id].next == 0) {
            delete lockedlist[_contract];
        }else {
            next = lockedlist[_contract].nodes[_id].next;
            lockedlist[_contract].nodes[next].prev = 0;
            lockedlist[_contract].head = next;
        }
    }

    /**
     * Remove nodes of the 'lockedlist' before the 'id' node
     */
    function removeLockedNodeBefore(address _contract, uint _id) private {
        require(lockedlist[_contract].nodes[_id].time > 0);
        lockedlist[_contract].head = _id;
        lockedlist[_contract].nodes[_id].prev = 0;
    }

    /**
     * Get the number of unlocked tokens
     */
    function totalUnlockedTokens(address _contract) public view returns(uint total) {
        if(lockedlist[_contract].id > 0) {
            uint p = lockedlist[_contract].head;
            while(p > 0) {
                if(lockedlist[_contract].nodes[p].time + lockedlist[_contract].nodes[p].locktime < now) {
                    total += lockedlist[_contract].nodes[p].tokens;
                    p = lockedlist[_contract].nodes[p].next;
                }else {
                    break;
                }
            }
            return total;
        }
        return 0;
    }

    /**
     * Unlock '_tokens' of '_contract', while the '_tokens' is over lock time
     */
    function unlockTokens(address _contract, uint _tokens) internal returns(bool) {
        require(lockedlist[_contract].id > 0 && _tokens > 0);
        uint p = lockedlist[_contract].head;
        uint total = 0;
        while(p > 0) {
            if(lockedlist[_contract].nodes[p].time + lockedlist[_contract].nodes[p].locktime < now) {
                total += lockedlist[_contract].nodes[p].tokens;
                if (total > _tokens) {
                    removeLockedNodeBefore(_contract, p);
                    lockedlist[_contract].nodes[p].tokens = (total - _tokens);
                    return true;
                } else if(total == _tokens) {
                    removeLockedNode(_contract, p);
                    return true;
                }
                p = lockedlist[_contract].nodes[p].next;
            }else {
                break;
            }
        }
        return false;
    }

    /**
     * Unlock '_tokens' of '_contract' anyway
     */
    function unlockTokensAnyway(address _contract, uint _tokens) internal returns(bool) {
        require(lockedlist[_contract].id > 0 && _tokens > 0);
        uint p = lockedlist[_contract].head;
        uint total = 0;
        while(p > 0) {
            total += lockedlist[_contract].nodes[p].tokens;
            if (total > _tokens) {
                removeLockedNodeBefore(_contract, p);
                lockedlist[_contract].nodes[p].tokens = (total - _tokens);
                return true;
            } else if(total == _tokens) {
                removeLockedNode(_contract, p);
                return true;
            }
            p = lockedlist[_contract].nodes[p].next;
        }
        return false;
    }
}