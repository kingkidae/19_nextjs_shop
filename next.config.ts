import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // .env 의 공개용 값만 브라우저 번들에 노출 (비밀번호·OAuth 시크릿은 넣지 않음)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_PROJECT_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PROJECT_PUBLISHABLE_KEY,
    // 토스 결제위젯 클라이언트 키(test_gck_). 시크릿 키(TOSS_PAYMENTS_SECRET)는 서버 전용
    NEXT_PUBLIC_TOSS_CLIENT_KEY: process.env.TOSS_PAYMENTS_CLIENT_KEY,
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
