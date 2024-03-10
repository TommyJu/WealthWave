// Event listener for adding a new budget
document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById('budgetForm')

    form.addEventListener('submit', function (e) {
        e.preventDefault()

        let category = document.getElementById('category').value
        let budget = document.getElementById('budget').value

        addBudget(category, budget)
        alterBar()
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
            let editForm = document.getElementById('editBudgetForm');

            let cardTemplate = document.getElementById("card-template");

            if (change.type === "added") {

                let newcard = cardTemplate.content.cloneNode(true);
                
                // Set the attribute of the html card div to the docID
                // Enables us to edit existing cards using this attribute
                newcard.querySelector('.card').setAttribute('data-doc-id', docID);
                
                newcard.querySelector('.card-category').innerHTML = category;
                newcard.querySelector('.card-budget').innerHTML = budget;
                newcard.querySelector(".edit-budget").onclick = () => editForm.setAttribute('categoryID', docID);
                newcard.querySelector(".delete-budget").onclick = async () => {
                    await deleteBudget(docID);
                    // Rebuild the chart
                    // buildChart();
                };

                document.getElementById("card-container").append(newcard);
            } 
            else if (change.type === "modified") {
                const existingCard = document.querySelector(`.card[data-doc-id="${docID}"]`);
                if (existingCard) {
                    // if (image) {
                    //     existingCard.querySelector('.card-image').src = image;
                    // }
                }
                existingCard.querySelector('.card-budget').innerHTML = budget;
                // buildChart();
            }
            else if (change.type === "removed") {
                let removedCard = document.querySelector(`.card[data-doc-id="${docID}"]`);
                removedCard.style.display = "none";
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', async function () {
    let userID = await getUserID();
    console.log(userID);
    displayCardsDynamically(userID);
    await alterBar()
});