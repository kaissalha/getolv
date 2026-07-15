import { memo, useEffect, useRef, useState } from "react";

import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

import { Input } from "@getolv/ui/components/input";
import { cn } from "@getolv/ui/lib/utils";

type PlaceAutocompleteProps = {
	value?: string;
	onChange?: (value: string) => void;
	onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
	placeholder?: string;
	className?: string;
	ref?: React.RefObject<HTMLInputElement>;
};

export const PlaceAutocompleteInternal = ({
	value,
	onChange,
	onPlaceSelect,
	placeholder = "Enter a location",
	className,
	ref: externalRef,
}: PlaceAutocompleteProps) => {
	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
		throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_KEY is not set");
	}

	const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
	const internalRef = useRef<HTMLInputElement>(null);
	const inputRef = externalRef || internalRef;
	const places = useMapsLibrary("places");

	useEffect(() => {
		if (!(places && inputRef.current)) return;

		const autocomplete = new places.Autocomplete(inputRef.current);

		setPlaceAutocomplete(autocomplete);
	}, [places, inputRef]);

	useEffect(() => {
		if (!placeAutocomplete) return;

		placeAutocomplete.addListener("place_changed", () => {
			onPlaceSelect?.(placeAutocomplete.getPlace());
		});
	}, [onPlaceSelect, placeAutocomplete]);

	return (
		<APIProvider
			apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
			solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
		>
			<div className='autocomplete-container w-full'>
				<Input
					ref={inputRef}
					placeholder={placeholder}
					className={cn("w-full", className)}
					type='text'
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
				/>
			</div>
		</APIProvider>
	);
};

export const PlaceAutocomplete = memo(function PlaceAutocomplete(props: PlaceAutocompleteProps) {
	if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
		throw new Error("NEXT_PUBLIC_GOOGLE_MAPS_KEY is not set");
	}

	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
			<PlaceAutocompleteInternal {...props} />
		</APIProvider>
	);
});
