import { WORKBENCH_ACTIVE_TAB, WORKBENCH_CONNECTION_STATUS } from "@/consts"

export type WorkbenchActiveTab = (typeof WORKBENCH_ACTIVE_TAB)[keyof typeof WORKBENCH_ACTIVE_TAB]

export type WorkbenchConnectionStatus =
  (typeof WORKBENCH_CONNECTION_STATUS)[keyof typeof WORKBENCH_CONNECTION_STATUS]