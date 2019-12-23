// CALCULATOR CONSTS
var d = new Date(); // graph start month

var year = d.getFullYear();
var month = d.getMonth();
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var bal = 6893.72;
var apr = 0.1865; // HELPER FUNCTIONS

/**
 *
 * @param string
 */

var dd = function dd(string) {
  console.log(string);
};
/**
 *
 * @param balance
 * @param counter
 * @param payment
 * @param apr
 * @param graphData
 */


function calculateGraphData(balance, counter, payment, apr, graphData) {
  while (balance > 0) {
    dd(counter + " - Month");

    var _month = new Calculator(balance, apr, 30, payment);

    balance = _month.init();

    if (balance > 0) {
      graphData.push(balance);
    }

    counter++;
  }
}
/**
 *
 * @param paymentData
 * @returns {[]}
 */


function getGraphLabels(paymentData) {
  var labelsDates = [];
  var labelDate = new Date(year, month);
  var labelMonth = month;
  var labelYear = year;

  _.each(paymentData, function () {
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

  return labelsDates;
}
/**
 *
 * @param paymentAmounts
 * @param graphdata
 */


function getLongestLabelsArray(paymentAmounts, graphdata) {
  var allValues = [];
  var lengths = [];

  _.each(paymentAmounts, function (amount) {
    allValues.push(amount.labels);
  });

  _.each(allValues, function (values) {
    lengths.push(values.length);
  }); // GETS THE LONGEST SET OF LABELS


  graphdata.labels = allValues[_.indexOf(lengths, Math.max.apply(Math, lengths))];
}
/**
 *
 * @param papymentAmounts
 * @param graphdata
 */


function prepareDatasets(papymentAmounts, graphdata) {
  graphdata.datasets = [];

  _.each(paymentAmounts, function (amount) {
    graphdata.datasets.push({
      label: amount.label,
      backgroundColor: 'transparent',
      borderColor: amount.color,
      data: amount.data
    });
  });
}
/**
 * CALCULATOR CLASS
 */


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

var paymentAmounts = [{
  balance: bal,
  counter: 1,
  payment: 600,
  data: [],
  labels: [],
  color: 'green',
  label: '$600'
}, {
  balance: bal,
  counter: 1,
  payment: 500,
  data: [],
  labels: [],
  color: 'orange',
  label: '$500'
}, {
  balance: bal,
  counter: 1,
  payment: 400,
  data: [],
  labels: [],
  color: 'blue',
  label: '$400'
}, {
  balance: bal,
  counter: 1,
  payment: 245,
  data: [],
  labels: [],
  color: 'purple',
  label: '$250'
}, {
  balance: bal,
  counter: 1,
  payment: 177,
  data: [],
  labels: [],
  color: 'red',
  label: '$177'
}]; // SET PAYMENT AMOUNTS DATA AND LABELS

_.each(paymentAmounts, function (amount) {
  amount.data.push(bal);
  calculateGraphData(bal, amount.counter, amount.payment, apr, amount.data);
  amount.labels = getGraphLabels(amount.data);
});
/**
 * GRAPH CODE
 */


var graphdata = {};
getLongestLabelsArray(paymentAmounts, graphdata);
prepareDatasets(paymentAmounts, graphdata); // DRAW GRAPHS

var ctx = $('#myChart');
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',
  // The data for our dataset
  data: graphdata,
  // Configuration options go here
  options: {}
});