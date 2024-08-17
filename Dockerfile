ARG RUST_VERSION=1.77
ARG RUST_RELEASE_MODE="release"
ARG CARGO_BUILD_FEATURES=default

ARG AMD_BUILDER_IMAGE=rust:${RUST_VERSION}
ARG ARM_BUILDER_IMAGE="ghcr.io/raskyld/aarch64-lemmy-linux-gnu:v0.4.0"

ARG AMD_RUNNER_IMAGE=debian:bookworm-slim
ARG ARM_RUNNER_IMAGE=debian:bookworm-slim

# AMD64 builder
FROM --platform=linux/amd64 ${AMD_BUILDER_IMAGE} AS build-amd64

ARG RUST_RELEASE_MODE
ARG CARGO_BUILD_FEATURES
ARG RUSTFLAGS

WORKDIR /home/lemmy/src
COPY . ./
 
# Build
RUN --mount=type=cache,target=./target set -ex; \
    echo "Building Lemmy $(git describe --tag), Cargo Target: $(rustc -vV | sed -n 's|host: ||p'), Mode: $RUST_RELEASE_MODE"; \
    if [ "${RUST_RELEASE_MODE}" = "debug" ]; then \
        cargo build --features "${CARGO_BUILD_FEATURES}"; \
    else \
        cargo clean --release; \
        cargo build --features "${CARGO_BUILD_FEATURES}" --release; \
    fi; \
    mv "./target/${RUST_RELEASE_MODE}/lemmy_server" ./../lemmy_server;

# ARM64 builder
FROM --platform=linux/amd64 ${ARM_BUILDER_IMAGE} AS build-arm64

USER 10001:10001

ARG RUST_RELEASE_MODE
ARG CARGO_BUILD_FEATURES
ARG RUSTFLAGS

WORKDIR /home/lemmy/src
COPY --chown=lemmy:lemmy . ./

ENV PATH="/home/lemmy/.cargo/bin:${PATH}"
ENV RUST_RELEASE_MODE=${RUST_RELEASE_MODE} \
    CARGO_BUILD_FEATURES=${CARGO_BUILD_FEATURES}

# Build
RUN --mount=type=cache,target=./target,uid=10001,gid=10001 set -ex; \
    echo "Building Lemmy $(git describe --tag), Cargo Target: $(rustc -vV | sed -n 's|host: ||p'), Mode: $RUST_RELEASE_MODE"; \
    if [ "${RUST_RELEASE_MODE}" = "debug" ]; then \
        cargo build --features "${CARGO_BUILD_FEATURES}"; \
    else \
        cargo clean --release; \
        cargo build --features "${CARGO_BUILD_FEATURES}" --release; \
    fi; \
    mv "./target/$CARGO_BUILD_TARGET/$RUST_RELEASE_MODE/lemmy_server" ./../lemmy_server;

# AMD64 base runner
FROM ${AMD_RUNNER_IMAGE} AS runner-linux-amd64

ARG DEBCONF_NOWARNINGS="yes"
ARG DEBIAN_FRONTEND="noninteractive"
ARG DEBCONF_NONINTERACTIVE_SEEN="true"

RUN apt-get update \
 && apt-get -y install --no-install-recommends tini postgresql-client libssl3 ca-certificates curl \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build-amd64 --chmod=0755 /home/lemmy/lemmy_server /usr/local/bin

# ARM64 base runner
FROM ${ARM_RUNNER_IMAGE} AS runner-linux-arm64

ARG DEBCONF_NOWARNINGS="yes"
ARG DEBIAN_FRONTEND="noninteractive"
ARG DEBCONF_NONINTERACTIVE_SEEN="true"

RUN apt-get update \
 && apt-get -y install --no-install-recommends tini postgresql-client libssl3 ca-certificates curl \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build-arm64 --chmod=0755 /home/lemmy/lemmy_server /usr/local/bin

# Final image that use a base runner based on the target OS and ARCH
FROM runner-${TARGETOS}-${TARGETARCH}

ARG UID=1000
ARG GID=1000
ARG UNAME=lemmy

RUN groupadd -g ${GID} -o ${UNAME} && \
    useradd -m -l -u ${UID} -g ${GID} -o -s /bin/bash ${UNAME}
USER $UNAME

EXPOSE 8536
STOPSIGNAL SIGTERM

ENTRYPOINT ["/usr/bin/tini", "-s", "lemmy_server"]
