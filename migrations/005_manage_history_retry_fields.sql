ALTER TABLE manage_history ADD COLUMN IF NOT EXISTS dst_dir String DEFAULT '' AFTER dst_path;
ALTER TABLE manage_history ADD COLUMN IF NOT EXISTS videos_only UInt8 DEFAULT 0 AFTER dst_dir;
ALTER TABLE manage_history ADD COLUMN IF NOT EXISTS watched_count Int32 DEFAULT 0 AFTER videos_only;
ALTER TABLE manage_history ADD COLUMN IF NOT EXISTS remove_empty_dirs UInt8 DEFAULT 0 AFTER watched_count;
