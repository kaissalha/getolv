CREATE EXTENSION IF NOT EXISTS "vector";--> statement-breakpoint
CREATE TYPE "rag_document_source_type" AS ENUM('text', 'file', 'url');--> statement-breakpoint
CREATE TYPE "rag_document_status" AS ENUM('pending', 'ready', 'failed');--> statement-breakpoint
CREATE TABLE "rag_document_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"document_id" uuid NOT NULL,
	"organization_id" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rag_document_chunks_document_chunk_idx" UNIQUE("document_id","chunk_index")
);
--> statement-breakpoint
CREATE TABLE "rag_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"source" text,
	"source_type" "rag_document_source_type" DEFAULT 'text'::"rag_document_source_type" NOT NULL,
	"status" "rag_document_status" DEFAULT 'ready'::"rag_document_status" NOT NULL,
	"content_hash" varchar(64),
	"error" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "rag_document_chunks_document_id_idx" ON "rag_document_chunks" ("document_id");--> statement-breakpoint
CREATE INDEX "rag_document_chunks_organization_id_idx" ON "rag_document_chunks" ("organization_id");--> statement-breakpoint
CREATE INDEX "rag_document_chunks_embedding_idx" ON "rag_document_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "rag_documents_organization_id_idx" ON "rag_documents" ("organization_id");--> statement-breakpoint
CREATE INDEX "rag_documents_organization_status_idx" ON "rag_documents" ("organization_id","status");--> statement-breakpoint
ALTER TABLE "rag_document_chunks" ADD CONSTRAINT "rag_document_chunks_document_id_rag_documents_id_fkey" FOREIGN KEY ("document_id") REFERENCES "rag_documents"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rag_document_chunks" ADD CONSTRAINT "rag_document_chunks_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rag_documents" ADD CONSTRAINT "rag_documents_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;