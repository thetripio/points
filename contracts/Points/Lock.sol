pragma solidity ^0.4.21;

contract Lock {
    struct Node {
        uint next;
        uint prev;
        uint tokens;
        uint time;
    }
    struct LinkedList {
        uint id;
        uint head;
        uint tail;
        mapping (uint=>Node) nodes;
    }
    
    mapping (address=>LinkedList) private lockedlist;
    uint private lockingTime;

    function Lock() public {
        lockingTime = 30 days;
    }

    function pushLockedTokens(address to, uint tokens) internal {
        require(tokens > 0);
        if (lockedlist[to].id == 0) {
            lockedlist[to] = LinkedList(1, 1, 1);
            lockedlist[to].nodes[1] = Node(0, 0, tokens, now);
        }else {
            uint prev = lockedlist[to].tail;
            lockedlist[to].id++;
            uint id = lockedlist[to].id;

            lockedlist[to].nodes[id] = Node(0, prev, tokens, now);
            lockedlist[to].nodes[prev].next = id;
            lockedlist[to].tail = id;
        }
    }

    function removeLockedNode(address to, uint id) private {
        require(lockedlist[to].nodes[id].time > 0);
        uint next = 0;
        if(lockedlist[to].nodes[id].next == 0) {
            delete lockedlist[to];
        }else {
            next = lockedlist[to].nodes[id].next;
            lockedlist[to].nodes[next].prev = 0;
            lockedlist[to].head = next;
        }
    }

    function removeLockedNodeBefore(address to, uint id) private {
        require(lockedlist[to].nodes[id].time > 0);
        lockedlist[to].head = id;
        lockedlist[to].nodes[id].prev = 0;
    }

    function totalUnlockedTokens(address to) public view returns(uint total) {
        if(lockedlist[to].id > 0) {
            uint p = lockedlist[to].head;
            while(p > 0) {
                if(lockedlist[to].nodes[p].time + lockingTime < now) {
                    total += lockedlist[to].nodes[p].tokens;
                    p = lockedlist[to].nodes[p].next;
                }else {
                    break;
                }
            }
            return total;
        }
        return 0;
    }

    function unlockTokens(address to, uint tokens) internal returns(bool) {
        require(lockedlist[to].id > 0 && tokens > 0);
        uint p = lockedlist[to].head;
        uint total = 0;
        while(p > 0) {
            if(lockedlist[to].nodes[p].time + lockingTime < now) {
                total += lockedlist[to].nodes[p].tokens;
                if (total > tokens) {
                    removeLockedNodeBefore(to, p);
                    lockedlist[to].nodes[p].tokens = (total - tokens);
                    return true;
                } else if(total == tokens) {
                    removeLockedNode(to, p);
                    return true;
                }
                p = lockedlist[to].nodes[p].next;
            }else {
                break;
            }
        }
        return false;
    }

    function unlockTokensAnyway(address to, uint tokens) internal returns(bool) {
        require(lockedlist[to].id > 0 && tokens > 0);
        uint p = lockedlist[to].head;
        uint total = 0;
        while(p > 0) {
            total += lockedlist[to].nodes[p].tokens;
            if (total > tokens) {
                removeLockedNodeBefore(to, p);
                lockedlist[to].nodes[p].tokens = (total - tokens);
                return true;
            } else if(total == tokens) {
                removeLockedNode(to, p);
                return true;
            }
            p = lockedlist[to].nodes[p].next;
        }
        return false;
    }
}