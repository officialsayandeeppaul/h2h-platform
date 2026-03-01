-- Enable Supabase Realtime for contact_messages (super admin push notifications)
-- Run only if contact_messages table exists and Realtime is desired
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
