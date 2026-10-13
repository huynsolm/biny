import type { CmsType } from "./type";
import { type01 } from "./types/type01";
import { type02 } from "./types/type02";
import { type03 } from "./types/type03";
import { type04 } from "./types/type04";
import { type05 } from "./types/type05";
import { type06 } from "./types/type06";
import { type07 } from "./types/type07";
import { type09 } from "./types/type09";
import { type10 } from "./types/type10";
import { type11 } from "./types/type11";
import { type12 } from "./types/type12";
import { type13 } from "./types/type13";
import { type14 } from "./types/type14";
import { type15 } from "./types/type15";

// 번호순. 원본에 08이 없어서 건너뛴다.
export const CMS_TYPES: CmsType[] = [type01, type02, type03, type04, type05, type06, type07, type09, type10, type11, type12, type13, type14, type15];

export function getType(id: string): CmsType | undefined {
  return CMS_TYPES.find((type) => type.id === id);
}
