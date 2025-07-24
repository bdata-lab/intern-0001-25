export const getRGBAStr = (colorJSON) => {
	if (colorJSON !== null) {
		let colorObj = JSON.parse(colorJSON);
		return `rgba(${colorObj.r},${colorObj.g},${colorObj.b},${colorObj.a})`;
	}
};

export const doesHaveColor = (dates, date, timeslots, timeslot, cells) => {
	const idxDate = dates.findIndex((d) => d.scheduleDate === date.scheduleDate);
	const idxTimeslot = timeslots.indexOf(timeslot);
	return cells[idxDate + 1][idxTimeslot + 1];
};

export const getInitalCells = (timeslots, dates) => {
	let initialCells = [];
	for (var i = 0; i < dates.length + 1; i++) {
		let aRow = [];
		for (var j = 0; j < timeslots.length + 1; j++) {
			aRow.push(false);
		}
		initialCells.push(aRow);
	}
	return initialCells;
};

export const fillCellsByMapMediaTimeslots = (
	dates,
	timeslots,
	cells,
	mapMediaTimeslots
) => {
	let newCells = [...cells];
	for (let mmt of mapMediaTimeslots) {
		const idxDate = dates.findIndex((d) => d.scheduleDate === mmt.scheduleDate);
		const idxTimeslot = timeslots.indexOf(mmt.scheduleAt);

		newCells[idxDate + 1][idxTimeslot + 1] = {
			resourceId: mmt.resourceId,
			color: getRGBAStr(mmt.color),
		};
	}
	return newCells;
};

export const fillCellsByMapMediaTimeslots2 = (
	dates,
	timeslots,
	cells,
	mapMediaTimeslots
) => {
	let newCells = [...cells];
	for (let mmt of mapMediaTimeslots) {
		const idxDate = dates.findIndex((d) => d.scheduleDate === mmt.scheduleDate);
		const idxTimeslot = timeslots.indexOf(mmt.scheduleAt);

		newCells[idxDate + 1][idxTimeslot + 1] = {
			resourceId: mmt.resourceId,
			color: getRGBAStr(mmt.color),
			takeup: mmt.takeup,
			quota: mmt.quota,
		};
	}
	return newCells;
};

export const RESOURCE_TYPE = {
	SCROLLING_MESSAGE: "SCROLLING_MESSAGE",
	PLAYLIST: "PLAYLIST",
	TEMPLATE: "TEMPLATE",
};

export const APPOINTMENT_TYPE = {
	CALL_APPOINTMENT: "CALL_APPOINTMENT",
	VIDEO_APPOINTMENT: "VIDEO_APPOINTMENT",
	SITE_VISIT: "SITE_VISIT",
};
