import fs from "fs";
import chalk from "chalk";
import clipboardy from "clipboardy";
import inquirer from "./utils/inquirer.js";

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
console.clear();
console.log(
  chalk.bold("\tWelcome to ") +
    chalk.rgb(58, 221, 25).bold("NodeJs") +
    chalk.bold(" Clipboard 📋\n")
);

const question1 = {
  name: "value",
  type: "list",
  message: "What do you want to do?",
  choices: [
    {
      name: "Copy",
      value: "copy",
      checked: false,
    },
    {
      name: "Paste",
      value: "paste",
      checked: false,
    },
    {
      name: "Delete",
      value: "delete",
      checked: false,
    },
    {
      name: "show",
      value: "show",
      checked: false,
    },
    {
      name: "Exit",
      value: "exit",
      checked: false,
    },
  ],
};

const question2 = {
  name: "value",
  type: "input",
  message: "<Copy> (key) ",
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return "Enter the key of what you want to copy.";
    }
  },
};
const question3 = {
  name: "value",
  type: "input",
  message: "<Paste> (key) ",
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return "Enter what you want to set as the key to paste!";
    }
  },
};
const question4 = {
  name: "value",
  type: "input",
  message: "<Delete> (key) ",
  validate: function (value) {
    if (value.length) {
      return true;
    } else {
      return "Enter what you want to delete!";
    }
  },
};

(async () => {
  while (true) {
    const data = await inquirer.getChatInput(question1).then((answers) => {
      return answers;
    });
    if (data.value === "copy") {
      const input = await inquirer.getChatInput(question2).then((answers) => {
        return answers;
      });
      const key = input.value.toLowerCase();
      if (config[key] != undefined) {
        clipboardy.writeSync(config[key]);
        console.log(
          chalk.green(`✔`) +
            chalk.hex("#00ffaa")(`  ${key}  `) +
            `copied to your clipboard 📋`
        );
        console.log("\u200b\n\u200b");
      } else {
        console.log(
          chalk.yellow(`⚠`) +
            chalk.hex("#00ffaa")(`  ${key}  `) +
            `not found in the config file!`
        );
        console.log("\u200b\n\u200b");
      }
    } else if (data.value === "paste") {
      const input = await inquirer.getChatInput(question3).then((answers) => {
        return answers;
      });
      try {
        const key = input.value.toLowerCase().replace(/\s/g, "");
        const value = await clipboardy.read().catch((err) => {
          console.log(
            chalk.yellow("⚠ ") +
              chalk.red(
                " Unable to copy content from your clipboard. Make sure it is not empty!"
              )
          );
          process.exit(1);
        });
        config[key] = value;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
        console.log(
          chalk.green(`✔`) +
            chalk.hex("#00ffaa")(`  ${key}  `) +
            `pasted from your clipboard 📋`
        );
        console.log("\u200b\n\u200b");
      } catch (e) {
        console.log(
          chalk.yellow("⚠ ") +
            chalk.red(
              "Unable to paste anything from clipboard. Make sure your clipboard has something copied!"
            )
        );
      }
    } else if (data.value === "delete") {
      const input = await inquirer.getChatInput(question4).then((answers) => {
        return answers;
      });
      const key = input.value.toLowerCase();
      if (config[key] != undefined) {
        delete config[key];
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
        console.log(
          chalk.green(`✔`) +
            chalk.hex("#00ffaa")(`  ${key}  `) +
            `deleted from the config file!`
        );
        console.log("\u200b\n\u200b");
      } else {
        console.log(
          chalk.yellow(`⚠`) +
            chalk.hex("#00ffaa")(`  ${key}  `) +
            `not found in the config file!`
        );
        console.log("\u200b\n\u200b");
      }
    } else if (data.value === "show") {
      const keys = Object.keys(config);
      console.log(chalk.blue(keys.join(", ")));
      console.log("\u200b\n\u200b");
    } else if (data.value === "exit") {
      console.log(chalk.green(`✔`) + `  Exiting...`);
      console.log("\u200b\n\u200b");
      process.exit(0);
    }
  }
})();

/**
 * @copyright nandhu-44
 */