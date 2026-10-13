import type { CmsType } from "./type";
import { type01 } from "./types/type01";

// 번호순. 원본에 08이 없어서 건너뛴다.
export const CMS_TYPES: CmsType[] = [type01];

export function getType(id: string): CmsType | undefined {
  return CMS_TYPES.find((type) => type.id === id);
}
