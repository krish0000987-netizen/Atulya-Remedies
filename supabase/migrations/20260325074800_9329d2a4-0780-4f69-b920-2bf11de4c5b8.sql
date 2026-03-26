-- Add unique constraint on page + section for upsert
ALTER TABLE public.page_content ADD CONSTRAINT page_content_page_section_unique UNIQUE (page, section);