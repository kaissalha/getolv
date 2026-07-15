import sharp from "sharp";

const FETCH_HEADERS = {
	Accept: "image/*",
	"User-Agent": "getolvApp/1.0 (workout-pdf)",
} as const;

export const resolveExerciseImageForPdf = async (url: string | null | undefined) => {
	if (!url?.trim()) {
		return null;
	}
	try {
		const res = await fetch(url, { headers: FETCH_HEADERS });
		if (!res.ok) {
			return null;
		}
		const input = Buffer.from(await res.arrayBuffer());
		const png = await sharp(input).rotate().resize(160, 160, { fit: "cover" }).png().toBuffer();
		return `data:image/png;base64,${png.toString("base64")}`;
	} catch {
		return null;
	}
};

export const buildExerciseImageDataUriMap = async (urls: Iterable<string | null | undefined>) => {
	const unique = [...new Set([...urls].filter((u): u is string => Boolean(u?.trim())))];
	const map = new Map<string, string | null>();
	await Promise.all(
		unique.map(async (u) => {
			map.set(u, await resolveExerciseImageForPdf(u));
		})
	);
	return map;
};
