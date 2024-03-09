function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let categoryColours = [
  "red",
  "orange",
  "yellow",
  "green",
  "indigo",
  "blue",
  "violet",
];

let categories = [];
let budgets = [];
let sum = 0;

function getBudgets() {
  firebase.auth().onAuthStateChanged(user => {
      if(user) {
          let budgetsCollection = db.collection("users/" + user.uid + "/budgets");
          budgetsCollection.orderBy("date").onSnapshot(snapshot => {
              snapshot.docChanges().forEach(change => {
                  var doc = change.doc;
                  var category = doc.data().category;
                  var budget = doc.data().budget;
                  categories.push(category);
                  budgets.push(budget);
                  sum += parseInt(budget);
              });
          });
      }
  });
}

let ratios = [];

function getRatio() {

  for (var budget of budgets) {
    ratios.push(budget / sum * 100);
  }
}

function buildChart() {
  let categoryCount = categories.length;
  if (categoryCount > 7) {
    for (var i = 0; i < (categoryCount - 7); i++) {
      categoryColours.push(getRandomColor());
    }
  }

  new Chart("budget-pie", {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        backgroundColor: categoryColours,
        data: ratios
      }]
    },
    options: {
      title: {
        display: true,
        text: "Current Budget"
      }
    }
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const delayFunction = async () => {
  getBudgets();
  await delay(800);
  getRatio();
  await delay(600);
  buildChart();
};

delayFunction();



