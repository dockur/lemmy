ARG RUST_VERSION=1.74
ARG RUST_RELEASE_MODE="release"
ARG CARGO_BUILD_FEATURES=default

ARG AMD_BUILDER_IMAGE=rust:${RUST_VERSION}
ARG ARM_BUILDER_IMAGE="dessalines/lemmy-builder-arm64:0.19.0-alpha.12"

ARG AMD_RUNNER_IMAGE=debian:bookworm-slim
ARG ARM_RUNNER_IMAGE=debian:bookworm-slim

ARG UID=1000
ARG GID=1000
ARG UNAME=lemmy

# AMD64 builder
FROM --platform=linux/amd64 ${AMD_BUILDER_IMAGE} AS build-amd64

ARG RUST_RELEASE_MODE
ARG CARGO_BUILD_FEATURES

WORKDIR /lemmy

COPY . ./

# Debug build
RUN --mount=type=cache,target=/lemmy/target set -ex; \
    if [ "${RUST_RELEASE_MODE}" = "debug" ]; then \
        echo "pub const VERSION: &str = \"$(git describe --tag)\";" > crates/utils/src/version.rs; \
        cargo build --features "${CARGO_BUILD_FEATURES}"; \
        mv target/debug/lemmy_server ./lemmy_server; \
    fi

# Release build
RUN set -ex; \
    if [ "${RUST_RELEASE_MODE}" = "release" ]; then \
        echo "pub const VERSION: &str = \"$(git describe --tag)\";" > crates/utils/src/version.rs; \
        cargo build --features "${CARGO_BUILD_FEATURES}" --release; \
        mv target/release/lemmy_server ./lemmy_server; \
    fi

# ARM64 builder
FROM --platform=linux/amd64 ${ARM_BUILDER_IMAGE} AS build-arm64

# amd64 base runner
FROM ${AMD_RUNNER_IMAGE} AS runner-linux-amd64

RUN apt-get update \
 && apt-get -y install --no-install-recommends tini postgresql-client libssl3 ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build-amd64 --chmod=0755 /lemmy/lemmy_server /usr/local/bin

# arm base runner
FROM ${ARM_RUNNER_IMAGE} AS runner-linux-arm64

RUN apt-get update \
 && apt-get -y install --no-install-recommends tini postgresql-client libssl3 ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build-arm64 --chmod=0755 /home/lemmy/lemmy_server /usr/local/bin

# Final image that use a base runner based on the target OS and ARCH
FROM runner-${TARGETOS}-${TARGETARCH}

ARG DATE_ARG=""
ARG BUILD_ARG=0
ARG VERSION_ARG=0
ENV VERSION=$VERSION_ARG

LABEL org.opencontainers.image.title="Lemmy"
LABEL org.opencontainers.image.licenses="AGPL-3.0"
LABEL org.opencontainers.image.created=${DATE_ARG}
LABEL org.opencontainers.image.revision=${BUILD_ARG}
LABEL org.opencontainers.image.version=${VERSION_ARG}
LABEL org.opencontainers.image.source="https://github.com/dockur/lemmy/"
LABEL org.opencontainers.image.url="https://hub.docker.com/r/dockurr/lemmy/"
LABEL org.opencontainers.image.description="A link aggregator and forum for the fediverse"

ARG GID
ARG UID
ARG UNAME

RUN groupadd -g ${GID} -o ${UNAME} && \
    useradd -m -u ${UID} -g ${GID} -o -s /bin/bash ${UNAME}
USER $UNAME

EXPOSE 8536
STOPSIGNAL SIGTERM

ENTRYPOINT ["/usr/bin/tini", "-s", "lemmy_server"]
