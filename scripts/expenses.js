function generateTable() {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            let expensesCollection = db.collection("users/" + user.uid + "/expenses");
            expensesCollection.orderBy("date").onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    var doc = change.doc;
                    var amount = doc.data().amount;
                    var category = doc.data().category;
                    var date = doc.data().date;
                    var vendor = doc.data().vendor;
                    console.log(amount, category, date, vendor);
                    document.getElementById("table-entrance").insertAdjacentHTML("afterend",
                        '<tr><td>' + date + '</td><td>' + category + '</td><td>' + vendor + '</td><td>' + amount + '</td></tr>');
                });
            });
        }
    });
}

generateTable();