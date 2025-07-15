
## Start
```sh
docker compose up
# or for detatched:
# docker compose up -d
```

## Restart
Might be needed after changing docker config, or some changes to packages
```sh
docker compose down
docker compose build --no-cache
docker compose up
```
