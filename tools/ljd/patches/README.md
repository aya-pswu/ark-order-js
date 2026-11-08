# Local modifications to upstream ljd.

`tools/ljd` is a snapshot of upstream [BrandTime/ljd](https://github.com/BrandTime/ljd)
(GPL-3.0) which previously lived here as a nested `.git` checkout. Nested git trees must
never enter a repository — they carry someone else's full history (including commits
unrelated to this project), and most tooling treats them as a gitlink or noise instead
of source.

The nested `.git` directory is therefore excluded, and local changes are recorded in
this directory as `.patch` files: readable, diffable, applicable with `git apply` or
plain `patch`, no network or extra tooling required.

## Applied changes

| Patch file | Affected file | Why | Upstream status |
|---|---|---|---|
| `0001-writer-invalid-method-key.patch` | `ljd/lua/writer.py` | Upstream `assert`s and crashes when a method key is not a valid identifier, which made files such as `ArkMgr.lua` decompile to empty output. The patch falls back to emitting valid Lua syntax: `["key"](...)`. | Not reported upstream |

## How to replay

```bash
cd tools/ljd && git apply patches/0001-writer-invalid-method-key.patch   # if a git worktree
cd tools/ljd && patch -p1 < patches/0001-writer-invalid-method-key.patch  # plain file tree
```

## Updating to a fresh upstream snapshot

1. Overwrite `tools/ljd` with the new upstream code (keep this `patches/` directory);
2. Replay each `patches/*.patch`; resolve conflicts per the "why" column above
   (touching `ljd/lua/writer.py`);
3. Sanity-check with `python main.py -c -f <some-bytecode>.lua -o /tmp/x.lua` and confirm
   the output is non-empty and contains `["`-style method keys (i.e. the patch applies).
