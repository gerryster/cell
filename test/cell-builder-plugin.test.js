
  define(function() {
    var $fixture_container, load_fixture;
    $fixture_container = $('#qunit-fixture');
    load_fixture = function(html, cb) {
      var waitFor;
      $fixture_container.html(html);
      waitFor = function() {
        var $f, $fix;
        $fix = $('html', $('iframe', $fixture_container)[0].contentDocument);
        $f = function(sel) {
          return $(sel, $fix);
        };
        if ($f('body > *').length > 0) {
          return cb($f);
        } else {
          return setTimeout(waitFor, 20);
        }
      };
      return waitFor();
    };
    return {
      $afterEach: function() {
        return $fixture_container.html('');
      },
      'verifies a single JS and single CSS is created correctly': {
        async: function() {
          expect(5);
          return load_fixture('<iframe src="fixtures/cell-builder-plugin/index.html"></iframe>', function($f) {
            equal($f('body').html().trim(), '<div class="Mock">Mock: <div class="MockNested">MockNested</div></div>', "Should render Mock and MockNested Cells");
            equal($f('.Mock').css('color'), 'rgb(0, 0, 255)', "Should apply Mock css from all.css");
            equal($f('.MockNested').css('color'), 'rgb(255, 0, 0)', "Should apply MockNested css from all.css");
            equal($f('head > link[href*="Mock.css"]').length, 0, "Should NOT attach <link> for Mock.css");
            equal($f('head > link[href*="MockNested.css"]').length, 0, "Should NOT attach <link> for MockNested.css");
            return start();
          });
        }
      }
    };
  });
