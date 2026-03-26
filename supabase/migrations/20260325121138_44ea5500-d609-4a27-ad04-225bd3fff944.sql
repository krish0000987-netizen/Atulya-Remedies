CREATE UNIQUE INDEX IF NOT EXISTS products_sort_order_unique_idx ON public.products (sort_order) WHERE sort_order IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS page_content_page_section_key ON public.page_content (page, section);
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_key ON public.site_settings (key);

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_content_updated_at ON public.page_content;
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();