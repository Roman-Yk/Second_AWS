FROM node:12.13.1-alpine3.9 AS builder

RUN mkdir /frontend
WORKDIR /frontend

# Add all dependencies
COPY application/package.json ./application/
COPY shared/package.json ./shared/
# COPY forms/package.json ./forms/
COPY api/package.json ./api/

COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn

COPY . .

RUN mkdir /frontend/application/dist
RUN yarn workspace @tms/application build


# FROM alpine:latest
# COPY --from=builder /frontend/application/dist/. /frontend/
# WORKDIR /frontend

# ENTRYPOINT ["sh", "-c"]
# CMD ["while sleep 1; do :; done"]
