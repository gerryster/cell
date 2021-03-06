
  define(['./util/helpers'], function(_arg) {
    var NODE, nodeHTMLEquals, _;
    nodeHTMLEquals = _arg.nodeHTMLEquals;
    NODE = function(tag) {
      return document.createElement(tag);
    };
    _ = cell.prototype._;
    return {
      "_(<empty string, undefined, null, false, or function>)": function() {
        var invalid, _i, _len, _ref, _results;
        _ref = ['', void 0, null, (function() {})];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          invalid = _ref[_i];
          _results.push(equal(_(invalid), void 0, "" + (invalid === '' && '""' || invalid) + " results to undefined"));
        }
        return _results;
      },
      "_(htmlTagString:<string>) HTML tag with attributes": function() {
        return nodeHTMLEquals(_('<p id="myid" class="myclass" data-custom="myattr">'), '<p class="myclass" data-custom="myattr" id="myid"></p>');
      },
      "_(htmlTagString:<string>, children...:<DOM Nodes, cell, strings, numbers, or arrays>) with children": function() {
        return nodeHTMLEquals(_('<div>', NODE('span'), 'hello', [NODE('table'), 'world', 5, [NODE('div')]], 0, NODE('a')), "<div><span></span>hello<table></table>world5<div></div>0<a></a></div>");
      },
      "_(HAMLString:<string>) tag name, id, multiple classes": function() {
        return nodeHTMLEquals(_('p#myid.myclass.myclass2'), '<p class=" myclass myclass2" id="myid"></p>');
      },
      "_(HAMLString:<string>, children...:<DOM Nodes, strings, numbers, or arrays>) with children": function() {
        return nodeHTMLEquals(_('p#myid.myclass.myclass2', NODE('span'), 'hello', [NODE('table'), 'world', 5, [NODE('div')]], 0, NODE('a')), '<p class=" myclass myclass2" id="myid"><span></span>hello<table></table>world5<div></div>0<a></a></p>');
      },
      "_(HAMLString:<string>, children...:<NOT DOM NODES, STRINGS, NUMBERS, or ARRAYS>)": function() {
        return nodeHTMLEquals(_('p#myid.myclass.myclass2', void 0, null, (function() {})), '<p class=" myclass myclass2" id="myid"></p>');
      },
      "_(HAMLString:<string>, attrMap:<object>) with attribute map": function() {
        return nodeHTMLEquals(_('p#myid.myclass.myclass2', {
          "class": 'myclass3',
          'data-custom': 'myattr',
          'data-custom2': 'myattr2'
        }), '<p class="myclass3 myclass myclass2" data-custom="myattr" data-custom2="myattr2" id="myid"></p>');
      },
      "_(HAMLString:<string>, attrMap:<object>, children...:<DOM Nodes, strings, numbers, or arrays>) with attribute map and children": function() {
        return nodeHTMLEquals(_('p', {
          'data-custom': 'myattr',
          'data-custom2': 'myattr2'
        }, NODE('span'), 'hello', [NODE('table'), 'world', 5, [NODE('div')]], 0, NODE('a')), '<p data-custom="myattr" data-custom2="myattr2"><span></span>hello<table></table>world5<div></div>0<a></a></p>');
      },
      "_(HAMLString:<string>, attrMap:<object>, children...:<NOT DOM NODES, STRINGS, NUMBERS, or ARRAYS>)": function() {
        return nodeHTMLEquals(_('p', {
          'data-custom': 'myattr',
          'data-custom2': 'myattr2'
        }, void 0, null, (function() {})), '<p data-custom="myattr" data-custom2="myattr2"></p>');
      },
      "_(cell:<cell>, options:<object>)": function() {
        var NewCell;
        NewCell = cell.extend({
          render: function() {
            return [NODE(this.options.tagName)];
          }
        });
        return nodeHTMLEquals(_(NewCell, {
          tagName: 'span'
        }), '<div><span></span></div>');
      }
    };
  });
