import DexieInstance from "@/plugins/dexie";

import InstanceService from '@/service/InstanceService';

// dexie实例
const dexieInstance = new DexieInstance();

// 导出数据库实例服务
export const instanceService = new InstanceService(dexieInstance.getInstance());