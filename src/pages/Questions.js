/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { Box } from "@mui/system";
import { Button, CircularProgress, Typography } from "@mui/material";
import React, {useState, useEffect} from "react";
import useAxios from "../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleScoreChange } from "../redux/actions";
import { decode } from "html-entities";

// Max random number is exclusive
 const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const Questions = () => {
  const {
    question_category,
    question_type,
    question_difficulty,
    amount_of_questions,
    score,
  } = useSelector(state => state);
  const navigate = useNavigate()
  const dispatch = useDispatch()


  // API's URL
  const apiUrl = `/api.php?amount=${amount_of_questions}`;
  if(question_category) {
    apiUrl = apiUrl.concat(`&category=${question_category}`);
  }
  if(question_difficulty) {
    apiUrl = apiUrl.concat(`&difficulty=${question_difficulty}`);
  }
  if(question_type) {
    apiUrl = apiUrl.concat(`&type=${question_type}`);
  }

  const { response, loading } = useAxios({ url: apiUrl });

  const [questionIndex, setQuestionIndex] = useState(0)
  const [options, setOptions] = useState([])

  useEffect(() => {
    
    if(response?.results.length) {
      const question = response.results[questionIndex];
      let answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length),
        0,
        question.correct_answer
      )
      setOptions(answers)
    }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, questionIndex])
  
//  Loads the next question
  if(loading) {
    return (
      <Box textAlign="center" mt={20}>
        <CircularProgress />
      </Box>
    )
  }

  const handleClickAnswer = (e) => {
    const question = response.results[questionIndex];
    if(e.target.textContent === question.correct_answer) {
       dispatch(handleScoreChange(score + 1)) 
    }

    if(questionIndex + 1 < response.results.length) {
      setQuestionIndex(questionIndex + 1)
    } else {
      navigate("/score")
    }
  }

  return ( 
    <Box>
      <Typography variant="h4">Questions {questionIndex + 1}</Typography>
      <Typography mt={5}>{decode(response.results[questionIndex].question)}</Typography>
      {options.map((data, id) => (
        <Box key={id} mt={5}>
          <Button onClick={handleClickAnswer} variant="contained" fullWidth>
            {decode(data)}
          </Button>
        </Box>
      ))}
      <Box mt={5}>Score {score} / {response.results.length}</Box>
    </Box>
  );
};

export default Questions;
