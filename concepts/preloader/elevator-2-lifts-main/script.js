//for creating a lift1 numbers
for (var i = 0; i <= 12; i++) {
  var numbers = document.createElement("div");
  numbers.className = "numAll lift1";
  numbers.id = "lift1";
  numbers.setAttribute("onclick", "numAll(event)");
  var content = document.createTextNode(i);
  numbers.appendChild(content);
  document.getElementById("boxLift1").appendChild(numbers);
  // document.getElementById("boxLift2").appendChild(numbers);
}
//for creating a lift2 numbers
for (var i = 0; i <= 12; i++) {
  var numbers = document.createElement("div");
  numbers.className = "numAll lift2";
  numbers.id = "lift2";
  numbers.setAttribute("onclick", "numAll(event)");
  var content = document.createTextNode(i);
  numbers.appendChild(content);
  // document.getElementById("boxLift1").appendChild(numbers);
  document.getElementById("boxLift2").appendChild(numbers);
}
//default lift css
document.getElementsByClassName("lift1")[0].style.boxShadow =
  "inset 0px 0px 12px #ffffff";
document.getElementsByClassName("lift2")[0].style.boxShadow =
  "inset 0px 0px 12px #ffffff";
let liftFloor = 0;
let liftStatus = false;
let activeLift;
let selectedLift = [0, 0];
let liftObj = {
  lift1: 0,
  lift2: 0,
};
let prevLiftFloor = {
  lift1: 0,
  lift2: 0,
};
let foundKey;
var allElem1 = document.getElementsByClassName("lift1");
var allElem2 = document.getElementsByClassName("lift2");
let movLiftDiv1 = document.getElementById("movLift1");
let movLiftDiv2 = document.getElementById("movLift2");
let lDoor_1 = document.getElementsByClassName("lift1Door");
let lDoor_2 = document.getElementsByClassName("lift2Door");
let LiftMove = new Audio("./sound/LiftMove.mp3");
let doorOpen = new Audio("./sound/doorOpen.mp3");
// LiftMove.play();
function lift1DoorClose() {
  setTimeout(() => {
    for (var l of lDoor_1) {
      l.style.width = "34px";
    }
    document.querySelector("body").style.pointerEvents = "all";
  }, 5000);
}
function lift2DoorClose() {
  setTimeout(() => {
    for (var l of lDoor_2) {
      l.style.width = "34px";
    }
    document.querySelector("body").style.pointerEvents = "all";
  }, 5000);
}
function lift1DoorOpen() {
  setTimeout(() => {
    for (var l of lDoor_1) {
      l.style.width = "0px";
    }
    LiftMove.pause();
    doorOpen.play();
    lift1DoorClose();
  }, 2500);
}
function lift2DoorOpen() {
  setTimeout(() => {
    for (var l of lDoor_2) {
      l.style.width = "0px";
    }
    LiftMove.pause();
    doorOpen.play();
    lift2DoorClose();
  }, 2500);
}

