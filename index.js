const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const { BadgeFactory } = require("gh-badges");

const badgeObject = new BadgeFactory(); 

const writeFileAsync = util.promisify(fs.writeFile);

function askUser() {
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your GitHub name?",
            name: "userName"
        },
        {
            type: "input",
            message: "What is the project name?",
            name: "projectN"
        },
        {
            type: "input",
            message: "Description?",
            name: "desc"
        },
        {
            type: "input",
            message: "Table of contents?",
            name: "tabC"
        },
        {
            type: "input",
            message: "How to installation?",
            name: "install"
        },
        {
            type: "input",
            message: "Usage?",
            name: "usage"
        },
        {
            type: "input",
            message: "License?",
            name: "license"
        },
        {
            type: "input",
            message: "Contributing?",
            name: "contr"
        },
        {
            type: "input",
            message: "Tests?",
            name: "tests"
        },
        {
            type: "input",
            message: "Questions?",
            name: "qest"
        },
        {
            type: "input",
            message: "First text on the badge?",
            name: "badgeFirstT"            
        },
        {
            type: "input",
            message: "Second text on the badge?",
            name: "badgeSecT"
        },
        {
            type: "list",
            message: "What color do you like on badge?",
            name: "badgeColor",
            choices: [
                "green",
                "red",
                "orange",
                "yellow",
                "blue"
            ]
        },
        {
            type: "input",
            message: "What is your e-mail?",
            name: "userEmail"
        }

    ])
}// END of askUser

function getGitHubInfo(name){
    const queryUrl = `https://api.github.com/users/${name}/repos?per_page=100`;
return axios.get(queryUrl);

}// END of gitHubInfo

function createBadges(firstText, secondText, color){

const format = {
  text: [firstText, secondText],
  color: color,
  template: 'flat',
}
const newBadge = badgeObject.create(format);

return newBadge;

} // END of createBadges

function generateReadMe(info, userPic, badges){
return `
# ${info.projectN}
# Description
${info.desc}
# Table of Contents
${info.tabC}
# Installation
${info.install}
# Usage
${info.usage}
# License
${info.license}
# Contributing
${info.contr}
# Tests
${info.tests}
# Questions
${info.qest}
# Contact
<img src="${userPic}" alt="userPic" width="150" height="150">
${info.userEmail} ${badges}
`
} // END of generateReadme

async function buildIt(){
    try{

        const userInfo = await askUser(); 

        const gitHubInfo = await getGitHubInfo(userInfo.userName);
        const {avatar_url : myPic} = gitHubInfo.data[0].owner       // destructor for picture

        const myBadge = await createBadges(userInfo.badgeFirstT, userInfo.badgeSecT, userInfo.badgeColor);

        await writeFileAsync(`${userInfo.userName}.md` , generateReadMe(userInfo, myPic, myBadge))

    } catch(error){ // catch all exeception
        console.log("ERROR: " + error);
    }
}// END of async

buildIt();