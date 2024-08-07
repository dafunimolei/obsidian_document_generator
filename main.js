/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => HelloworldPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var rolling_dice = 0;
var index_processed = 0;
var index_all = 0;
var intput_question = "";
var output_answer = "";
var output_docu = "";
var index_info = "";
var question = "";
var document_info = "";
var password = "";
var username = "";
var topicid = "";
var lastres = "";
var lastleft = 0;
var lastright = 0;
var index_array = [];
var left = 0;
var right = 0;
var current_state = 0;
var ask_times = 0;
var query_type = 0;
var DEFAULT_SETTINGS = {
  usertoken: "bafeec42da6b4eaaab93b8950abc6eee44c3a30e",
  serveraddress: "localhost:5000"
};
var HelloworldPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText("Status Bar Text");
    this.addRibbonIcon("pencil", "Auto Document Generator", async () => {
      this.showCustomModalInOutline();
    });
    this.addSettingTab(new SampleSettingTab(this.app, this));
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "//styles.css";
    document.head.appendChild(link);
    this.registerDomEvent(document, "click", (evt) => {
      console.log("click", evt);
    });
    this.registerInterval(window.setInterval(() => console.log("setInterval"), 5 * 60 * 1e3));
  }
  showCustomModalInOutline() {
    const modal = new TextModal(this.app, this.settings.usertoken, this.settings.serveraddress);
    modal.open();
    const modalContent = modal.contentEl;
  }
  onunload() {
  }
  addTextEditor() {
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "\u8BF7\u8F93\u5165\u60A8\u7684\u6587\u672C";
    input.addEventListener("input", () => {
      this.displayText(input.value);
    });
    document.body.appendChild(input);
  }
  displayText(text) {
    let displayDiv = document.createElement("div");
    displayDiv.textContent = text;
    let existingDisplay = document.getElementById("text-display");
    if (existingDisplay) {
      existingDisplay.remove();
    }
    displayDiv.id = "text-display";
    document.body.appendChild(displayDiv);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var TextModal = class extends import_obsidian.Modal {
  constructor(app, t, sa) {
    super(app);
    this.token = "";
    this.serveradd = "";
    this.thisapp = app;
    this.token = t;
    this.serveradd = sa;
  }
  setupWebSocket1() {
    this.socket = new WebSocket("ws://" + this.serveradd + "/getIndex");
    this.socket.onopen = () => {
      console.log("WebSocket connection established");
      new import_obsidian.Notice("WebSocket connection established");
      const data = JSON.stringify({
        input_string: this.textarea.value,
        input_token: this.token,
        input_username: this.input_username.value,
        input_password: this.input_password.value,
        ask_times,
        query_type,
        rolling_dice,
        topicid: this.input_topicid.value
      });
      lastres = this.output_suggestions.value;
      this.output_suggestions.value = "\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u52FF\u8F93\u5165\u6216\u89E6\u78B0\u6309\u952E...";
      this.socket.send(data);
    };
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data === "object") {
          const content = data.content || "";
          if (data.error) {
            new import_obsidian.Notice(data.error + " \u8BF7\u70B9\u51FB\u91CD\u65B0\u751F\u6210\u6B64\u76EE\u5F55 ");
          }
          if (this.output_suggestions.value === "\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u52FF\u8F93\u5165\u6216\u89E6\u78B0\u6309\u952E..." && content !== "") {
            this.output_suggestions.value = "";
          }
          this.output_suggestions.value += content;
          index_info = this.output_suggestions.value;
          output_answer = this.output_suggestions.value;
          this.output_suggestions.scrollTop = this.output_suggestions.scrollHeight;
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile) {
            const fp = activeFile.path;
            this.thisapp.vault.adapter.write(fp, this.output_suggestions.value);
          }
        } else {
          console.warn("Received data is not a valid JSON object:", event.data);
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error, event.data);
      }
      ;
    };
    this.socket.onclose = (event) => {
      const tempStr = index_info.replace(/####/g, "__FOURHASH__").replace(/###/g, "__THREEHASH__");
      let parts = tempStr.split(/##(?!#)/);
      parts = parts.map((part) => part.replace(/__FOURHASH__/g, "####").replace(/__THREEHASH__/g, "###"));
      index_array = parts;
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.log("Connection died");
      }
      new import_obsidian.Notice(" \u76EE\u5F55\u751F\u6210\u5B8C\u6BD5 ");
    };
    this.socket.onerror = (error) => {
      console.error(`[WebSocket Error] ${error}`);
      new import_obsidian.Notice("[WebSocket Error] ${error}");
    };
  }
  setupWebSocket2() {
    this.socket = new WebSocket("ws://" + this.serveradd + "/getDocument");
    if (index_processed == 0 && index_all == 0) {
      if (index_array.length == 0) {
        new import_obsidian.Notice("\u7A7A\u76EE\u5F55\uFF01");
        return;
      }
      left = 0;
      right = index_array[0].length;
    }
    this.socket.onopen = () => {
      console.log("WebSocket connection established");
      new import_obsidian.Notice("WebSocket connection established");
      const data = JSON.stringify({
        input_string: this.textarea.value,
        input_token: this.token,
        input_username: this.input_username.value,
        input_password: this.input_password.value,
        index: index_info,
        ask_times,
        query_type,
        rolling_dice,
        topicid: this.input_topicid.value,
        index_processed,
        output_suggestions: output_answer,
        index_all
      });
      lastres = output_answer;
      lastleft = left;
      lastright = right;
      right += index_array[index_processed + 1].length + 2;
      if (index_processed == 0 && index_all == 0)
        this.output_ducument.value = "\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u52FF\u8F93\u5165\u6216\u89E6\u78B0\u6309\u952E...";
      this.socket.send(data);
    };
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data === "object") {
          const content = data.content || "";
          if (data.index_processed && data.index_all) {
            index_processed = parseInt(data.index_processed, 10);
            index_all = parseInt(data.index_all, 10);
            if (index_processed >= index_all) {
              new import_obsidian.Notice("\u5168\u90E8\u6587\u6863\u751F\u6210\u5B8C\u6210");
            }
          }
          if (data.error) {
            new import_obsidian.Notice(data.error + " \u8BF7\u70B9\u51FB\u91CD\u65B0\u751F\u6210\u6B64\u5C0F\u7ED3 ");
          }
          if (this.output_ducument.value === "\u6B63\u5728\u751F\u6210\u4E2D\uFF0C\u8BF7\u52FF\u8F93\u5165\u6216\u89E6\u78B0\u6309\u952E..." && content !== "") {
            this.output_ducument.value = "";
          }
          this.output_ducument.value += content;
          this.output_suggestions.value = this.output_suggestions.value.slice(0, left) + content + index_info.slice(right, index_info.length);
          left += content.length;
          document_info = this.output_ducument.value;
          output_answer = this.output_suggestions.value;
          output_docu = this.output_ducument.value;
          this.output_ducument.scrollTop = this.output_ducument.scrollHeight;
          const activeFile = this.app.workspace.getActiveFile();
          if (activeFile) {
            const fp = activeFile.path;
            this.thisapp.vault.adapter.write(fp, output_answer);
          }
        } else {
          console.warn("Received data is not a valid JSON object:", event.data);
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error, event.data);
      }
      ;
    };
    this.socket.onclose = (event) => {
      new import_obsidian.Notice(" \u5DF2\u751F\u6210 " + index_processed + " \u6BB5,\u4E00\u5171 " + index_all + " \u6BB5 ");
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.log("Connection died");
      }
    };
    this.socket.onerror = (error) => {
      console.error(`[WebSocket Error] ${error}`);
      new import_obsidian.Notice("[WebSocket Error] ${error}");
    };
  }
  /*
  	setupWebSocket3() {
  		this.socket = new WebSocket("ws://" + this.serveradd + "/getRevise");
  
  		this.socket.onopen = () => {
  			console.log("WebSocket connection established");
  			new Notice('WebSocket connection established');
  			const data = JSON.stringify({
  				input_string: this.textarea.value,
  				input_token: this.token,
  				input_username: this.input_username.value,
  				input_password: this.input_password.value,
  				index: index_info,
  				ask_times: ask_times,
  				query_type: query_type,
  				rolling_dice: rolling_dice,
  				topicid: this.input_topicid.value,
  				index_processed: index_processed,
  				output_suggestions: this.output_ducument.value,
  				index_all: index_all,
  				problem: this.requirement.value
  			});
  			//new Notice('Preparing data');
  			//new Notice(data);
  			lastres = this.requirement.value;
  			this.socket.send(data);
  			this.revise.value = "正在生成中，请勿输入或触碰按键...";
  			
  			//new Notice('Data sent');
  		};
  		let result = '';
  
  		//new Notice(event.data);
  		this.socket.onmessage = (event) => {
  			try {
  				// 尝试解析接收到的消息为 JSON 对象
  				const data = JSON.parse(event.data);
  
  				// 检查并处理 JSON 数据
  				if (data && typeof data === 'object') {
  					// 假设 JSON 数据包含一个 `content` 字段
  					const content = data.content || '';
  					
  					// 更新 output_ducument 的值
  					if (this.revise.value === "正在生成中，请勿输入或触碰按键..." && content !== '') {
  						this.revise.value = "";
  					}
  					this.revise.value += content;
  					
  					this.revise.scrollTop = this.revise.scrollHeight;
  
  					// 获取当前活动文件
  					
  				} else {
  					console.warn('Received data is not a valid JSON object:', event.data);
  				}
  			} catch (error) {
  				console.error('Error parsing JSON data:', error, event.data);
  			};
  
  
  		};
  
  		this.socket.onclose = (event) => {
  			if (event.wasClean) {
  				console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  			} else {
  				console.log('Connection died');
  			}
  		};
  
  		this.socket.onerror = (error) => {
  			console.error(`[WebSocket Error] ${error}`);
  			new Notice('[WebSocket Error] ${error}');
  		};
  	}
  	*/
  async loadcontent_index() {
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const filePath = activeFile.path;
      try {
        index_info = await this.app.vault.adapter.read(filePath);
        console.log("Current file content:", index_info);
      } catch (error) {
        console.error("Failed to read file:", error);
      }
    }
  }
  async loadcontent_output_suggestions() {
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const filePath = activeFile.path;
      try {
        let tmp = this.output_suggestions.value.length;
        this.output_suggestions.value = await this.app.vault.adapter.read(filePath);
        output_answer = this.output_suggestions.value;
        left = left - tmp + output_answer.length;
        console.log("Current file content:", this.output_suggestions.value);
      } catch (error) {
        console.error("Failed to read file:", error);
      }
    } else {
      this.output_suggestions.value = "";
      console.log("No active file.");
    }
  }
  onOpen() {
    let { contentEl } = this;
    contentEl.createEl("h1", { text: "Input your requirements:" });
    contentEl.style.width = "300px";
    contentEl.style.height = "300px";
    contentEl.style.zIndex = "9999";
    contentEl.style.position = "fixed";
    contentEl.style.top = localStorage.getItem("lastPositionTop") || "50%";
    contentEl.style.left = localStorage.getItem("lastPositionLeft") || "50%";
    contentEl.style.backgroundColor = "white";
    contentEl.style.border = "1px solid #ccc";
    contentEl.style.borderRadius = "10px";
    const inputDiv = contentEl.createEl("div");
    inputDiv.style.marginBottom = "5px";
    inputDiv.style.display = "flex";
    inputDiv.style.justifyContent = "center";
    inputDiv.style.alignItems = "center";
    this.textarea = inputDiv.createEl("textarea");
    this.textarea.placeholder = "Enter your text here";
    this.textarea.style.height = "80px";
    this.textarea.style.width = "250px";
    this.textarea.focus();
    this.textarea.value = intput_question;
    this.textarea.addEventListener("input", (event) => {
      const inputt = event.target;
      this.textarea.value = inputt.value;
      intput_question = this.textarea.value;
    });
    const outputDiv = contentEl.createEl("div");
    outputDiv.style.marginBottom = "5px";
    outputDiv.style.display = "flex";
    outputDiv.style.flexDirection = "column";
    outputDiv.style.justifyContent = "center";
    outputDiv.style.alignItems = "center";
    this.output_suggestions = outputDiv.createEl("textarea");
    this.output_suggestions.placeholder = "output_suggestions are as follows:";
    this.output_suggestions.style.height = "0px";
    this.output_suggestions.style.width = "0px";
    this.output_suggestions.focus();
    this.output_suggestions.style.display = "none";
    this.output_ducument = outputDiv.createEl("textarea");
    this.output_ducument.placeholder = "output_ducument are as follows:";
    this.output_ducument.style.height = "0px";
    this.output_ducument.style.width = "0px";
    this.output_ducument.focus();
    this.output_ducument.style.display = "none";
    this.output_ducument.addEventListener("input", (event) => {
      const inputt = event.target;
      this.output_ducument.value = inputt.value;
      output_docu = this.output_ducument.value;
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        const fp = activeFile.path;
        this.thisapp.vault.adapter.write(fp, this.output_ducument.value);
      }
    });
    this.output_suggestions.addEventListener("input", (event) => {
      const inputt = event.target;
      this.output_suggestions.value = inputt.value;
      if (current_state != 2) {
        index_info = this.output_suggestions.value;
      }
      output_answer = this.output_suggestions.value;
      const tempStr = index_info.replace(/####/g, "__FOURHASH__").replace(/###/g, "__THREEHASH__");
      let parts = tempStr.split(/##(?!#)/);
      parts = parts.map((part) => part.replace(/__FOURHASH__/g, "####").replace(/__THREEHASH__/g, "###"));
      index_array = parts;
    });
    if (query_type == 1)
      this.output_suggestions.value = index_info;
    if (query_type == 2)
      this.output_suggestions.value = document_info;
    this.output_suggestions.value = output_answer;
    this.output_ducument.value = output_docu;
    const inputInfoDiv = contentEl.createEl("div");
    inputInfoDiv.style.marginBottom = "5px";
    inputInfoDiv.style.display = "flex";
    inputInfoDiv.style.justifyContent = "center";
    inputInfoDiv.style.alignItems = "center";
    this.input_username = inputInfoDiv.createEl("input");
    this.input_username.type = "text";
    this.input_username.style.width = "45%";
    this.input_username.placeholder = "Docchain username";
    this.input_username.style.flexWrap = "wrap";
    this.input_username.focus();
    this.input_password = inputInfoDiv.createEl("input");
    this.input_password.type = "text";
    this.input_password.style.width = "45%";
    this.input_password.placeholder = "Docchain password";
    this.input_password.style.flexWrap = "wrap";
    this.input_password.focus();
    this.input_topicid = inputInfoDiv.createEl("input");
    this.input_topicid.type = "text";
    this.input_topicid.style.width = "45%";
    this.input_topicid.placeholder = "Docchain topicid";
    this.input_topicid.style.flexWrap = "wrap";
    this.input_topicid.focus();
    const buttonDiv = contentEl.createEl("div");
    buttonDiv.style.marginBottom = "5px";
    buttonDiv.style.display = "flex";
    buttonDiv.style.flexWrap = "wrap";
    buttonDiv.style.alignItems = "center";
    buttonDiv.style.width = "100%";
    let resetButton = buttonDiv.createEl("button", { text: "Reset to generate new document" });
    resetButton.style.fontSize = "12px";
    resetButton.style.padding = "5px";
    resetButton.style.width = "auto";
    resetButton.style.display = "inline-block";
    let indexButton = buttonDiv.createEl("button", { text: "Index" });
    indexButton.style.fontSize = "12px";
    indexButton.style.padding = "5px";
    indexButton.style.width = "auto";
    indexButton.style.display = "inline-block";
    let documentButton = buttonDiv.createEl("button", { text: "Document" });
    documentButton.style.fontSize = "12px";
    documentButton.style.padding = "5px";
    documentButton.style.width = "auto";
    documentButton.style.display = "inline-block";
    let safButton = buttonDiv.createEl("button", { text: "Save to another file" });
    safButton.style.fontSize = "12px";
    safButton.style.padding = "5px";
    safButton.style.width = "auto";
    safButton.style.display = "inline-block";
    let rgButton = buttonDiv.createEl("button", { text: "Regenerate this graph" });
    rgButton.style.fontSize = "12px";
    rgButton.style.padding = "5px";
    rgButton.style.width = "auto";
    rgButton.style.display = "inline-block";
    safButton.addEventListener("click", () => {
      const currentTime = new Date();
      const years = currentTime.getFullYear();
      const months = currentTime.getMonth();
      const days = currentTime.getDay();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      const newFileName = "tmp_" + years + "_" + months + "_" + days + "_" + hours + "_" + minutes + "_" + seconds + ".md";
      this.loadcontent_output_suggestions();
      this.thisapp.vault.create(newFileName, output_answer);
    });
    rgButton.addEventListener("click", () => {
      new import_obsidian.Notice("\u91CD\u65B0\u751F\u6210\u672C\u6BB5\u6587\u6863\uFF0C\u751F\u6210\u6587\u6863\u671F\u95F4\u8BF7\u4E0D\u8981\u4FEE\u6539\u6587\u4EF6\u5185\u5BB9");
      query_type = 2;
      current_state = 2;
      if (question != this.textarea.value) {
        ask_times = 1;
      } else {
        ask_times++;
      }
      if (index_processed <= 0) {
        new import_obsidian.Notice("\u672A\u751F\u6210\u6587\u6863\uFF01\u65E0\u6CD5\u91CD\u65B0\u751F\u6210");
        return;
      }
      index_processed--;
      if (index_processed >= index_all && index_all > 0) {
        index_all = 0;
        index_processed = 0;
        new import_obsidian.Notice("\u6839\u636E\u76EE\u5F55\u91CD\u65B0\u751F\u6210\u6587\u6863", 15e3);
        this.output_ducument.value = "";
        this.output_suggestions.value = index_info;
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
          const fp = activeFile.path;
          this.thisapp.vault.adapter.write(fp, index_info);
        }
      }
      output_answer = lastres;
      this.output_suggestions.value = output_answer;
      left = lastleft;
      right = lastright;
      this.setupWebSocket2();
      question = this.textarea.value;
      intput_question = this.textarea.value;
    });
    this.input_topicid.addEventListener("input", (event) => {
      const inputt = event.target;
      this.input_topicid.value = inputt.value;
      topicid = this.input_topicid.value;
    });
    this.input_password.addEventListener("input", (event) => {
      const inputt = event.target;
      this.input_password.value = inputt.value;
      password = this.input_password.value;
    });
    this.input_username.addEventListener("input", (event) => {
      const inputt = event.target;
      this.input_username.value = inputt.value;
      username = this.input_username.value;
    });
    this.input_username.value = username;
    this.input_password.value = password;
    this.input_topicid.value = topicid;
    resetButton.addEventListener("click", () => {
      index_all = 0;
      index_processed = 0;
      this.output_ducument.value = "";
      this.output_suggestions.value = index_info;
      output_answer = index_info;
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        const fp = activeFile.path;
        this.thisapp.vault.adapter.write(fp, output_answer);
      }
    });
    indexButton.addEventListener("click", () => {
      query_type = 1;
      current_state = 1;
      index_all = 0;
      index_processed = 0;
      if (question != this.textarea.value) {
        ask_times = 1;
      } else {
        ask_times++;
      }
      this.loadcontent_index();
      this.setupWebSocket1();
      question = this.textarea.value;
      intput_question = this.textarea.value;
      const tempStr = index_info.replace(/####/g, "__FOURHASH__").replace(/###/g, "__THREEHASH__");
      let parts = tempStr.split(/##(?!#)/);
      parts = parts.map((part) => part.replace(/__FOURHASH__/g, "####").replace(/__THREEHASH__/g, "###"));
      index_array = parts;
    });
    documentButton.addEventListener("click", () => {
      new import_obsidian.Notice("\u5DF2\u786E\u8BA4\u6839\u636E\u76EE\u5F55\u751F\u6210\u6587\u6863\uFF0C\u751F\u6210\u6587\u6863\u671F\u95F4\u8BF7\u4E0D\u8981\u4FEE\u6539\u6587\u4EF6\u5185\u5BB9");
      query_type = 2;
      current_state = 2;
      if (question != this.textarea.value) {
        ask_times = 1;
      } else {
        ask_times++;
      }
      if (index_processed == 0 && index_all == 0) {
        this.loadcontent_index();
      } else {
        this.loadcontent_output_suggestions();
      }
      if (index_processed >= index_all && index_all > 0) {
        index_all = 0;
        index_processed = 0;
        new import_obsidian.Notice("\u6839\u636E\u76EE\u5F55\u91CD\u65B0\u751F\u6210\u6587\u6863", 15e3);
        this.output_ducument.value = "";
        this.output_suggestions.value = index_info;
        output_answer = index_info;
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
          const fp = activeFile.path;
          this.thisapp.vault.adapter.write(fp, output_answer);
        }
      }
      this.setupWebSocket2();
      question = this.textarea.value;
      intput_question = this.textarea.value;
    });
    let isDragging = false;
    let offsetX;
    let offsetY;
    contentEl.addEventListener("mousedown", (e) => {
      if (e.target === contentEl) {
        isDragging = true;
        offsetX = e.clientX - contentEl.getBoundingClientRect().left;
        offsetY = e.clientY - contentEl.getBoundingClientRect().top;
        contentEl.style.cursor = "move";
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        contentEl.style.left = `${e.clientX - offsetX}px`;
        contentEl.style.top = `${e.clientY - offsetY}px`;
        contentEl.style.position = "fixed";
      }
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      contentEl.style.cursor = "default";
    });
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";
    resizeHandle.style.width = "10px";
    resizeHandle.style.height = "10px";
    resizeHandle.style.background = "gray";
    resizeHandle.style.position = "absolute";
    resizeHandle.style.right = "0";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.cursor = "nwse-resize";
    contentEl.appendChild(resizeHandle);
    let isResizing = false;
    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      e.stopPropagation();
    });
    document.addEventListener("mousemove", (e) => {
      if (isResizing) {
        const newWidth = e.clientX - contentEl.getBoundingClientRect().left;
        const newHeight = e.clientY - contentEl.getBoundingClientRect().top;
        contentEl.style.width = `${newWidth}px`;
        contentEl.style.height = `${newHeight}px`;
      }
    });
    document.addEventListener("mouseup", () => {
      isResizing = false;
    });
    const closeButton = document.createElement("button");
    closeButton.textContent = "\u5173\u95ED";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    contentEl.appendChild(closeButton);
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem("lastPositionTop", contentEl.style.top);
      localStorage.setItem("lastPositionLeft", contentEl.style.left);
      contentEl.remove();
    });
  }
};
var SampleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Server Address").setDesc("Input your server address.").addText((text) => text.setPlaceholder("Enter server address").setValue(this.plugin.settings.serveraddress).onChange(async (value) => {
      this.plugin.settings.serveraddress = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian.Setting(containerEl).setName("GPT token").setDesc("You can get your GPT token in the WhaleCloud website.").addText((text) => text.setPlaceholder("Enter GPT token").setValue(this.plugin.settings.usertoken).onChange(async (value) => {
      this.plugin.settings.usertoken = value;
      await this.plugin.saveSettings();
    }));
  }
};