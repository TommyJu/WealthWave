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