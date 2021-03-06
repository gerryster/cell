
  define(function() {
    var testRender;
    testRender = function(render, expectedInnerHTML) {
      var NewCell, instance, render_spy;
      render_spy = sinon.spy(render);
      NewCell = cell.extend({
        render: render_spy
      });
      instance = new NewCell();
      strictEqual(instance.el.innerHTML, expectedInnerHTML, "@el.innerHTML");
      ok(render_spy.calledOnce, 'called once');
      return ok(render_spy.calledOn(instance), 'called with "this" set to cell instance');
    };
    return {
      "called with cell renderHelper (cell::_)": function() {
        var NewCell, instance, render;
        NewCell = cell.extend({
          render: render = sinon.spy()
        });
        instance = new NewCell();
        debugger;
        ok(render.calledOnce, 'render() called once');
        return ok(render.getCall(0).calledWith(cell.prototype._), 'render() was passed cell.prototype._ (cell render helper)');
      },
      "-> <NOT AN ARRAY>": function() {
        var invalid, _i, _len, _ref, _results;
        _ref = [void 0, null, (function() {}), 5, 'testString', document.createElement('a')];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          invalid = _ref[_i];
          _results.push((function(invalid) {
            return testRender((function() {
              return invalid;
            }), "");
          })(invalid));
        }
        return _results;
      },
      "-> []": function() {
        return testRender((function() {
          return [];
        }), "");
      },
      "-> [ undefined, null, (->) ]": function() {
        return testRender((function() {
          return [void 0, null, (function() {})];
        }), "");
      },
      "-> [ <number>, <string> ]": function() {
        return testRender((function() {
          return [5, 'testString'];
        }), "5testString");
      },
      "-> [ <DOM NODE> ]": function() {
        return testRender((function() {
          return [document.createElement('a')];
        }), "<a></a>");
      },
      "-> [ <DOM NODE>, <string>, <number> ]": function() {
        return testRender((function() {
          return [document.createElement('a'), 'testString', 7];
        }), "<a></a>testString7");
      }
    };
  });
