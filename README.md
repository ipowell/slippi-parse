## Dev Instructions

- `npm install`
- `make run`
- Create a `.env` with the following keys:
    - `DOLPHIN`
    - `MELEE`
    - `BASE_DIR`

See `Makefile` for more commands.

Output files will be generated in a directory named `output`.

To play a JSON file in Dolphin, run:

```bash
<path/to/dolphin/executable> -e <path/to/melee/iso> -i <path/to/json>
```

In Linux, Dolphin is located by default at `~/.config/Slippi\ Launcher/playback/Slippi_Playback-x86_64.AppImage`. Note that you want the one in `Slippi Launcher/playback` and NOT `Slippi Launcher/netplay`.