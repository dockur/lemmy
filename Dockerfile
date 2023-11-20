FROM rust:1.74.0-slim-bookworm as builder

# Install compilation dependencies
RUN apt-get update \
 && apt-get -y install --no-install-recommends libssl-dev pkg-config libpq-dev git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# comma-seperated list of features to enable
ARG CARGO_BUILD_FEATURES=default

# This can be set to release using --build-arg
ARG RUST_RELEASE_MODE="release"

COPY . .

# Build the project

# Debug mode build
RUN --mount=type=cache,target=/app/target \
    if [ "$RUST_RELEASE_MODE" = "debug" ] ; then \
      echo "pub const VERSION: &str = \"$(git describe --tag)\";" > "crates/utils/src/version.rs" \
      && echo "Building Lemmy $(git describe --tag), Cargo Target: $(rustc -vV | sed -n 's|host: ||p'), Mode: $RUST_RELEASE_MODE" \
      && cargo build --features ${CARGO_BUILD_FEATURES} \
      && cp ./target/$RUST_RELEASE_MODE/lemmy_server /app/lemmy_server; \
    fi

# Release mode build
RUN \
    if [ "$RUST_RELEASE_MODE" = "release" ] ; then \
      echo "pub const VERSION: &str = \"$(git describe --tag)\";" > "crates/utils/src/version.rs" \
      && echo "Building Lemmy $(git describe --tag), Cargo Target: $(rustc -vV | sed -n 's|host: ||p'), Mode: $RUST_RELEASE_MODE" \
      && cargo build --features ${CARGO_BUILD_FEATURES} --release \
      && cp ./target/$RUST_RELEASE_MODE/lemmy_server /app/lemmy_server; \
    fi

# The Debian runner
FROM debian:bookworm-slim as lemmy

# Install libpq for postgres
RUN apt-get update \
 && apt-get -y install --no-install-recommends tini postgresql-client libc6 libssl3 ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN addgroup --gid 1000 lemmy
RUN useradd --no-create-home --shell /bin/sh --uid 1000 --gid 1000 lemmy

# Copy resources
COPY --chown=lemmy:lemmy --from=builder /app/lemmy_server /app/lemmy

RUN chown lemmy:lemmy /app/lemmy
USER lemmy

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

ENTRYPOINT ["/usr/bin/tini", "-s", "/app/lemmy"]
