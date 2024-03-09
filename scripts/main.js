document.addEventListener('DOMContentLoaded', function () {
    let form = document.getElementById('budgetForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let category = document.getElementById('category').value;
        let budget = document.getElementById('budget').value;

        addBudget(category, budget);
    });
});
