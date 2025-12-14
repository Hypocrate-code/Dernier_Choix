const startBtn = document.querySelector("#start");
const skipBtn = document.querySelector("#skipIntro");
const creditsBtn = document.querySelector("#credits");
const titleSection = document.querySelector(".title-screen")

const intros = document.querySelectorAll(".intro");
const objects = document.querySelectorAll(".hoverable-object");
const sceneContainer = document.querySelector(".scene-container");
const cartons = document.querySelectorAll("#carton");
const darkOverlay = document.querySelector(".memory-dark-overlay");


const overlay = document.getElementById("scene-overlay");
const memoryScene = document.getElementById("memory-scene");
const scenePhoto = document.getElementById("scene-photo");
const fadeOverlay = document.getElementById("fade-overlay");
const sceneCaption = document.getElementById("scene-caption");
const boundary = document.getElementById("drag-boundary");
const draggables = boundary.querySelectorAll(".draggable");


// object in memory scenes
const lamp = document.getElementById("Calque-lamp");
const horloge = document.getElementById("Calque-horloge");
const pendule = document.getElementById("Calque-pendule");
const lamp2 = document.getElementById("Calque-lamp2");
const sew = document.getElementById("Calque-sew");
const scissors = document.getElementById("Calque-scissors");
const sewingMachine = document.getElementById("Calque-sewing-machine");
const armChair = document.getElementById("Calque-arm-chair");
const armChairInner = document.getElementById("arm-chair");
const easterEgg = document.getElementById("Calque-easter-egg");
const magnetFlower = document.getElementById("Calque-magnet-flower");
const polaroid1 = document.getElementById("Calque-polaroid1");
const polaroid2 = document.getElementById("Calque-polaroid2");

// audio in memory scenes
const scissorsSound = new Audio("./audios/meuble/sound-effects/ciseaux-tissu.mp3");
const machineSound = new Audio("./audios/meuble/sound-effects/machine-a-coudre.mp3");
const umino = new Audio("./audios/boite-a-musique/sound-effects/uminomieru.mp3");

// animation cartons
const cartonLottieOverlay = document.getElementById("carton-lottie-overlay");
let cartonLottieAnim = null;
let cartonSound = null;
let soundTimeout = null;

// === ending ===
const endingOverlay = document.getElementById("ending-overlay");
let endingAnim = null;
let endingReadyToExit = false;
let endingSound = null;
let drivingLoop = null;      

const ENDING_AUDIO = {
  default: "assets/ending/sound/fin-defaut.mp3",
  enfant:  "assets/ending/sound/fin-enfant.mp3",
  ex:      "assets/ending/sound/fin-ex.mp3",
  rien:    "assets/ending/sound/fin-garde-rien.mp3",
  tout:    "assets/ending/sound/fin-garde-tout.mp3",
  ticket:  "assets/ending/sound/fin-ticket.mp3",
};

let activeObject = null;
let currentObject = null;
let keptObjects = [];
let thrownObjects = [];
let dragging = false;

let sceneCaptionTimer = null;
let currentCaptionIndex = 0;
let currentCaptionLines = [];

const AUDIOS_SRC = {
    "music-box": "audios/boite-a-musique/audio.mp3",
    "caillou": "audios/caillou/audio.mp3",
    "collier": "audios/collier/audio.mp3",
    "dessin": "audios/dessin/audio.mp3",
    "maneki": "audios/maneki/audio.mp3",
    "fauteuil": "audios/meuble/audio.mp3",
    "pull": "audios/pull/audio.mp3",
    "ticket": "audios/ticket/audio.mp3"
}

const SOUND_EFFECTS_SRC = {
    "music-box": "",
    "caillou": "",
    "collier": "",
    "dessin": "",
    "maneki": "",
    "fauteuil": "",
    "pull": "",
    "ticket": ""
}

