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


let activeObject = null;
let currentObject = null;
let keptObjects = [];
let thrownObjects = [];
let dragging = false;

startBtn.addEventListener("click", () => {
    titleSection.classList.add("disappear");
    document.documentElement.style.background = "whitesmoke";
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

        if (!scenePhotoPath) {
            console.warn("No data-scene !");
            // Case of the ticket
            startBoxSelection(activeObject);
            return;
        }


        scenePhoto.src = scenePhotoPath;
        overlay.classList.remove("hidden");
       

    }, {once: true})
})

scenePhoto.addEventListener("click", () => {
    overlay.classList.add("hidden");
    scenePhoto.src = "";

    startBoxSelection(activeObject);
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