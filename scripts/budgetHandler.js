// Function to add a budget to the database
async function addBudget(category, budget) {
    // This authentication state listener should be registered once, not on every form submit.
    const user = firebase.auth().currentUser;
    if (user) {
        // current Category is a local variable
        let userID = user.uid;
        let budgetsCollection = db.collection("users/" + userID + "/budgets");

        let categoryData = {
            date: new Date().toLocaleDateString(),
            category: category,
            budget: budget
        };

        await budgetsCollection.add(categoryData);
        console.log("Budget category added successfully");
    } else {
        console.error('User not signed in.');
        // Here you could, for example, display an error message or redirect to the login page.
    }
}

// Function to edit the budget amount in the database
async function editBudget(budgetId, newBudget) {
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const userID = user.uid;
            const budgetRef = db.collection("users/" + userID + "/budgets").doc(budgetId);

            await budgetRef.update({ budget: newBudget });
            console.log("Budget amount updated successfully");
        } catch (error) {
            console.error("Error updating budget:", error);
        }
    } else {
        console.error('User not signed in.');
    }
}

// Function to delete a budget from the database
async function deleteBudget(budgetId) {
    const user = firebase.auth().currentUser;
    if (user) {
        try {
            const userID = user.uid;
            const budgetRef = db.collection("users/" + userID + "/budgets").doc(budgetId);

            await budgetRef.delete();
            console.log("Budget deleted successfully");
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    } else {
        console.error('User not signed in.');
        // Handle the case where the user is not signed in
    }
}
