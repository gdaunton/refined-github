import OptionsSync from 'webext-options-sync';

const cache = new Map();

export default async (endpoint, checkCache = true) => {
	if (checkCache && cache.has(endpoint)) {
		return cache.get(endpoint);
	}
	const headers = {};
	const {personalToken} = await new OptionsSync().getAll();
	if (personalToken) {
		headers.Authorization = `token ${personalToken}`;
	}
	const api = location.hostname === 'github.com' ? 'https://api.github.com/' : `${location.origin}/api/`;
	const response = await fetch(api + endpoint, {headers});
	const json = await response.json();

	const result = {
		error: !response.ok,
		data: json
	};

	cache.set(endpoint, result);

	return result;
};
