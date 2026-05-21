#!/usr/bin/env python3
# High-level logic:
# - Scan a root directory for episodic video files whose names contain a season
#   and one or more episode numbers.
# - Group files by normalized series title plus season, then move them into one
#   folder per group.
# - Name each folder as:
#       "<Title> SNN [<episode-summary>of_wN]"
#   where:
#   - "of" describes which episodes are present in the folder.
#   - "wN" is a watched marker and is configurable, so it can be w0, w3, etc.
# - Episode summaries follow the conventions already used in the media tree:
#   - [7-7of_w0] means only episode 7 is present.
#   - [7of_w0] means episodes 1 through 7 are present.
#   - [-2,4-7of_w0] means episodes 1-2 and 4-7 are present.
# - When coverage is almost continuous from episode 1 to the current maximum,
#   use the compact missing style instead:
#       [43of_w0]=missing8,9
#       [43of_w0]=missing5-7
#   This means episodes 1 through 43 are present except the listed missing
#   episodes or episode ranges.
# - Move matching subtitles alongside their videos when the match is clear.
# - Optionally delete common junk sidecar files and remove empty directories.
from __future__ import annotations

import argparse
import os
import re
import shutil
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path


VIDEO_EXTS = {".mkv", ".mp4"}
SUB_EXTS = {".srt"}
AUX_DELETE_EXTS = {".exe", ".nfo", ".txt", ".url"}
EPISODE_RE = re.compile(r"(?i)^(?P<title>.+?)[ .]S(?P<season>\d{2,4})(?P<episodes>E\d{2,4}(?:(?:E|-)\d{2,4})*)(?P<rest>[ .].+)?$")
PREFIX_RE = re.compile(r"^(?:www\.UIndex\.org|www\.Torrenting\.com|WWW\.SCENETIME\.COM)\s+-\s+", re.IGNORECASE)
MAX_FOLDER_NAME_LEN = 240
DEFAULT_WATCHED_COUNT = 0
MAX_COMPACT_MISSING = 3


@dataclass(frozen=True)
class EpisodeFile:
    path: Path
    title: str
    normalized_title: str
    season: int
    episodes: tuple[int, ...]
    stem: str


@dataclass
class DirectorySubtitleInfo:
    local_srts: list[Path]
    subs_srts: list[Path]


DIR_SUBTITLE_CACHE: dict[Path, DirectorySubtitleInfo] = {}


def clean_component(name: str) -> str:
    name = PREFIX_RE.sub("", name.strip())
    name = re.sub(r"\s+", " ", name)
    return name.strip(" .")


def display_title(raw_title: str, season: int) -> str:
    title = clean_component(raw_title.replace(".", " "))
    return f"{title} S{season:02d}"


def normalize_title(raw_title: str) -> str:
    return clean_component(raw_title.replace(".", " "))


def parse_episode_file(path: Path) -> EpisodeFile | None:
    if path.suffix.lower() not in VIDEO_EXTS:
        return None
    stem = clean_component(path.stem)
    match = EPISODE_RE.match(stem)
    if not match:
        return None
    episodes_token = match.group("episodes")
    numbers = [int(n) for n in re.findall(r"\d{2,4}", episodes_token)]
    if not numbers:
        return None
    episodes: list[int] = [numbers[0]]
    if "-" in episodes_token and len(numbers) >= 2:
        start, end = numbers[0], numbers[1]
        if end >= start:
            episodes = list(range(start, end + 1))
    else:
        episodes = numbers
    return EpisodeFile(
        path=path,
        title=match.group("title"),
        normalized_title=normalize_title(match.group("title")),
        season=int(match.group("season")),
        episodes=tuple(episodes),
        stem=stem,
    )


