function alterBar() {
    /*
    Get budget and current balance from DB
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            budget = user.budget;
            balance = user.balance;
        }
    })
    */

    let budget = 100;
    let balance = 100;
    let ratio = balance / budget;
    let category = "progress-bar progress-bar-striped bg-success";
    if (ratio < 0.25) {
        category = "progress-bar progress-bar-striped bg-danger";
    } else if (ratio < 0.75) {
        category = "progress-bar progress-bar-striped bg-warning";
    }
    document.getElementById("budget-bar").className = category;
    document.getElementById("budget-bar").innerHTML = `${ratio * 100}%`;
}

alterBar();

// Store form details to database
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('budgetForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();


        // This authentication state listener should be registered once, not on every form submit.
        // If needed, place this listener outside and use a variable to store the user state.
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                // current Category is a local variable
                var userID = user.uid;
                let budgetsCollection = db.collection("users/" + userID + "/budgets");
                var category = document.getElementById('category').value;
                var budget = document.getElementById('budget').value;

                var categoryData = {
                    date: new Date().toLocaleDateString(),
                    category: category,
                    budget: budget
                };

                budgetsCollection.add(categoryData);
                console.log("Budget category added successfully");

            } else {
                console.error('User not signed in.');
                // Here you could, for example, display an error message or redirect to the login page.
            }
        });
    });
});