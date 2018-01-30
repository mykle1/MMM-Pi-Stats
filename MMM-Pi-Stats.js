/* Magic Mirror
 * Module: MMM-Pi-Stats
 *
 * By Mykle1
 * MIT License
 */
Module.register("MMM-Pi-Stats", {

    // Module config defaults.
    defaults: {
        useHeader: false,    // true if you want a header      
        header: "",          // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        updateInterval: 15 * 1000, // Every minute

    },

    getStyles: function() {
        return ["MMM-Pi-Stats.css"];
    },

    getScripts: function() {
		
        return ["moment.js"];
    },

		
	start: function() {
        Log.info("Starting module: " + this.name);

        //  Set locale.
        this.Stats = {};
        this.scheduleUpdate();
    },
	

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("Loading . . .");
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("small", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var Stats = this.Stats;
		

        var top = document.createElement("div");
        top.classList.add("list-row");

		
		// cpu info
        var cpu = document.createElement("div");
        cpu.classList.add("xsmall", "bright", "cpu");
        cpu.innerHTML = Stats.cpu.name;
        wrapper.appendChild(cpu);
		
		
		// total and free ram
        var ram = document.createElement("div");
        ram.classList.add("xsmall", "bright", "ram");
        ram.innerHTML = "Total RAM = " + Stats.ram.total + Stats.ram.unit + " &nbsp &nbsp &nbsp "
						+ " Free RAM = " + Stats.ram.free + Stats.ram.unit;
        wrapper.appendChild(ram);
		
		
		// core load %
        var core = document.createElement("div");
        core.classList.add("xsmall", "bright", "core");
        core.innerHTML = Stats.cpu.threads[0].name + " &nbsp @ &nbsp " +  Number(Math.round(Stats.cpu.threads[0].usage+'e2')+'e-2') + "%";
        wrapper.appendChild(core);
		
		
        return wrapper;
		
    }, // closes getDom
    
    
    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_STATS') {
            this.hide();
        }  else if (notification === 'SHOW_STATS') {
            this.show(1000);
        }
            
    },


    processStats: function(data) {
        this.Stats = data;
	//	console.log(this.Stats); // for checking
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getStats();
        }, this.config.updateInterval);
        this.getStats(this.config.initialLoadDelay);
    },

    getStats: function() {
        this.sendSocketNotification('GET_STATS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "STATS_RESULT") {
            this.processStats(payload);

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