def summarize_episodes(episodes: list[int]) -> tuple[str, str]:
    ordered = sorted(set(episodes))
    if not ordered:
        return "", ""

    max_episode = ordered[-1]
    missing = [episode for episode in range(1, max_episode + 1) if episode not in ordered]
    if 0 < len(missing) <= MAX_COMPACT_MISSING:
        missing_ranges: list[str] = []
        range_start = range_end = missing[0]
        for episode in missing[1:]:
            if episode == range_end + 1:
                range_end = episode
                continue
            missing_ranges.append(str(range_start) if range_start == range_end else f"{range_start}-{range_end}")
            range_start = range_end = episode
        missing_ranges.append(str(range_start) if range_start == range_end else f"{range_start}-{range_end}")
        missing_suffix = "=missing" + ",".join(missing_ranges)
        return str(max_episode), missing_suffix

    if len(ordered) == 1:
        only = ordered[0]
        return ("1" if only == 1 else f"{only}-{only}"), ""

    ranges: list[tuple[int, int]] = []
    start = prev = ordered[0]
    for episode in ordered[1:]:
        if episode == prev + 1:
            prev = episode
            continue
        ranges.append((start, prev))
        start = prev = episode
    ranges.append((start, prev))

    if len(ranges) == 1 and ranges[0][0] == 1:
        start, end = ranges[0]
        if start == end:
            return "1", ""
        return str(end), ""

    parts: list[str] = []
    for start, end in ranges:
        if start == end:
            parts.append(str(start))
        elif start == 1:
            parts.append(f"-{end}")
        else:
            parts.append(f"{start}-{end}")
    return ",".join(parts), ""


def abbreviate_summary(summary: str, max_len: int) -> str:
    if len(summary) <= max_len:
        return summary
    parts = summary.split(",")
    if len(parts) <= 2:
        return summary[:max_len]

    left = 1
    right = len(parts) - 1
    best = f"{parts[0]},...,{parts[-1]}"
    while left < right:
        candidate = ",".join(parts[: left + 1] + ["..."] + parts[right:])
        if len(candidate) > max_len:
            if (left + 1) <= (len(parts) - right):
                right -= 1
            else:
                left += 1
            continue
        best = candidate
        if (left + 1) <= (len(parts) - right):
            left += 1
        else:
            right -= 1
    return best[:max_len]


def build_folder_name(raw_title: str, season: int, summary: str, watched_count: int, suffix: str = "") -> str:
    prefix = f"{display_title(raw_title, season)} ["
    watched_suffix = f"of_w{watched_count}]{suffix}"
    name = f"{prefix}{summary}{watched_suffix}"
    if len(name) <= MAX_FOLDER_NAME_LEN:
        return name
    available = MAX_FOLDER_NAME_LEN - len(prefix) - len(watched_suffix)
    short_summary = abbreviate_summary(summary, max(available, 8))
    return f"{prefix}{short_summary}{watched_suffix}"


def get_directory_subtitle_info(parent: Path) -> DirectorySubtitleInfo:
    cached = DIR_SUBTITLE_CACHE.get(parent)
    if cached is not None:
        return cached

    local_srts = [p for p in parent.iterdir() if p.is_file() and p.suffix.lower() in SUB_EXTS]
    subs_dir = parent / "Subs"
    subs_srts: list[Path] = []
    if subs_dir.is_dir():
        subs_srts = [p for p in subs_dir.iterdir() if p.is_file() and p.suffix.lower() in SUB_EXTS]

    info = DirectorySubtitleInfo(local_srts=local_srts, subs_srts=subs_srts)
    DIR_SUBTITLE_CACHE[parent] = info
    return info


def find_candidate_subtitles(video_path: Path) -> list[Path]:
    parent = video_path.parent
    info = get_directory_subtitle_info(parent)
    candidates: set[Path] = set()
    exact = parent / f"{video_path.stem}.srt"
    if exact.exists():
        candidates.add(exact)

    if len(info.local_srts) == 1:
        candidates.add(info.local_srts[0])

    if len(info.subs_srts) == 1:
        candidates.add(info.subs_srts[0])
    for sub in info.subs_srts:
        if sub.stem.lower() == video_path.stem.lower():
            candidates.add(sub)

    return sorted(candidates)


def choose_subtitle(video_path: Path) -> Path | None:
    candidates = find_candidate_subtitles(video_path)
    if not candidates:
        return None
    exact_name = [p for p in candidates if p.stem.lower() == video_path.stem.lower()]
    if len(exact_name) == 1:
        return exact_name[0]
    if len(candidates) == 1:
        return candidates[0]
    return None


def relative_to_root(path: Path, root: Path) -> str:
    return str(path.relative_to(root))


