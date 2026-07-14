DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exercise_muscle_role') THEN
		CREATE TYPE "exercise_muscle_role" AS ENUM ('target', 'secondary');
	END IF;
END
$$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "body_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "equipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL UNIQUE,
	"aliases" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "muscles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL UNIQUE,
	"aliases" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "exercise_body_parts" (
	"exercise_id" uuid NOT NULL,
	"body_part_id" uuid NOT NULL,
	CONSTRAINT "exercise_body_parts_pkey" PRIMARY KEY ("exercise_id", "body_part_id")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "exercise_equipments" (
	"exercise_id" uuid NOT NULL,
	"equipment_id" uuid NOT NULL,
	CONSTRAINT "exercise_equipments_pkey" PRIMARY KEY ("exercise_id", "equipment_id")
);--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "exercise_muscles" (
	"exercise_id" uuid NOT NULL,
	"muscle_id" uuid NOT NULL,
	"role" "exercise_muscle_role" NOT NULL,
	CONSTRAINT "exercise_muscles_pkey" PRIMARY KEY ("exercise_id", "muscle_id", "role")
);--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name = 'fts'
	) THEN
		ALTER TABLE "exercises"
		ADD COLUMN "fts" tsvector GENERATED ALWAYS AS (
			to_tsvector('english'::regconfig, COALESCE("exercises"."name", ''))
		) STORED;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercise_body_parts_exercise_id_exercises_id_fkey'
	) THEN
		ALTER TABLE "exercise_body_parts"
		ADD CONSTRAINT "exercise_body_parts_exercise_id_exercises_id_fkey"
		FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercise_body_parts_body_part_id_body_parts_id_fkey'
	) THEN
		ALTER TABLE "exercise_body_parts"
		ADD CONSTRAINT "exercise_body_parts_body_part_id_body_parts_id_fkey"
		FOREIGN KEY ("body_part_id") REFERENCES "body_parts"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercise_equipments_exercise_id_exercises_id_fkey'
	) THEN
		ALTER TABLE "exercise_equipments"
		ADD CONSTRAINT "exercise_equipments_exercise_id_exercises_id_fkey"
		FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercise_equipments_equipment_id_equipments_id_fkey'
	) THEN
		ALTER TABLE "exercise_equipments"
		ADD CONSTRAINT "exercise_equipments_equipment_id_equipments_id_fkey"
		FOREIGN KEY ("equipment_id") REFERENCES "equipments"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercise_muscles_exercise_id_exercises_id_fkey'
	) THEN
		ALTER TABLE "exercise_muscles"
		ADD CONSTRAINT "exercise_muscles_exercise_id_exercises_id_fkey"
		FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'exercise_muscles_muscle_id_muscles_id_fkey'
	) THEN
		ALTER TABLE "exercise_muscles"
		ADD CONSTRAINT "exercise_muscles_muscle_id_muscles_id_fkey"
		FOREIGN KEY ("muscle_id") REFERENCES "muscles"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name = 'body_parts'
	) THEN
		INSERT INTO "body_parts" ("slug", "name")
		SELECT DISTINCT
			trim(BOTH '-' FROM regexp_replace(lower(source.name), '[^a-z0-9]+', '-', 'g')),
			source.name
		FROM "exercises"
		CROSS JOIN LATERAL jsonb_array_elements_text("exercises"."body_parts") AS source(name)
		ON CONFLICT ("name") DO NOTHING;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name = 'equipments'
	) THEN
		WITH equipment_alias_map AS (
			SELECT *
			FROM (
				VALUES ('band', 'resistance band')
			) AS equipment_alias_map(alias, canonical_name)
		),
		distinct_equipments AS (
			SELECT DISTINCT COALESCE(equipment_alias_map.canonical_name, source.name) AS canonical_name
			FROM "exercises"
			CROSS JOIN LATERAL jsonb_array_elements_text("exercises"."equipments") AS source(name)
			LEFT JOIN equipment_alias_map
				ON equipment_alias_map.alias = source.name
		)
		INSERT INTO "equipments" ("slug", "name", "aliases")
		SELECT
			trim(BOTH '-' FROM regexp_replace(lower(canonical_name), '[^a-z0-9]+', '-', 'g')),
			canonical_name,
			COALESCE(
				(
					SELECT jsonb_agg(alias ORDER BY alias)
					FROM equipment_alias_map
					WHERE equipment_alias_map.canonical_name = distinct_equipments.canonical_name
				),
				'[]'::jsonb
			)
		FROM distinct_equipments
		ON CONFLICT ("name") DO NOTHING;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name IN ('target_muscles', 'secondary_muscles')
	) THEN
		WITH muscle_alias_map AS (
			SELECT *
			FROM (
				VALUES
					('delts', 'deltoids'),
					('lats', 'latissimus dorsi'),
					('traps', 'trapezius')
			) AS muscle_alias_map(alias, canonical_name)
		),
		distinct_muscles AS (
			SELECT DISTINCT COALESCE(muscle_alias_map.canonical_name, source.name) AS canonical_name
			FROM (
				SELECT jsonb_array_elements_text("target_muscles") AS name
				FROM "exercises"
				UNION
				SELECT jsonb_array_elements_text("secondary_muscles") AS name
				FROM "exercises"
			) AS source
			LEFT JOIN muscle_alias_map
				ON muscle_alias_map.alias = source.name
		)
		INSERT INTO "muscles" ("slug", "name", "aliases")
		SELECT
			trim(BOTH '-' FROM regexp_replace(lower(canonical_name), '[^a-z0-9]+', '-', 'g')),
			canonical_name,
			COALESCE(
				(
					SELECT jsonb_agg(alias ORDER BY alias)
					FROM muscle_alias_map
					WHERE muscle_alias_map.canonical_name = distinct_muscles.canonical_name
				),
				'[]'::jsonb
			)
		FROM distinct_muscles
		ON CONFLICT ("name") DO NOTHING;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name = 'body_parts'
	) THEN
		INSERT INTO "exercise_body_parts" ("exercise_id", "body_part_id")
		SELECT DISTINCT
			"exercises"."id",
			"body_parts"."id"
		FROM "exercises"
		CROSS JOIN LATERAL jsonb_array_elements_text("exercises"."body_parts") AS source(name)
		INNER JOIN "body_parts"
			ON "body_parts"."name" = source.name
		ON CONFLICT DO NOTHING;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name = 'equipments'
	) THEN
		WITH equipment_alias_map AS (
			SELECT *
			FROM (
				VALUES ('band', 'resistance band')
			) AS equipment_alias_map(alias, canonical_name)
		)
		INSERT INTO "exercise_equipments" ("exercise_id", "equipment_id")
		SELECT DISTINCT
			"exercises"."id",
			"equipments"."id"
		FROM "exercises"
		CROSS JOIN LATERAL jsonb_array_elements_text("exercises"."equipments") AS source(name)
		LEFT JOIN equipment_alias_map
			ON equipment_alias_map.alias = source.name
		INNER JOIN "equipments"
			ON "equipments"."name" = COALESCE(equipment_alias_map.canonical_name, source.name)
		ON CONFLICT DO NOTHING;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.columns
		WHERE table_schema = 'public'
			AND table_name = 'exercises'
			AND column_name IN ('target_muscles', 'secondary_muscles')
	) THEN
		WITH muscle_alias_map AS (
			SELECT *
			FROM (
				VALUES
					('delts', 'deltoids'),
					('lats', 'latissimus dorsi'),
					('traps', 'trapezius')
			) AS muscle_alias_map(alias, canonical_name)
		)
		INSERT INTO "exercise_muscles" ("exercise_id", "muscle_id", "role")
		SELECT DISTINCT
			"exercises"."id",
			"muscles"."id",
			'target'::"exercise_muscle_role"
		FROM "exercises"
		CROSS JOIN LATERAL jsonb_array_elements_text("exercises"."target_muscles") AS source(name)
		LEFT JOIN muscle_alias_map
			ON muscle_alias_map.alias = source.name
		INNER JOIN "muscles"
			ON "muscles"."name" = COALESCE(muscle_alias_map.canonical_name, source.name)
		ON CONFLICT DO NOTHING;

		WITH muscle_alias_map AS (
			SELECT *
			FROM (
				VALUES
					('delts', 'deltoids'),
					('lats', 'latissimus dorsi'),
					('traps', 'trapezius')
			) AS muscle_alias_map(alias, canonical_name)
		)
		INSERT INTO "exercise_muscles" ("exercise_id", "muscle_id", "role")
		SELECT DISTINCT
			"exercises"."id",
			"muscles"."id",
			'secondary'::"exercise_muscle_role"
		FROM "exercises"
		CROSS JOIN LATERAL jsonb_array_elements_text("exercises"."secondary_muscles") AS source(name)
		LEFT JOIN muscle_alias_map
			ON muscle_alias_map.alias = source.name
		INNER JOIN "muscles"
			ON "muscles"."name" = COALESCE(muscle_alias_map.canonical_name, source.name)
		ON CONFLICT DO NOTHING;
	END IF;
