{hasFlag, getFlagArg, isFlag} = require './util/server/commandflags.coffee'
findtests = require './util/server/findtests.coffee'
eventFormatters = require './util/client/qunit-event-formatters.coffee'

log = console.log
port = 8080
testsdir = __dirname+'/unit'
browserCmd = getFlagArg('-browser', 'b') or 'google-chrome'
debug = hasFlag '-debug', 'd'

{spawn} = require 'child_process'

# Find tests
testSpec = process.argv[process.argv.length-1]
findtests {spec:testSpec+'Test.coffee', dir:testsdir}, (tests) ->
   if tests.length <= 0
      log "No tests found for \"#{testSpec}\""
      process.exit 0

   testsurl = "http://localhost:#{port}/util/unit-runner.html?tests=#{(encodeURIComponent '/tests'+test for test in tests).join ','}"

   # Setup test result server
   results = (require './util/server/test-server').create
      testsDir: testsdir
      srcDir: __dirname+'/../src'
      depsDir: __dirname+'/../deps'
      mocksDir: __dirname+'/mocks'
      utilDir: __dirname+'/util/client'
      port: port

   for eventType in Object.getOwnPropertyNames eventFormatters
      # Listen for failure
      results.on eventType, (event) ->
         log l if l = eventFormatters[event.type](event)

   # Listen for completion
   results.on 'done', do->
      debugPrinted = false
      (event)->
         if not debugPrinted
            debugPrinted = true
            if debug
               log "\n*** DEBUG: Goto #{testsurl} ***\n"
            else
               browser.kill()
               process.exit 0

   browser = spawn(browserCmd,[testsurl])
