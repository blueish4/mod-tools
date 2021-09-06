function lineToUsername(line: string): string {
	const candidate = line.trim().replace("/ban ", "").trim().split(" ")[0].split(",")[0];

	if(! /^[a-zA-Z0-9_]{4,25}$/.test(candidate)) {
		throw new Error(`Name formatted incorrectly: ${candidate}`)
	}
	return candidate;
}
export { lineToUsername }