END
$$;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "exercise_body_parts_body_part_id_idx" ON "exercise_body_parts" ("body_part_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercise_equipments_equipment_id_idx" ON "exercise_equipments" ("equipment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercise_muscles_muscle_id_idx" ON "exercise_muscles" ("muscle_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exercise_muscles_role_idx" ON "exercise_muscles" ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exercises_fts" ON "exercises" USING gin ("fts" tsvector_ops);--> statement-breakpoint

ALTER TABLE "exercises" DROP COLUMN IF EXISTS "target_muscles";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "body_parts";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "equipments";--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN IF EXISTS "secondary_muscles";--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "muscle_body_parts" (
	"muscle_id" uuid NOT NULL,
	"body_part_id" uuid NOT NULL,
	CONSTRAINT "muscle_body_parts_pkey" PRIMARY KEY ("muscle_id", "body_part_id")
);--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'muscle_body_parts_muscle_id_muscles_id_fkey'
	) THEN
		ALTER TABLE "muscle_body_parts"
		ADD CONSTRAINT "muscle_body_parts_muscle_id_muscles_id_fkey"
		FOREIGN KEY ("muscle_id") REFERENCES "muscles"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'muscle_body_parts_body_part_id_body_parts_id_fkey'
	) THEN
		ALTER TABLE "muscle_body_parts"
		ADD CONSTRAINT "muscle_body_parts_body_part_id_body_parts_id_fkey"
		FOREIGN KEY ("body_part_id") REFERENCES "body_parts"("id") ON DELETE CASCADE;
	END IF;
END
$$;--> statement-breakpoint

INSERT INTO "muscle_body_parts" ("muscle_id", "body_part_id")
SELECT DISTINCT
	"exercise_muscles"."muscle_id",
	"exercise_body_parts"."body_part_id"
FROM "exercise_muscles"
INNER JOIN "exercise_body_parts"
	ON "exercise_body_parts"."exercise_id" = "exercise_muscles"."exercise_id"
ON CONFLICT DO NOTHING;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "muscle_body_parts_body_part_id_idx" ON "muscle_body_parts" ("body_part_id");