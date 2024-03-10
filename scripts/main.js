// Event listener for adding a new budget
document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById('budgetForm')

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        let category = document.getElementById('category').value
        let budget = document.getElementById('budget').value

        addBudget(category, budget)
        alterBar()
        buildChart()
    });
});


// Event listener for editing an existing budget
document.addEventListener('DOMContentLoaded', function () {
    let editForm = document.getElementById('editBudgetForm');

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // let category = document.getElementById('category').value;
        let budget = document.getElementById('newBudget').value;
        let categoryID = editForm.getAttribute('categoryID');
        editBudget(categoryID, budget)
        alterBar()
        buildChart()
    })
})

// Event listener for adding an expense form
document.addEventListener('DOMContentLoaded', function () {
    let addExpenseForm = document.getElementById('addExpenseForm');

    addExpenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // let category = document.getElementById('category').value;
        let newExpense = document.getElementById('newExpense').value;
        let newExpenseValue = document.getElementById('newExpenseValue').value;
        let categoryName = addExpenseForm.getAttribute('categoryName');
        addExpenseToCollection(categoryName, newExpenseValue, newExpense);
    })
})

function getUserID() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("user id retrieved");
                resolve(user.uid);
            } else {
                console.error('User not signed in.');
                resolve(null); // Resolve with null if the user is not signed in
            }
        });
    });
}

// ---------- Add cards using the Firestore database ----------
function displayCardsDynamically(userID) {
    if (userID == null) {
        console.error("Cannot display cards, userID is null");
        return
    }
    delayFunction();
    
    let budgetsCollection = db.collection("users/" + userID + "/budgets");
    budgetsCollection.orderBy("date").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {

            var doc = change.doc;
            var docID = doc.id;
            var category = doc.data().category;
            var budget = doc.data().budget;
            var expenses = doc.data().expenses;
            let editForm = document.getElementById('editBudgetForm');
            let addExpenseForm = document.getElementById('addExpenseForm');

            let cardTemplate = document.getElementById("card-template");
            if (change.type === "added") {

                let newcard = cardTemplate.content.cloneNode(true);
                
                // Set the attribute of the html card div to the docID
                // Enables us to edit existing cards using this attribute
                newcard.querySelector('.budget-card').setAttribute('data-doc-id', docID);
                newcard.querySelector('.progress-bar').setAttribute('progress-bar-doc-id', docID);
                
                newcard.querySelector('.card-category').innerHTML = category;
                newcard.querySelector('.card-budget').innerHTML = budget;
                newcard.querySelector('.card-expenses').innerHTML = expenses;
                newcard.querySelector(".edit-budget").onclick = () => editForm.setAttribute('categoryID', docID);
                newcard.querySelector(".delete-budget").onclick = async () => {
                    await deleteBudget(docID);
                    alterBar()
                    removeCategory(category)
                    buildChart()
                };
                newcard.querySelector('.card-add-expenses').onclick = () => addExpenseForm.setAttribute('categoryName', category);
                // Add the card to container
                document.getElementById("card-container").append(newcard);

                // Update the progress bar for a budget category
                let progressBar = document.querySelector(`[progress-bar-doc-id=${docID}]`);
                alterCategoryProgressBar(progressBar, budget, expenses);
            } 
            else if (change.type === "modified") {
                const existingCard = document.querySelector(`.card[data-doc-id="${docID}"]`);
                existingCard.querySelector('.card-budget').innerHTML = budget;
                existingCard.querySelector('.card-expenses').innerHTML = expenses;
                
                let progressBar = document.querySelector(`[progress-bar-doc-id=${docID}]`);
                alterCategoryProgressBar(progressBar, budget, expenses);

                alterBar();
            }
            else if (change.type === "removed") {
                let removedCard = document.querySelector(`.card[data-doc-id="${docID}"]`);
                removedCard.style.display = "none";
                let progressBar = document.querySelector(`[progress-bar-doc-id=${docID}]`);
                progressBar.style.display = "none";
                alterBar();
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', async function () {
    let userID = await getUserID();
    console.log(userID);
    displayCardsDynamically(userID);
    await alterBar()
    buildChart()
});