-- Create a general media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

-- Allow anyone to view media
CREATE POLICY "Public read site-media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'site-media');

-- Allow admins to upload media
CREATE POLICY "Admins upload site-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete media
CREATE POLICY "Admins delete site-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));