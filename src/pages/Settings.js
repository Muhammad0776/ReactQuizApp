import "../global.css"
import { Box } from "@mui/system";
import { Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
import TextFieldComp from "../components/TextFieldComp";
import useAxios from "../hooks/useAxios";
// import { amber } from '@mui/material/colors';

const Settings = () => {
  const {response, error, loading} = useAxios({url: "/api_category.php"});
  const navigate = useNavigate();
 
    if(loading) {
      return (
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      )
    }

    if(error) {
      return (
        <Typography variant="h6" mt={20} fontWeight="bold" color="red">
          Some Went Wrong!
        </Typography>
      )
    }

    const difficultyOptions = [
      {id: "easy", name: "Easy"},
      {id: "medium", name: "Medium"},
      {id: "hard", name: "Hard"},
    ]

    const typeOptions = [
      {id: "multiple", name: "Multiple Choice"},
      {id: "boolean", name: "True/False"},
    ]

    // Handle the submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/questions");
  };

  // const selectC = amber[100];

  return (
    <form onSubmit={handleSubmit}>
      <SelectField options={response.trivia_categories} label="Category secondary" color="secondary" focused />
      <SelectField options={difficultyOptions} label="Difficulty" />
      <SelectField options={typeOptions} label="Type" />
      <TextFieldComp />
      <Box mt={3} width="100%">
        <Button fullWidth variant="contained" type="submit">
          Get Started
        </Button>
      </Box>
    </form>
  );
};

export default Settings;
