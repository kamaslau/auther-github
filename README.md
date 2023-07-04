# auther-github

## Deploy

### Docker

构建，并上传镜像

```bash
APP_NAME=auther-github; docker build . -t auther-github:latest --no-cache
```

拉取，并启动容器

```bash
IMAGE_NAME=auther-github; APP_NAME=auther-github; PORT=3000; docker run --name $APP_NAME --restart always -d -p $PORT:3000 $IMAGE_NAME
```

### Manual

Only recommended under development scenerios.

```bash
cp .env.sample .env
nano .env # modify variables to yours

pnpm i

# development
pnpm start:dev

# production (better use with PM2)
# pnpm start
```

## Usage

```bash
# development
curl -X POST http://localhost:3000?code=123456asdf

# production
curl -X POST <yourUrl>?code=123456asdf&appId=<yourAppId>&appSecret=<yourappSecret>
```