const CARTON_LOTTIE = {
    throw: {
        "music-box": "assets/objets/cartons/musique-donner/musique-donner.json",
        "caillou": "assets/objets/cartons/caillou-donner/caillou-donner.json",
        "collier": "assets/objets/cartons/Donner-collier/collier-donner.json",
        "dessin": "assets/objets/cartons/Jeter-dessin/dessin-donner.json",
        "maneki": "assets/objets/cartons/maneki-donner/maneki-donner.json",
        "fauteuil": "assets/objets/cartons/fauteuil-donner/fauteuil-donner.json",
        "pull": "assets/objets/cartons/sweat-donner/sweat-donner.json",
        "ticket": "assets/objets/cartons/Jeter-ticket-de-caisse/ticket-donner.json",
    },
    keep: {
        "music-box": "assets/objets/cartons/musique-garder/musique-garder.json",
        "caillou": "assets/objets/cartons/caillou-garder/caillou-garder.json",
        "collier": "assets/objets/cartons/Garder-collier-chien/collier-garder.json",
        "dessin": "assets/objets/cartons/Garder-dessin/dessin-garder.json",
        "maneki": "assets/objets/cartons/maneki-garder/maneki-garder.json",
        "fauteuil": "assets/objets/cartons/fauteuil-garder/fauteuil-garder.json",
        "pull": "assets/objets/cartons/sweat-garder/sweat-garder.json",
        "ticket": "assets/objets/cartons/Garder-ticket-de-caisse/ticket-garder.json",
    },
};

const ENDING_LOTTIE = {
        "default": "assets/ending/default.json",
        "enfant": "assets/ending/enfant.json",
        "ex": "assets/ending/ex.json",
        "rien": "assets/ending/rien.json",
        "ticket": "assets/ending/ticket.json",
        "tout": "assets/ending/tout-.json",
}

const CARTON_SOUNDS = {
    throw: {
        "music-box": "assets/objets/cartons/musique-donner/piano-slam-lid-move-chair-43789.mp3",
        "caillou": "assets/objets/cartons/caillou-donner/small-rock-break-194553.mp3",
        "collier": "assets/objets/cartons/Donner-collier/sound-of-ice-cracking-426894.mp3",
        "dessin": "assets/objets/cartons/Jeter-dessin/the-sound-of-an-exploding-cracker-with-tinsel-or-confetti.mp3",
        "maneki": "assets/objets/cartons/maneki-donner/cat-meow-sound-383823.mp3",
        "fauteuil": "assets/objets/cartons/fauteuil-donner/cartoon-spring-bright-fx_179bpm.wav",
        "pull": "assets/objets/cartons/sweat-donner/cashier-quotka-chingquot-sound-effect-129698.mp3",
        "ticket": "assets/objets/cartons/Jeter-ticket-de-caisse/the-impatient-sound-of-a-paper-envelope-tearing.mp3",
    },
    keep: {
        "music-box": "assets/objets/cartons/musique-garder/playing-the-harp-up-the-scale-slowly.mp3",
        "caillou": "assets/objets/cartons/caillou-garder/rainy-night-ambience-loop-31064.mp3",// Pas de fichier son disponible
        "collier": "assets/objets/cartons/Garder-collier-chien/dog-sound.mp3",
        "dessin": "assets/objets/cartons/Garder-dessin/children-giggling-kids-laughing-hd-378111.mp3",
        "maneki": "assets/objets/cartons/maneki-garder/montbell-bonsho-von-japan-30695.mp3",
        "fauteuil": "assets/objets/cartons/fauteuil-garder/diamond-found-190255.mp3",
        "pull": "assets/objets/cartons/sweat-garder/warm-piano-logo-116098.mp3",
        "ticket": "assets/objets/cartons/Garder-ticket-de-caisse/the-noise-of-a-large-stack-of-papers-falling.mp3",
    },
};

// Délais personnalisés pour chaque son
const CARTON_SOUND_DELAYS = {
    keep: {
        "music-box": 1500,
        "caillou": 1000,
        "collier": 1500,
        "dessin": 2000,
        "maneki": 1500,
        "fauteuil": 1000,
        "pull": 500,
        "ticket": 0,
    },
    throw: {
        "music-box": 500,
        "caillou": 0,
        "collier": 500,
        "dessin": 1500,
        "maneki": 700,
        "fauteuil": 1000,
        "pull": 1500,
        "ticket": 1900,
    },
};

