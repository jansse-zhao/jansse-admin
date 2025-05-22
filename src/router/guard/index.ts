import type { Router } from 'vue-router';
import { createRouteGuard } from './route';
import { createProgressGuard } from './progress';
import { createDocumentTitleGuard } from './title';

/**
 * Router guard
 *
 * @param router - Router instance
 */
export function createRouterGuard(router: Router) {
  // 设置组件加载进度条
  createProgressGuard(router);
  createRouteGuard(router);
  // 设置标题名称
  createDocumentTitleGuard(router);
}
