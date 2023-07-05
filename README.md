# auther-github

Auth with GitHub, get user info as result.

First, get auth code with your tokens:

```bash
https://github.com/login/oauth/authorize?client_id=<your-appId>&redirect_uri=<your-callbackUrl>&scope=user:email
```

Then, post params with URL query with:

|      Name | Required $NODE_ENV     | Description |
| --------: | ---------------------- | ----------- |
|      code | production,development |             |
|     appId | production             |             |
| appSecret | production             |             |

For more infos, checkout references:

- https://docs.github.com/
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps

## Usage

```bash
# development
curl -X POST http://localhost:3000?code=123456asdf

# production
curl -X POST <your-service-url>?code=123456asdf&appId=<your-appId>&appSecret=<your-appSecret>
```

## Deploy

### Docker

#### 集成文件

```bash
# 编译并发布
APP_NAME=auther-github sh -x build.sh
# 拉取并运行
APP_NAME=auther-github sh -x run.sh
```

#### 单独操作

```bash
# 单独构建镜像
APP_NAME=auther-github \
docker build . -t $APP_NAME:latest --no-cache
```

```bash
# 单独启动容器
IMAGE_NAME=auther-github \
APP_NAME=auther-github \
PORT=3000 \
docker run --name $APP_NAME --restart always -d -p $PORT:3000 $IMAGE_NAME
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