const startObject = {
    dataset: {
        intervals: "8000, 6000, 4500, 7000, 6500",
        story: "Dans trois jours, nouvelle vie. Nouvelle ville et nouveau studio microscopique. Et moi, plantée là avec mes cartons vides et mes souvenirs partout.|L'opportunité professionnelle que j'ai acceptée m'emmène vers un avenir prometteur, mais dans une ville plus chère où chaque mètre carré compte.|Mon futur studio sera trois fois plus petit que cet espace où j'ai vécu tant d'histoires.|La peluche. Le journal. Le canapé. Les meubles chinés. Chaque objet me regarde comme si je trahissais une partie de moi.|Derrière moi, les fantômes d'une histoire qui s'achève, les objets, eux, n'ont pas encore compris qu'il fallait partir.|Allez, pas le temps de pleurer. Il faut choisir, garder l'essentiel mais certains objets sont plus difficiles à trier que d’autres."
    }
};


intros.forEach(intro => intro.addEventListener('animationend', () => { intro.style.display = "none" }, { once: true }))

startBtn.addEventListener("click", () => {
    titleSection.classList.add("disappear");

    titleSection.addEventListener("animationend", () => {
        const audioIntro = new Audio("./audios/intro.mp3");
        audioIntro.addEventListener("play", () => {
            startSceneCaption(startObject);
        })
        audioIntro.play();
        intros.forEach(intro => intro.style.animationPlayState = "running");
        document.documentElement.style.animationPlayState = "running";
        titleSection.style.display = "none";
        sceneContainer.style.display = "block";
        skipBtn.classList.add("visible");
        skipBtn.addEventListener("click", () => {
            audioIntro.pause();
            document.documentElement.style.animation = "none";
            document.documentElement.style.backgroundColor = "#f9ecd7";
            intros.forEach(intro => intro.style.display = "none");
            skipBtn.classList.remove("visible");
            stopSceneCaption();
        }, { once: true })
        audioIntro.addEventListener("ended", () => {
            skipBtn.classList.remove("visible");
            stopSceneCaption();
            skipBtn.removeEventListener("click");
        }, { once: true })
    }, { once: true })
})




objects.forEach(object => {
    object.addEventListener("click", () => {
        if (activeObject !== null) { return; }
        activeObject = object;
        const sceneId = object.parentElement.dataset.name || "static";
        scenePhoto.src = object.dataset.scene;
        const audio = new Audio(AUDIOS_SRC[activeObject.parentElement.dataset.name]);

        // Arrêter les animations et sons des cartons en cours
        if (cartonLottieAnim) {
            cartonLottieAnim.destroy();
            cartonLottieAnim = null;
        }
        if (cartonLottieOverlay) {
            cartonLottieOverlay.style.display = "none";
            cartonLottieOverlay.innerHTML = "";
        }
        if (soundTimeout) {
            clearTimeout(soundTimeout);
            soundTimeout = null;
        }
        if (cartonSound) {
            cartonSound.pause();
            cartonSound.currentTime = 0;
            cartonSound = null;
        }
        // Réafficher les cartons si cachés
        cartons.forEach(carton => {
            carton.classList.remove("hidden");
        });


        fadeOverlayTo(1, 800, () => {
            overlay.classList.remove("hidden");

            openMemoryScene(sceneId, activeObject);

            audio.play();
            startSceneCaption(activeObject);

            scenePhoto.addEventListener("click", () => {
                audio.pause();
                umino.pause();
                stopSceneCaption();
                overlay.classList.add("hidden");
                scenePhoto.src = "";
                fadeOverlayTo(0, 800, () => {
                    startBoxSelection(activeObject);
                });
            }, { once: true });

        });


    }, { once: true })
})

//memory scene animation and interaction

let isDark = false; // 今暗いかどうかを記録

