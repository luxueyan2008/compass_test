(function() {
  var demoTask;

  $(function() {
    var demoTask, food, foods, test, _i, _len;
    demoTask = function(start, end) {
      return end - start;
    };
    foods = ['broccoli', 'spinach', 'chocolate'];
    for (_i = 0, _len = foods.length; _i < _len; _i++) {
      food = foods[_i];
      if (food !== 'chocolate') {
        eat(food);
      }
    }
    return test = function(x) {
      return x * 2;
    };
  });

  demoTask = function(start2, end) {
    return end - start2;
  };

}).call(this);
