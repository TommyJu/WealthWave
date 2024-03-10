
function getFish(i) {
    const svgs = ["assets/fish/fish-2-svgrepo-com.svg",
        "assets/fish/fish-food-salmon-svgrepo-com.svg",
        "assets/fish/fish-food-sea-svgrepo-com.svg",
        "assets/fish/fish-jellyfish-sea-svgrepo-com.svg",
        "assets/fish/fish-puffer-sea-svgrepo-com.svg",
        "assets/fish/fish-svgrepo-com.svg",
        "assets/fish/fish-svgrepo-com(1).svg",
        "assets/fish/fish-svgrepo-com(2).svg"  //7
    ];

    const direction = [
        "left",
        "left",
        "left",
        "up",
        "left",
        "right",
        "left",
        "left"
    ]

    const speed = [
        "12",
        "13",
        "8",
        "3",
        "5",
        "8",
        "9",
        "15"
    ]

    if (i > 7) {
        i -= 2;
    }
    return {svg: svgs[i], direction: direction[i], speed: speed[i]}; 
}

function cleanTank() {
    document.getElementById("fish-tank").innerHTML = '<div id="fish-entrance"></div>';
}

function generateFish() {
    console.log("generate called");
    cleanTank();
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            let budgetsCollection = db.collection("users/" + user.uid + "/budgets");
            budgetsCollection.orderBy("date").onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    var doc = change.doc;
                    let charCode = doc.id.charCodeAt(0);
                    var budget = doc.data().budget;
                    var expenses = doc.data().expenses;
                    let fish;
                    if (budget - expenses == 0) {
                        fish = {svg: "assets/fish-bone-1-svgrepo-com.svg", direction: "left", speed: 1};
                    } else if (charCode > 100) {
                        fish = getFish(parseInt(charCode.toString().charAt(2)));
                    } else {
                        fish = getFish(parseInt(charCode.toString().charAt(0)));
                    }
                        document.getElementById("fish-entrance")
                        .insertAdjacentHTML("afterend", 
                        '<marquee behavior="scroll" direction="' + fish.direction + '" scrollamount="' + fish.speed + '">' 
                        + '<img class="fish" src="' + fish.svg + '">' 
                        + '</marquee>'
                        );
                });
            });
        }
    });
}

generateFish();

