// this is a fixture file
let helloWorld = require('hello-world'); if (helloWorld && helloWorld.__esModule) helloWorld = helloWorld.default;

       const test = () => {
  const res = helloWorld()
  console.log(res)
}

module.exports.test = test