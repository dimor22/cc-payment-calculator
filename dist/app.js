// CALCULATOR CONSTS
var d = new Date(); // graph start month

var year = d.getFullYear();
var month = d.getMonth();
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var bal = 6893.72;
var apr = 0.1865;
numeral.defaultFormat('0,0'); // HELPER FUNCTIONS

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


function calculateGraphData(balance, payment, apr, graphData, output) {
  var counter = 1;

  while (balance > 0) {
    dd(counter + " - Month");

    var _month = new Calculator(balance, apr, 30, payment);

    var monthlyObj = _month.init();

    balance = monthlyObj.nextMonthBalance;

    if (balance > 0) {
      graphData.push(balance);
      output.push(_.concat([{
        text: 'Month - ',
        value: counter
      }], monthlyObj.output));
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
    this.output = [];
  }

  var _proto = Calculator.prototype;

  _proto.getMonthlyInterestRate = function getMonthlyInterestRate() {
    var dailyPercentage = this.apr / 365;
    var dailyInterest = dailyPercentage * this.balance;
    this.monthlyInterest = dailyInterest * this.days;
    dd('Monthly Interest: ' + this.monthlyInterest);
    this.output.push({
      text: 'Monthly Interest:',
      value: this.monthlyInterest
    });
  };

  _proto.getMinimumPayment = function getMinimumPayment() {
    var minimumPrincipalPayment = this.balance * 0.01; // 1%

    this.minimumMonthlyPayment = minimumPrincipalPayment + this.monthlyInterest;
    dd('Minimum payment: ' + this.minimumMonthlyPayment);
    this.output.push({
      text: 'Minimum payment:',
      value: this.minimumMonthlyPayment
    });
    dd('Money towards principal is: ' + minimumPrincipalPayment);
    this.output.push({
      text: 'Money towards principal is:',
      value: minimumPrincipalPayment
    });
  };

  _proto.getNextMonthBalance = function getNextMonthBalance() {
    var minPrincipalPayment = this.minimumMonthlyPayment - this.monthlyInterest;
    this.nextMonthBalance = this.balance - minPrincipalPayment;
    dd('Current balance: ' + this.balance);
    this.output.push({
      text: 'Current balance:',
      value: this.balance
    });
    dd('Next balance paying Min.: ' + this.nextMonthBalance);
    this.output.push({
      text: 'Next balance:',
      value: this.nextMonthBalance
    });
  } // User related methods
  ;

  _proto.getUserPayment = function getUserPayment() {
    this.userPrincipalPayment = this.payment - this.monthlyInterest;
    dd('User payment: ' + this.payment);
    this.output.push({
      text: 'User payment:',
      value: this.payment
    });
    dd('Money towards principal is: ' + this.userPrincipalPayment);
    this.output.push({
      text: 'Money towards principal is:',
      value: this.userPrincipalPayment
    });
  };

  _proto.getUserNextMonthBalance = function getUserNextMonthBalance() {
    this.nextMonthBalance = this.balance - this.userPrincipalPayment;
    dd('Current balance: ' + this.balance);
    this.output.push({
      text: 'Current balance:',
      value: this.balance
    });
    dd('Next balance paying more than Min.: ' + this.nextMonthBalance);
    this.output.push({
      text: 'Next balance:',
      value: this.nextMonthBalance
    });
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
      return {
        nextMonthBalance: this.nextMonthBalance,
        output: this.output
      };
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
  payment: 600,
  data: [],
  labels: [],
  color: 'green',
  label: '$600',
  output: []
}, {
  balance: bal,
  payment: 500,
  data: [],
  labels: [],
  color: 'orange',
  label: '$500',
  output: []
}, {
  balance: bal,
  payment: 400,
  data: [],
  labels: [],
  color: 'blue',
  label: '$400',
  output: []
}, {
  balance: bal,
  payment: 245,
  data: [],
  labels: [],
  color: 'purple',
  label: '$250',
  output: []
}, {
  balance: bal,
  payment: 177,
  data: [],
  labels: [],
  color: 'red',
  label: '$177',
  output: []
}]; // SET PAYMENT AMOUNTS DATA AND LABELS

_.each(paymentAmounts, function (amount) {
  amount.data.push(bal);
  calculateGraphData(bal, amount.payment, apr, amount.data, amount.output);
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
/**
 * OUTPUT CODE
 */

$(function () {
  console.log(paymentAmounts[0].output);

  _.each(paymentAmounts, function (payment) {
    var div = document.createElement('div');
    document.getElementById('history').appendChild(div);

    _.each(payment.output, function (month) {
      var table = document.createElement('table');
      div.appendChild(table);

      _.each(month, function (line) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = line.text;
        var td2 = document.createElement('td');
        tr.appendChild(td2);
        td2.innerHTML = line.value;
      });
    });
  }); //historySection.html(lists);
  //console.log(lists);

});