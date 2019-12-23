var dd = function dd(string) {
  console.log(string);
};

var Calculator =
/*#__PURE__*/
function () {
  function Calculator(balance, apr, days, payment) {
    if (payment === void 0) {
      payment = 0;
    }

    this.balance = balance;
    this.apr = apr;
    this.days = days;
    this.payment = payment;
    this.option = payment === 0 ? 'Min.' : payment;
    this.error = [];
  }

  var _proto = Calculator.prototype;

  _proto.getMonthlyInterestRate = function getMonthlyInterestRate() {
    var dailyPercentage = this.apr / 365;
    var dailyInterest = dailyPercentage * this.balance;
    this.monthlyInterest = dailyInterest * this.days;
    dd('Monthly Interest: ' + this.monthlyInterest);
  };

  _proto.getMinimumPayment = function getMinimumPayment() {
    var minimumPrincipalPayment = this.balance * 0.01; // 1%

    this.minimumMonthlyPayment = minimumPrincipalPayment + this.monthlyInterest;
    dd('Minimum payment: ' + this.minimumMonthlyPayment);
    dd('Money towards principal is: ' + minimumPrincipalPayment);
  };

  _proto.getNextMonthBalance = function getNextMonthBalance() {
    var minPrincipalPayment = this.minimumMonthlyPayment - this.monthlyInterest;
    this.nextMonthBalance = this.balance - minPrincipalPayment;
    dd('Current balance: ' + this.balance);
    dd('Next balance paying Min.: ' + this.nextMonthBalance);
  } // User related methods
  ;

  _proto.getUserPayment = function getUserPayment() {
    this.userPrincipalPayment = this.payment - this.monthlyInterest;
    dd('User payment: ' + this.payment);
    dd('Money towards principal is: ' + this.userPrincipalPayment);
  };

  _proto.getUserNextMonthBalance = function getUserNextMonthBalance() {
    this.nextMonthBalance = this.balance - this.userPrincipalPayment;
    dd('Current balance: ' + this.balance);
    dd('Next balance paying more than Min.: ' + this.nextMonthBalance);
  };

  _proto.init = function init() {
    this.getMonthlyInterestRate();

    if (this.payment > 0 && this.monthlyInterest > this.payment) {
      this.error.push("Payment must be greater than the monthly interest rate of " + this.monthlyInterest + ".");
    }

    if (_.size(this.error) === 0) {
      if (this.payment > 0) {
        this.getUserPayment();
        this.getUserNextMonthBalance();
      } else {
        this.getMinimumPayment();
        this.getNextMonthBalance();
      }

      dd("End of option " + this.option + " payment.\n        ========================================");
      return this.nextMonthBalance;
    } else {
      _.each(this.error, function (value) {
        dd(value);
      });
    }
  };

  return Calculator;
}();

var bal = 6893.72;
var balance = bal;
var payment = 600;
var apr = 0.1865;
var counter = 1;
var dataBill = [];
dataBill.push(balance);

while (balance > 0) {
  dd(counter + " - Month");

  var _month = new Calculator(balance, apr, 30, payment);

  balance = _month.init();

  if (balance > 0) {
    dataBill.push(balance);
  }

  counter++;
}

dd('payment option 1: ' + dataBill); // reset data

balance = bal;
counter = 0;
payment = 245;
var dataBill2 = [];
dataBill2.push(balance);

while (balance > 0) {
  dd(counter + " - Month");

  var _month2 = new Calculator(balance, apr, 30, payment);

  balance = _month2.init();

  if (balance > 0) {
    dataBill2.push(balance);
  }

  counter++;
}

dd('payment option 2: ' + dataBill2); // reset data

balance = bal;
counter = 0;
payment = 177;
var dataBill3 = [];
dataBill3.push(balance);

while (balance > 0) {
  dd(counter + " - Month");

  var _month3 = new Calculator(balance, apr, 30, payment);

  balance = _month3.init();

  if (balance > 0) {
    dataBill3.push(balance);
  }

  counter++;
}

dd('payment option 3: ' + dataBill3); // draw graph

var ctx = $('#myChart');
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var d = new Date(); // graph start month

var year = d.getFullYear();
var month = d.getMonth();
var labelsDates = [];
var labelDate = new Date(year, month);
var labelMonth = month;
var labelYear = year;

_.each(dataBill, function () {
  labelsDates.push(monthNames[labelMonth] + ' ' + labelYear.toString().substring(2, 4));

  if (labelMonth < 11) {
    labelMonth++;
  } else {
    labelYear++;
    labelMonth = 0;
  }

  labelDate.setFullYear(labelYear);
  labelDate.setMonth(labelMonth);
});

dd(labelsDates); // second payment option

var labelsDates2 = [];
labelMonth = month;
labelYear = year;

_.each(dataBill2, function () {
  labelsDates2.push(monthNames[labelMonth] + ' ' + labelYear.toString().substring(2, 4));

  if (labelMonth < 11) {
    labelMonth++;
  } else {
    labelYear++;
    labelMonth = 0;
  }

  labelDate.setFullYear(labelYear);
  labelDate.setMonth(labelMonth);
});

dd(labelsDates2); // third payment option

var labelsDates3 = [];
labelMonth = month;
labelYear = year;

_.each(dataBill3, function () {
  labelsDates3.push(monthNames[labelMonth] + ' ' + labelYear.toString().substring(2, 4));

  if (labelMonth < 11) {
    labelMonth++;
  } else {
    labelYear++;
    labelMonth = 0;
  }

  labelDate.setFullYear(labelYear);
  labelDate.setMonth(labelMonth);
});

dd(labelsDates3);
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',
  // The data for our dataset
  data: {
    labels: labelsDates3,
    datasets: [{
      label: '$600',
      backgroundColor: 'rgb(242, 171, 47,0.5)',
      borderColor: 'orange',
      data: dataBill
    }, {
      label: '$245',
      backgroundColor: 'rgb(242, 171, 47,0.5)',
      borderColor: 'red',
      data: dataBill2
    }, {
      label: '$177',
      backgroundColor: 'rgb(242, 171, 47,0.5)',
      borderColor: 'purple',
      data: dataBill3
    }]
  },
  // Configuration options go here
  options: {}
});