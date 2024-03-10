async function alterBar() {
    const user = firebase.auth().currentUser;
    if (user) {
        let budget = await getTotalBudget()
        let balance = budget - await getTotalExpenses()
        let ratio = balance / budget;
        let category = "progress-bar progress-bar-striped bg-success"
        if (ratio < 0.25) {
            category = "progress-bar progress-bar-striped bg-danger"
        } else if (ratio < 0.75) {
            category = "progress-bar progress-bar-striped bg-warning"
        }
        document.getElementById("budget-bar").className = category
        document.getElementById("budget-bar").style.width= `${ratio * 100}%`
        document.getElementById("budget-bar").innerHTML = `${Math.round(ratio * 100)}% Left of Your Budget`

        return ratio
    } else {
        //console.log('User not signed in.')
    }
}

alterBar()

// Alters a progress bar for a sub category
async function alterCategoryProgressBar(progressBar, budget, expenses) {
    const user = firebase.auth().currentUser;
    if (user) {
        let balance = budget - expenses;
        let ratio = balance / budget;
        let category = "progress-bar progress-bar-striped bg-success"
        if (ratio < 0.25) {
            category = "progress-bar progress-bar-striped bg-danger"
        } else if (ratio < 0.75) {
            category = "progress-bar progress-bar-striped bg-warning"
        }
        progressBar.className = category
        progressBar.innerHTML = `${Math.round(ratio * 100)}% Left of this Budget!`
        progressBar.style.width= `${ratio * 100}%`

        return ratio
    } else {
        //console.log('User not signed in.')
    }
}