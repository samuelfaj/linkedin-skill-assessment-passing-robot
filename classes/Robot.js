import ChatGpt from "./ChatGpt.js";
import LinkedIn from "./LinkedIn.js";

export default class Robot {
	linkedIn;
	chatGpt;

	constructor(linkedIn_config, chatGpt_config) {
		this.chatGpt = new ChatGpt(chatGpt_config);
		this.linkedIn = new LinkedIn(linkedIn_config, this.chatGpt);
	}

	async init(){
		await this.chatGpt.test();
		await this.linkedIn.init();
	}
}
