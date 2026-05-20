ALTER TABLE entries ADD COLUMN IF NOT EXISTS subtree_size Int64 DEFAULT size;
ALTER TABLE entries ADD COLUMN IF NOT EXISTS subtree_files Int32 DEFAULT if(is_dir = 0, 1, 0);
ALTER TABLE entries ADD COLUMN IF NOT EXISTS subtree_dirs Int32 DEFAULT 0;
