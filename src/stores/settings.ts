import { writable } from 'svelte/store';
import { building } from '$app/environment';

// TODO !!: An alternative to the settings store would be to only store the token
// and then store all the  settings to the backend and subscribe to that store
// then the settings would persist on the backend for the session.

const settingsKey = "settings"

type PersistentSettings = {
	// Persisted properties:
	token: string; // Null means not authenticated
	userID: string;
	organizationID: string | null;
	projectID: string | null;
	mainMenuExpanded: boolean;
}

type EphemeralSettings = {
	cmdPalletOpen: boolean;
}

type Settings = PersistentSettings & EphemeralSettings

const defaultSettings = (): Settings => {
	return {
		token: "",
		userID: "",
		organizationID: "",
		projectID: "",
		mainMenuExpanded: true,

		cmdPalletOpen: false,
	}
}

const persistentSettings = (s: Settings): PersistentSettings => {
	return {
		token: s.token,
		userID: s.userID,
		organizationID: s.organizationID,
		projectID: s.projectID,
		mainMenuExpanded: s.mainMenuExpanded,
	}
}

// localSettings creates a Settings object from the JSON stored under the
// "settings" key in localStorage. Each value that does not exist gets its
// default value making this function OK to use for initial instantiation.
const localSettings = (): Settings => {
	// Guard browser code since it runs during build (dumb):
	// https://github.com/sveltejs/kit/discussions/7716
	if (building) {
		return defaultSettings()
	}

	const val = localStorage.getItem(settingsKey) || '{}'

	try {
		const json = JSON.parse(val);

		return {
			token: json.token ? json.token : "",
			userID: json.userID ? json.userID : "",
			organizationID: json.organizationID ? json.organizationID : "",
			projectID: json.projectID ? json.projectID : "",
			mainMenuExpanded: typeof (json.mainMenuExpanded) == 'boolean' ? json.mainMenuExpanded : true,

			cmdPalletOpen: false,
		}
	} catch (e) {
		return defaultSettings()
	}
}

function createSettings() {
	// Instantiate settings using localStorage values.
	const settings = localSettings()

	// console.log("settings localSettings():", settings)

	// Create store from settings.
	const { subscribe, update } = writable(settings);

	// Subscribe to changes to that we can persist them to localStorage.
	subscribe((settings: Settings) => {
		// Guard browser code since it runs during build (dumb):
		// https://github.com/sveltejs/kit/discussions/7716
		if (building) {
			return
		}

		localStorage.setItem(settingsKey, JSON.stringify(persistentSettings(settings)))
	})

	// We are only exposing subscribe directly and using setters for all
	// other properties. This allows us to set types and control inputs.
	return {
		subscribe,
		// Example of storing an int, though projectID is actually a string like all IDs.
		// setProjectID: (id: number|null) => update(state => ({...state, projectID: parseInt(id)})),

		// TODO: Create logOut function to clear only sensitive fields, preserving the rest.
		clearAll: () => update(state => (defaultSettings())),
		setToken: (token: string) => update(state => ({ ...state, token: token })),
		clearToken: () => update(state => ({ ...state, token: "" })),
		setUserID: (id: string) => update(state => ({ ...state, userID: id })),
		setOrganizationID: (id: string | null) => update(state => ({ ...state, organizationID: id })),
		setProjectID: (id: string | null) => update(state => ({ ...state, projectID: id })),
		expandMainMenu: (expand: boolean) => update(state => ({ ...state, mainMenuExpanded: expand })),
		openCmdPallet: (open: boolean) => update(state => ({ ...state, cmdPalletOpen: open })),
	}
}

export default createSettings()


/**
* https://monad.fi/en/blog/svelte-custom-stores/
* Good Source
*/