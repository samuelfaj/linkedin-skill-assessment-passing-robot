import colors from "colors";
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'

export default class ChatGpt {
	api;

	constructor(config) {
		this.api = new ChatGPTUnofficialProxyAPI(config);
	}

	async test(){
		console.log(`Testing ChatGPT...`);

		const reply = await this.sendMessage(`count to 30`);

		if(!reply){
			console.error(`ChatGPT offline`);
			throw new Error(`ChatGPT offline`);
		}
	}

	async sendMessage(string, args){
		const self = this;

		const origial = string;
		console.log(`Sent to ChatGPT:`, string.green);

		const chat = await self.api.sendMessage(origial, args);
		console.log(`ChatGPT reply:`, chat.text.red)

		return chat.text;
	}
}
