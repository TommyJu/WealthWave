// Custom error class for representing invalid budget amounts
class InvalidBudget extends Error {
    // Constructor for creating an InvalidBudget error instance with a custom error message
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        // Capture the stack trace for better error tracing
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

// Function to add a budget to the database
async function addBudget(category, budget) {
    // Check if a user is authenticated
    const user = firebase.auth().currentUser
    if (user) {
        try {
            const userID = user.uid
            const budgetsCollection = db.collection("users/" + userID + "/budgets")

            // Ensure the budget amount is not negative
            if (budget < 0) {
                // Throw an error if the budget is negative
                throw new Error("Budget cannot be below 0.")
            }

            // Checking if the budget category already exists in the database
            const existingBudgetQuery = await budgetsCollection.where("category", "==", category).get()
            if (!existingBudgetQuery.empty) {
                // If the budget category already exists, update the budget amount
                const existingBudgetDoc = existingBudgetQuery.docs[0]
                console.log("Budget already exists! Updating budget to given amount.")
                await editBudget(existingBudgetDoc.id, budget) // Accessing document ID with existingBudgetDoc.id
                return;
            }

            // If budget category doesn't exist, add a new budget entry
            const categoryData = {
                date: new Date().toLocaleDateString(),
                category: category,
                budget: parseInt(budget),
                expenses: 0
            };

            await budgetsCollection.add(categoryData);
            console.log("Budget category added successfully")
        } catch (error) {
            // Log any errors that occur during the process of adding the budget
            console.error("Error adding budget:", error)
        }
    } else {
        // If no user is signed in, log an error message
        console.log('User not signed in.')
    }
}

// Function to edit the budget amount in the database
async function editBudget(budgetId, newBudget) {
    // Check if a user is authenticated
    const user = firebase.auth().currentUser
    if (user) {
        try {
            const userID = user.uid
            const budgetRef = db.collection("users/" + userID + "/budgets").doc(budgetId)

            // Ensure the new budget amount is not negative
            if (newBudget < 0) {
                // Throw an error if the new budget amount is negative
                throw new InvalidBudget("Budget cannot be below 0.")
            }

            // Update the budget amount with the new value
            await budgetRef.update({ budget: parseInt(newBudget) })
            console.log("Budget amount updated successfully")
        } catch (error) {
            // Log any errors that occur during the process of editing the budget
            console.error("Error updating budget:", error)
        }
    } else {
        // If no user is signed in, log an error message
        console.error('User not signed in.')
    }
}

// Function to delete a budget from the database
async function deleteBudget(budgetId) {
    // Check if a user is authenticated
    const user = firebase.auth().currentUser
    if (user) {
        try {
            const userID = user.uid
            const budgetRef = db.collection("users/" + userID + "/budgets").doc(budgetId)

            // Delete the budget document from the database
            await budgetRef.delete();
            generateFish();
            console.log("Budget deleted successfully")
        } catch (error) {
            // Log any errors that occur during the process of deleting the budget
            console.error("Error deleting budget:", error)
        }
    } else {
        // If no user is signed in, log an error message
        console.error('User not signed in.')
    }
}

// Function to add an expense to a specified budget
async function addExpenseToTotal(budgetCategory, amount) {
    // Check if a user is authenticated
    const user = firebase.auth().currentUser
    if (user) {
        try {
            const userID = user.uid
            const budgetsCollection = db.collection("users/" + userID + "/budgets")

            // Query the budget collection to find the budget with the specified category
            const querySnapshot = await budgetsCollection.where("category", "==", budgetCategory).get()

            if (!querySnapshot.empty) {
                // If the specified budget category exists, update the expenses
                const budgetDoc = querySnapshot.docs[0]
                const currentExpenses = budgetDoc.data().amount || 0
                const newExpenseTotal = currentExpenses + amount

                // Update the expenses for the budget with the new total
                await budgetDoc.ref.update({ expenses: newExpenseTotal })
                console.log("Expense added successfully")
            } else {
                // If no budget document is found with the specified category, log an error message
                console.log("No document found with the specified category")
            }
        } catch (error) {
            // Log any errors that occur during the process of adding the expense
            console.error("Error adding expense:", error)
        }
    } else {
        // If no user is signed in, log an error message
        console.error('User not signed in.')
    }
}

async function addExpenseToCollection(budgetCategory, amount, vendor) {
    const user = firebase.auth().currentUser
    if (user) {
        const userID = user.uid
        const budgetsCollection = db.collection("users/" + userID + "/expenses")

        const categoryData = {
            date: new Date().toLocaleDateString(),
            category: budgetCategory,
            amount: parseInt(amount),
            vendor: vendor
        };

        await budgetsCollection.add(categoryData);
        await addExpenseToTotal(budgetCategory, amount);
    } else {
        // If no user is signed in, log an error message
        console.error('User not signed in.')
    }
}


// Function to get total budget
async function getTotalBudget() {
    const user = firebase.auth().currentUser

    if (user) {
        try {
            const userID = user.uid;
            const budgetsCollection = db.collection("users/" + userID + "/budgets")

            let total = 0;

            // Get all documents from the budgets collection
            const querySnapshot = await budgetsCollection.get()

            // Iterate through each document in the collection
            querySnapshot.forEach((doc) => {
                // Access each document's data
                const budgetData = doc.data()
                total += budgetData.budget
            })

            // Return the total budget as an integer
            return parseInt(total)

        } catch (error) {
            // Handle errors
            console.error("Error getting total budget:", error)
        }
    } else {
        console.log('User not signed in.')
    }
}


async function getTotalExpenses() {
    const user = firebase.auth().currentUser

    if (user) {
        try {
            const userID = user.uid
            const budgetsCollection = db.collection("users/" + userID + "/budgets")

            let total = 0

            // Get all documents from the budgets collection
            const querySnapshot = await budgetsCollection.get()

            // Iterate through each document in the collection
            querySnapshot.forEach((doc) => {
                // Access each document's data
                const budgetData = doc.data()
                total += budgetData.expenses
            })

            // Return the total expenses as an integer
            return parseInt(total)

        } catch (error) {
            // Handle errors
            console.error("Error getting total expenses:", error)
        }
    } else {
        console.log('User not signed in.')
    }
}
