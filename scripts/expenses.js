function clearTable() {
    document.getElementById("expenses-table").innerHTML = '<tr id="table-entrance"><th>Date</th>'
    + '<th>Category</th><th>Vendor</th><th>Amount</th></tr>'
}

function generateTable(params) {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            let expensesCollection = db.collection("users/" + user.uid + "/expenses");
            expensesCollection.orderBy(params.selection.toLowerCase(), params.dir).onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    var doc = change.doc;
                    var amount = doc.data().amount;
                    var category = doc.data().category;
                    var date = doc.data().date;
                    var vendor = doc.data().vendor;
                    document.getElementById("table-entrance").insertAdjacentHTML("afterend",
                        '<tr><td>' + date + '</td><td>' + category + '</td><td>' + vendor + '</td><td>' + amount + '</td></tr>');
                });
            });
        }
    });
}

generateTable({selection: "date", dir: "desc"});

$('.dropdown-menu a').click(function(){
    $('#selected').text($(this).text());
    clearTable();
    let direction = "desc";
    if (document.getElementById("sort-dir-button").value.localeCompare("up") == 0) {
        direction = "asc";
    }
    generateTable({selection: $(this).text(), dir: direction});
  });

document.addEventListener('DOMContentLoaded', function () {
    let sortDir = document.getElementById("sort-dir-button");

    sortDir.addEventListener("click", function (e) {
        e.preventDefault()
        let sortBy = document.getElementById("selected").innerText;
        clearTable();
        if (sortDir.value.localeCompare("down") == 0) {
            generateTable({selection: sortBy, dir: "asc"})
            sortDir.innerHTML = '<i class="bi bi-sort-up" id="sort-dir" ></i>';
            sortDir.value = "up";
        } else {
            generateTable({selection: sortBy, dir: "desc"})
            sortDir.innerHTML = '<i class="bi bi-sort-down" id="sort-dir" ></i>';
            sortDir.value = "down";
        }
    });
});