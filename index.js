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
const photosChien = document.querySelectorAll("#photo-chien");
const photosChienContainer = document.getElementById("Calque-collier-souvenir");
const tv = document.getElementById("tv");
const lovers = document.getElementById("lovers");
const objetsManeki = document.getElementById("objets_maneki");
const leavesContainer = document.querySelector(".leaves-container");
const leaves = document.querySelectorAll(".leaves-container > img");


// audio in memory scenes
const song = new Audio("./compressed/audios/song.mp3");
song.loop = true;
const scissorsSound = new Audio("./compressed/audios/meuble/sound-effects/ciseaux-tissu.mp3");
const machineSound = new Audio("./compressed/audios/meuble/sound-effects/machine-a-coudre.mp3");

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
    default: "compressed/assets/ending/sound/fin-defaut.mp3",
    enfant: "compressed/assets/ending/sound/fin-enfant.mp3",
    ex: "compressed/assets/ending/sound/fin-ex.mp3",
    rien: "compressed/assets/ending/sound/fin-garde-rien.mp3",
    tout: "compressed/assets/ending/sound/fin-garde-tout.mp3",
    ticket: "compressed/assets/ending/sound/fin-ticket.mp3",
};


// === credits ===
const creditsOverlay = document.getElementById("credits-overlay");
const creditsImg = document.getElementById("credits-image");

let creditsRAF = null;


let actualVoiceMemory;
let actualAmbianceSound;

let activeObject = null;
let currentObject = null;
let keptObjects = [];
let thrownObjects = [];
let dragging = false;

let sceneCaptionTimer = null;
let currentCaptionIndex = 0;
let currentCaptionLines = [];

const AUDIOS_SRC = {
    "music-box": "compressed/audios/boite-a-musique/audio.mp3",
    "caillou": "compressed/audios/caillou/audio.mp3",
    "collier": "compressed/audios/collier/audio.mp3",
    "dessin": "compressed/audios/dessin/audio.mp3",
    "maneki": "compressed/audios/maneki/audio.mp3",
    "fauteuil": "compressed/audios/meuble/audio.mp3",
    "pull": "compressed/audios/pull/audio.mp3",
    "ticket": "compressed/audios/ticket/audio.mp3"
}

const CARTON_LOTTIE = {
    throw: {
        "music-box": "compressed/assets/objets/cartons/musique-donner/musique-donner.json",
        "caillou": "compressed/assets/objets/cartons/caillou-donner/caillou-donner.json",
        "collier": "compressed/assets/objets/cartons/Donner-collier/collier-donner.json",
        "dessin": "compressed/assets/objets/cartons/Jeter-dessin/dessin-donner.json",
        "maneki": "compressed/assets/objets/cartons/maneki-donner/maneki-donner.json",
        "fauteuil": "compressed/assets/objets/cartons/fauteuil-donner/fauteuil-donner.json",
        "pull": "compressed/assets/objets/cartons/sweat-donner/sweat-donner.json",
        "ticket": "compressed/assets/objets/cartons/Jeter-ticket-de-caisse/ticket-donner.json",
    },
    keep: {
        "music-box": "compressed/assets/objets/cartons/musique-garder/musique-garder.json",
        "caillou": "compressed/assets/objets/cartons/caillou-garder/caillou-garder.json",
        "collier": "compressed/assets/objets/cartons/Garder-collier-chien/collier-garder.json",
        "dessin": "compressed/assets/objets/cartons/Garder-dessin/dessin-garder.json",
        "maneki": "compressed/assets/objets/cartons/maneki-garder/maneki-garder.json",
        "fauteuil": "compressed/assets/objets/cartons/fauteuil-garder/fauteuil-garder.json",
        "pull": "compressed/assets/objets/cartons/sweat-garder/sweat-garder.json",
        "ticket": "compressed/assets/objets/cartons/Garder-ticket-de-caisse/ticket-garder.json",
    },
};

const ENDING_LOTTIE = {
    "default": "compressed/assets/ending/defaut.json",
    "enfant": "compressed/assets/ending/enfant.json",
    "ex": "compressed/assets/ending/ex.json",
    "rien": "compressed/assets/ending/rien.json",
    "ticket": "compressed/assets/ending/ticket.json",
    "tout": "compressed/assets/ending/tout-.json"
}

