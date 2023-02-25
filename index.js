const LINKEDIN = {
	username: 'username',
	password: 'password',
	url: `https://www.linkedin.com/skill-assessments/Angular/quiz-intro/`
};

// You can manually get an accessToken by logging in to the ChatGPT webapp and then opening https://chat.openai.com/api/auth/session,
// which will return a JSON object containing your accessToken string.
const CHAT_GPT = {
	apiReverseProxyUrl: 'https://chat.duti.tech/api/conversation',
	accessToken: "******"
}

import Robot from "./classes/Robot.js";
(new Robot(LINKEDIN, CHAT_GPT)).init()
	.then(() => console.log('Finished'))
	.catch(e => console.error(e));
