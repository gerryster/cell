
  define({
    'extend(<NOT AN OBJECT>) throws an error': function() {
      var invalid, whenStr, _i, _len, _ref, _results;
      _ref = [7, "string", (function() {})];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        invalid = _ref[_i];
        whenStr = "expected error thrown, when argument is " + invalid;
        try {
          cell.extend(invalid);
          _results.push(ok(false, whenStr));
        } catch (e) {
          _results.push(equal(e, "cell.extend(): expects an object {render,init,name}", whenStr));
        }
      }
      return _results;
    },
    'extend({tag:<string>,init:<function>,render:<function>,name:String}): init, render, name are optional': function() {
      var NewCell, init, name, render, tag, whenStr, _i, _len, _ref, _results;
      _ref = [void 0, null, "<span>"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        _results.push((function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = [void 0, null, "exampleName"];
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            name = _ref2[_j];
            _results2.push((function() {
              var _k, _len3, _ref3, _results3;
              _ref3 = [void 0, null, (function() {})];
              _results3 = [];
              for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
                init = _ref3[_k];
                _results3.push((function() {
                  var _l, _len4, _ref4, _results4;
                  _ref4 = [void 0, null, (function() {})];
                  _results4 = [];
                  for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
                    render = _ref4[_l];
                    whenStr = "when " + (JSON.stringify({
                      init: init,
                      render: render,
                      name: name
                    }));
                    NewCell = cell.extend({
                      tag: tag,
                      init: init,
                      render: render,
                      name: name
                    });
                    ok(NewCell.prototype instanceof cell, "prototype is an instanceof cell, " + whenStr);
                    equal(NewCell.prototype.tag, tag, "prototype.tag is the name passed in cell.extend(" + whenStr + ")");
                    equal(NewCell.prototype.name, name, "prototype.name is the name passed in cell.extend(" + whenStr + ")");
                    equal(NewCell.prototype.init, init, "prototype.init is the init function passed in cell.extend(" + whenStr + ")");
                    equal(NewCell.prototype.render, render, "prototype.render is the render function passed in cell.extend(" + whenStr + ")");
                    _results4.push(ok((new NewCell()) instanceof cell, "instance is an instanceof newly created cell, when cell.extend(" + whenStr + ")"));
                  }
                  return _results4;
                })());
              }
              return _results3;
            })());
          }
          return _results2;
        })());
      }
      return _results;
    },
    'extend({init:<NOT A FUNCTION>, render:<NOT A FUNCTION>}), throws an error': function() {
      var init, render, vals, whenStr, _i, _len, _results;
      vals = [5, "string", [], {}, (function() {}), void 0, null];
      _results = [];
      for (_i = 0, _len = vals.length; _i < _len; _i++) {
        init = vals[_i];
        _results.push((function() {
          var _j, _len2, _results2;
          _results2 = [];
          for (_j = 0, _len2 = vals.length; _j < _len2; _j++) {
            render = vals[_j];
            if (!(!((typeof init === 'function' || (init === null || init === (void 0))) && (typeof render === 'function' || (render === null || render === (void 0)))))) {
              continue;
            }
            whenStr = "expected error thrown, when typeof init == " + (typeof init) + " and typeof render == " + (typeof render);
            try {
              cell.extend({
                init: init,
                render: render
              });
              _results2.push(ok(false, whenStr));
            } catch (e) {
              _results2.push(equal(e, "cell.extend(): expects {render,init} to be functions", whenStr));
            }
          }
          return _results2;
        })());
      }
      return _results;
    },
    'extend({}), inherits parent cell attributes': function() {
      var JuniorBlargo, SeniorBlargo;
      SeniorBlargo = cell.extend({
        name: 'SeniorBlargo',
        key1: 'val1',
        key2: 'val2'
      });
      JuniorBlargo = SeniorBlargo.extend();
      equal(SeniorBlargo.prototype.name, JuniorBlargo.prototype.name, 'Same name');
      equal(SeniorBlargo.prototype.key1, JuniorBlargo.prototype.key1, 'Same attribute key1');
      return equal(SeniorBlargo.prototype.key2, JuniorBlargo.prototype.key2, 'Same attribute key2');
    },
    'extend({}), inherits parent cell attributes are overrideable': function() {
      var JuniorBlargo, SeniorBlargo;
      SeniorBlargo = cell.extend({
        name: 'SeniorBlargo',
        toBeOverriden: 'val'
      });
      JuniorBlargo = SeniorBlargo.extend({
        name: 'JuniorBlargo',
        toBeOverriden: 'val2'
      });
      equal(JuniorBlargo.prototype.name, 'JuniorBlargo', 'Same name');
      return equal(JuniorBlargo.prototype.toBeOverriden, 'val2', 'Same attribute key1');
    }
  });