lamp.addEventListener("click", () => {
    console.log("lamp clicked");
    if (!isDark) {
        darkOverlay.classList.remove("hidden"); // 暗くする
        isDark = true;
    } else {
        darkOverlay.classList.add("hidden"); // 明るく戻す
        isDark = false;
    }
});

lamp2.addEventListener("click", () => {
    console.log("lamp clicked");
    if (!isDark) {
        darkOverlay.classList.remove("hidden"); // 暗くする
        isDark = true;
    } else {
        darkOverlay.classList.add("hidden"); // 明るく戻す
        isDark = false;
    }
});

scissorsSound.preload = "auto";

scissors.addEventListener("mouseenter", () => {
    scissorsSound.currentTime = 0; // いつでも頭出ししたいなら
    scissorsSound.play();
});

scissors.addEventListener("mouseleave", () => {
    scissorsSound.pause();
    scissorsSound.currentTime = 0; // 離れたら止めるなら
});

machineSound.preload = "auto";

sewingMachine.addEventListener("mouseenter", () => {
    machineSound.currentTime = 0; // いつでも頭出ししたいなら
    machineSound.play();
});

sewingMachine.addEventListener("mouseleave", () => {
    machineSound.pause();
    machineSound.currentTime = 0; // 離れたら止めるなら
});

armChair.addEventListener("click", () => {
    console.log("ArmChair clicked");
    armChairInner.classList.remove("arm-chair-rotate-in");
    void armChairInner.offsetWidth; // ←リフローでアニメーションをリセット
    armChairInner.classList.add("arm-chair-rotate-in");
});

draggables.forEach(el => {
    el.addEventListener("mousedown", (e) => {
        e.preventDefault();
        el.classList.add("dragging");

        const b = boundary.getBoundingClientRect();
        const r = el.getBoundingClientRect();

        const offsetX = e.clientX - r.left;
        const offsetY = e.clientY - r.top;

        function move(ev) {
            const maxLeft = b.width - r.width;
            const maxTop = b.height - r.height;

            let left = ev.clientX - b.left - offsetX;
            let top = ev.clientY - b.top - offsetY;

            left = Math.max(0, Math.min(maxLeft, left));
            top = Math.max(0, Math.min(maxTop, top));

            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
        }

        function up() {
            el.classList.remove("dragging");
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        }

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
    });
});




