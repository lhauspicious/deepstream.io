'use strict'

const Cluster = require('../../tools/cluster')

const { defineSupportCode } = require('cucumber')

defineSupportCode(({ When, Given, Then, Before, After, BeforeAll, AfterAll }) => {

  Given(/"([^"]*)" permissions are used$/, (permissionType) => {
    global.cluster.updatePermissions(permissionType)
  })

  When(/^server (\S)* goes down$/, (server, done) => {
    global.cluster.stopServer(server - 1, done)
  })

  When(/^server (\S)* comes back up$/, (server, done) => {
    global.cluster.startServer(server - 1, done)
  })

  BeforeAll((callback) => {
    global.cluster = new Cluster(6001, 8001, !!process.env.LOG)
    global.cluster.on('started', callback)
    console.log('ello')
  })

  AfterAll((callback) => {
    setTimeout(() => {
      global.cluster.on('stopped', () => {
        callback()
      })
      global.cluster.stop()
    }, 100)
  })

})
