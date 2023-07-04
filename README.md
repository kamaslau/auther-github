# auther-github

## Deploy

### Manual

Only recommended under development scenerios.

```bash
cp .env.sample .env
nano .env # modify variables

pnpm i

# development
pnpm start:dev

# production (better use with PM2)
# pnpm start

# Usage
## development
curl -X POST http://localhost:3000?code=123456asdf
### production
curl -X POST <yourUrl>?code=123456asdf&appId=<yourAppId>&appSecret=<yourappSecret>
```
