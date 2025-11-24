const objects = document.querySelectorAll(".hoverable-object");
const sceneContainer = document.querySelector(".scene-container");
const cartons = document.querySelectorAll("#carton");
const overlay = document.getElementById("scene-overlay");
const scenePhoto = document.getElementById("scene-photo");



console.log("objects", objects);
console.log("cartons", cartons);


let activeObject = null;
let currentObject = null;
let keptObjects = [];
let thrownObjects = [];
let dragging = false;



objects.forEach(object => {
    object.addEventListener("click", () => {
        
// When clicking an object, i instantly did the "choose to keep or throw away" scene.
// Whereas, the game has to first launch the memory of the object, before making the player choose.
// That's why you probably have to insert your code (managing scenes) before the following code.

        if (activeObject !== null) { return; }        
        
        const scenePhotoPath = object.dataset.scene;

        if (!scenePhotoPath) {
            console.warn("no data-scene")
            return;
        }

        currentObject = object;

        scenePhoto.src = scenePhotoPath;
        overlay.classList.remove("hidden");
       

    }, {once: true})
})

scenePhoto.addEventListener("click", () => {
    overlay.classList.add("hidden");
    scenePhoto.src = "";

    startBoxSelection(currentObject);
});



function startBoxSelection(object) {
    // Now the user has to choose whether or not to keep the object.
    activeObject = object;
    activeObject.classList.add("object-selected");
    activeObject.parentElement.style.zIndex = 99;
    
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

    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        activeObject.parentElement.style.left = (e.clientX - offsetX) + "px";
        activeObject.parentElement.style.top = (e.clientY - offsetY) + "px";
    });
    
    // More complex function, appart from the main code down below
    document.addEventListener("mouseup", handleMouseUp);

}

// Function to handle 
function handleMouseUp(e) {
    activeObject.style.cursor = "grab";
    if (dragging) {
        activeObject.parentElement.style.pointerEvents = "none"; // Removing pointer events, to get the element under the dragged one
        const elemUnder = document.elementFromPoint(e.clientX, e.clientY); // getting the element under the dragged one
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