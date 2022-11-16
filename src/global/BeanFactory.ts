import DexieInstance from "@/plugins/dexie";

import DatabaseService from "@/service/DatabaseService";
import FieldService from "@/service/FieldService";
import InstanceService from '@/service/InstanceService';
import TableService from "@/service/TableService";

// dexie实例
const dexieInstance = new DexieInstance();

// 导出数据库实例服务
export const instanceService = new InstanceService(dexieInstance.getInstance());
export const databaseService = new DatabaseService(dexieInstance, dexieInstance.getDatabase());
export const tableService = new TableService(dexieInstance.getTable());
export const fieldService = new FieldService(dexieInstance.getField());