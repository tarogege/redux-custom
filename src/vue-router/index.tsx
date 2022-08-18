/**
 * vue2 vue.use(VueRouter) install的静态方法
 * vue3中 vue.use(router) router实例
 */
import Vue from "vue";

class MyVueRouter {
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    // data是响应式数据，监听路由变化
    this.data = Vue.observable({ current: "" });

    this.init();
  }

  init() {
    this.createRouteMap();
    this.initComponent();
    this.initEvent();
  }
  // 创建router-link,router-view
  // 默认版本vue不支持template，需要使用render（h）方法
  initComponent() {
    const that = this;
    const routerLink = Vue.component("router-link", {
      props: {
        to: String
      },
      template: "<a :href=to @click=handleClick><slot></slot></a>",
      methods: {
        handleClick(e) {
          e.preventDefault();
          window.history.pushState(this.props.to);
          that.data.current = this.props.to;
        }
      }
    });
    const routerView = Vue.component("router-view", {
      render(h) {
        const path = that.data.current;
        return h(that.routeMap(path));
      }
    });
    return { routerLink, routerView };
  }
  createRouteMap() {
    const routes = this.options?.routes || {};
    // TODO:没有考虑到嵌套路由的情况
    for (const route of routes) {
      this.routeMap[route?.path] = route?.component;
    }
  }
  initEvent() {
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;
    });
  }
}

export default MyVueRouter;
