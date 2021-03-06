pragma solidity ^0.4.14;

import './SafeMath.sol';

contract Gamble {
    using SafeMath for uint;


    // Gambler Info
    struct Gambler {
        address id;
        uint balance;
        uint[] historyResult;
        uint[] historyTime;
    }
    address public owner;
    mapping(address => Gambler) public gamblers;


    uint totalGamePlayed = 0;
    uint maxGamblerInGame = 2;
    address[] currentGameGamblers;
    bool inGame = false;

    function Gamble() public {
        owner = msg.sender;
    }

    // Event sending out the game result
    event GameEndResult(address from, address to, uint amount, uint dice);

    // Event when number of gamer changed
    event UpdateGamerNum(uint num);

    // Event when balance changed
    event UpdateGamerBalance(address to, uint num);

    // Event when contract owner receive tips from other
    event OwnerReceivedTips(address from, uint num);


    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier gamblerExist(address gamblerId) {
        var gambler = gamblers[gamblerId];
        assert(gambler.id != 0x0);
        _;
    }

    // Inorder to join game, number of current joined gamblers should be less than maxGamblerInGame
    // Also a gambler should have a least 1 ether in the balance
    modifier qualifiedJoin(address gamblerId) {
        assert(currentGameGamblers.length < maxGamblerInGame);

        var gambler = gamblers[gamblerId];
        uint totalAmount = 0;
        if (gambler.id != 0x0) {
            totalAmount = gambler.balance.add(msg.value);
        } else {
            totalAmount = msg.value;
        }
        assert(totalAmount >= 1 ether);

        // check if the gamer have already joined
        for(uint i=0; i<currentGameGamblers.length; i++){
            assert(currentGameGamblers[i] != msg.sender);
        }
        _;
    }

    // To join game, a gambler must have 1 ether in the balance or pay 1 ether
    function joinGame() public payable qualifiedJoin(msg.sender) returns (uint totalGambler){
        address gamblerId = msg.sender;
        var gambler = gamblers[gamblerId];
        // Gambler exist in our record
        if (gambler.id != 0x0) {
            gambler.balance = gambler.balance.add(msg.value);
        } else{
            // Create a new gambler
            Gambler memory newGambler;
            newGambler.id = gamblerId;
            newGambler.balance = msg.value;
            gamblers[gamblerId] = newGambler;
        }
        if (msg.value > 0){
            UpdateGamerBalance(msg.sender, gamblers[gamblerId].balance);
        }

        currentGameGamblers.push(gamblerId);
        totalGambler = currentGameGamblers.length;
        UpdateGamerNum(totalGambler);
    }

    // Get gambler balance information
    function checkGamblerBalance(address gamblerId) public constant gamblerExist(gamblerId) returns(uint balance){
        balance = gamblers[gamblerId].balance;
    }

    // Check if gambler in game
    function checkGamblerInGame(address gamblerId) public constant returns(bool joined){
        joined = false;
        for(uint i=0; i<currentGameGamblers.length; i++){
            if(currentGameGamblers[i] == gamblerId){
                joined = true;
                break;
            }
        }

    }

    function getNumberOfGamer() public constant returns(uint numGamer){
        numGamer = currentGameGamblers.length;
    }

    // A gambler can quit game anytime before game start
    function quitGame() public returns(uint totalGambler){
        assert(inGame == false);

        uint idx = 0;
        bool exist = false;
        for(uint i=0; i<currentGameGamblers.length; i++){
            if(currentGameGamblers[i] == msg.sender){
                idx = i;
                exist = true;
                break;
            }
        }
        assert(exist == true);

        currentGameGamblers[idx] = currentGameGamblers[currentGameGamblers.length-1];
        currentGameGamblers.length--;
        totalGambler = currentGameGamblers.length;
        UpdateGamerNum(totalGambler);
    }

    // A gambler is allowed to withdraw balance if he is not in a game
    function withdraw() public gamblerExist(msg.sender) returns(uint amount){
        bool exist = false;
        for(uint i=0; i<currentGameGamblers.length; i++){
            if(currentGameGamblers[i] == msg.sender){
                exist = true;
                break;
            }
        }
        assert(exist == false);

        amount = gamblers[msg.sender].balance;
        gamblers[msg.sender].balance = 0;
        msg.sender.transfer(amount);
        UpdateGamerBalance(msg.sender, 0);
    }

    // tip the owner
    function tipOwner() public payable{
        owner.transfer(msg.value);
        OwnerReceivedTips(msg.sender, msg.value);
    }

    // Get a random value
    function _getRandomValue(uint upper, address gamblerId) private constant returns(uint rand){
        uint _seed = uint(keccak256(keccak256(block.blockhash(block.number), gamblerId), now));
        return _seed % upper;
    }

    // Calculate percent value
    function _percent(uint numerator, uint denominator, uint precision) private constant returns(uint quotient) {
         // caution, check safe-to-multiply here
        uint _numerator  = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }

    function getLastFiveGameResult(address gamblerId) public constant  gamblerExist(gamblerId) returns(uint[5] results){
        var gambler = gamblers[gamblerId];
        uint numGameResult = gambler.historyResult.length;
        if (numGameResult > 5){
            numGameResult = 5;
        }
        for(uint i=0; i<numGameResult; i++){
            results[i] = gambler.historyResult[numGameResult-1-i];
        }

    }
    // Start a Game
    function startGame() public onlyOwner{
        // Game can be start only when number of gamblers equal to maxGamblerInGame
        assert(currentGameGamblers.length == maxGamblerInGame);

        inGame = true;

        uint[] memory gamblerRandVal = new uint[](maxGamblerInGame);
        uint[] memory diceVal = new uint[](maxGamblerInGame);
        uint totalRandVal;
        uint totalMoney = 0;
        uint gameTime = now;
        uint i = 0;
        // Get a random value for each gamblers
        for(i=0; i<currentGameGamblers.length; i++){
            // Mimic a dice roll from 1~6
            gamblerRandVal[i] = _getRandomValue(6, currentGameGamblers[i]).add(1);
            diceVal[i] = gamblerRandVal[i];
            totalRandVal = totalRandVal.add(gamblerRandVal[i]);
            totalMoney = totalMoney.add(1 ether);
        }

        // Convert to percent value 
        for(i=0; i<currentGameGamblers.length; i++){
            uint resultPercent = _percent(gamblerRandVal[i], totalRandVal, 3);
            gamblerRandVal[i] = resultPercent;
        }

        // Split the money and record the game
        for(i=0; i<currentGameGamblers.length; i++){
            uint resultMoney = totalMoney.div(1000);
            resultMoney = resultMoney.mul(gamblerRandVal[i]);
            uint currentBalance = gamblers[currentGameGamblers[i]].balance;
            gamblers[currentGameGamblers[i]].balance = currentBalance.sub(1 ether).add(resultMoney);
            gamblers[currentGameGamblers[i]].historyResult.push(resultMoney);
            gamblers[currentGameGamblers[i]].historyTime.push(gameTime);
            // Send out the event for game result per user
            GameEndResult(msg.sender, currentGameGamblers[i], resultMoney, diceVal[i]);
            UpdateGamerBalance(currentGameGamblers[i], gamblers[currentGameGamblers[i]].balance);
        }

        // Clean the list and end the game
        currentGameGamblers.length = 0;
        inGame = false;
        UpdateGamerNum(0);

    }
    
}   