const CARTON_SOUNDS = {
    throw: {
        "music-box": "compressed/assets/objets/cartons/musique-donner/piano-slam-lid-move-chair-43789.mp3",
        "caillou": "compressed/assets/objets/cartons/caillou-donner/small-rock-break-194553.mp3",
        "collier": "compressed/assets/objets/cartons/Donner-collier/sound-of-ice-cracking-426894.mp3",
        "dessin": "compressed/assets/objets/cartons/Jeter-dessin/the-sound-of-an-exploding-cracker-with-tinsel-or-confetti.mp3",
        "maneki": "compressed/assets/objets/cartons/maneki-donner/cat-meow-sound-383823.mp3",
        "fauteuil": "compressed/assets/objets/cartons/fauteuil-donner/cartoon-spring-bright-fx_179bpm.wav",
        "pull": "compressed/assets/objets/cartons/sweat-donner/cashier-quotka-chingquot-sound-effect-129698.mp3",
        "ticket": "compressed/assets/objets/cartons/Jeter-ticket-de-caisse/the-impatient-sound-of-a-paper-envelope-tearing.mp3",
    },
    keep: {
        "music-box": "compressed/assets/objets/cartons/musique-garder/playing-the-harp-up-the-scale-slowly.mp3",
        "caillou": "compressed/assets/objets/cartons/caillou-garder/rainy-night-ambience-loop-31064.mp3",// Pas de fichier son disponible
        "collier": "compressed/assets/objets/cartons/Garder-collier-chien/dog-sound.mp3",
        "dessin": "compressed/assets/objets/cartons/Garder-dessin/children-giggling-kids-laughing-hd-378111.mp3",
        "maneki": "compressed/assets/objets/cartons/maneki-garder/montbell-bonsho-von-japan-30695.mp3",
        "fauteuil": "compressed/assets/objets/cartons/fauteuil-garder/diamond-found-190255.mp3",
        "pull": "compressed/assets/objets/cartons/sweat-garder/warm-piano-logo-116098.mp3",
        "ticket": "compressed/assets/objets/cartons/Garder-ticket-de-caisse/the-noise-of-a-large-stack-of-papers-falling.mp3",
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

const loader = document.querySelector(".loader");
document.addEventListener("DOMContentLoaded", () => {
    loader.style.opacity = 0;
    loader.addEventListener("transitionend", () => {
        loader.style.display = "none";
    })
})


const startObject = {
    dataset: {
        intervals: "8000, 6000, 4500, 7000, 6500",
        story: "Dans trois jours, nouvelle vie. Nouvelle ville et nouveau studio microscopique. Et moi, plantée là avec mes cartons vides et mes souvenirs partout.|L'opportunité professionnelle que j'ai acceptée m'emmène vers un avenir prometteur, mais dans une ville plus chère où chaque mètre carré compte.|Mon futur studio sera trois fois plus petit que cet espace où j'ai vécu tant d'histoires.|La peluche. Le journal. Le canapé. Les meubles chinés. Chaque objet me regarde comme si je trahissais une partie de moi.|Derrière moi, les fantômes d'une histoire qui s'achève, les objets, eux, n'ont pas encore compris qu'il fallait partir.|Allez, pas le temps de pleurer. Il faut choisir, garder l'essentiel mais certains objets sont plus difficiles à trier que d’autres."
    }
};


intros.forEach(intro => intro.addEventListener('animationend', () => { intro.style.display = "none" }, { once: true }))

startBtn.addEventListener("click", () => {
    titleSection.classList.add("disappear");
    song.play();
    titleSection.addEventListener("animationend", () => {
        const audioIntro = new Audio("./compressed/audios/intro.mp3");
        audioIntro.volume = .8;
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
        actualVoiceMemory = new Audio(AUDIOS_SRC[activeObject.parentElement.dataset.name]);

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

            actualVoiceMemory.play();
            startSceneCaption(activeObject);

            scenePhoto.addEventListener("click", () => {
                actualVoiceMemory.pause();
                actualAmbianceSound && actualAmbianceSound.pause();
                stopSceneCaption();
                overlay.classList.add("hidden");
                scenePhoto.src = "";
                fadeOverlayTo(0, 800, () => {
                    startBoxSelection(activeObject);
                });
            }, { once: true });
            actualVoiceMemory.addEventListener("ended", () => {
                stopSceneCaption();
            }, { once: true });

        });


    }, { once: true })
})

