const startBtn = document.querySelector("#start");
const creditsBtn = document.querySelector("#credits");
const titleSection = document.querySelector(".title-screen")

console.log(startBtn);
console.log(creditsBtn);

const objects = document.querySelectorAll(".hoverable-object");
const sceneContainer = document.querySelector(".scene-container");
const cartons = document.querySelectorAll("#carton");



const overlay = document.getElementById("scene-overlay");
const scenePhoto = document.getElementById("scene-photo");
const fadeOverlay = document.getElementById("fade-overlay");
const sceneCaption = document.getElementById("scene-caption");



let activeObject = null;
let currentObject = null;
let keptObjects = [];
let thrownObjects = [];
let dragging = false;

let sceneCaptionTimer = null;
let currentCaptionIndex = 0;
let currentCaptionLines = [];


startBtn.addEventListener("click", () => {
    document.documentElement.style.background = "#f9ecd7";
    titleSection.classList.add("disappear");
    titleSection.addEventListener("transitionend", ()=> {
        titleSection.style.display = "none";
        sceneContainer.style.display = "block";
        sceneContainer.classList.add('visible');
    }, {once: true})
})




objects.forEach(object => {
    object.addEventListener("click", () => {
        
// When clicking an object, i instantly did the "choose to keep or throw away" scene.
// Whereas, the game has to first launch the memory of the object, before making the player choose.
// That's why you probably have to insert your code (managing scenes) before the following code.

        if (activeObject !== null) { return; }        
        
        activeObject = object;

        const scenePhotoPath = object.dataset.scene;

        fadeOverlayTo(1,800, () => {
            scenePhoto.src = scenePhotoPath;
            overlay.classList.remove("hidden");
            startSceneCaption(activeObject);
        });
       

    }, {once: true})
})

scenePhoto.addEventListener("click", () => {
    stopSceneCaption();
    overlay.classList.add("hidden");
    scenePhoto.src = "";

    fadeOverlayTo(0,800, () => {
        startBoxSelection(activeObject);
    });
       

});



function startBoxSelection(object) {
    // Now the user has to choose whether or not to keep the object.
    activeObject = object;
    activeObject.classList.add("object-selected");
    
    let offsetX = 0;
    let offsetY = 0;
    
    // Showing that other objects are not selectable anymore for now
    objects.forEach(object=>object.classList.remove("hoverable-object"));
    
    // Make cupboards appear
    cartons.forEach(carton => {
        carton.parentElement.classList.add("active");
    })
        
    activeObject.addEventListener("mousedown", (e) => {
        dragging = true;
        activeObject.style.cursor = "grabbing";

        const widthElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["width"].replace("px", ""));
        const heightElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["height"].replace("px", ""));
        // offset of the container to properly place the dragged object onto the mouse on mousemove
        offsetX = sceneContainer.offsetLeft + (widthElement/2); 
        offsetY = sceneContainer.offsetTop + (heightElement/2);
    });
    activeObject.addEventListener("touchstart", (e) => {
        dragging = true;
        activeObject.style.cursor = "grabbing";

        const widthElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["width"].replace("px", ""));
        const heightElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["height"].replace("px", ""));
        // offset of the container to properly place the dragged object onto the mouse on mousemove
        offsetX = sceneContainer.offsetLeft + (widthElement/2); 
        offsetY = sceneContainer.offsetTop + (heightElement/2);
    });

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        activeObject.parentElement.style.zIndex = 99;
        const x = e.clientX || e.targetTouches[0].pageX;
        const y = e.clientY || e.targetTouches[0].pageY;
        activeObject.parentElement.style.left = (x - offsetX) + "px";
        activeObject.parentElement.style.top = (y - offsetY) + "px";
    });
    document.addEventListener("touchmove", (e) => {
        if (!dragging) return;
        activeObject.parentElement.style.zIndex = 99;
        const x = e.clientX || e.targetTouches[0].pageX;
        const y = e.clientY || e.targetTouches[0].pageY;
        activeObject.parentElement.style.left = (x - offsetX) + "px";
        activeObject.parentElement.style.top = (y - offsetY) + "px";
    });
    
    // More complex function, appart from the main code down below
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);

}