function startBoxSelection(object) {
    // Now the user has to choose whether or not to keep the object.
    activeObject = object;
    activeObject.classList.add("object-selected");

    let offsetX = 0;
    let offsetY = 0;

    // Showing that other objects are not selectable anymore for now
    objects.forEach(object => object.classList.remove("hoverable-object"));

    // Make cupboards appear
    cartons.forEach(carton => {
        carton.parentElement.style.zIndex = 50;
        carton.parentElement.classList.add("active");
    })

    activeObject.addEventListener("mousedown", (e) => {
        dragging = true;
        activeObject.style.cursor = "grabbing";

        const widthElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["width"].replace("px", ""));
        const heightElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["height"].replace("px", ""));
        // offset of the container to properly place the dragged object onto the mouse on mousemove
        offsetX = sceneContainer.offsetLeft + (widthElement / 2);
        offsetY = sceneContainer.offsetTop + (heightElement / 2);
    });
    activeObject.addEventListener("touchstart", (e) => {
        dragging = true;
        activeObject.style.cursor = "grabbing";

        const widthElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["width"].replace("px", ""));
        const heightElement = parseFloat(window.getComputedStyle(activeObject.parentElement)["height"].replace("px", ""));
        // offset of the container to properly place the dragged object onto the mouse on mousemove
        offsetX = sceneContainer.offsetLeft + (widthElement / 2);
        offsetY = sceneContainer.offsetTop + (heightElement / 2);
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
                // Carton de gauche (classe "keep") = jeter, Carton de droite (classe "throw") = garder
                const isKeep = carton.parentElement.classList.contains("throw"); // Inversé !
                const action = isKeep ? "keep" : "throw";
                const objectKey = activeObject.parentElement.dataset.name; // 8種キー
                const cartonSvg = carton.closest("svg");

                playCartonLottie({ action, objectKey, cartonSvg });

                isKeep ? keptObjects.push(activeObject) : thrownObjects.push(activeObject);

                umino.pause();
                // Making the object disappear
                activeObject.classList.remove("object-selected");
                activeObject.classList.add("done");
                activeObject.addEventListener("animationend", () => {
                    // Reseting scene
                    cartons.forEach(carton => {
                        carton.parentElement.classList.remove("active");
                        carton.parentElement.addEventListener("transitionend", () => carton.parentElement.style.zIndex = -1, { once: true })
                    })
                    objects.forEach(object => object.classList.add("hoverable-object"));
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

function startSceneCaption(object, defaultInterval = 3500, fadeMs = 250) {
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


function openMemoryScene(sceneId, object) {

    console.log("openMemoryScene called, sceneId =", sceneId);
    memoryScene.classList.add("hidden");
    lamp.classList.add("hidden");
    pendule.classList.add("hidden");
    horloge.classList.add("hidden");
    sew.classList.add("hidden");
    lamp2.classList.add("hidden");
    sewingMachine.classList.add("hidden");
    scissors.classList.add("hidden");
    armChair.classList.add("hidden");
    easterEgg.classList.add("hidden");
    magnetFlower.classList.add("hidden");
    polaroid1.classList.add("hidden");
    polaroid2.classList.add("hidden");

    memoryScene.classList.remove("hidden");

    if (sceneId === "music-box") {
        umino.volume = 0.8;
        umino.play();
        lamp.classList.remove("hidden");
        pendule.classList.remove("hidden");
        horloge.classList.remove("hidden");
    } else if (sceneId === "fauteuil") {
        sew.classList.remove("hidden");
        lamp2.classList.remove("hidden");
        sewingMachine.classList.remove("hidden");
        scissors.classList.remove("hidden");
        armChair.classList.remove("hidden");
    } else if (sceneId === "dessin") {
        easterEgg.classList.remove("hidden");
        magnetFlower.classList.remove("hidden");
        polaroid1.classList.remove("hidden");
        polaroid2.classList.remove("hidden");

    } else if (sceneId === "collier") {
        console.log("collier");
    } else if (sceneId === "caillou") {
        console.log("caillou");
    } else if (sceneId === "maneki") {
        console.log("maneki");
    } else if (sceneId === "pull") {
        console.log("pull");
    }
}

function playCartonLottie({ action, objectKey, cartonSvg }) {
    if (!cartonLottieOverlay || !window.lottie) return;

    const src = CARTON_LOTTIE?.[action]?.[objectKey];
    const soundSrc = CARTON_SOUNDS?.[action]?.[objectKey];
    if (!src) return;

    const r = cartonSvg.getBoundingClientRect();
    cartons.forEach(carton => {
        carton.classList.add("hidden");
    });

    console.log(cartonSvg);

    // Dimensions fixes pour toutes les animations
    const fixedWidth = 380; // Largeur fixe
    const fixedHeight = 380 // Hauteur fixe
    const bottomDistance = 15; // Distance fixe depuis le bas de la fenêtre

    cartonLottieOverlay.style.display = "block";
    cartonLottieOverlay.style.left = r.left + (r.width / 2) - (fixedWidth / 2) + "px"; // Centré sur le carton
    cartonLottieOverlay.style.bottom = bottomDistance + "px";
    cartonLottieOverlay.style.top = "auto"; // Désactiver le positionnement par le haut
    cartonLottieOverlay.style.width = fixedWidth + "px";
    cartonLottieOverlay.style.height = fixedHeight + "px";

    if (cartonLottieAnim) cartonLottieAnim.destroy();
    cartonLottieOverlay.innerHTML = "";


    // Jouer l'effet sonore
    if (soundSrc) {
        const delay = CARTON_SOUND_DELAYS?.[action]?.[objectKey] || 0;
        soundTimeout = setTimeout(() => {
            cartonSound = new Audio(soundSrc);
            cartonSound.play().catch(err => console.warn("Erreur lecture audio carton:", err));
        }, delay);
    }


    cartonLottieAnim = lottie.loadAnimation({
        container: cartonLottieOverlay,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: src,

    });

    cartonLottieAnim.addEventListener("complete", () => {
        cartonLottieOverlay.style.display = "none";
        cartonLottieOverlay.innerHTML = "";
        cartonLottieAnim = null;
        cartons.forEach(carton => {
            carton.classList.remove("hidden");
        });

        // Arrêter et nettoyer l'audio et le timeout
        if (soundTimeout) {
            clearTimeout(soundTimeout);
            soundTimeout = null;
        }
        if (cartonSound) {
            cartonSound.pause();
            cartonSound.currentTime = 0;
            cartonSound = null;
        }

        const TOTAL_OBJECTS = 8;
        if (keptObjects.length + thrownObjects.length >= TOTAL_OBJECTS) {
        playEnding();
        }
    });
}

function decideEndingKey() {
  const keptKeys = keptObjects
    .map(o => o.parentElement?.dataset?.name)
    .filter(Boolean);

  const thrownKeys = thrownObjects
    .map(o => o.parentElement?.dataset?.name)
    .filter(Boolean);

  const keptSet = new Set(keptKeys);
  const thrownSet = new Set(thrownKeys);

  // 全部keep
  if (keptKeys.length === 8) return "tout";

  // 全部throw
  if (thrownKeys.length === 8) return "rien";

  // ticketをthrowした
  if (thrownSet.has("ticket")) return "ticket";

  // enfant系
  if (keptSet.has("dessin") || keptSet.has("collier")) return "enfant";

  // ex系
  if (keptSet.has("pull") || keptSet.has("maneki")) return "ex";

  return "default";
}

function playEnding() {
  if (!endingOverlay || !window.lottie) return;

  const key = decideEndingKey();
  const src = ENDING_LOTTIE[key] || ENDING_LOTTIE.default;
  const audioSrc = ENDING_AUDIO[key] || ENDING_AUDIO.default;

  // 画面をエンディングモードに（操作止める）
  endingReadyToExit = false;
  endingOverlay.classList.remove("hidden");
  endingOverlay.classList.add("visible");
  endingOverlay.style.pointerEvents = "none";
  sceneContainer.style.pointerEvents = "none";

  // 前のendingを掃除
  if (endingAnim) {
    endingAnim.destroy();
    endingAnim = null;
  }
  endingOverlay.innerHTML = "";

  // 既存音を停止
  if (endingSound) {
    endingSound.pause();
    endingSound.currentTime = 0;
    endingSound = null;
  }
  if (drivingLoop) {
    drivingLoop.pause();
    drivingLoop.currentTime = 0;
    drivingLoop = null;
  }

  // ★ticket以外なら driving-loop をループ再生
  if (key !== "ticket") {
    drivingLoop = new Audio("assets/ending/sound/driving-loop.mp3"); // パスは適宜
    drivingLoop.loop = true;
    drivingLoop.volume = 1.0; // 好みで（エンディング音とぶつかるなら下げる）
    drivingLoop.play().catch(err => console.warn("Driving loop blocked:", err));
  }

  // エンディング固有音を再生
  if (audioSrc) {
    endingSound = new Audio(audioSrc);
    endingSound.volume = 1.0;
    endingSound.play().catch(err => console.warn("Ending audio blocked:", err));
  }

  // Lottie再生
  endingAnim = lottie.loadAnimation({
    container: endingOverlay,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: src
  });

  endingAnim.addEventListener("complete", () => {
    endingReadyToExit = true;

    // アニメ後：クリックでタイトルへ戻れるようにする
    endingOverlay.style.pointerEvents = "auto";
    endingOverlay.addEventListener("click", returnToTitle, { once: true });
  });
}
function returnToTitle() {
  // エンディング片付け
    window.location.reload();
}