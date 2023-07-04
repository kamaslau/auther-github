# https://docs.docker.com/engine/reference/builder/
#
# Build with
# docker build . -t <local-image-name>
#
# Tag with (remember to push at least 1 latest tag)
# docker tag <local-image-name>:tagname <org-name>/<image-name>:tagname 
#
# Push with
# docker push <org-name>/<local-image-name>:tag-name
#
# Pull with
# docker pull <org-name>/<local-image-name>:tag-name
#
# Export with
# docker save <local-image-name> -o <local-image-name>.tar
#
# Load from file with
# docker load -i <local-image-name>.tar
#
# Run with
# docker container run --name <container-name> --restart always --add-host=host.docker.internal:host-gateway --privileged -d -p 3000:3000 <local-image-name>
#
# Copy file from container to pwd (causes data leak, proceed with caution)
# docker cp <container-name>:/root/app/.env ./.env
#
# Exec with (dont't do this in production container)
# docker exec -it <container-name> /bin/bash
FROM node:lts-slim AS base
ENV APP_PATH=/root/app
WORKDIR ${APP_PATH}
# [Optional]Config PRC mirror for NPM
RUN npm set registry https://registry.npmmirror.com/
RUN npm add -g pnpm@latest

# ======
# 依赖项基底
FROM base AS deps
COPY package.json pnpm-lock.yaml ./

# ======
# 依赖项:生产环境
FROM deps AS deps-prod
RUN pnpm i --production

# ======
# 运行时
FROM deps AS final
COPY --from=deps-prod ${APP_PATH}/node_modules ./node_modules
COPY src ./src
COPY .env ./
EXPOSE 3000
CMD pnpm start
