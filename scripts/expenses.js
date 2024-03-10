function clearTable() {
    console.log("clear called");
    document.getElementById("expenses-table").innerHTML = '<tr id="table-entrance"><th>Date</th>'
    + '<th>Category</th><th>Vendor</th><th>Amount</th></tr>'
}

function generateTable(param) {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            let expensesCollection = db.collection("users/" + user.uid + "/expenses");
            expensesCollection.orderBy(param.toLowerCase(), "desc").onSnapshot(snapshot => {
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

generateTable("date");

$('.dropdown-menu a').click(function(){
    $('#selected').text($(this).text());
    clearTable();
    generateTable($(this).text());
  });