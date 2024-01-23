let votingSystemContract;
let userAccount;

window.addEventListener('load', async function() {
    // Check if Web3 has been injected by the browser (Mist/MetaMask)
    if (window.ethereum) {
        // Use the browser's ethereum provider
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            userAccount = web3.eth.accounts[0];
            startApp();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        userAccount = web3.eth.accounts[0];
        startApp();
    } else {
        console.log('No web3? You should consider trying MetaMask!');
    }
});

function startApp() {
    const contractAddress = "0xfA9405a92E6570dA8D11E2195660d0769677654E"; // Replace with your contract's address
    const contractABI = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "admin",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "candidateList",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "hasVoted",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "voteStarted",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "votesReceived",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newAdmin",
              "type": "address"
            }
          ],
          "name": "changeAdmin",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            }
          ],
          "name": "addCandidate",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "startVote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "endVote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "candidate",
              "type": "string"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "candidate",
              "type": "string"
            }
          ],
          "name": "voteCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ]; // Replace with your contract's ABI

    votingSystemContract = new web3.eth.Contract(contractABI, contractAddress);

    // Listen for events emitted from the contract
    votingSystemContract.events.VoteCast({}, (error, event) => {
        console.log(event);
        // Refresh the vote count when a new vote is cast
        fetchResults();
    });
}

async function addCandidate() {
    const candidateName = document.getElementById('newCandidate').value;
    votingSystemContract.methods.addCandidate(candidateName).send({ from: userAccount })
    .then(result => {
        console.log(result);
    }).catch(err => {
        console.error(err);
    });
}

async function startVote() {
    votingSystemContract.methods.startVote().send({ from: userAccount })
    .then(result => {
        console.log(result);
    }).catch(err => {
        console.error(err);
    });
}

async function endVote() {
    votingSystemContract.methods.endVote().send({ from: userAccount })
    .then(result => {
        console.log(result);
    }).catch(err => {
        console.error(err);
    });
}

async function voteForCandidate() {
    const candidateName = document.getElementById('candidateToVote').value;
    votingSystemContract.methods.vote(candidateName).send({ from: userAccount })
    .then(result => {
        console.log(result);
    }).catch(err => {
        console.error(err);
    });
}

async function fetchResults() {
    const resultsDisplay = document.getElementById('resultsDisplay');
    resultsDisplay.innerHTML = '';
    
    const candidatesCount = await votingSystemContract.methods.getCandidatesCount().call();
    for (let i = 0; i < candidatesCount; i++) {
        const candidate = await votingSystemContract.methods.candidateList(i).call();
        const voteCount = await votingSystemContract.methods.voteCount(candidate).call();

        const candidateElement = document.createElement('div');
        candidateElement.innerHTML = `${candidate}: ${voteCount}`;
        resultsDisplay.appendChild(candidateElement);
    }
}
