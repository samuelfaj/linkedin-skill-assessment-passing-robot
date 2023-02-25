import puppeteer from "puppeteer";
import functions from "../functions.js";

export default class ChatGpt {
	page;
	config;
	chatGpt;

	constructor(config, chatGpt) {
		this.config = config;
		this.chatGpt = chatGpt;
	}

	async init(){
		const self = this;
		const browser = await puppeteer.launch({
			headless: false
		});

		this.page = await browser.newPage();
		await this.page.goto(this.config.url);

		await this.page.waitForSelector(`.main__sign-in-link`);
		await functions.sleep(1);
		await this.page.click(`.main__sign-in-link`);

		await this.page.waitForSelector(`#username`);
		await functions.sleep(1);
		await this.page.type('#username', this.config.username);
		await this.page.type('#password', this.config.password);

		await this.page.waitForSelector(`button[type=submit]`);
		await functions.sleep(1);
		await this.page.click(`button[type=submit]`);

		await this.page.waitForSelector(`button[title="Start"]`);
		await this.page.click(`button[title="Start"]`);

		let hasQuestion = true;

		do{
			try{
				await this.page.waitForSelector(`#assessment-a11y-title`, 3000);
				await functions.sleep(1);
				await self.question();

				hasQuestion = true;
			}catch (e) {
				hasQuestion = false;
			}
		}while (hasQuestion)

		console.log()
	}

	async question(){
		const self = this;
		let title = await self.getText(self.page, `.visually-hidden`, await self.page.$(`#assessment-a11y-title`));

		if(!title){
			return false;
		}

		const detail = await self.page.$('.sa-assessment-quiz__title-detail');
		if(detail){
			let code = await self.getText(self.page, `.visually-hidden`, detail);

			if(code){
				title += `\n\n\`\`\`${code}\`\`\``
			}
		}


		const options = {};

		let formattedOptions = [];

		for(let i=0;i<10;i++){
			const div = await self.page.$(`#skill-assessment-quiz-${i}`);

			if(!div){ break; }

			const className = await (await div.getProperty('className')).jsonValue()

			console.log('className', className);

			let text = (className.indexOf('sa-code-block') > -1)
				? await div.evaluate(node => node.textContent)
				: await self.getText(self.page, `.visually-hidden`, div);

			options[i] = text;
			formattedOptions.push(`${i} - \`\`\`${text}\`\`\``)
		}

		const chatGptQuestion =
			`${title}\n\n` +
			`Answers: \n` +
			`${formattedOptions.join(`\n`)}` +
			`\n\n` +
			`Reply with only the number of the right answer and nothing more.\n` +
			`Example of what you need to reply: 2`

		console.log({
			title,
			options
		})

		console.log(chatGptQuestion);

		const reply = (await self.chatGpt.sendMessage(chatGptQuestion) || '').replace(/[^0-9]/g, '').substr(0,1);
		console.log(reply);


		const divs = await self.page.$$(`.sa-question-multichoice__item`);
		const element = await divs[+reply].$(`input[type="radio"]`);
		await element.click();

		const footer = await self.page.$(`.sa-assessment-quiz__footer`);
		const footer_button = await footer.$(`button`);
		// const footer_button_text = footer_button.evaluate(node => node.textContent)
		await footer_button.click();

		// if(footer_button_text.toLowerCase() === 'check answer'){
		// 	await functions.sleep(2);
		//
		// 	const footer_button2 = await footer.$(`button`);
		// 	await footer_button2.click();
		// }
	}

	async getText(page, selector, div){
		console.log(div);
		const element = div ? await div.$$(selector) : await this.page.$$(selector);
		return await element[0].evaluate(node => node.textContent)
	}
}
