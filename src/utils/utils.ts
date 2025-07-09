import type { PresenceStatus } from "discord.js";

export const arrayRemove = (arr: any[], value: any) => {
	return arr.filter((ele) => ele !== value);
};

export const getColorFromStatus = (status: PresenceStatus) => {
	const statutes = {
		online: "#3ba55c",
		idle: "#faa61a",
		dnd: "#ed4245",
		stream: "#593695",
		offline: "#747f8e",
		invisible: "#747f8e",
	};

	return statutes[status];
};