def cleanup_auxiliary_files(root: Path) -> tuple[int, int]:
    removed_files = 0
    removed_screens_dirs = 0

    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in AUX_DELETE_EXTS:
            path.unlink()
            removed_files += 1

    for path in root.rglob("Screens"):
        if path.is_dir():
            shutil.rmtree(path)
            removed_screens_dirs += 1

    return removed_files, removed_screens_dirs


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--preview-limit", type=int, default=200)
    parser.add_argument("--videos-only", action="store_true")
    parser.add_argument("--remove-empty-dirs", action="store_true")
    parser.add_argument("--watched-count", type=int, default=DEFAULT_WATCHED_COUNT)
    args = parser.parse_args()

    root = Path(args.root).resolve()
    episode_files: list[EpisodeFile] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [name for name in dirnames if name not in {".git", ".agents", ".codex"}]
        for filename in filenames:
            path = Path(dirpath) / filename
            parsed = parse_episode_file(path)
            if parsed:
                episode_files.append(parsed)

    groups: dict[tuple[str, int], list[EpisodeFile]] = defaultdict(list)
    for episode_file in episode_files:
        groups[(episode_file.normalized_title, episode_file.season)].append(episode_file)

    operations: list[tuple[Path, Path]] = []
    skipped_subtitles: list[tuple[Path, list[Path]]] = []

    for (normalized_title, season), files in sorted(groups.items(), key=lambda item: (f"{item[0][0]} S{item[0][1]:02d}".lower(), item[0][1])):
        episodes = [episode for entry in files for episode in entry.episodes]
        summary, summary_suffix = summarize_episodes(episodes)
        folder = root / build_folder_name(normalized_title, season, summary, args.watched_count, summary_suffix)
        for entry in sorted(files, key=lambda item: (item.episodes[0], str(item.path).lower())):
            target_video = folder / entry.path.name
            operations.append((entry.path, target_video))

            if not args.videos_only:
                subtitle = choose_subtitle(entry.path)
                if subtitle is None:
                    continue
                target_sub = folder / f"{target_video.stem}.srt"
                if target_sub.resolve() == subtitle.resolve():
                    continue
                if subtitle != entry.path.with_suffix(".srt") and len(find_candidate_subtitles(entry.path)) > 1:
                    skipped_subtitles.append((entry.path, find_candidate_subtitles(entry.path)))
                    continue
                operations.append((subtitle, target_sub))

    print(f"Detected episodic video files: {len(episode_files)}")
    print(f"Detected groups: {len(groups)}")
    print(f"Planned moves/renames: {len(operations)}")
    print()

    if args.preview_limit > 0:
        preview_count = 0
        seen_targets: set[Path] = set()
        for source, target in operations:
            if target in seen_targets:
                continue
            seen_targets.add(target)
            print(f"{relative_to_root(source, root)} -> {relative_to_root(target, root)}")
            preview_count += 1
            if preview_count >= args.preview_limit:
                print("... preview truncated ...")
                break

    if skipped_subtitles:
        print()
        print("Ambiguous subtitles skipped:")
        for video_path, candidates in skipped_subtitles[:50]:
            joined = ", ".join(relative_to_root(candidate, root) for candidate in candidates)
            print(f"{relative_to_root(video_path, root)} :: {joined}")
        if len(skipped_subtitles) > 50:
            print("... skipped subtitle list truncated ...")

    if not args.apply:
        return 0

    removed_aux_files, removed_screens_dirs = cleanup_auxiliary_files(root)
    print(f"Removed auxiliary files: {removed_aux_files}")
    print(f"Removed Screens directories: {removed_screens_dirs}")
    print("Creating target directories...")
    for _, target in operations:
        target.parent.mkdir(parents=True, exist_ok=True)

    print("Moving files...")
    moved = 0
    skipped_existing = 0
    for source, target in operations:
        if not source.exists():
            continue
        if source.resolve() == target.resolve():
            continue
        if target.exists():
            if source.resolve() == target.resolve():
                continue
            print(f"SKIP existing target: {relative_to_root(target, root)}")
            skipped_existing += 1
            continue
        shutil.move(str(source), str(target))
        moved += 1
        if moved % 1000 == 0:
            print(f"Moved {moved} entries...")

    print(f"Completed. moved={moved} skipped_existing={skipped_existing}")

    if args.remove_empty_dirs:
        removed_dirs = 0
        for dirpath, dirnames, filenames in os.walk(root, topdown=False):
            current = Path(dirpath)
            if current == root:
                continue
            if current.name in {".git", ".agents", ".codex"}:
                continue
            if dirnames or filenames:
                continue
            try:
                current.rmdir()
                removed_dirs += 1
            except OSError:
                pass
        print(f"Removed empty directories: {removed_dirs}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
