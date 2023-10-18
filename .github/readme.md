<h1 align="center">Lemmy<br />
<div align="center">
<img src="https://raw.githubusercontent.com/LemmyNet/lemmy-ui/main/src/assets/icons/favicon.svg" title="Logo" style="max-width:100%;" width="128" />
</div>
<div align="center">
  
[![Build]][build_url]
[![Version]][tag_url]
[![Size]][tag_url]
[![Pulls]][hub_url]

</div></h1>

Docker image of [Lemmy](https://github.com/LemmyNet/lemmy), a link aggregator and forum for the fediverse.

## How to use

Via `docker-compose`

```yaml
version: "3"
services:
  lemmy:
    container_name: lemmy
    image: dockurr/lemmy:latest
    ports:
      - 8536:8536
    environment:
      - RUST_LOG="warn"
    volumes:
      - /path/to/lemmy.hjson:/config/config.hjson:Z
    restart: on-failure
    stop_grace_period: 1m
```

[build_url]: https://github.com/dockur/lemmy/
[hub_url]: https://hub.docker.com/r/dockurr/lemmy/
[tag_url]: https://hub.docker.com/r/dockurr/lemmy/tags

[Build]: https://github.com/dockur/lemmy/actions/workflows/build.yml/badge.svg
[Size]: https://img.shields.io/docker/image-size/dockurr/lemmy/latest?color=066da5&label=size
[Pulls]: https://img.shields.io/docker/pulls/dockurr/lemmy.svg?style=flat&label=pulls&logo=docker
[Version]: https://img.shields.io/docker/v/dockurr/lemmy/latest?arch=amd64&sort=semver&color=066da5
