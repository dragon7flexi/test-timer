class Reloader {
    constructor(view) {
        this.view = view;
        this.cntLimit = 2;
        this.restCnt = 2;
    }

    tryToReload(currTime) {
        if (!this.#canReload()) {
            return;
        }

        const nextRestCnt = this.restCnt - 1;
        this.restCnt = nextRestCnt;
        this.view.updateCnt(`残り: ${nextRestCnt}回`);
        if (nextRestCnt == 0) {
            this.view.cnt.style.color = "orange";
        }

        location.replace(`#${currTime}`);
    }

    #canReload() {
        return this.restCnt > 0;
    }

    resetCnt() {
        this.restCnt = this.cntLimit;
        this.view.updateCnt(`残り: ${this.cntLimit}回`);
        this.view.cnt.style.color = "lightgreen";
    }
}

class Timer {
    constructor(view, reloader) {
        this.view = view;
        this.reloader = reloader;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.reloadCooldown = 30.5;
        this.timerId = null;
    }

    start() {
        const disable = false;
        if (disable) {
            return;
        }

        this.startTime = Date.now();
        this.timerId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            const seconds = (this.elapsedTime / 1000).toFixed(1);
            
            this.view.updateTime(seconds);

            const isCooldownFinished = this.elapsedTime >= this.reloadCooldown * 1000;
            if (isCooldownFinished) {
                this.resetAndStart();
                this.reloader.resetCnt();
            }
        }, 100); // setInterval should be called in milliseconds (1000ms = 1s)
    }

    resetAndStart() {
        this.elapsedTime = 0;
        clearInterval(this.timerId); // clear the previous timer
        this.start();
    }
}

class Service {
    constructor(timer, reloader) {
        this.timer = timer;
        this.reloader = reloader;
    }

    startTimer() {
        this.timer.start();
    }

    reload() {
        this.reloader.tryToReload(this.timer.elapsedTime);
    }
}

class Controller {
    constructor(service) {
        this.service = service;
    }

    reload () {
        this.service.reload();
    }
}

class View {
    constructor() {
        this.container = document.createElement("div");
        this.time = document.createElement("p");
        this.cnt = document.createElement("p");
        this.reloadBtn = document.createElement("button");
        this.controller = null;
    }

    drawTimer() {
        this.#setInitialtext();
        this.#addControllerEventListener();
        this.#setStyle();
        this.#insertDomsIntoContainer();
        this.#appendToBody();
    }

    #setInitialtext() {
        this.updateTime("0");
        this.updateCnt(`残り: 2回`);
    }

    #setStyle() {
        this.container.style.position = "fixed";
        this.container.style.top = "20%";
        this.container.style.right = "15%";
        this.container.style.margin = "0";
        this.container.style.padding = "0";
        this.container.style.width = "100px";
        this.container.style.height = "150px";

        const INF = "99999";
        this.container.style.zIndex = INF;
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.justifyContent = "center";
        this.container.style.alignItems = "center";
        
        this.container.style.borderRadius = "20px";
        this.container.style.backgroundColor = "rgb(40, 40, 40)";

        this.time.style.color = "white";
        this.time.style.margin = "0";
        
        this.cnt.style.color = "lightgreen";

        this.reloadBtn.style.width = "50px";
        this.reloadBtn.style.height = "50px";
        this.reloadBtn.style.borderRadius = "10px";
        this.reloadBtn.style.backgroundColor = "rgb(50, 50, 50)";
    }

    #addControllerEventListener() {
        this.reloadBtn.onclick = () => {
            this.controller.reload();
        };
    }

    #insertDomsIntoContainer() {
        this.container.appendChild(this.time);
        this.container.appendChild(this.cnt);
        this.container.appendChild(this.reloadBtn);
    }

    #appendToBody() {
        document.body.appendChild(this.container);
    }

    updateTime(newTime) {
        this.time.innerText = newTime;
    }

    updateCnt(newCnt) {
        this.cnt.innerText = newCnt;
    }
}

class App {
    constructor(view, service) {
        this.view = view;
        this.service = service;
        this.view.controller = new Controller(service);
    }

    start() {
        this.view.drawTimer();
        this.service.startTimer();
    }
}

function getNewApp() {
    const view = new View();
    const reloader = new Reloader(view);
    const timer = new Timer(view, reloader);
    const service = new Service(timer, reloader);
    const controller = new Controller(service);

    return new App(view, service);
}

function main() {
    const app = getNewApp();
    app.start();
}

main();
