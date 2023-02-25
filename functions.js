export default {
	sleep: (sec) => new Promise(resolve => setTimeout(()=>resolve(true), sec * 1000))
}
