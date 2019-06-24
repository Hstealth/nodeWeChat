const superagent = require('superagent')

function req(url, method, params, data, cookies) {

  return new Promise(function (resolve, reject) {
    superagent(method, url)
      .query(params)
      .send(data)
      .end(function (err, response) {
        if (err) {
          reject(err)
        }
        resolve(response)
      })

  })
}
module.exports = req
