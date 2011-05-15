define(['cell!./CellWithInit'], function(CellWithInit) {
  return {
    render: function(R) {
      return "" + (R(CellWithInit, {
        id: 'oneid',
        "class": 'one',
        foo: 'bar'
      })) + "\n" + (R(CellWithInit, {
        id: 'twoid',
        "class": 'two',
        foo: 'blarg'
      }));
    }
  };
});