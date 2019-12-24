// CALCULATOR CONSTS
const d = new Date(); // graph start month
const year = d.getFullYear();
const month = d.getMonth();
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


numeral.defaultFormat('$0,0.00');

// HELPER FUNCTIONS

/**
 *
 * @param string
 */
const dd = function (string) {
    console.log(string);
}

/**
 *
 * @param balance
 * @param counter
 * @param payment
 * @param apr
 * @param graphData
 */
function calculateGraphData(balance, payment, apr, graphData, output, payments) {
    let counter = 1;
    while (balance > 0) {
        dd(`${counter} - Month`);
        let month = new Calculator(balance, apr, 30, payment);

        let monthlyObj = month.init();
        balance = monthlyObj.nextMonthBalance;
        if (balance > 0 ) {
            graphData.push(balance);
            output.push(_.concat([{text: 'Month - ', value: counter}], monthlyObj.output));
            payments.push(monthlyObj.payment);
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
    let labelsDates = [];
    let labelDate = new Date(year, month);
    let labelMonth = month;
    let labelYear = year;

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
    let allValues = [];
    let lengths = [];
    _.each(paymentAmounts, function (amount) {
        allValues.push(amount.labels);
    });
    _.each(allValues, function (values) {
        lengths.push(values.length);
    });

    // GETS THE LONGEST SET OF LABELS
    graphdata.labels = allValues[_.indexOf(lengths, Math.max(...lengths))];

}

/**
 *
 * @param papymentAmounts
 * @param graphdata
 */
function prepareDatasets(papymentAmounts, graphdata) {
    graphdata.datasets = [];
    _.each(paymentAmounts, function (amount) {
        graphdata.datasets.push(
            {
                label: amount.label,
                backgroundColor: 'transparent',
                borderColor: amount.color,
                data: amount.data
            }
        )
    });
}


/**
 * CALCULATOR CLASS
 */
class Calculator {


    constructor(balance, apr, days, payment = 0) {
        this.balance = balance;
        this.apr = apr;
        this.days = days;
        this.payment = payment;
        this.option = payment === 0 ? 'Min.' : payment;
        this.error = [];
        this.output = [];
    }

    getMonthlyInterestRate() {
        const dailyPercentage = this.apr / 365;
        const dailyInterest = dailyPercentage * this.balance;
        this.monthlyInterest = dailyInterest * this.days;
        dd('Monthly Interest: ' + this.monthlyInterest);
        this.output.push({text: 'Monthly Interest:', value: this.monthlyInterest});
    }

    getMinimumPayment() {
        let payment = this.balance * 0.01;
        this.minimumPrincipalPayment = payment > 25 ? payment : 25; // 1% or $25 whatever is higher
        this.minimumMonthlyPayment = this.minimumPrincipalPayment + this.monthlyInterest;
        dd('Minimum payment: ' + this.minimumMonthlyPayment);
        this.output.push({text:'Minimum payment:', value:this.minimumMonthlyPayment});
        dd('Money towards principal is: ' + this.minimumPrincipalPayment);
        this.output.push({text:'Money towards principal is:', value: this.minimumPrincipalPayment});
    }

    getNextMonthBalance() {
        this.nextMonthBalance = this.balance - this.minimumMonthlyPayment;
        dd('Current balance: ' + this.balance);
        this.output.push({text: 'Current balance:', value: this.balance});
        dd('Next balance paying Min.: ' + this.nextMonthBalance);
        this.output.push({text: 'Next balance:', value: this.nextMonthBalance});
    }


    // User related methods

    getUserPayment() {
        this.userPrincipalPayment = this.payment - this.monthlyInterest;
        dd('User payment: ' + this.payment);
        this.output.push({text: 'User payment:', value: this.payment});
        dd('Money towards principal is: ' + this.userPrincipalPayment);
      this.output.push({text: 'Money towards principal is:', value: this.userPrincipalPayment});
    }

    getUserNextMonthBalance() {
        this.nextMonthBalance = this.balance - this.userPrincipalPayment;
        dd('Current balance: ' + this.balance);
      this.output.push({text: 'Current balance:', value: this.balance});
        dd('Next balance paying more than Min.: ' + this.nextMonthBalance);
      this.output.push({text: 'Next balance:', value: this.nextMonthBalance});
    }


    init() {

        this.getMonthlyInterestRate();

        if (this.payment > 0 && this.monthlyInterest > this.payment) {
            this.error.push(`Payment must be greater than the monthly interest rate of ${this.monthlyInterest}.`);
        }


        if (_.size(this.error) === 0) {

            if (this.payment > 0) {

                this.getUserPayment();
                this.getUserNextMonthBalance();

            } else {
                this.getMinimumPayment();
                this.getNextMonthBalance();
            }


            dd(`End of option ${this.option} payment.
        ========================================`);

            return {
              nextMonthBalance: this.nextMonthBalance,
              output: this.output,
              payment: this.minimumMonthlyPayment || this.userPrincipalPayment
            }

        } else {
            _.each(this.error, function (value) {
                dd(value);
            })
        }

    }


}

let paymentAmounts = [
    {
        balance: 6893.72,
        apr: 0.1865,
        payment: 600,
        data: [],
        labels: [],
        color: 'green',
        label: 'Wells CC',
        output: [],
        payments: []
    },
    {
        balance: 6999,
        apr: 0.1174,
        payment: 177,
        data: [],
        labels: [],
        color: 'orange',
        label: 'Wells Loan',
        output: [],
        payments: []
    },
    {
        balance: 2935,
        apr: 0.2149,
        payment: 200,
        data: [],
        labels: [],
        color: 'blue',
        label: 'Barcley',
        output: [],
        payments: []
    },
    {
        balance: 900.54,
        apr: 0.2049,
        payment: 300,
        data: [],
        labels: [],
        color: 'purple',
        label: 'Discovery',
        output: [],
        payments: []
    },
    {
        balance: 1804.64,
        apr: 0.1674,
        payment: 200,
        data: [],
        labels: [],
        color: 'red',
        label: 'Citi',
        output: [],
        payments: []
    }
];

// SET PAYMENT AMOUNTS DATA AND LABELS
_.each(paymentAmounts, function (amount) {
    amount.data.push(amount.balance);
    calculateGraphData(amount.balance, amount.payment, amount.apr, amount.data, amount.output, amount.payments);
    amount.labels = getGraphLabels(amount.data);
});


/**
 * GRAPH CODE
 */

let graphdata = {};
getLongestLabelsArray(paymentAmounts, graphdata);
prepareDatasets(paymentAmounts, graphdata);


// DRAW GRAPHS
let ctx = $('#myChart');
let chart = new Chart(ctx, {
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

    let totalMonthly = [];
    let counter = 0;

  _.each(paymentAmounts, function (payment) {
      let div = document.createElement('div');
      document.getElementById('history').appendChild(div);

      _.each(payment.payments, function(amount) {
          let num = _.isNaN(totalMonthly[counter]) ? 0 : totalMonthly[counter];
        totalMonthly[counter] = num + amount;
        counter++;
      });

      counter = 0;


      _.each(payment.output, function (month) {
          let table = document.createElement('table');
          div.appendChild(table);
          _.each(month, function (line) {
              let tr = document.createElement('tr');
              table.appendChild(tr);
              let td = document.createElement('td');
              tr.appendChild(td);
              td.innerHTML = line.text;
              let td2 = document.createElement('td');
              tr.appendChild(td2);
              let numberFormatted = numeral(line.value);
              td2.innerHTML = numberFormatted.format();

          });
      });
  });
  //historySection.html(lists);
    console.log(totalMonthly);
});