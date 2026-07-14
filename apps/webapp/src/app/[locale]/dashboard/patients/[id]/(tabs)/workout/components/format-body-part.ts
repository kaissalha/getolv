const BODY_PART_LABELS: Record<string, string> = {
	back: "Back",
	chest: "Chest",
	"upper arms": "Arms",
	"lower arms": "Forearms",
	"upper legs": "Legs",
	"lower legs": "Calves",
	shoulders: "Shoulders",
	waist: "Core",
	cardio: "Cardio",
	neck: "Neck",
};

export const formatBodyPart = ({ raw }: { raw: string }) =>
	BODY_PART_LABELS[raw.toLowerCase()] ?? raw.charAt(0).toUpperCase() + raw.slice(1);
