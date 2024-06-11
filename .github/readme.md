<h1 align="center">Lemmy<br />
<div align="center">
<a href="https://github.com/dockur/lemmy"><img src="https://raw.githubusercontent.com/dockur/lemmy/master/.github/logo.svg" title="Logo" style="max-width:100%;" width="128" /></a>
</div>
<div align="center">
  
[![Build]][build_url]
[![Version]][tag_url]
[![Size]][tag_url]
[![Pulls]][hub_url]

</div></h1>

Multi-platform docker image of [Lemmy](https://github.com/LemmyNet/lemmy), a link aggregator and forum for the fediverse.

## Usage  🐳

Via Docker Compose:

```yaml
services:
  lemmy:
    container_name: lemmy
    image: dockurr/lemmy
    ports:
      - 8536:8536
    environment:
      - RUST_LOG="warn"
    volumes:
      - ./lemmy.hjson:/config/config.hjson
    stop_grace_period: 1m
```

Via Docker CLI:

```bash
docker run -it --rm -p 8536:8536 -v " ./lemmy.hjson:/config/config.hjson" --stop-timeout 60 dockurr/lemmy
```

## Stars 🌟
[![Stars](https://starchart.cc/dockur/lemmy.svg?variant=adaptive)](https://starchart.cc/dockur/lemmy)

[build_url]: https://github.com/dockur/lemmy/
[hub_url]: https://hub.docker.com/r/dockurr/lemmy/
[tag_url]: https://hub.docker.com/r/dockurr/lemmy/tags

[Build]: https://github.com/dockur/lemmy/actions/workflows/build.yml/badge.svg
[Size]: https://img.shields.io/docker/image-size/dockurr/lemmy/latest?color=066da5&label=size
[Pulls]: https://img.shields.io/docker/pulls/dockurr/lemmy.svg?style=flat&label=pulls&logo=docker
[Version]: https://img.shields.io/docker/v/dockurr/lemmy/latest?arch=amd64&sort=semver&color=066da5