function numAll(event) {
  document.querySelector("body").style.pointerEvents = "none";
  liftFloor = event.target.innerHTML;
  activeLift = event.target.id;
  prevLiftFloor.lift1 = selectedLift[0];
  prevLiftFloor.lift2 = selectedLift[1];
  //main functionality and works when liftstatus true.
  if (liftStatus == true) {
    var closest = selectedLift.reduce(function (prev, curr) {
      return Math.abs(curr - liftFloor) < Math.abs(prev - liftFloor)
        ? curr
        : prev;
    });
    // console.log(closest);
    for (let ele in liftObj) {
      //console.log(liftObj[ele])
      if (liftObj[ele] == closest) {
        console.log(ele);
        foundKey = ele;
        console.log(foundKey);
      }
    }
    if (foundKey == "lift1") {
      liftObj.lift1 = liftFloor;
      selectedLift.splice(0, 1, liftFloor);
    } else if (foundKey == "lift2") {
      liftObj.lift2 = liftFloor;
      selectedLift.splice(1, 1, liftFloor);
    }
  }
  // console.log(selectedLift)
  //works first time only
  setTimeout(() => {
    LiftMove.play();
  }, 1000);

  if (!liftStatus) {
    liftStatus = true;
    var prevNum = 0;
    var currNum = Number(event.target.innerHTML);
    if (activeLift == "lift1") {
      liftObj.lift1 = liftFloor;
      selectedLift.splice(0, 1, liftFloor);
      var liftNumUpdate = setInterval(() => {
        for (var j = 0; j < allElem1.length; j++) {
          allElem1[j].style.boxShadow = "0px 0px 9px #fff700";
        }
        prevNum++;
        allElem1[prevNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
        movLiftDiv1.style.top = prevNum * (window.innerHeight / 13) + "px";

        console.log(prevNum);
        console.log(movLiftDiv1);
        if (prevNum == currNum) {
          // console.log(movLiftDiv1.style.top);
          lift1DoorOpen();
          clearInterval(liftNumUpdate);
        }
      }, 2000);
    } else if (activeLift == "lift2") {
      liftObj.lift2 = liftFloor;
      selectedLift.splice(1, 1, liftFloor);
      var liftNumUpdate = setInterval(() => {
        for (var j = 0; j < allElem2.length; j++) {
          allElem2[j].style.boxShadow = "0px 0px 9px #fff700";
        }
        prevNum++;
        allElem2[prevNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
        movLiftDiv2.style.top = prevNum * (window.innerHeight / 13) + "px";
        if (prevNum == currNum) {
          lift2DoorOpen();
          clearInterval(liftNumUpdate);
        }
      }, 2000);
    }
  }

  //added for get selected lift css update
  if (foundKey == "lift1") {
    var prevNum = prevLiftFloor.lift1;
    var currNum = Number(liftObj.lift1);
    var liftNumUpdate = setInterval(() => {
      for (var j = 0; j < allElem1.length; j++) {
        allElem1[j].style.boxShadow = "0px 0px 9px #fff700";
      }
      if (prevNum < currNum) {
        prevNum++;
        allElem1[prevNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
        movLiftDiv1.style.top = prevNum * (window.innerHeight / 13) + "px";
        if (prevNum == currNum) {
          lift1DoorOpen();
          clearInterval(liftNumUpdate);
        }
      } else if (prevNum > currNum) {
        prevNum--;
        allElem1[prevNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
        movLiftDiv1.style.top = prevNum * (window.innerHeight / 13) + "px";
        if (prevNum == currNum) {
          lift1DoorOpen();
          clearInterval(liftNumUpdate);
        }
      } else {
        LiftMove.pause();
        lift1DoorOpen();
        clearInterval(liftNumUpdate);
        allElem1[currNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
      }
    }, 2000);
  } else if (foundKey == "lift2") {
    var prevNum = prevLiftFloor.lift2;
    var currNum = Number(liftObj.lift2);
    var liftNumUpdate = setInterval(() => {
      for (var j = 0; j < allElem2.length; j++) {
        allElem2[j].style.boxShadow = "0px 0px 9px #fff700";
      }
      if (prevNum < currNum) {
        prevNum++;
        allElem2[prevNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
        movLiftDiv2.style.top = prevNum * (window.innerHeight / 13) + "px";
        if (prevNum == currNum) {
          lift2DoorOpen();
          clearInterval(liftNumUpdate);
        }
      } else if (prevNum > currNum) {
        prevNum--;
        allElem2[prevNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
        movLiftDiv2.style.top = prevNum * (window.innerHeight / 13) + "px";
        if (prevNum == currNum) {
          lift2DoorOpen();
          clearInterval(liftNumUpdate);
        }
      } else {
        LiftMove.pause();
        lift2DoorOpen();
        clearInterval(liftNumUpdate);

        allElem2[currNum].style.boxShadow = "inset 0px 0px 12px #ffffff";
      }
    }, 2000);
  }
}
