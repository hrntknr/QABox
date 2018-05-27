pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract QABox is Ownable {
    struct Question {
        string question;
        string answer;
    }

    Question[] public questions;

    event QuestionPosted(string question, uint256 indexed postID);
    event QuestionsAnswered(string answer, uint256 indexed postID);

    function postQuestion(string question) public {
        uint256 postID = questions.length;
        questions.push(Question(question, ""));
        emit QuestionPosted(question, postID);
    }

    function getQuestionsLength() public view returns (uint256 length) {
        return questions.length;
    }

    function getQuestions(uint256 postID) public view returns (string question, string answer) {
        require(postID < questions.length);
        return (
            questions[postID].question,
            questions[postID].answer
        );
    }

    function answerQuestion(uint256 postID, string answer) public onlyOwner {
        require(postID < questions.length);
        // require(bytes(questions[postID].answer).length == 0);
        questions[postID].answer = answer;
        emit QuestionsAnswered(answer, postID);
    }
}
