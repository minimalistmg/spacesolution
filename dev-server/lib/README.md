# Dev server internals

Helper scripts used by the two launchers in the parent folder.

| File | Purpose |
|------|---------|
| `dev-server.cmd` | Runs `npm run dev:fast` hidden with light Node/npm settings |
| `_start-hidden.cmd` | Starts `dev-server.cmd` via hidden VBS launcher |
| `kill-dev-port.ps1` | Stops process listening on port 4321 |
| `is-dev-running.ps1` | Exit 0 if port 4321 is listening |
| `notify.ps1` | Windows tray balloon notification |
| `status-dev.bat` | Optional status check with toast |

Preview URL: **http://localhost:4321/**

First start after reboot may take up to ~45 seconds.
