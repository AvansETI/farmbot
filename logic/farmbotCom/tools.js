global.atob     = require("atob");

let axios       = require("axios").default;
let config      = require('../../config.json');
let validation  = require('./setup');
let movement    = require('./movement');

function renameTool(id, toolName)
{
  axios
  .put(API_URL + "/points/" + id, {
    headers: {
      'Authorization': `${validation.token}`
  },
    payload: {
      name: toolName
    }
})
  .then(function (resp) {
    console.log(`add tool...` + resp.name);
    })
  .catch(function (err) {

    console.log(`Bad tool data...!`);
 });
}

module.exports = {
  renameTool
}