//memory scene animation and interaction

let isDark = false; // 今暗いかどうかを記録

lamp.addEventListener("click", () => {
    if (!isDark) {
        darkOverlay.classList.remove("hidden"); // 暗くする
        isDark = true;
    } else {
        darkOverlay.classList.add("hidden"); // 明るく戻す
        isDark = false;
    }
});

lamp2.addEventListener("click", () => {
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

// Creditsボタンで開始
creditsBtn.addEventListener("click", () => {
    song.play();
    startCreditsScroll(50000); // 速度調整したければここ（ms）
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

                console.log(`Objet "${objectKey}" → Action: ${action}`);

                if (isKeep) {
                    keptObjects.push(activeObject);
                    console.log(`  ✓ Ajouté à keptObjects (total: ${keptObjects.length})`);
                } else {
                    thrownObjects.push(activeObject);
                    console.log(`  ✗ Ajouté à thrownObjects (total: ${thrownObjects.length})`);
                }

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
                // End of reset
            }
        });
        // If cupboard not under mouse on mouse up -> do nothing
        if (activeObject) {
            activeObject.parentElement.style.pointerEvents = "auto";
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

function fadeOutAudio(audio, duration = 500, callback) {
    if (!audio || audio.paused) {
        if (callback) callback();
        return;
    }

    const startVolume = audio.volume;
    const startTime = performance.now();

    function fade(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        audio.volume = startVolume * (1 - progress);

        if (progress < 1) {
            requestAnimationFrame(fade);
        } else {
            audio.volume = 0;
            if (callback) callback();
        }
    }

    requestAnimationFrame(fade);
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
    photosChienContainer.classList.add("hidden");
    boundary.classList.add('hidden');
    lovers.classList.add('hidden');
    tv.classList.add('hidden');
    objetsManeki.classList.add("hidden");
    leavesContainer.classList.add("hidden");
    darkOverlay.classList.add("hidden");
    memoryScene.classList.remove("hidden");

    if (sceneId === "music-box") {
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
        boundary.classList.remove('hidden');

    } else if (sceneId === "collier") {
        photosChienContainer.classList.remove("hidden");
        photosChienContainer.addEventListener("click", () => {
            actualVoiceMemory.pause();
            actualAmbianceSound && actualAmbianceSound.pause();
            stopSceneCaption();
            overlay.classList.add("hidden");
            scenePhoto.src = "";
            fadeOverlayTo(0, 800, () => {
                startBoxSelection(activeObject);
            });
        }, { once: true })
    } else if (sceneId === "caillou") {
        actualAmbianceSound = new Audio("compressed/audios/caillou/pluie.mp3");
        actualAmbianceSound.loop = true;
        actualAmbianceSound.volume = 0.85;
        actualAmbianceSound.play();
        leavesContainer.classList.remove("hidden");
        leavesContainer.addEventListener("click", () => {
            actualVoiceMemory.pause();
            actualAmbianceSound && actualAmbianceSound.pause();
            stopSceneCaption();
            overlay.classList.add("hidden");
            scenePhoto.src = "";
            fadeOverlayTo(0, 800, () => {
                startBoxSelection(activeObject);
            });
        }, { once: true })
    } else if (sceneId === "maneki") {
        actualAmbianceSound = new Audio("compressed/audios/maneki/furin-loop.mp3");
        actualAmbianceSound.loop = true;
        actualAmbianceSound.play();
        objetsManeki.classList.remove("hidden");
    } else if (sceneId === "pull") {
        lovers.classList.remove('hidden');
        tv.classList.remove('hidden');
    }
}

tv.addEventListener("click", () => {
    if (tv.src.includes("kiki")) {
        tv.src = "compressed/assets/souvenirs/parts/pull/got.svg";
    }
    else if (tv.src.includes("got")) {
        tv.src = "compressed/assets/souvenirs/parts/pull/hypload.png";
    }
    else if (tv.src.includes("hypload")) {
        tv.src = "compressed/assets/souvenirs/parts/pull/stranger-things.svg";
    }
    else {
        tv.src = "compressed/assets/souvenirs/parts/pull/kiki.svg";
    }


})

// Collar memory animations
const normeDeplacementCollier = 22;
photosChienContainer.addEventListener("mousemove", (e) => {
    const rect = photosChienContainer.getBoundingClientRect();
    photosChien.forEach(photo => {
        // Pos mouse
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Pos photo
        const posX = photo.getBoundingClientRect().left - rect.left + (photo.getBoundingClientRect().width / 2);
        const posY = photo.getBoundingClientRect().top - rect.top + (photo.getBoundingClientRect().height / 2);
        let x = posX - mouseX;
        let y = posY - mouseY;
        const norme = Math.sqrt(x ** 2 + y ** 2);
        x /= norme;
        y /= norme;
        x *= normeDeplacementCollier;
        y *= normeDeplacementCollier;
        photo.style.transform = `translate(${x}px) translateY(${y}px)`;
    })
})
photosChienContainer.addEventListener("mouseleave", (e) => {
    photosChien.forEach(photo => {
        photo.style.transform = `none`;
    })
})

// Leaves on rock memory animations
leavesContainer.addEventListener("mousemove", (e) => {
    const rect = leavesContainer.getBoundingClientRect();
    leaves.forEach(leaf => {
        // Pos mouse
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Pos photo
        const posX = leaf.getBoundingClientRect().left - rect.left + (leaf.getBoundingClientRect().width / 2);
        const posY = leaf.getBoundingClientRect().top - rect.top + (leaf.getBoundingClientRect().height / 2);
        let x = posX - mouseX;
        let y = posY - mouseY;
        const norme = Math.sqrt(x ** 2 + y ** 2);
        x /= norme;
        y /= norme;
        const normeDeplacementFeuilles = norme < 100 ? 100 - norme : 0;
        if (norme < 100 && !leaf.dataset.hasPlayedASound == true) {
            leaf.dataset.hasPlayedASound = true;
            new Audio(`./compressed/audios/caillou/sound-effects/leaf-${Math.floor(Math.random() * 3) + 1}.mp3`).play();
        }
        x *= normeDeplacementFeuilles;
        y *= normeDeplacementFeuilles;
        leaf.style.transform = `translate(${x}px) translateY(${y}px)`;

    })
})



function playCartonLottie({ action, objectKey, cartonSvg }) {
    if (!cartonLottieOverlay || !window.lottie) return;

    const src = CARTON_LOTTIE?.[action]?.[objectKey];
    const soundSrc = CARTON_SOUNDS?.[action]?.[objectKey];
    if (!src) return;

    const r = cartonSvg.getBoundingClientRect();

    // Dimensions fixes pour toutes les animations
    const fixedWidth = 327; // Largeur fixe
    const bottomDistance = 15; // Distance fixe depuis le bas de la fenêtre

    // Préparer l'overlay AVANT de cacher les cartons
    cartonLottieOverlay.style.display = "block";
    cartonLottieOverlay.style.left = r.left + (r.width / 2) - (fixedWidth / 2) + "px"; // Centré sur le carton
    cartonLottieOverlay.style.bottom = bottomDistance + "px";
    cartonLottieOverlay.style.top = "auto"; // Désactiver le positionnement par le haut
    cartonLottieOverlay.style.width = fixedWidth + "px";
    cartonLottieOverlay.style.height = "auto"; // Hauteur automatique pour respecter le ratio

    if (cartonLottieAnim) cartonLottieAnim.destroy();
    cartonLottieOverlay.innerHTML = "";


    // Jouer l'effet sonore
    if (soundSrc) {
        const delay = CARTON_SOUND_DELAYS?.[action]?.[objectKey] || 0;
        soundTimeout = setTimeout(() => {
            cartonSound = new Audio(soundSrc);
            cartonSound.volume = 0.2;
            cartonSound.play().catch(err => console.warn("Erreur lecture audio carton:", err));
        }, delay);
    }


    // Charger et démarrer l'animation Lottie
    cartonLottieAnim = lottie.loadAnimation({
        container: cartonLottieOverlay,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: src,

    });

    // Cacher les cartons APRÈS avoir démarré l'animation (délai pour chevauchement visuel)
    setTimeout(() => {
        cartons.forEach(carton => {
            carton.classList.add("hidden");
        });
    }, 200);

    cartonLottieAnim.addEventListener("complete", () => {
        cartonLottieOverlay.style.display = "none";
        cartonLottieOverlay.innerHTML = "";
        cartonLottieAnim = null;
        cartons.forEach(carton => {
            carton.classList.remove("hidden");
        });

        // Arrêter et nettoyer le timeout
        if (soundTimeout) {
            clearTimeout(soundTimeout);
            soundTimeout = null;
        }

        // Faire un fondu du son avant de l'arrêter
        if (cartonSound && !cartonSound.paused) {
            fadeOutAudio(cartonSound, 500, () => {
                cartonSound.pause();
                cartonSound.currentTime = 0;
                cartonSound = null;
            });
        } else if (cartonSound) {
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

    console.log("=== DÉCISION DE FIN ===");
    console.log("Objets gardés:", keptKeys);
    console.log("Objets jetés:", thrownKeys);
    console.log("Nombre gardés:", keptKeys.length);
    console.log("Nombre jetés:", thrownKeys.length);

    // Tout gardé
    if (keptKeys.length === 8) {
        console.log("→ Fin choisie: TOUT (tous les objets gardés)");
        return "tout";
    }

    // Tout jeté
    if (thrownKeys.length === 8) {
        console.log("→ Fin choisie: RIEN (tous les objets jetés)");
        return "rien";
    }

    // Ticket jeté (priorité haute car c'est une fin spécifique)
    if (thrownSet.has("ticket")) {
        console.log("→ Fin choisie: TICKET (ticket jeté)");
        return "ticket";
    }

    // Fin EX : si on jette les objets liés à l'ex (pull ET maneki)
    const hasExObjects = thrownSet.has("pull") && thrownSet.has("maneki");
    console.log("Condition EX:");
    console.log("  - Pull jeté?", thrownSet.has("pull"));
    console.log("  - Maneki jeté?", thrownSet.has("maneki"));
    console.log("  → A jeté LES DEUX objets de l'ex:", hasExObjects);

    if (hasExObjects) {
        console.log("→ Fin choisie: EX");
        return "ex";
    }

    // Fin ENFANT : si on garde les objets liés à l'enfance (dessin ET collier)
    const hasChildObjects = keptSet.has("dessin") && keptSet.has("collier");
    console.log("Condition ENFANT:");
    console.log("  - Dessin gardé?", keptSet.has("dessin"));
    console.log("  - Collier gardé?", keptSet.has("collier"));
    console.log("  → A gardé LES DEUX objets de l'enfance:", hasChildObjects);

    if (hasChildObjects) {
        console.log("→ Fin choisie: ENFANT");
        return "enfant";
    }

    // Par défaut
    console.log("→ Fin choisie: DEFAULT");
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
        drivingLoop = new Audio("compressed/assets/ending/sound/driving-loop.mp3"); // パスは適宜
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

function startCreditsScroll(durationMs = 500000, paddingPx = 40) {
    if (!creditsOverlay || !creditsImg) return;
    // 表示
    creditsOverlay.classList.remove("hidden");
    creditsOverlay.classList.add("visible");
    creditsOverlay.setAttribute("aria-hidden", "false");

    // 既存のアニメがあれば止める
    if (creditsRAF) cancelAnimationFrame(creditsRAF);

    // 画像ロード後にスクロール開始
    const run = () => {
        const viewportH = window.innerHeight;
        const imgH = creditsImg.getBoundingClientRect().height;

        // 下から出てきて、上に抜けるまで
        const fromY = viewportH + paddingPx;
        const toY = -(imgH + paddingPx);

        const start = performance.now();

        const tick = (now) => {
            const t = Math.min(1, (now - start) / durationMs);
            const y = fromY + (toY - fromY) * t;
            creditsImg.style.transform = `translateY(${y}px)`;

            if (t < 1) {
                creditsRAF = requestAnimationFrame(tick);
            } else {
                // 最後まで流れたら止める（クリック待ち）
                creditsRAF = null;
            }
        };

        creditsRAF = requestAnimationFrame(tick);
    };

    if (creditsImg.complete) run();
    else creditsImg.onload = run;

    // クリックでリロード
    creditsOverlay.addEventListener("click", () => location.reload(), { once: true });
}

