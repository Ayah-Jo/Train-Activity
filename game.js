// Initialize Firebase
let config = {
    apiKey: "AIzaSyD1OywTnT5-koltDmi4u63K5Ffd6AA0A-Q",
    authDomain: "ayah-test-fdd51.firebaseapp.com",
    databaseURL: "https://ayah-test-fdd51.firebaseio.com",
    projectId: "ayah-test-fdd51",
    storageBucket: "ayah-test-fdd51.appspot.com",
    messagingSenderId: "489446981898",
    appId: "1:489446981898:web:9605ad5a6f6463be1fbaf3",
    measurementId: "G-4GEBHR25RW",
};
firebase.initializeApp(config);

let database = firebase.database();
let currentTime = moment();

database.ref().on("child_added", function(childSnap) {

    let name = childSnap.val().name;
    let destination = childSnap.val().destination;
    let firstTrain = childSnap.val().firstTrain;
    let frequency = childSnap.val().frequency;
    let min = childSnap.val().min;
    let next = childSnap.val().next;

    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + next + "</td><td>" + min + "</td></tr>");
});

database.ref().on("value", function(snapshot) {
   

});

//grabs information from the form
$("#addTrainBtn").on("click", function() {

    let trainName = $("#trainNameInput").val().trim();
    let destination = $("#destinationInput").val().trim();
    let firstTrain = $("#firstInput").val().trim();
    let frequency = $("#frequencyInput").val().trim();

    //ensures that each input has a value
    if (trainName == "") {
        alert('Enter a train name.');
        return false;
    }
    if (destination == "") {
        alert('Enter a destination.');
        return false;
    }
    if (firstTrain == "") {
        alert('Enter a first train time.');
        return false;
    }
    if (frequency == "") {
        alert('Enter a frequency');
        return false;
    }

    // THE MATH!
    //subtracts the first train time back a year to ensure it's before current time.
    let firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    // the time difference between current time and the first train
    let difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    let remainder = difference % frequency;
    let minUntilTrain = frequency - remainder;
    let nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstInput").val("");
    $("#frequencyInput").val("");

    return false;
});