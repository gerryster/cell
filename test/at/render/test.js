(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  define(function() {
    return function(done) {
      var html;
      html = __bind(function(sel) {
        return this.$(sel).html();
      }, this);
      equal(html('.RenderCell > .booleanFalse'), "");
      equal(html('.RenderCell > .undefined'), "");
      equal(html('.RenderCell > .null'), "");
      equal(html('.RenderCell > .number'), "5");
      equal(html('.RenderCell > .numberZero'), "0");
      equal(this.$('.RenderCell > .list > li').length, 3);
      equal(html('.RenderCell > .list > .li0'), "10, Passed input list: true");
      equal(html('.RenderCell > .list > .li1'), "20, Passed input list: true");
      equal(html('.RenderCell > .list > .li2'), "30, Passed input list: true");
      equal(html('.RenderCell > .node'), '<a href="www.google.com">blargo</a>');
      equal(html('#anotherCellId.AnotherCell.anotherCellClass'), "id:anotherCellId class:anotherCellClass options.foo:bar collection:collection_val model:model_val");
      equal(html('#anotherCellByNameId.AnotherCellByName.anotherCellByNameClass'), "id:anotherCellByNameId class:anotherCellByNameClass options.foo:bar2 collection:collection_val2 model:model_val2");
      equal(html('.RenderCell > .afterRender'), 'afterRender');
      return done();
    };
  });
}).call(this);
