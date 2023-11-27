ARG RUST_VERSION=1.72.1
ARG RUST_RELEASE_MODE="release"
ARG CARGO_BUILD_FEATURES=default

ARG AMD_BUILDER_IMAGE=rust:${RUST_VERSION}
ARG ARM_BUILDER_IMAGE="ghcr.io/raskyld/aarch64-lemmy-linux-gnu:v0.1.0"

ARG AMD_RUNNER_IMAGE=debian:bookworm-slim
ARG ARM_RUNNER_IMAGE=debian:bookworm-slim

# AMD64 builder
FROM --platform=linux/amd64 ${AMD_BUILDER_IMAGE} AS build-amd64

ARG RUST_RELEASE_MODE
ARG CARGO_BUILD_FEATURES

WORKDIR /home/lemmy/src
COPY . ./
 
# Build
RUN --mount=type=cache,target=./target set -ex; \
    echo "pub const VERSION: &str = \"$(git describe --tag)\";" > crates/utils/src/version.rs; \
    echo "Building Lemmy $(git describe --tag), Cargo Target: $(rustc -vV | sed -n 's|host: ||p'), Mode: $RUST_RELEASE_MODE"; \
    if [ "${RUST_RELEASE_MODE}" = "debug" ]; then \
        cargo build --features "${CARGO_BUILD_FEATURES}"; \
    else \
        [ -z "$USE_RELEASE_CACHE" ] && cargo clean --release; \
        cargo build --features "${CARGO_BUILD_FEATURES}" --release; \
    fi; \
    mv "./target/${RUST_RELEASE_MODE}/lemmy_server" ./lemmy_server;

# ARM64 builder
FROM --platform=linux/amd64 ${ARM_BUILDER_IMAGE} AS build-arm64

USER 10001:10001

ARG RUST_RELEASE_MODE
ARG CARGO_BUILD_FEATURES

WORKDIR /home/lemmy/src
COPY --chown=lemmy:lemmy . ./

ENV PATH="/home/lemmy/.cargo/bin:${PATH}"
ENV RUST_RELEASE_MODE=${RUST_RELEASE_MODE} \
    CARGO_BUILD_FEATURES=${CARGO_BUILD_FEATURES}

# Build
RUN --mount=type=cache,target=./target,uid=10001,gid=10001 set -ex; \
    echo "pub const VERSION: &str = \"$(git describe --tag)\";" > crates/utils/src/version.rs; \
    echo "Building Lemmy $(git describe --tag), Cargo Target: $(rustc -vV | sed -n 's|host: ||p'), Mode: $RUST_RELEASE_MODE"; \
    if [ "${RUST_RELEASE_MODE}" = "debug" ]; then \
        cargo build --features "${CARGO_BUILD_FEATURES}"; \
    else \
        [ -z "$USE_RELEASE_CACHE" ] && cargo clean --release; \
        cargo build --features "${CARGO_BUILD_FEATURES}" --release; \
    fi; \
    mv "./target/$CARGO_BUILD_TARGET/$RUST_RELEASE_MODE/lemmy_server" ./lemmy_server;

# AMD64 base runner
FROM ${AMD_RUNNER_IMAGE} AS runner-linux-amd64

ARG DEBCONF_NOWARNINGS="yes"
ARG DEBIAN_FRONTEND noninteractive

RUN apt-get update \
 && apt-get -y install --no-install-recommends tini postgresql-client libssl3 ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build-amd64 --chmod=0755 /home/lemmy/lemmy_server /usr/local/bin

# ARM64 base runner
FROM ${ARM_RUNNER_IMAGE} AS runner-linux-arm64

ARG DEBCONF_NOWARNINGS="yes"
ARG DEBIAN_FRONTEND noninteractive

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

ARG UID=1000
ARG GID=1000
ARG UNAME=lemmy

RUN groupadd -g ${GID} -o ${UNAME} && \
    useradd -m -u ${UID} -g ${GID} -o -s /bin/bash ${UNAME}
USER $UNAME

EXPOSE 8536
STOPSIGNAL SIGTERM

ENTRYPOINT ["/usr/bin/tini", "-s", "lemmy_server"]