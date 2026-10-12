import type { NextConfig } from "next";

// Cache Components는 켜지 않는다: 이 사이트는 빌드 때 파일을 읽어 굳히는 정적 페이지뿐이라
// 요청 시점 캐싱 모델이 필요 없고, 켜면 dynamicParams(목록 밖 슬러그를 404로)를 쓸 수 없다.
const nextConfig: NextConfig = {};

export default nextConfig;
