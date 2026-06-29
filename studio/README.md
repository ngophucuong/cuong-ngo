# Studio v1 Spec

`studio/` la Worker rieng cho quy trinh viet, duyet va publish bai len `ngophucuong/cuong-ngo`.

## Muc tieu v1

- Soan bai Markdown trong UI noi bo.
- Luu draft va artifact publish-ready tach biet.
- AI chi goi y va review, khong tu publish.
- Publish ngay hoac dat lich tu server.
- Theo doi bai nao duoc doc nhieu nhat trong 30 ngay.
- Chi commit vao duy nhat `src/content/blog/<slug>.md`.

## Kien truc

- `studio.cuong.ngo`
  - Gan vao cung Worker nay.
  - Bao boi boi Cloudflare Access OTP.
  - Dung cho editor, review, approve, publish.
- `signals.cuong.ngo`
  - Gan vao cung Worker nay, KHONG bat Access.
  - Chi mo `POST /api/track` de nhan pageview tu blog public.
- `D1`
  - Luu metadata draft, review runs, publish jobs, top-post analytics.
- `R2`
  - Luu body draft goc va artifact da approve.
- `Workers AI`
  - Review bai viet, goi y metadata, goi y related posts.
  - Tao SVG minh hoa tu prompt/noi dung.
- `Workflows`
  - Xu ly publish now/schedule bang mot duong di duy nhat.
- `GitHub token`
  - Secret chi co quyen push vao repo `ngophucuong/cuong-ngo`.
  - Worker chi viet file markdown duoi `src/content/blog/`.

## Luong xu ly

1. Tao draft
2. Luu body vao `R2`
3. AI review de de xuat:
   - title
   - description
   - tags
   - read time
   - series / related slugs
   - call to action
4. AI co the tao `SVG` minh hoa.
5. Ban phe duyet -> Worker dong artifact Markdown hoan chinh.
6. Publish:
   - `now`: Workflows chay ngay
   - `schedule`: Workflows `sleepUntil()` roi publish
7. Worker commit thang len GitHub `main`.

## Du lieu

### D1

- `drafts`
  - metadata hien tai
  - trang thai `draft | ready | scheduled | published`
  - link toi source/artifact trong R2
- `review_runs`
  - luu ket qua review de audit
- `publish_jobs`
  - log publish now/schedule + workflow instance + commit SHA
- `view_events`
  - pageview cho dashboard

### R2

- `drafts/<id>/source.md`
- `drafts/<id>/approved.md`

## GitHub safety rules

- Slug duoc slugify va strip path traversal.
- Target path luon la `src/content/blog/<slug>.md`.
- Khong co API nao cho phep ghi file bat ky noi nao khac.
- Route publish yeu cau draft da o trang thai `ready`.
- Studio UI chi chay sau Cloudflare Access.

## Cloudflare setup

1. Tao D1:
   - `wrangler d1 create cuong-ngo-studio`
2. Tao R2:
   - `wrangler r2 bucket create cuong-ngo-studio-drafts --location=apac`
3. Chinh `studio/wrangler.jsonc`:
   - thay `database_id`
4. Dat secret:
   - `wrangler secret put GITHUB_TOKEN`
5. Apply migration:
   - `wrangler d1 migrations apply cuong-ngo-studio --remote`
6. Deploy:
   - `wrangler deploy`
7. Gan custom domains:
   - `studio.cuong.ngo` -> Worker `cuong-ngo-studio`
   - `signals.cuong.ngo` -> Worker `cuong-ngo-studio`
8. Bat Cloudflare Access cho `studio.cuong.ngo`
   - Login method: One-time PIN
   - Allowed email: `info@cuong.ngo`
   - Session duration tuy nhu cau, vi du 30 ngay

## Local dev

- `cd studio`
- `npm install`
- `wrangler dev --remote`

AI can `--remote` vi Workers AI khong chay local.

## Ghi chu v1

- Preview Markdown trong studio la ban render don gian de soan thao nhanh.
- Analytics v1 dung pageview beacon tu site public, chua dua vao Cloudflare Analytics Engine.
- Minh hoa `SVG` duoc nhung vao dau body bai da phe duyet de site public hien ngay, khong can them asset pipeline moi.
