const axios = require("axios");

const heroku = "https://c-clicker-api.herokuapp.com/teams";
const localhost = "http://localhost:8000/teams";

const teams = [
  {
    name: "Javascript",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png"
  },
  {
    name: "PHP",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/711px-PHP-logo.svg.png"
  },
  {
    name: "Golang",
    logo:
      "https://sdtimes.com/wp-content/uploads/2018/02/golang.sh_-490x490.png"
  },
  {
    name: "Python",
    logo: "https://www.stickpng.com/assets/images/5848152fcef1014c0b5e4967.png"
  }
];

teams.forEach(team => {
  axios.post(localhost, team).then(res => console.log(res.status));
});
