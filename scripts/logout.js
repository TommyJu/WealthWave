function logout() {
    console.log("logging out user");
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = "login.html";
    }).catch((error) => {
        // An error happened.
    });
}