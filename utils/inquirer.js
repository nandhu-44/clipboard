import inquirer from "inquirer";

export default {
  getChatInput: (questions) => {
    return inquirer.prompt(questions);
  },
};
