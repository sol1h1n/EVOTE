// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bool public voteStarted;
    mapping(address => bool) public hasVoted;
    mapping(string => uint) public votesReceived;
    string[] public candidateList;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function.");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the contract deployer as the admin
        voteStarted = false;
    }

    function changeAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
    }

    function addCandidate(string memory name) public onlyAdmin {
        candidateList.push(name);
        votesReceived[name] = 0;
    }

    function startVote() public onlyAdmin {
        voteStarted = true;
    }

    function endVote() public onlyAdmin {
        voteStarted = false;
    }

    function vote(string memory candidate) public {
        require(voteStarted, "Voting is not started yet.");
        require(!hasVoted[msg.sender], "You have already voted.");
        require(votesReceived[candidate] > 0, "Not a valid candidate.");
        votesReceived[candidate]++;
        hasVoted[msg.sender] = true;
    }

    function voteCount(string memory candidate) public view returns (uint) {
        return votesReceived[candidate];
    }
}