// Function to handle 
function handleMouseUp(e) {
    activeObject.style.cursor = "grab";
    if (dragging) {
        activeObject.parentElement.style.pointerEvents = "none"; // Removing pointer events, to get the element under the dragged one
        const x = e.clientX || e.targetTouches[0].pageX;
        const y = e.clientY || e.targetTouches[0].pageY;
        const elemUnder = document.elementFromPoint(x, y); // getting the element under the dragged one
        cartons.forEach(carton => {
            // If cupboard is under the mouse, make the element disappear
            if (carton.contains(elemUnder) || carton === elemUnder) {
                // If "keep" cupboard -> objects added to keepObjects, otherwise added to thrownObjects global list
                carton.parentElement.classList.contains("keep") ? keptObjects.push(activeObject) : thrownObjects.push(activeObject);
                // Making the object disappear
                activeObject.classList.remove("object-selected");
                activeObject.classList.add("done");
                activeObject.addEventListener("animationend", ()=>{
                    // Reseting scene
                    cartons.forEach(carton => {carton.parentElement.classList.remove("active");})
                    objects.forEach(object=>object.classList.add("hoverable-object"));
                })
                activeObject = null;
                document.removeEventListener("mouseup", handleMouseUp);
                console.log("objet supprimé");
                // End of reset
            }
        });
        // If cupboard not under mouse on mouse up -> do nothing
        if (activeObject) {
            activeObject.parentElement.style.pointerEvents = "auto";
            console.log("objet non supprimé, essaie encore");
        }
    }
    dragging = false;
}

function fadeOverlayTo(targetOpacity, duration = 600, callback) {
    if (!fadeOverlay) {
        if (callback) callback();
        return;
    }

    fadeOverlay.style.transitionDuration = duration + "ms";

    if (targetOpacity === 1) {
        fadeOverlay.classList.add("visible");   // opacity: 1
    } else {
        fadeOverlay.classList.remove("visible"); // opacity: 0
    }

    if (callback) {
        setTimeout(() => {
            callback();
        }, duration);
    }
}

function startSceneCaption(object, defaultInterval = 3500, fadeMs = 300) {
    if (!sceneCaption) return;

    const raw = object.dataset.story;
    if (!raw) return;

    currentCaptionLines = raw
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (currentCaptionLines.length === 0) return;

    const intervals = (object.dataset.intervals || "")
    .split(",")
    .map(s => parseInt(s.trim(), 10))
    .map(v => (isNaN(v) ? defaultInterval : v)); 

    // 他のキャプションが動いていたら停止
    if (sceneCaptionTimer) {
        clearTimeout(sceneCaptionTimer);
        sceneCaptionTimer = null;
    }

    currentCaptionIndex = 0;

    // --- 最初の行をフェードインして表示 ---
    sceneCaption.textContent = currentCaptionLines[0];
    sceneCaption.classList.remove("hidden");

    requestAnimationFrame(() => {
        sceneCaption.classList.add("visible");
    });

    // --- 次の行をふわっと切り替える関数 ---
    function showNextLine() {
        currentCaptionIndex++;

        if (currentCaptionIndex >= currentCaptionLines.length) {
            return; // 最後まで行ったら終了
        }

        // まずフェードアウト（visible を外す）
        sceneCaption.classList.remove("visible");

        // フェードアウトが終わる timing でテキスト入れ替え
        setTimeout(() => {
            sceneCaption.textContent = currentCaptionLines[currentCaptionIndex];

            // 次のフレームで visible を戻す → フェードイン
            requestAnimationFrame(() => {
                sceneCaption.classList.add("visible");
            });
        }, fadeMs);

        const thisInterval = intervals[currentCaptionIndex] ?? defaultInterval;
        sceneCaptionTimer = setTimeout(showNextLine, thisInterval);
    }

    const firstInterval = intervals[0] ?? defaultInterval;
    sceneCaptionTimer = setTimeout(showNextLine, firstInterval);
}


function stopSceneCaption() {
    if (sceneCaptionTimer) {
        clearInterval(sceneCaptionTimer);
        sceneCaptionTimer = null;
    }

    if (!sceneCaption) return;

    sceneCaption.classList.remove("visible");
    setTimeout(() => {
        sceneCaption.classList.add("hidden");
        sceneCaption.textContent = "";
        currentCaptionLines = [];
        currentCaptionIndex = 0;
    }, 200); 
}