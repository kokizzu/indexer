(() => {
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
  var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // node_modules/svelte/src/constants.js
  var EACH_ITEM_REACTIVE = 1;
  var EACH_INDEX_REACTIVE = 1 << 1;
  var EACH_IS_CONTROLLED = 1 << 2;
  var EACH_IS_ANIMATED = 1 << 3;
  var EACH_ITEM_IMMUTABLE = 1 << 4;
  var PROPS_IS_IMMUTABLE = 1;
  var PROPS_IS_RUNES = 1 << 1;
  var PROPS_IS_UPDATED = 1 << 2;
  var PROPS_IS_BINDABLE = 1 << 3;
  var PROPS_IS_LAZY_INITIAL = 1 << 4;
  var TRANSITION_OUT = 1 << 1;
  var TRANSITION_GLOBAL = 1 << 2;
  var TEMPLATE_FRAGMENT = 1;
  var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
  var TEMPLATE_USE_SVG = 1 << 2;
  var TEMPLATE_USE_MATHML = 1 << 3;
  var HYDRATION_START = "[";
  var HYDRATION_START_ELSE = "[!";
  var HYDRATION_START_FAILED = "[?";
  var HYDRATION_END = "]";
  var HYDRATION_ERROR = {};
  var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
  var ELEMENT_IS_INPUT = 1 << 2;
  var UNINITIALIZED = /* @__PURE__ */ Symbol("uninitialized");
  var FILENAME = /* @__PURE__ */ Symbol("filename");
  var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
  var NAMESPACE_SVG = "http://www.w3.org/2000/svg";
  var NAMESPACE_MATHML = "http://www.w3.org/1998/Math/MathML";

  // node_modules/esm-env/dev-fallback.js
  var node_env = globalThis.process?.env?.NODE_ENV;
  var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

  // node_modules/svelte/src/internal/shared/utils.js
  var is_array = Array.isArray;
  var index_of = Array.prototype.indexOf;
  var includes = Array.prototype.includes;
  var array_from = Array.from;
  var object_keys = Object.keys;
  var define_property = Object.defineProperty;
  var get_descriptor = Object.getOwnPropertyDescriptor;
  var get_descriptors = Object.getOwnPropertyDescriptors;
  var object_prototype = Object.prototype;
  var array_prototype = Array.prototype;
  var get_prototype_of = Object.getPrototypeOf;
  var is_extensible = Object.isExtensible;
  var noop = () => {
  };
  function run(fn) {
    return fn();
  }
  function run_all(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  // node_modules/svelte/src/internal/client/constants.js
  var DERIVED = 1 << 1;
  var EFFECT = 1 << 2;
  var RENDER_EFFECT = 1 << 3;
  var MANAGED_EFFECT = 1 << 24;
  var BLOCK_EFFECT = 1 << 4;
  var BRANCH_EFFECT = 1 << 5;
  var ROOT_EFFECT = 1 << 6;
  var BOUNDARY_EFFECT = 1 << 7;
  var CONNECTED = 1 << 9;
  var CLEAN = 1 << 10;
  var DIRTY = 1 << 11;
  var MAYBE_DIRTY = 1 << 12;
  var INERT = 1 << 13;
  var DESTROYED = 1 << 14;
  var REACTION_RAN = 1 << 15;
  var DESTROYING = 1 << 25;
  var EFFECT_TRANSPARENT = 1 << 16;
  var EAGER_EFFECT = 1 << 17;
  var HEAD_EFFECT = 1 << 18;
  var EFFECT_PRESERVED = 1 << 19;
  var USER_EFFECT = 1 << 20;
  var EFFECT_OFFSCREEN = 1 << 25;
  var WAS_MARKED = 1 << 16;
  var REACTION_IS_UPDATING = 1 << 21;
  var ASYNC = 1 << 22;
  var ERROR_VALUE = 1 << 23;
  var STATE_SYMBOL = /* @__PURE__ */ Symbol("$state");
  var LEGACY_PROPS = /* @__PURE__ */ Symbol("legacy props");
  var LOADING_ATTR_SYMBOL = /* @__PURE__ */ Symbol("");
  var PROXY_PATH_SYMBOL = /* @__PURE__ */ Symbol("proxy path");
  var ATTRIBUTES_CACHE = /* @__PURE__ */ Symbol("attributes");
  var CLASS_CACHE = /* @__PURE__ */ Symbol("class");
  var STYLE_CACHE = /* @__PURE__ */ Symbol("style");
  var TEXT_CACHE = /* @__PURE__ */ Symbol("text");
  var FORM_RESET_HANDLER = /* @__PURE__ */ Symbol("form reset");
  var HMR_ANCHOR = /* @__PURE__ */ Symbol("hmr anchor");
  var STALE_REACTION = new class StaleReactionError extends Error {
    constructor() {
      super(...arguments);
      __publicField(this, "name", "StaleReactionError");
      __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
    }
  }();
  var IS_XHTML = (
    // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
    !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
  );
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;

  // node_modules/svelte/src/internal/shared/errors.js
  function invariant_violation(message) {
    if (dev_fallback_default) {
      const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/invariant_violation`);
    }
  }
  function lifecycle_outside_component(name) {
    if (dev_fallback_default) {
      const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
    }
  }

  // node_modules/svelte/src/internal/client/errors.js
  function async_derived_orphan() {
    if (dev_fallback_default) {
      const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/async_derived_orphan`);
    }
  }
  function bind_invalid_checkbox_value() {
    if (dev_fallback_default) {
      const error = new Error(`bind_invalid_checkbox_value
Using \`bind:value\` together with a checkbox input is not allowed. Use \`bind:checked\` instead
https://svelte.dev/e/bind_invalid_checkbox_value`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/bind_invalid_checkbox_value`);
    }
  }
  function derived_references_self() {
    if (dev_fallback_default) {
      const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/derived_references_self`);
    }
  }
  function each_key_duplicate(a, b, value) {
    if (dev_fallback_default) {
      const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/each_key_duplicate`);
    }
  }
  function each_key_volatile(index2, a, b) {
    if (dev_fallback_default) {
      const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${index2} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/each_key_volatile`);
    }
  }
  function effect_in_teardown(rune) {
    if (dev_fallback_default) {
      const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_in_teardown`);
    }
  }
  function effect_in_unowned_derived() {
    if (dev_fallback_default) {
      const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
    }
  }
  function effect_orphan(rune) {
    if (dev_fallback_default) {
      const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_orphan`);
    }
  }
  function effect_update_depth_exceeded() {
    if (dev_fallback_default) {
      const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
    }
  }
  function hydration_failed() {
    if (dev_fallback_default) {
      const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/hydration_failed`);
    }
  }
  function props_invalid_value(key2) {
    if (dev_fallback_default) {
      const error = new Error(`props_invalid_value
Cannot do \`bind:${key2}={undefined}\` when \`${key2}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/props_invalid_value`);
    }
  }
  function rune_outside_svelte(rune) {
    if (dev_fallback_default) {
      const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
    }
  }
  function state_descriptors_fixed() {
    if (dev_fallback_default) {
      const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
    }
  }
  function state_prototype_fixed() {
    if (dev_fallback_default) {
      const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
    }
  }
  function state_unsafe_mutation() {
    if (dev_fallback_default) {
      const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
    }
  }
  function svelte_boundary_reset_onerror() {
    if (dev_fallback_default) {
      const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
      error.name = "Svelte error";
      throw error;
    } else {
      throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
    }
  }

  // node_modules/svelte/src/internal/client/warnings.js
  var bold = "font-weight: bold";
  var normal = "font-weight: normal";
  function await_reactivity_loss(name) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${name}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/await_reactivity_loss`);
    }
  }
  function await_waterfall(name, location) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/await_waterfall`);
    }
  }
  function derived_inert() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/derived_inert`);
    }
  }
  function hydration_attribute_changed(attribute, html2, value) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html2}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
    }
  }
  function hydration_html_changed(location) {
    if (dev_fallback_default) {
      console.warn(
        `%c[svelte] hydration_html_changed
%c${location ? `The value of an \`{@html ...}\` block ${location} changed between server and client renders. The client value will be ignored in favour of the server value` : "The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,
        bold,
        normal
      );
    } else {
      console.warn(`https://svelte.dev/e/hydration_html_changed`);
    }
  }
  function hydration_mismatch(location) {
    if (dev_fallback_default) {
      console.warn(
        `%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,
        bold,
        normal
      );
    } else {
      console.warn(`https://svelte.dev/e/hydration_mismatch`);
    }
  }
  function lifecycle_double_unmount() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
    }
  }
  function select_multiple_invalid_value() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
    }
  }
  function state_proxy_equality_mismatch(operator) {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
    }
  }
  function state_proxy_unmount() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/state_proxy_unmount`);
    }
  }
  function svelte_boundary_reset_noop() {
    if (dev_fallback_default) {
      console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
    } else {
      console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
    }
  }

  // node_modules/svelte/src/internal/client/dom/hydration.js
  var hydrating = false;
  function set_hydrating(value) {
    hydrating = value;
  }
  var hydrate_node;
  function set_hydrate_node(node) {
    if (node === null) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    return hydrate_node = node;
  }
  function hydrate_next() {
    return set_hydrate_node(get_next_sibling(hydrate_node));
  }
  function reset(node) {
    if (!hydrating) return;
    if (get_next_sibling(hydrate_node) !== null) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    hydrate_node = node;
  }
  function next(count = 1) {
    if (hydrating) {
      var i = count;
      var node = hydrate_node;
      while (i--) {
        node = /** @type {TemplateNode} */
        get_next_sibling(node);
      }
      hydrate_node = node;
    }
  }
  function skip_nodes(remove = true) {
    var depth = 0;
    var node = hydrate_node;
    while (true) {
      if (node.nodeType === COMMENT_NODE) {
        var data = (
          /** @type {Comment} */
          node.data
        );
        if (data === HYDRATION_END) {
          if (depth === 0) return node;
          depth -= 1;
        } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || // "[1", "[2", etc. for if blocks
        data[0] === "[" && !isNaN(Number(data.slice(1)))) {
          depth += 1;
        }
      }
      var next2 = (
        /** @type {TemplateNode} */
        get_next_sibling(node)
      );
      if (remove) node.remove();
      node = next2;
    }
  }
  function read_hydration_instruction(node) {
    if (!node || node.nodeType !== COMMENT_NODE) {
      hydration_mismatch();
      throw HYDRATION_ERROR;
    }
    return (
      /** @type {Comment} */
      node.data
    );
  }

  // node_modules/svelte/src/internal/client/reactivity/equality.js
  function equals(value) {
    return value === this.v;
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
  }
  function safe_equals(value) {
    return !safe_not_equal(value, this.v);
  }

  // node_modules/svelte/src/internal/flags/index.js
  var async_mode_flag = false;
  var legacy_mode_flag = false;
  var tracing_mode_flag = false;
  function enable_legacy_mode_flag() {
    legacy_mode_flag = true;
  }

  // node_modules/svelte/src/internal/client/dev/tracing.js
  var tracing_expressions = null;
  function tag(source2, label) {
    source2.label = label;
    tag_proxy(source2.v, label);
    return source2;
  }
  function tag_proxy(value, label) {
    value?.[PROXY_PATH_SYMBOL]?.(label);
    return value;
  }

  // node_modules/svelte/src/internal/shared/dev.js
  function get_error(label) {
    const error = new Error();
    const stack2 = get_stack();
    if (stack2.length === 0) {
      return null;
    }
    stack2.unshift("\n");
    define_property(error, "stack", {
      value: stack2.join("\n")
    });
    define_property(error, "name", {
      value: label
    });
    return (
      /** @type {Error & { stack: string }} */
      error
    );
  }
  function get_stack() {
    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    const stack2 = new Error().stack;
    Error.stackTraceLimit = limit;
    if (!stack2) return [];
    const lines = stack2.split("\n");
    const new_lines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const posixified = line.replaceAll("\\", "/");
      if (line.trim() === "Error") {
        continue;
      }
      if (line.includes("validate_each_keys")) {
        return [];
      }
      if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
        continue;
      }
      new_lines.push(line);
    }
    return new_lines;
  }
  function invariant(condition, message) {
    if (!dev_fallback_default) {
      throw new Error("invariant(...) was not guarded by if (DEV)");
    }
    if (!condition) invariant_violation(message);
  }

  // node_modules/svelte/src/internal/client/context.js
  var component_context = null;
  function set_component_context(context) {
    component_context = context;
  }
  var dev_stack = null;
  function set_dev_stack(stack2) {
    dev_stack = stack2;
  }
  var dev_current_component_function = null;
  function set_dev_current_component_function(fn) {
    dev_current_component_function = fn;
  }
  function push(props, runes = false, fn) {
    component_context = {
      p: component_context,
      i: false,
      c: null,
      e: null,
      s: props,
      x: null,
      r: (
        /** @type {Effect} */
        active_effect
      ),
      l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
    };
    if (dev_fallback_default) {
      component_context.function = fn;
      dev_current_component_function = fn;
    }
  }
  function pop(component2) {
    var context = (
      /** @type {ComponentContext} */
      component_context
    );
    var effects = context.e;
    if (effects !== null) {
      context.e = null;
      for (var fn of effects) {
        create_user_effect(fn);
      }
    }
    if (component2 !== void 0) {
      context.x = component2;
    }
    context.i = true;
    component_context = context.p;
    if (dev_fallback_default) {
      dev_current_component_function = component_context?.function ?? null;
    }
    return component2 ?? /** @type {T} */
    {};
  }
  function is_runes() {
    return !legacy_mode_flag || component_context !== null && component_context.l === null;
  }

  // node_modules/svelte/src/internal/client/dom/task.js
  var micro_tasks = [];
  function run_micro_tasks() {
    var tasks = micro_tasks;
    micro_tasks = [];
    run_all(tasks);
  }
  function queue_micro_task(fn) {
    if (micro_tasks.length === 0 && !is_flushing_sync) {
      var tasks = micro_tasks;
      queueMicrotask(() => {
        if (tasks === micro_tasks) run_micro_tasks();
      });
    }
    micro_tasks.push(fn);
  }
  function flush_tasks() {
    while (micro_tasks.length > 0) {
      run_micro_tasks();
    }
  }

  // node_modules/svelte/src/internal/client/error-handling.js
  var adjustments = /* @__PURE__ */ new WeakMap();
  function handle_error(error) {
    var effect2 = active_effect;
    if (effect2 === null) {
      active_reaction.f |= ERROR_VALUE;
      return error;
    }
    if (dev_fallback_default && error instanceof Error && !adjustments.has(error)) {
      adjustments.set(error, get_adjustments(error, effect2));
    }
    if ((effect2.f & REACTION_RAN) === 0 && (effect2.f & EFFECT) === 0) {
      if (dev_fallback_default && !effect2.parent && error instanceof Error) {
        apply_adjustments(error);
      }
      throw error;
    }
    invoke_error_boundary(error, effect2);
  }
  function invoke_error_boundary(error, effect2) {
    while (effect2 !== null) {
      if ((effect2.f & BOUNDARY_EFFECT) !== 0) {
        if ((effect2.f & REACTION_RAN) === 0) {
          throw error;
        }
        try {
          effect2.b.error(error);
          return;
        } catch (e) {
          error = e;
        }
      }
      effect2 = effect2.parent;
    }
    if (dev_fallback_default && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  function get_adjustments(error, effect2) {
    const message_descriptor = get_descriptor(error, "message");
    if (message_descriptor && !message_descriptor.configurable) return;
    var indent = is_firefox ? "  " : "	";
    var component_stack = `
${indent}in ${effect2.fn?.name || "<unknown>"}`;
    var context = effect2.ctx;
    while (context !== null) {
      component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
      context = context.p;
    }
    return {
      message: error.message + `
${component_stack}
`,
      stack: error.stack?.split("\n").filter((line) => !line.includes("svelte/src/internal")).join("\n")
    };
  }
  function apply_adjustments(error) {
    const adjusted = adjustments.get(error);
    if (adjusted) {
      define_property(error, "message", {
        value: adjusted.message
      });
      define_property(error, "stack", {
        value: adjusted.stack
      });
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/status.js
  var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
  function set_signal_status(signal, status) {
    signal.f = signal.f & STATUS_MASK | status;
  }
  function update_derived_status(derived3) {
    if ((derived3.f & CONNECTED) !== 0 || derived3.deps === null) {
      set_signal_status(derived3, CLEAN);
    } else {
      set_signal_status(derived3, MAYBE_DIRTY);
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/utils.js
  function clear_marked(deps) {
    if (deps === null) return;
    for (const dep of deps) {
      if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
        continue;
      }
      dep.f ^= WAS_MARKED;
      clear_marked(
        /** @type {Derived} */
        dep.deps
      );
    }
  }
  function defer_effect(effect2, dirty_effects, maybe_dirty_effects) {
    if ((effect2.f & DIRTY) !== 0) {
      dirty_effects.add(effect2);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
      maybe_dirty_effects.add(effect2);
    }
    clear_marked(effect2.deps);
    set_signal_status(effect2, CLEAN);
  }

  // node_modules/svelte/src/store/utils.js
  function subscribe_to_store(store, run3, invalidate) {
    if (store == null) {
      run3(void 0);
      if (invalidate) invalidate(void 0);
      return noop;
    }
    const unsub = untrack(
      () => store.subscribe(
        run3,
        // @ts-expect-error
        invalidate
      )
    );
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }

  // node_modules/svelte/src/store/shared/index.js
  var subscriber_queue = [];
  function writable(value, start = noop) {
    let stop = null;
    const subscribers = /* @__PURE__ */ new Set();
    function set2(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set2(fn(
        /** @type {T} */
        value
      ));
    }
    function subscribe(run3, invalidate = noop) {
      const subscriber = [run3, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set2, update2) || noop;
      }
      run3(
        /** @type {T} */
        value
      );
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set: set2, update: update2, subscribe };
  }
  function get(store) {
    let value;
    subscribe_to_store(store, (_) => value = _)();
    return value;
  }

  // node_modules/svelte/src/internal/client/reactivity/store.js
  var legacy_is_updating_store = false;
  var is_store_binding = false;
  var IS_UNMOUNTED = /* @__PURE__ */ Symbol("unmounted");
  function store_get(store, store_name, stores) {
    const entry = stores[store_name] ?? (stores[store_name] = {
      store: null,
      source: mutable_source(void 0),
      unsubscribe: noop
    });
    if (dev_fallback_default) {
      entry.source.label = store_name;
    }
    if (entry.store !== store && !(IS_UNMOUNTED in stores)) {
      entry.unsubscribe();
      entry.store = store ?? null;
      if (store == null) {
        entry.source.v = void 0;
        entry.unsubscribe = noop;
      } else {
        var is_synchronous_callback = true;
        entry.unsubscribe = subscribe_to_store(store, (v) => {
          if (is_synchronous_callback) {
            entry.source.v = v;
          } else {
            set(entry.source, v);
          }
        });
        is_synchronous_callback = false;
      }
    }
    if (store && IS_UNMOUNTED in stores) {
      return get(store);
    }
    return get2(entry.source);
  }
  function setup_stores() {
    const stores = {};
    function cleanup() {
      teardown(() => {
        for (var store_name in stores) {
          const ref = stores[store_name];
          ref.unsubscribe();
        }
        define_property(stores, IS_UNMOUNTED, {
          enumerable: false,
          value: true
        });
      });
    }
    return [stores, cleanup];
  }
  function capture_store_binding(fn) {
    var previous_is_store_binding = is_store_binding;
    try {
      is_store_binding = false;
      return [fn(), is_store_binding];
    } finally {
      is_store_binding = previous_is_store_binding;
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/batch.js
  var first_batch = null;
  var last_batch = null;
  var current_batch = null;
  var previous_batch = null;
  var batch_values = null;
  var last_scheduled_effect = null;
  var is_flushing_sync = false;
  var is_processing = false;
  var collected_effects = null;
  var legacy_updates = null;
  var flush_count = 0;
  var source_stacks = /* @__PURE__ */ new Set();
  var uid = 1;
  var _started, _prev, _next, _commit_callbacks, _discard_callbacks, _fork_commit_callbacks, _pending, _blocking_pending, _deferred, _roots, _new_effects, _dirty_effects, _maybe_dirty_effects, _skipped_branches, _unskipped_branches, _decrement_queued, _Batch_instances, is_deferred_fn, process_fn, traverse_fn, find_earlier_batch_fn, merge_fn, defer_effects_fn, commit_fn, link_fn, unlink_fn;
  var _Batch = class _Batch {
    constructor() {
      __privateAdd(this, _Batch_instances);
      __publicField(this, "id", uid++);
      /** True as soon as `#process` was called */
      __privateAdd(this, _started, false);
      __publicField(this, "linked", true);
      /** @type {Batch | null} */
      __privateAdd(this, _prev, null);
      /** @type {Batch | null} */
      __privateAdd(this, _next, null);
      /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
      __publicField(this, "async_deriveds", /* @__PURE__ */ new Map());
      /**
       * The current values of any signals that are updated in this batch.
       * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
       * They keys of this map are identical to `this.#previous`
       * @type {Map<Value, [any, boolean]>}
       */
      __publicField(this, "current", /* @__PURE__ */ new Map());
      /**
       * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
       * They keys of this map are identical to `this.#current`
       * @type {Map<Value, any>}
       */
      __publicField(this, "previous", /* @__PURE__ */ new Map());
      /**
       * Async effects which this batch doesn't take into account anymore when calculating blockers,
       * as it has a value for it already.
       * @type {Set<Effect>}
       */
      __publicField(this, "unblocked", /* @__PURE__ */ new Set());
      /**
       * When the batch is committed (and the DOM is updated), we need to remove old branches
       * and append new ones by calling the functions added inside (if/each/key/etc) blocks
       * @type {Set<(batch: Batch) => void>}
       */
      __privateAdd(this, _commit_callbacks, /* @__PURE__ */ new Set());
      /**
       * If a fork is discarded, we need to destroy any effects that are no longer needed
       * @type {Set<(batch: Batch) => void>}
       */
      __privateAdd(this, _discard_callbacks, /* @__PURE__ */ new Set());
      /**
       * Callbacks that should run only when a fork is committed.
       * @type {Set<(batch: Batch) => void>}
       */
      __privateAdd(this, _fork_commit_callbacks, /* @__PURE__ */ new Set());
      /**
       * The number of async effects that are currently in flight
       */
      __privateAdd(this, _pending, 0);
      /**
       * Async effects that are currently in flight, _not_ inside a pending boundary
       * @type {Map<Effect, number>}
       */
      __privateAdd(this, _blocking_pending, /* @__PURE__ */ new Map());
      /**
       * A deferred that resolves when the batch is committed, used with `settled()`
       * TODO replace with Promise.withResolvers once supported widely enough
       * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
       */
      __privateAdd(this, _deferred, null);
      /**
       * The root effects that need to be flushed
       * @type {Effect[]}
       */
      __privateAdd(this, _roots, []);
      /**
       * Effects created while this batch was active.
       * @type {Effect[]}
       */
      __privateAdd(this, _new_effects, []);
      /**
       * Deferred effects (which run after async work has completed) that are DIRTY
       * @type {Set<Effect>}
       */
      __privateAdd(this, _dirty_effects, /* @__PURE__ */ new Set());
      /**
       * Deferred effects that are MAYBE_DIRTY
       * @type {Set<Effect>}
       */
      __privateAdd(this, _maybe_dirty_effects, /* @__PURE__ */ new Set());
      /**
       * A map of branches that still exist, but will be destroyed when this batch
       * is committed — we skip over these during `process`.
       * The value contains child effects that were dirty/maybe_dirty before being reset,
       * so they can be rescheduled if the branch survives.
       * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
       */
      __privateAdd(this, _skipped_branches, /* @__PURE__ */ new Map());
      /**
       * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
       * @type {Set<Effect>}
       */
      __privateAdd(this, _unskipped_branches, /* @__PURE__ */ new Set());
      __publicField(this, "is_fork", false);
      __privateAdd(this, _decrement_queued, false);
    }
    /**
     * Add an effect to the #skipped_branches map and reset its children
     * @param {Effect} effect
     */
    skip_effect(effect2) {
      if (!__privateGet(this, _skipped_branches).has(effect2)) {
        __privateGet(this, _skipped_branches).set(effect2, { d: [], m: [] });
      }
      __privateGet(this, _unskipped_branches).delete(effect2);
    }
    /**
     * Remove an effect from the #skipped_branches map and reschedule
     * any tracked dirty/maybe_dirty child effects
     * @param {Effect} effect
     * @param {(e: Effect) => void} callback
     */
    unskip_effect(effect2, callback = (e) => this.schedule(e)) {
      var tracked = __privateGet(this, _skipped_branches).get(effect2);
      if (tracked) {
        __privateGet(this, _skipped_branches).delete(effect2);
        for (var e of tracked.d) {
          set_signal_status(e, DIRTY);
          callback(e);
        }
        for (e of tracked.m) {
          set_signal_status(e, MAYBE_DIRTY);
          callback(e);
        }
      }
      __privateGet(this, _unskipped_branches).add(effect2);
    }
    /**
     * Associate a change to a given source with the current
     * batch, noting its previous and current values
     * @param {Value} source
     * @param {any} value
     * @param {boolean} [is_derived]
     */
    capture(source2, value, is_derived = false) {
      if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
        this.previous.set(source2, source2.v);
      }
      if ((source2.f & ERROR_VALUE) === 0) {
        this.current.set(source2, [value, is_derived]);
        batch_values?.set(source2, value);
      }
      if (!this.is_fork) {
        source2.v = value;
      }
    }
    activate() {
      current_batch = this;
    }
    deactivate() {
      current_batch = null;
      batch_values = null;
    }
    flush() {
      try {
        if (dev_fallback_default) {
          source_stacks.clear();
        }
        is_processing = true;
        current_batch = this;
        __privateMethod(this, _Batch_instances, process_fn).call(this);
      } finally {
        flush_count = 0;
        last_scheduled_effect = null;
        collected_effects = null;
        legacy_updates = null;
        is_processing = false;
        current_batch = null;
        batch_values = null;
        old_values.clear();
        if (dev_fallback_default) {
          for (const source2 of source_stacks) {
            source2.updated = null;
          }
        }
      }
    }
    discard() {
      for (const fn of __privateGet(this, _discard_callbacks)) fn(this);
      __privateGet(this, _discard_callbacks).clear();
      __privateGet(this, _fork_commit_callbacks).clear();
      __privateMethod(this, _Batch_instances, unlink_fn).call(this);
    }
    /**
     * @param {Effect} effect
     */
    register_created_effect(effect2) {
      __privateGet(this, _new_effects).push(effect2);
    }
    /**
     * @param {boolean} blocking
     * @param {Effect} effect
     */
    increment(blocking, effect2) {
      __privateSet(this, _pending, __privateGet(this, _pending) + 1);
      if (blocking) {
        let blocking_pending_count = __privateGet(this, _blocking_pending).get(effect2) ?? 0;
        __privateGet(this, _blocking_pending).set(effect2, blocking_pending_count + 1);
      }
    }
    /**
     * @param {boolean} blocking
     * @param {Effect} effect
     */
    decrement(blocking, effect2) {
      __privateSet(this, _pending, __privateGet(this, _pending) - 1);
      if (blocking) {
        let blocking_pending_count = __privateGet(this, _blocking_pending).get(effect2) ?? 0;
        if (blocking_pending_count === 1) {
          __privateGet(this, _blocking_pending).delete(effect2);
        } else {
          __privateGet(this, _blocking_pending).set(effect2, blocking_pending_count - 1);
        }
      }
      if (__privateGet(this, _decrement_queued)) return;
      __privateSet(this, _decrement_queued, true);
      queue_micro_task(() => {
        __privateSet(this, _decrement_queued, false);
        if (this.linked) {
          this.flush();
        }
      });
    }
    /**
     * @param {Set<Effect>} dirty_effects
     * @param {Set<Effect>} maybe_dirty_effects
     */
    transfer_effects(dirty_effects, maybe_dirty_effects) {
      for (const e of dirty_effects) {
        __privateGet(this, _dirty_effects).add(e);
      }
      for (const e of maybe_dirty_effects) {
        __privateGet(this, _maybe_dirty_effects).add(e);
      }
      dirty_effects.clear();
      maybe_dirty_effects.clear();
    }
    /** @param {(batch: Batch) => void} fn */
    oncommit(fn) {
      __privateGet(this, _commit_callbacks).add(fn);
    }
    /** @param {(batch: Batch) => void} fn */
    ondiscard(fn) {
      __privateGet(this, _discard_callbacks).add(fn);
    }
    /** @param {(batch: Batch) => void} fn */
    on_fork_commit(fn) {
      __privateGet(this, _fork_commit_callbacks).add(fn);
    }
    run_fork_commit_callbacks() {
      for (const fn of __privateGet(this, _fork_commit_callbacks)) fn(this);
      __privateGet(this, _fork_commit_callbacks).clear();
    }
    settled() {
      return (__privateGet(this, _deferred) ?? __privateSet(this, _deferred, deferred())).promise;
    }
    static ensure() {
      var _a2;
      if (current_batch === null) {
        const batch = current_batch = new _Batch();
        __privateMethod(_a2 = batch, _Batch_instances, link_fn).call(_a2);
        if (!is_processing && !is_flushing_sync) {
          queue_micro_task(() => {
            if (!__privateGet(batch, _started)) {
              batch.flush();
            }
          });
        }
      }
      return current_batch;
    }
    apply() {
      if (!async_mode_flag || !this.is_fork && __privateGet(this, _prev) === null && __privateGet(this, _next) === null) {
        batch_values = null;
        return;
      }
      batch_values = /* @__PURE__ */ new Map();
      for (const [source2, [value]] of this.current) {
        batch_values.set(source2, value);
      }
      for (let batch = first_batch; batch !== null; batch = __privateGet(batch, _next)) {
        if (batch === this || batch.is_fork) continue;
        var intersects = false;
        if (batch.id < this.id) {
          for (const [source2, [, is_derived]] of batch.current) {
            if (is_derived) continue;
            if (this.current.has(source2)) {
              intersects = true;
              break;
            }
          }
        }
        if (!intersects) {
          for (const [source2, previous] of batch.previous) {
            if (!batch_values.has(source2)) {
              batch_values.set(source2, previous);
            }
          }
        }
      }
    }
    /**
     *
     * @param {Effect} effect
     */
    schedule(effect2) {
      last_scheduled_effect = effect2;
      if (effect2.b?.is_pending && (effect2.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect2.f & REACTION_RAN) === 0) {
        effect2.b.defer_effect(effect2);
        return;
      }
      var e = effect2;
      while (e.parent !== null) {
        e = e.parent;
        var flags2 = e.f;
        if (collected_effects !== null && e === active_effect) {
          if (async_mode_flag) return;
          if ((active_reaction === null || (active_reaction.f & DERIVED) === 0) && !legacy_is_updating_store) {
            return;
          }
        }
        if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
          if ((flags2 & CLEAN) === 0) {
            return;
          }
          e.f ^= CLEAN;
        }
      }
      __privateGet(this, _roots).push(e);
    }
  };
  _started = new WeakMap();
  _prev = new WeakMap();
  _next = new WeakMap();
  _commit_callbacks = new WeakMap();
  _discard_callbacks = new WeakMap();
  _fork_commit_callbacks = new WeakMap();
  _pending = new WeakMap();
  _blocking_pending = new WeakMap();
  _deferred = new WeakMap();
  _roots = new WeakMap();
  _new_effects = new WeakMap();
  _dirty_effects = new WeakMap();
  _maybe_dirty_effects = new WeakMap();
  _skipped_branches = new WeakMap();
  _unskipped_branches = new WeakMap();
  _decrement_queued = new WeakMap();
  _Batch_instances = new WeakSet();
  is_deferred_fn = function() {
    if (this.is_fork) return true;
    for (const effect2 of __privateGet(this, _blocking_pending).keys()) {
      var e = effect2;
      var skipped = false;
      while (e.parent !== null) {
        if (__privateGet(this, _skipped_branches).has(e)) {
          skipped = true;
          break;
        }
        e = e.parent;
      }
      if (!skipped) {
        return true;
      }
    }
    return false;
  };
  process_fn = function() {
    var _a2, _b, _c;
    __privateSet(this, _started, true);
    if (flush_count++ > 1e3) {
      __privateMethod(this, _Batch_instances, unlink_fn).call(this);
      infinite_loop_guard();
    }
    if (dev_fallback_default) {
      for (const value of this.current.keys()) {
        source_stacks.add(value);
      }
    }
    if (!__privateMethod(this, _Batch_instances, is_deferred_fn).call(this)) {
      for (const e of __privateGet(this, _dirty_effects)) {
        __privateGet(this, _maybe_dirty_effects).delete(e);
        set_signal_status(e, DIRTY);
        this.schedule(e);
      }
      for (const e of __privateGet(this, _maybe_dirty_effects)) {
        set_signal_status(e, MAYBE_DIRTY);
        this.schedule(e);
      }
    }
    const roots = __privateGet(this, _roots);
    __privateSet(this, _roots, []);
    this.apply();
    var effects = collected_effects = [];
    var render_effects = [];
    var updates = legacy_updates = [];
    for (const root14 of roots) {
      try {
        __privateMethod(this, _Batch_instances, traverse_fn).call(this, root14, effects, render_effects);
      } catch (e) {
        reset_all(root14);
        throw e;
      }
    }
    current_batch = null;
    if (updates.length > 0) {
      var batch = _Batch.ensure();
      for (const e of updates) {
        batch.schedule(e);
      }
    }
    collected_effects = null;
    legacy_updates = null;
    if (__privateMethod(this, _Batch_instances, is_deferred_fn).call(this)) {
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, render_effects);
      __privateMethod(this, _Batch_instances, defer_effects_fn).call(this, effects);
      for (const [e, t] of __privateGet(this, _skipped_branches)) {
        reset_branch(e, t);
      }
      if (updates.length > 0) {
        /** @type {unknown} */
        __privateMethod(_a2 = current_batch, _Batch_instances, process_fn).call(_a2);
      }
      return;
    }
    const earlier_batch = __privateMethod(this, _Batch_instances, find_earlier_batch_fn).call(this);
    if (earlier_batch) {
      __privateMethod(_b = earlier_batch, _Batch_instances, merge_fn).call(_b, this);
      return;
    }
    __privateGet(this, _dirty_effects).clear();
    __privateGet(this, _maybe_dirty_effects).clear();
    for (const fn of __privateGet(this, _commit_callbacks)) fn(this);
    __privateGet(this, _commit_callbacks).clear();
    previous_batch = this;
    flush_queued_effects(render_effects);
    flush_queued_effects(effects);
    previous_batch = null;
    __privateGet(this, _deferred)?.resolve();
    var next_batch = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      current_batch
    );
    if (this.linked && __privateGet(this, _pending) === 0) {
      __privateMethod(this, _Batch_instances, unlink_fn).call(this);
    }
    if (async_mode_flag && !this.linked) {
      __privateMethod(this, _Batch_instances, commit_fn).call(this);
      current_batch = next_batch;
    }
    if (__privateGet(this, _roots).length > 0) {
      if (next_batch === null) {
        next_batch = this;
        __privateMethod(this, _Batch_instances, link_fn).call(this);
      }
      const batch2 = next_batch;
      __privateGet(batch2, _roots).push(...__privateGet(this, _roots).filter((r) => !__privateGet(batch2, _roots).includes(r)));
    }
    if (next_batch !== null) {
      __privateMethod(_c = next_batch, _Batch_instances, process_fn).call(_c);
    }
  };
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   */
  traverse_fn = function(root14, effects, render_effects) {
    root14.f ^= CLEAN;
    var effect2 = root14.first;
    while (effect2 !== null) {
      var flags2 = effect2.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & INERT) !== 0 || __privateGet(this, _skipped_branches).has(effect2);
      if (!skip && effect2.fn !== null) {
        if (is_branch) {
          effect2.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect2);
        } else if (async_mode_flag && (flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
          render_effects.push(effect2);
        } else if (is_dirty(effect2)) {
          if ((flags2 & BLOCK_EFFECT) !== 0) __privateGet(this, _maybe_dirty_effects).add(effect2);
          update_effect(effect2);
        }
        var child2 = effect2.first;
        if (child2 !== null) {
          effect2 = child2;
          continue;
        }
      }
      while (effect2 !== null) {
        var next2 = effect2.next;
        if (next2 !== null) {
          effect2 = next2;
          break;
        }
        effect2 = effect2.parent;
      }
    }
  };
  find_earlier_batch_fn = function() {
    var batch = __privateGet(this, _prev);
    while (batch !== null) {
      if (!batch.is_fork) {
        for (const [value, [, is_derived]] of this.current) {
          if (batch.current.has(value) && !is_derived) {
            return batch;
          }
        }
      }
      batch = __privateGet(batch, _prev);
    }
    return null;
  };
  /**
   * @param {Batch} batch
   */
  merge_fn = function(batch) {
    var _a2;
    for (const [source2, value] of batch.current) {
      if (!this.previous.has(source2) && batch.previous.has(source2)) {
        this.previous.set(source2, batch.previous.get(source2));
      }
      this.current.set(source2, value);
    }
    for (const [effect2, deferred2] of batch.async_deriveds) {
      const d = this.async_deriveds.get(effect2);
      if (d) deferred2.promise.then(d.resolve);
    }
    const mark = (value) => {
      var reactions = value.reactions;
      if (reactions === null) return;
      for (const reaction of reactions) {
        var flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark(
            /** @type {Derived} */
            reaction
          );
        } else {
          var effect2 = (
            /** @type {Effect} */
            reaction
          );
          if (flags2 & (ASYNC | BLOCK_EFFECT) && !this.async_deriveds.has(effect2)) {
            __privateGet(this, _maybe_dirty_effects).delete(effect2);
            set_signal_status(effect2, DIRTY);
            this.schedule(effect2);
          }
        }
      }
    };
    for (const source2 of this.current.keys()) {
      mark(source2);
    }
    this.oncommit(() => batch.discard());
    __privateMethod(_a2 = batch, _Batch_instances, unlink_fn).call(_a2);
    current_batch = this;
    __privateMethod(this, _Batch_instances, process_fn).call(this);
  };
  /**
   * @param {Effect[]} effects
   */
  defer_effects_fn = function(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      defer_effect(effects[i], __privateGet(this, _dirty_effects), __privateGet(this, _maybe_dirty_effects));
    }
  };
  commit_fn = function() {
    var _a2;
    __privateMethod(this, _Batch_instances, unlink_fn).call(this);
    for (let batch = first_batch; batch !== null; batch = __privateGet(batch, _next)) {
      var is_earlier = batch.id < this.id;
      var sources = [];
      for (const [source3, [value, is_derived]] of this.current) {
        if (batch.current.has(source3)) {
          var batch_value = (
            /** @type {[any, boolean]} */
            batch.current.get(source3)[0]
          );
          if (is_earlier && value !== batch_value) {
            batch.current.set(source3, [value, is_derived]);
          } else {
            continue;
          }
        }
        sources.push(source3);
      }
      if (is_earlier) {
        for (const [effect2, deferred2] of this.async_deriveds) {
          const d = batch.async_deriveds.get(effect2);
          if (d) deferred2.promise.then(d.resolve);
        }
      }
      if (!__privateGet(batch, _started)) continue;
      var others = [...batch.current.keys()].filter((s) => !this.current.has(s));
      if (others.length === 0) {
        if (is_earlier) {
          batch.discard();
        }
      } else if (sources.length > 0) {
        if (dev_fallback_default && !__privateGet(batch, _decrement_queued)) {
          invariant(__privateGet(batch, _roots).length === 0, "Batch has scheduled roots");
        }
        if (is_earlier) {
          for (const unskipped of __privateGet(this, _unskipped_branches)) {
            batch.unskip_effect(unskipped, (e) => {
              var _a3;
              if ((e.f & (BLOCK_EFFECT | ASYNC)) !== 0) {
                batch.schedule(e);
              } else {
                __privateMethod(_a3 = batch, _Batch_instances, defer_effects_fn).call(_a3, [e]);
              }
            });
          }
        }
        batch.activate();
        var marked = /* @__PURE__ */ new Set();
        var checked = /* @__PURE__ */ new Map();
        for (var source2 of sources) {
          mark_effects(source2, others, marked, checked);
        }
        checked = /* @__PURE__ */ new Map();
        var current_unequal = [...batch.current.keys()].filter(
          (c) => this.current.has(c) ? (
            /** @type {[any, boolean]} */
            this.current.get(c)[0] !== c.v
          ) : true
        );
        if (current_unequal.length > 0) {
          for (const effect2 of __privateGet(this, _new_effects)) {
            if ((effect2.f & (DESTROYED | INERT | EAGER_EFFECT)) === 0 && depends_on(effect2, current_unequal, checked)) {
              if ((effect2.f & (ASYNC | BLOCK_EFFECT)) !== 0) {
                set_signal_status(effect2, DIRTY);
                batch.schedule(effect2);
              } else {
                __privateGet(batch, _dirty_effects).add(effect2);
              }
            }
          }
        }
        if (__privateGet(batch, _roots).length > 0 && !__privateGet(batch, _decrement_queued)) {
          batch.apply();
          for (var root14 of __privateGet(batch, _roots)) {
            __privateMethod(_a2 = batch, _Batch_instances, traverse_fn).call(_a2, root14, [], []);
          }
          __privateSet(batch, _roots, []);
        }
        batch.deactivate();
      }
    }
  };
  link_fn = function() {
    if (last_batch === null) {
      first_batch = last_batch = this;
    } else {
      __privateSet(last_batch, _next, this);
      __privateSet(this, _prev, last_batch);
    }
    last_batch = this;
  };
  unlink_fn = function() {
    var prev = __privateGet(this, _prev);
    var next2 = __privateGet(this, _next);
    if (prev === null) {
      first_batch = next2;
    } else {
      __privateSet(prev, _next, next2);
    }
    if (next2 === null) {
      last_batch = prev;
    } else {
      __privateSet(next2, _prev, prev);
    }
    this.linked = false;
  };
  var Batch = _Batch;
  function flushSync(fn) {
    var was_flushing_sync = is_flushing_sync;
    is_flushing_sync = true;
    try {
      var result;
      if (fn) {
        if (current_batch !== null && !current_batch.is_fork) {
          current_batch.flush();
        }
        result = fn();
      }
      while (true) {
        flush_tasks();
        if (current_batch === null) {
          return (
            /** @type {T} */
            result
          );
        }
        current_batch.flush();
      }
    } finally {
      is_flushing_sync = was_flushing_sync;
    }
  }
  function infinite_loop_guard() {
    if (dev_fallback_default) {
      var updates = /* @__PURE__ */ new Map();
      for (
        const source2 of
        /** @type {Batch} */
        current_batch.current.keys()
      ) {
        for (const [stack2, update2] of source2.updated ?? []) {
          var entry = updates.get(stack2);
          if (!entry) {
            entry = { error: update2.error, count: 0 };
            updates.set(stack2, entry);
          }
          entry.count += update2.count;
        }
      }
      for (const update2 of updates.values()) {
        if (update2.error) {
          console.error(update2.error);
        }
      }
    }
    try {
      effect_update_depth_exceeded();
    } catch (error) {
      if (dev_fallback_default) {
        define_property(error, "stack", { value: "" });
      }
      invoke_error_boundary(error, last_scheduled_effect);
    }
  }
  var eager_block_effects = null;
  function flush_queued_effects(effects) {
    var length = effects.length;
    if (length === 0) return;
    var i = 0;
    while (i < length) {
      var effect2 = effects[i++];
      if ((effect2.f & (DESTROYED | INERT)) === 0 && is_dirty(effect2)) {
        eager_block_effects = /* @__PURE__ */ new Set();
        update_effect(effect2);
        if (effect2.deps === null && effect2.first === null && effect2.nodes === null && effect2.teardown === null && effect2.ac === null) {
          unlink_effect(effect2);
        }
        if (eager_block_effects?.size > 0) {
          old_values.clear();
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0) continue;
              update_effect(e2);
            }
          }
          eager_block_effects.clear();
        }
      }
    }
    eager_block_effects = null;
  }
  function mark_effects(value, sources, marked, checked) {
    if (marked.has(value)) return;
    marked.add(value);
    if (value.reactions !== null) {
      for (const reaction of value.reactions) {
        const flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark_effects(
            /** @type {Derived} */
            reaction,
            sources,
            marked,
            checked
          );
        } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
          set_signal_status(reaction, DIRTY);
          schedule_effect(
            /** @type {Effect} */
            reaction
          );
        }
      }
    }
  }
  function depends_on(reaction, sources, checked) {
    const depends = checked.get(reaction);
    if (depends !== void 0) return depends;
    if (reaction.deps !== null) {
      for (const dep of reaction.deps) {
        if (includes.call(sources, dep)) {
          return true;
        }
        if ((dep.f & DERIVED) !== 0 && depends_on(
          /** @type {Derived} */
          dep,
          sources,
          checked
        )) {
          checked.set(
            /** @type {Derived} */
            dep,
            true
          );
          return true;
        }
      }
    }
    checked.set(reaction, false);
    return false;
  }
  function schedule_effect(effect2) {
    current_batch.schedule(effect2);
  }
  function reset_branch(effect2, tracked) {
    if ((effect2.f & BRANCH_EFFECT) !== 0 && (effect2.f & CLEAN) !== 0) {
      return;
    }
    if ((effect2.f & DIRTY) !== 0) {
      tracked.d.push(effect2);
    } else if ((effect2.f & MAYBE_DIRTY) !== 0) {
      tracked.m.push(effect2);
    }
    set_signal_status(effect2, CLEAN);
    var e = effect2.first;
    while (e !== null) {
      reset_branch(e, tracked);
      e = e.next;
    }
  }
  function reset_all(effect2) {
    set_signal_status(effect2, CLEAN);
    var e = effect2.first;
    while (e !== null) {
      reset_all(e);
      e = e.next;
    }
  }

  // node_modules/svelte/src/reactivity/create-subscriber.js
  function createSubscriber(start) {
    let subscribers = 0;
    let version = source(0);
    let stop;
    if (dev_fallback_default) {
      tag(version, "createSubscriber version");
    }
    return () => {
      if (effect_tracking()) {
        get2(version);
        render_effect(() => {
          if (subscribers === 0) {
            stop = untrack(() => start(() => increment(version)));
          }
          subscribers += 1;
          return () => {
            queue_micro_task(() => {
              subscribers -= 1;
              if (subscribers === 0) {
                stop?.();
                stop = void 0;
                increment(version);
              }
            });
          };
        });
      }
    };
  }

  // node_modules/svelte/src/internal/client/dom/blocks/boundary.js
  var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
  function boundary(node, props, children, transform_error) {
    new Boundary(node, props, children, transform_error);
  }
  var _anchor, _hydrate_open, _props, _children, _effect, _main_effect, _pending_effect, _failed_effect, _offscreen_fragment, _local_pending_count, _pending_count, _pending_count_update_queued, _dirty_effects2, _maybe_dirty_effects2, _effect_pending, _effect_pending_subscriber, _Boundary_instances, hydrate_resolved_content_fn, hydrate_failed_content_fn, hydrate_pending_content_fn, render_fn, resolve_fn, run_fn, update_pending_count_fn, handle_error_fn;
  var Boundary = class {
    /**
     * @param {TemplateNode} node
     * @param {BoundaryProps} props
     * @param {((anchor: Node) => void)} children
     * @param {((error: unknown) => unknown) | undefined} [transform_error]
     */
    constructor(node, props, children, transform_error) {
      __privateAdd(this, _Boundary_instances);
      /** @type {Boundary | null} */
      __publicField(this, "parent");
      __publicField(this, "is_pending", false);
      /**
       * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
       * Inherited from parent boundary, or defaults to identity.
       * @type {(error: unknown) => unknown}
       */
      __publicField(this, "transform_error");
      /** @type {TemplateNode} */
      __privateAdd(this, _anchor);
      /** @type {TemplateNode | null} */
      __privateAdd(this, _hydrate_open, hydrating ? hydrate_node : null);
      /** @type {BoundaryProps} */
      __privateAdd(this, _props);
      /** @type {((anchor: Node) => void)} */
      __privateAdd(this, _children);
      /** @type {Effect} */
      __privateAdd(this, _effect);
      /** @type {Effect | null} */
      __privateAdd(this, _main_effect, null);
      /** @type {Effect | null} */
      __privateAdd(this, _pending_effect, null);
      /** @type {Effect | null} */
      __privateAdd(this, _failed_effect, null);
      /** @type {DocumentFragment | null} */
      __privateAdd(this, _offscreen_fragment, null);
      __privateAdd(this, _local_pending_count, 0);
      __privateAdd(this, _pending_count, 0);
      __privateAdd(this, _pending_count_update_queued, false);
      /** @type {Set<Effect>} */
      __privateAdd(this, _dirty_effects2, /* @__PURE__ */ new Set());
      /** @type {Set<Effect>} */
      __privateAdd(this, _maybe_dirty_effects2, /* @__PURE__ */ new Set());
      /**
       * A source containing the number of pending async deriveds/expressions.
       * Only created if `$effect.pending()` is used inside the boundary,
       * otherwise updating the source results in needless `Batch.ensure()`
       * calls followed by no-op flushes
       * @type {Source<number> | null}
       */
      __privateAdd(this, _effect_pending, null);
      __privateAdd(this, _effect_pending_subscriber, createSubscriber(() => {
        __privateSet(this, _effect_pending, source(__privateGet(this, _local_pending_count)));
        if (dev_fallback_default) {
          tag(__privateGet(this, _effect_pending), "$effect.pending()");
        }
        return () => {
          __privateSet(this, _effect_pending, null);
        };
      }));
      __privateSet(this, _anchor, node);
      __privateSet(this, _props, props);
      __privateSet(this, _children, (anchor) => {
        var effect2 = (
          /** @type {Effect} */
          active_effect
        );
        effect2.b = this;
        effect2.f |= BOUNDARY_EFFECT;
        children(anchor);
      });
      this.parent = /** @type {Effect} */
      active_effect.b;
      this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
      __privateSet(this, _effect, block(() => {
        if (hydrating) {
          const comment2 = (
            /** @type {Comment} */
            __privateGet(this, _hydrate_open)
          );
          hydrate_next();
          const server_rendered_pending = comment2.data === HYDRATION_START_ELSE;
          const server_rendered_failed = comment2.data.startsWith(HYDRATION_START_FAILED);
          if (server_rendered_failed) {
            const serialized_error = JSON.parse(comment2.data.slice(HYDRATION_START_FAILED.length));
            __privateMethod(this, _Boundary_instances, hydrate_failed_content_fn).call(this, serialized_error);
          } else if (server_rendered_pending) {
            __privateMethod(this, _Boundary_instances, hydrate_pending_content_fn).call(this);
          } else {
            __privateMethod(this, _Boundary_instances, hydrate_resolved_content_fn).call(this);
          }
        } else {
          __privateMethod(this, _Boundary_instances, render_fn).call(this);
        }
      }, flags));
      if (hydrating) {
        __privateSet(this, _anchor, hydrate_node);
      }
    }
    /**
     * Defer an effect inside a pending boundary until the boundary resolves
     * @param {Effect} effect
     */
    defer_effect(effect2) {
      defer_effect(effect2, __privateGet(this, _dirty_effects2), __privateGet(this, _maybe_dirty_effects2));
    }
    /**
     * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
     * @returns {boolean}
     */
    is_rendered() {
      return !this.is_pending && (!this.parent || this.parent.is_rendered());
    }
    has_pending_snippet() {
      return !!__privateGet(this, _props).pending;
    }
    /**
     * Update the source that powers `$effect.pending()` inside this boundary,
     * and controls when the current `pending` snippet (if any) is removed.
     * Do not call from inside the class
     * @param {1 | -1} d
     * @param {Batch} batch
     */
    update_pending_count(d, batch) {
      __privateMethod(this, _Boundary_instances, update_pending_count_fn).call(this, d, batch);
      __privateSet(this, _local_pending_count, __privateGet(this, _local_pending_count) + d);
      if (!__privateGet(this, _effect_pending) || __privateGet(this, _pending_count_update_queued)) return;
      __privateSet(this, _pending_count_update_queued, true);
      queue_micro_task(() => {
        __privateSet(this, _pending_count_update_queued, false);
        if (__privateGet(this, _effect_pending)) {
          internal_set(__privateGet(this, _effect_pending), __privateGet(this, _local_pending_count));
        }
      });
    }
    get_effect_pending() {
      __privateGet(this, _effect_pending_subscriber).call(this);
      return get2(
        /** @type {Source<number>} */
        __privateGet(this, _effect_pending)
      );
    }
    /** @param {unknown} error */
    error(error) {
      if (!__privateGet(this, _props).onerror && !__privateGet(this, _props).failed) {
        throw error;
      }
      if (current_batch?.is_fork) {
        if (__privateGet(this, _main_effect)) current_batch.skip_effect(__privateGet(this, _main_effect));
        if (__privateGet(this, _pending_effect)) current_batch.skip_effect(__privateGet(this, _pending_effect));
        if (__privateGet(this, _failed_effect)) current_batch.skip_effect(__privateGet(this, _failed_effect));
        current_batch.on_fork_commit(() => {
          __privateMethod(this, _Boundary_instances, handle_error_fn).call(this, error);
        });
      } else {
        __privateMethod(this, _Boundary_instances, handle_error_fn).call(this, error);
      }
    }
  };
  _anchor = new WeakMap();
  _hydrate_open = new WeakMap();
  _props = new WeakMap();
  _children = new WeakMap();
  _effect = new WeakMap();
  _main_effect = new WeakMap();
  _pending_effect = new WeakMap();
  _failed_effect = new WeakMap();
  _offscreen_fragment = new WeakMap();
  _local_pending_count = new WeakMap();
  _pending_count = new WeakMap();
  _pending_count_update_queued = new WeakMap();
  _dirty_effects2 = new WeakMap();
  _maybe_dirty_effects2 = new WeakMap();
  _effect_pending = new WeakMap();
  _effect_pending_subscriber = new WeakMap();
  _Boundary_instances = new WeakSet();
  hydrate_resolved_content_fn = function() {
    try {
      __privateSet(this, _main_effect, branch(() => __privateGet(this, _children).call(this, __privateGet(this, _anchor))));
    } catch (error) {
      this.error(error);
    }
  };
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  hydrate_failed_content_fn = function(error) {
    const failed = __privateGet(this, _props).failed;
    if (!failed) return;
    __privateSet(this, _failed_effect, branch(() => {
      failed(
        __privateGet(this, _anchor),
        () => error,
        () => () => {
        }
      );
    }));
  };
  hydrate_pending_content_fn = function() {
    const pending2 = __privateGet(this, _props).pending;
    if (!pending2) return;
    this.is_pending = true;
    __privateSet(this, _pending_effect, branch(() => pending2(__privateGet(this, _anchor))));
    queue_micro_task(() => {
      var fragment = __privateSet(this, _offscreen_fragment, document.createDocumentFragment());
      var anchor = create_text();
      fragment.append(anchor);
      __privateSet(this, _main_effect, __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
        return branch(() => __privateGet(this, _children).call(this, anchor));
      }));
      if (__privateGet(this, _pending_count) === 0) {
        __privateGet(this, _anchor).before(fragment);
        __privateSet(this, _offscreen_fragment, null);
        pause_effect(
          /** @type {Effect} */
          __privateGet(this, _pending_effect),
          () => {
            __privateSet(this, _pending_effect, null);
          }
        );
        __privateMethod(this, _Boundary_instances, resolve_fn).call(
          this,
          /** @type {Batch} */
          current_batch
        );
      }
    });
  };
  render_fn = function() {
    try {
      this.is_pending = this.has_pending_snippet();
      __privateSet(this, _pending_count, 0);
      __privateSet(this, _local_pending_count, 0);
      __privateSet(this, _main_effect, branch(() => {
        __privateGet(this, _children).call(this, __privateGet(this, _anchor));
      }));
      if (__privateGet(this, _pending_count) > 0) {
        var fragment = __privateSet(this, _offscreen_fragment, document.createDocumentFragment());
        move_effect(__privateGet(this, _main_effect), fragment);
        const pending2 = (
          /** @type {(anchor: Node) => void} */
          __privateGet(this, _props).pending
        );
        __privateSet(this, _pending_effect, branch(() => pending2(__privateGet(this, _anchor))));
      } else {
        __privateMethod(this, _Boundary_instances, resolve_fn).call(
          this,
          /** @type {Batch} */
          current_batch
        );
      }
    } catch (error) {
      this.error(error);
    }
  };
  /**
   * @param {Batch} batch
   */
  resolve_fn = function(batch) {
    this.is_pending = false;
    batch.transfer_effects(__privateGet(this, _dirty_effects2), __privateGet(this, _maybe_dirty_effects2));
  };
  /**
   * @template T
   * @param {() => T} fn
   */
  run_fn = function(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(__privateGet(this, _effect));
    set_active_reaction(__privateGet(this, _effect));
    set_component_context(__privateGet(this, _effect).ctx);
    try {
      Batch.ensure();
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  };
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count_fn = function(d, batch) {
    var _a2;
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        __privateMethod(_a2 = this.parent, _Boundary_instances, update_pending_count_fn).call(_a2, d, batch);
      }
      return;
    }
    __privateSet(this, _pending_count, __privateGet(this, _pending_count) + d);
    if (__privateGet(this, _pending_count) === 0) {
      __privateMethod(this, _Boundary_instances, resolve_fn).call(this, batch);
      if (__privateGet(this, _pending_effect)) {
        pause_effect(__privateGet(this, _pending_effect), () => {
          __privateSet(this, _pending_effect, null);
        });
      }
      if (__privateGet(this, _offscreen_fragment)) {
        __privateGet(this, _anchor).before(__privateGet(this, _offscreen_fragment));
        __privateSet(this, _offscreen_fragment, null);
      }
    }
  };
  /**
   * @param {unknown} error
   */
  handle_error_fn = function(error) {
    if (__privateGet(this, _main_effect)) {
      destroy_effect(__privateGet(this, _main_effect));
      __privateSet(this, _main_effect, null);
    }
    if (__privateGet(this, _pending_effect)) {
      destroy_effect(__privateGet(this, _pending_effect));
      __privateSet(this, _pending_effect, null);
    }
    if (__privateGet(this, _failed_effect)) {
      destroy_effect(__privateGet(this, _failed_effect));
      __privateSet(this, _failed_effect, null);
    }
    if (hydrating) {
      set_hydrate_node(
        /** @type {TemplateNode} */
        __privateGet(this, _hydrate_open)
      );
      next();
      set_hydrate_node(skip_nodes());
    }
    var onerror = __privateGet(this, _props).onerror;
    let failed = __privateGet(this, _props).failed;
    var did_reset = false;
    var calling_on_error = false;
    const reset2 = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (__privateGet(this, _failed_effect) !== null) {
        pause_effect(__privateGet(this, _failed_effect), () => {
          __privateSet(this, _failed_effect, null);
        });
      }
      __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
        __privateMethod(this, _Boundary_instances, render_fn).call(this);
      });
    };
    const handle_error_result = (transformed_error) => {
      try {
        calling_on_error = true;
        onerror?.(transformed_error, reset2);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
      }
      if (failed) {
        __privateSet(this, _failed_effect, __privateMethod(this, _Boundary_instances, run_fn).call(this, () => {
          try {
            return branch(() => {
              var effect2 = (
                /** @type {Effect} */
                active_effect
              );
              effect2.b = this;
              effect2.f |= BOUNDARY_EFFECT;
              failed(
                __privateGet(this, _anchor),
                () => transformed_error,
                () => reset2
              );
            });
          } catch (error2) {
            invoke_error_boundary(
              error2,
              /** @type {Effect} */
              __privateGet(this, _effect).parent
            );
            return null;
          }
        }));
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, __privateGet(this, _effect) && __privateGet(this, _effect).parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof /** @type {any} */
      result.then === "function") {
        result.then(
          handle_error_result,
          /** @param {unknown} e */
          (e) => invoke_error_boundary(e, __privateGet(this, _effect) && __privateGet(this, _effect).parent)
        );
      } else {
        handle_error_result(result);
      }
    });
  };

  // node_modules/svelte/src/internal/client/reactivity/async.js
  function flatten(blockers, sync, async2, fn) {
    const d = is_runes() ? derived : derived_safe_equal;
    var pending2 = blockers.filter((b) => !b.settled);
    if (async2.length === 0 && pending2.length === 0) {
      fn(sync.map(d));
      return;
    }
    var parent = (
      /** @type {Effect} */
      active_effect
    );
    var restore = capture();
    var blocker_promise = pending2.length === 1 ? pending2[0].promise : pending2.length > 1 ? Promise.all(pending2.map((b) => b.promise)) : null;
    function finish(values) {
      if ((parent.f & DESTROYED) !== 0) {
        return;
      }
      restore();
      try {
        fn(values);
      } catch (error) {
        invoke_error_boundary(error, parent);
      }
      unset_context();
    }
    var decrement_pending = increment_pending();
    if (async2.length === 0) {
      blocker_promise.then(() => finish(sync.map(d))).finally(decrement_pending);
      return;
    }
    function run3() {
      Promise.all(async2.map((expression) => async_derived(expression))).then((result) => finish([...sync.map(d), ...result])).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
    }
    if (blocker_promise) {
      blocker_promise.then(() => {
        restore();
        run3();
        unset_context();
      });
    } else {
      run3();
    }
  }
  function capture() {
    var previous_effect = (
      /** @type {Effect} */
      active_effect
    );
    var previous_reaction = active_reaction;
    var previous_component_context = component_context;
    var previous_batch2 = (
      /** @type {Batch} */
      current_batch
    );
    if (dev_fallback_default) {
      var previous_dev_stack = dev_stack;
    }
    return function restore(activate_batch = true) {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_component_context);
      if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
        previous_batch2?.activate();
        previous_batch2?.apply();
      }
      if (dev_fallback_default) {
        set_reactivity_loss_tracker(null);
        set_dev_stack(previous_dev_stack);
      }
    };
  }
  function unset_context(deactivate_batch = true) {
    set_active_effect(null);
    set_active_reaction(null);
    set_component_context(null);
    if (deactivate_batch) current_batch?.deactivate();
    if (dev_fallback_default) {
      set_reactivity_loss_tracker(null);
      set_dev_stack(null);
    }
  }
  function increment_pending() {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    var boundary2 = (
      /** @type {Boundary} */
      effect2.b
    );
    var batch = (
      /** @type {Batch} */
      current_batch
    );
    var blocking = boundary2.is_rendered();
    boundary2.update_pending_count(1, batch);
    batch.increment(blocking, effect2);
    return () => {
      boundary2.update_pending_count(-1, batch);
      batch.decrement(blocking, effect2);
    };
  }

  // node_modules/svelte/src/internal/client/reactivity/deriveds.js
  var reactivity_loss_tracker = null;
  function set_reactivity_loss_tracker(v) {
    reactivity_loss_tracker = v;
  }
  var recent_async_deriveds = /* @__PURE__ */ new Set();
  // @__NO_SIDE_EFFECTS__
  function derived(fn) {
    var flags2 = DERIVED | DIRTY;
    if (active_effect !== null) {
      active_effect.f |= EFFECT_PRESERVED;
    }
    const signal = {
      ctx: component_context,
      deps: null,
      effects: null,
      equals,
      f: flags2,
      fn,
      reactions: null,
      rv: 0,
      v: (
        /** @type {V} */
        UNINITIALIZED
      ),
      wv: 0,
      parent: active_effect,
      ac: null
    };
    if (dev_fallback_default && tracing_mode_flag) {
      signal.created = get_error("created at");
    }
    return signal;
  }
  var OBSOLETE = /* @__PURE__ */ Symbol("obsolete");
  // @__NO_SIDE_EFFECTS__
  function async_derived(fn, label, location) {
    let parent = (
      /** @type {Effect | null} */
      active_effect
    );
    if (parent === null) {
      async_derived_orphan();
    }
    var promise = (
      /** @type {Promise<V>} */
      /** @type {unknown} */
      void 0
    );
    var signal = source(
      /** @type {V} */
      UNINITIALIZED
    );
    if (dev_fallback_default) signal.label = label ?? fn.toString();
    var should_suspend = !active_reaction;
    var deferreds = /* @__PURE__ */ new Set();
    async_effect(() => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      if (dev_fallback_default) {
        reactivity_loss_tracker = { effect: effect2, effect_deps: /* @__PURE__ */ new Set(), warned: false };
      }
      var d = deferred();
      promise = d.promise;
      try {
        Promise.resolve(fn()).then(d.resolve, (e) => {
          if (e !== STALE_REACTION) d.reject(e);
        }).finally(unset_context);
      } catch (error) {
        d.reject(error);
        unset_context();
      }
      if (dev_fallback_default) {
        if (reactivity_loss_tracker) {
          if (effect2.deps !== null) {
            for (let i = 0; i < skipped_deps; i += 1) {
              reactivity_loss_tracker.effect_deps.add(effect2.deps[i]);
            }
          }
          if (new_deps !== null) {
            for (let i = 0; i < new_deps.length; i += 1) {
              reactivity_loss_tracker.effect_deps.add(new_deps[i]);
            }
          }
        }
        reactivity_loss_tracker = null;
      }
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      if (should_suspend) {
        if ((effect2.f & REACTION_RAN) !== 0) {
          var decrement_pending = increment_pending();
        }
        if (
          /** @type {Boundary} */
          parent.b.is_rendered()
        ) {
          batch.async_deriveds.get(effect2)?.reject(OBSOLETE);
        } else {
          for (const d2 of deferreds.values()) {
            d2.reject(OBSOLETE);
          }
        }
        deferreds.add(d);
        batch.async_deriveds.set(effect2, d);
      }
      const handler = (value, error = void 0) => {
        if (dev_fallback_default) {
          reactivity_loss_tracker = null;
        }
        decrement_pending?.();
        deferreds.delete(d);
        if (error === OBSOLETE) return;
        batch.activate();
        if (error) {
          signal.f |= ERROR_VALUE;
          internal_set(signal, error);
        } else {
          if ((signal.f & ERROR_VALUE) !== 0) {
            signal.f ^= ERROR_VALUE;
          }
          internal_set(signal, value);
          if (dev_fallback_default && location !== void 0) {
            recent_async_deriveds.add(signal);
            setTimeout(() => {
              if (recent_async_deriveds.has(signal) && (effect2.f & DESTROYED) === 0) {
                await_waterfall(
                  /** @type {string} */
                  signal.label,
                  location
                );
                recent_async_deriveds.delete(signal);
              }
            });
          }
        }
        batch.deactivate();
      };
      d.promise.then(handler, (e) => handler(null, e || "unknown"));
    });
    teardown(() => {
      for (const d of deferreds) {
        d.reject(OBSOLETE);
      }
    });
    if (dev_fallback_default) {
      signal.f |= ASYNC;
    }
    return new Promise((fulfil) => {
      function next2(p) {
        function go() {
          if (p === promise) {
            fulfil(signal);
          } else {
            next2(promise);
          }
        }
        p.then(go, go);
      }
      next2(promise);
    });
  }
  // @__NO_SIDE_EFFECTS__
  function user_derived(fn) {
    const d = /* @__PURE__ */ derived(fn);
    if (!async_mode_flag) push_reaction_value(d);
    return d;
  }
  // @__NO_SIDE_EFFECTS__
  function derived_safe_equal(fn) {
    const signal = /* @__PURE__ */ derived(fn);
    signal.equals = safe_equals;
    return signal;
  }
  function destroy_derived_effects(derived3) {
    var effects = derived3.effects;
    if (effects !== null) {
      derived3.effects = null;
      for (var i = 0; i < effects.length; i += 1) {
        destroy_effect(
          /** @type {Effect} */
          effects[i]
        );
      }
    }
  }
  var stack = [];
  function execute_derived(derived3) {
    var value;
    var prev_active_effect = active_effect;
    var parent = derived3.parent;
    if (!is_destroying_effect && parent !== null && derived3.v !== UNINITIALIZED && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
    (parent.f & (DESTROYED | INERT)) !== 0) {
      derived_inert();
      return derived3.v;
    }
    set_active_effect(parent);
    if (dev_fallback_default) {
      let prev_eager_effects = eager_effects;
      set_eager_effects(/* @__PURE__ */ new Set());
      try {
        if (includes.call(stack, derived3)) {
          derived_references_self();
        }
        stack.push(derived3);
        derived3.f &= ~WAS_MARKED;
        destroy_derived_effects(derived3);
        value = update_reaction(derived3);
      } finally {
        set_active_effect(prev_active_effect);
        set_eager_effects(prev_eager_effects);
        stack.pop();
      }
    } else {
      try {
        derived3.f &= ~WAS_MARKED;
        destroy_derived_effects(derived3);
        value = update_reaction(derived3);
      } finally {
        set_active_effect(prev_active_effect);
      }
    }
    return value;
  }
  function update_derived(derived3) {
    var value = execute_derived(derived3);
    if (!derived3.equals(value)) {
      derived3.wv = increment_write_version();
      if (!current_batch?.is_fork || derived3.deps === null) {
        if (current_batch !== null) {
          current_batch.capture(derived3, value, true);
          previous_batch?.capture(derived3, value, true);
        } else {
          derived3.v = value;
        }
        if (derived3.deps === null) {
          set_signal_status(derived3, CLEAN);
          return;
        }
      }
    }
    if (is_destroying_effect) {
      return;
    }
    if (batch_values !== null) {
      if (effect_tracking() || current_batch?.is_fork) {
        batch_values.set(derived3, value);
      }
    } else {
      update_derived_status(derived3);
    }
  }
  function freeze_derived_effects(derived3) {
    if (derived3.effects === null) return;
    for (const e of derived3.effects) {
      if (e.teardown || e.ac) {
        e.teardown?.();
        e.ac?.abort(STALE_REACTION);
        if (e.fn !== null) e.teardown = noop;
        e.ac = null;
        remove_reactions(e, 0);
        destroy_effect_children(e);
      }
    }
  }
  function unfreeze_derived_effects(derived3) {
    if (derived3.effects === null) return;
    for (const e of derived3.effects) {
      if (e.teardown && e.fn !== null) {
        update_effect(e);
      }
    }
  }

  // node_modules/svelte/src/internal/client/reactivity/sources.js
  var eager_effects = /* @__PURE__ */ new Set();
  var old_values = /* @__PURE__ */ new Map();
  function set_eager_effects(v) {
    eager_effects = v;
  }
  var eager_effects_deferred = false;
  function set_eager_effects_deferred() {
    eager_effects_deferred = true;
  }
  function source(v, stack2) {
    var signal = {
      f: 0,
      // TODO ideally we could skip this altogether, but it causes type errors
      v,
      reactions: null,
      equals,
      rv: 0,
      wv: 0
    };
    if (dev_fallback_default && tracing_mode_flag) {
      signal.created = stack2 ?? get_error("created at");
      signal.updated = null;
      signal.set_during_effect = false;
      signal.trace = null;
    }
    return signal;
  }
  // @__NO_SIDE_EFFECTS__
  function state(v, stack2) {
    const s = source(v, stack2);
    push_reaction_value(s);
    return s;
  }
  // @__NO_SIDE_EFFECTS__
  function mutable_source(initial_value, immutable = false, trackable = true) {
    var _a2;
    const s = source(initial_value);
    if (!immutable) {
      s.equals = safe_equals;
    }
    if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
      ((_a2 = component_context.l).s ?? (_a2.s = [])).push(s);
    }
    return s;
  }
  function set(source2, value, should_proxy = false) {
    if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
    // to ensure we error if state is set inside an inspect effect
    (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !includes.call(current_sources, source2))) {
      state_unsafe_mutation();
    }
    let new_value = should_proxy ? proxy(value) : value;
    if (dev_fallback_default) {
      tag_proxy(
        new_value,
        /** @type {string} */
        source2.label
      );
    }
    return internal_set(source2, new_value, legacy_updates);
  }
  function internal_set(source2, value, updated_during_traversal = null) {
    if (!source2.equals(value)) {
      old_values.set(source2, is_destroying_effect ? value : source2.v);
      var batch = Batch.ensure();
      batch.capture(source2, value);
      if (dev_fallback_default) {
        if (tracing_mode_flag || active_effect !== null) {
          source2.updated ?? (source2.updated = /* @__PURE__ */ new Map());
          const count = (source2.updated.get("")?.count ?? 0) + 1;
          source2.updated.set("", { error: (
            /** @type {any} */
            null
          ), count });
          if (tracing_mode_flag || count > 5) {
            const error = get_error("updated at");
            if (error !== null) {
              let entry = source2.updated.get(error.stack);
              if (!entry) {
                entry = { error, count: 0 };
                source2.updated.set(error.stack, entry);
              }
              entry.count++;
            }
          }
        }
        if (active_effect !== null) {
          source2.set_during_effect = true;
        }
      }
      if ((source2.f & DERIVED) !== 0) {
        const derived3 = (
          /** @type {Derived} */
          source2
        );
        if ((source2.f & DIRTY) !== 0) {
          execute_derived(derived3);
        }
        if (batch_values === null) {
          update_derived_status(derived3);
        }
      }
      source2.wv = increment_write_version();
      mark_reactions(source2, DIRTY, updated_during_traversal);
      if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
        if (untracked_writes === null) {
          set_untracked_writes([source2]);
        } else {
          untracked_writes.push(source2);
        }
      }
      if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
    return value;
  }
  function flush_eager_effects() {
    eager_effects_deferred = false;
    for (const effect2 of eager_effects) {
      if ((effect2.f & CLEAN) !== 0) {
        set_signal_status(effect2, MAYBE_DIRTY);
      }
      let dirty;
      try {
        dirty = is_dirty(effect2);
      } catch {
        dirty = true;
      }
      if (dirty) {
        update_effect(effect2);
      }
    }
    eager_effects.clear();
  }
  function increment(source2) {
    set(source2, source2.v + 1);
  }
  function mark_reactions(signal, status, updated_during_traversal) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var runes = is_runes();
    var length = reactions.length;
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      if (!runes && reaction === active_effect) continue;
      var not_dirty = (flags2 & DIRTY) === 0;
      if (not_dirty) {
        set_signal_status(reaction, status);
      }
      if ((flags2 & EAGER_EFFECT) !== 0) {
        eager_effects.add(
          /** @type {Effect} */
          reaction
        );
      } else if ((flags2 & DERIVED) !== 0) {
        var derived3 = (
          /** @type {Derived} */
          reaction
        );
        batch_values?.delete(derived3);
        if ((flags2 & WAS_MARKED) === 0) {
          if (flags2 & CONNECTED && (active_effect === null || (active_effect.f & REACTION_IS_UPDATING) === 0)) {
            reaction.f |= WAS_MARKED;
          }
          mark_reactions(derived3, MAYBE_DIRTY, updated_during_traversal);
        }
      } else if (not_dirty) {
        var effect2 = (
          /** @type {Effect} */
          reaction
        );
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          eager_block_effects.add(effect2);
        }
        if (updated_during_traversal !== null) {
          updated_during_traversal.push(effect2);
        } else {
          schedule_effect(effect2);
        }
      }
    }
  }

  // node_modules/svelte/src/internal/client/proxy.js
  var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
  function proxy(value) {
    if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
      return value;
    }
    const prototype = get_prototype_of(value);
    if (prototype !== object_prototype && prototype !== array_prototype) {
      return value;
    }
    var sources = /* @__PURE__ */ new Map();
    var is_proxied_array = is_array(value);
    var version = state(0);
    var stack2 = dev_fallback_default && tracing_mode_flag ? get_error("created at") : null;
    var parent_version = update_version;
    var with_parent = (fn) => {
      if (update_version === parent_version) {
        return fn();
      }
      var reaction = active_reaction;
      var version2 = update_version;
      set_active_reaction(null);
      set_update_version(parent_version);
      var result = fn();
      set_active_reaction(reaction);
      set_update_version(version2);
      return result;
    };
    if (is_proxied_array) {
      sources.set("length", state(
        /** @type {any[]} */
        value.length,
        stack2
      ));
      if (dev_fallback_default) {
        value = /** @type {any} */
        inspectable_array(
          /** @type {any[]} */
          value
        );
      }
    }
    var path = "";
    let updating = false;
    function update_path(new_path) {
      if (updating) return;
      updating = true;
      path = new_path;
      tag(version, `${path} version`);
      for (const [prop2, source2] of sources) {
        tag(source2, get_label(path, prop2));
      }
      updating = false;
    }
    return new Proxy(
      /** @type {any} */
      value,
      {
        defineProperty(_, prop2, descriptor) {
          if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
            state_descriptors_fixed();
          }
          var s = sources.get(prop2);
          if (s === void 0) {
            with_parent(() => {
              var s2 = state(descriptor.value, stack2);
              sources.set(prop2, s2);
              if (dev_fallback_default && typeof prop2 === "string") {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
          } else {
            set(s, descriptor.value, true);
          }
          return true;
        },
        deleteProperty(target2, prop2) {
          var s = sources.get(prop2);
          if (s === void 0) {
            if (prop2 in target2) {
              const s2 = with_parent(() => state(UNINITIALIZED, stack2));
              sources.set(prop2, s2);
              increment(version);
              if (dev_fallback_default) {
                tag(s2, get_label(path, prop2));
              }
            }
          } else {
            set(s, UNINITIALIZED);
            increment(version);
          }
          return true;
        },
        get(target2, prop2, receiver) {
          if (prop2 === STATE_SYMBOL) {
            return value;
          }
          if (dev_fallback_default && prop2 === PROXY_PATH_SYMBOL) {
            return update_path;
          }
          var s = sources.get(prop2);
          var exists = prop2 in target2;
          if (s === void 0 && (!exists || get_descriptor(target2, prop2)?.writable)) {
            s = with_parent(() => {
              var p = proxy(exists ? target2[prop2] : UNINITIALIZED);
              var s2 = state(p, stack2);
              if (dev_fallback_default) {
                tag(s2, get_label(path, prop2));
              }
              return s2;
            });
            sources.set(prop2, s);
          }
          if (s !== void 0) {
            var v = get2(s);
            return v === UNINITIALIZED ? void 0 : v;
          }
          return Reflect.get(target2, prop2, receiver);
        },
        getOwnPropertyDescriptor(target2, prop2) {
          var descriptor = Reflect.getOwnPropertyDescriptor(target2, prop2);
          if (descriptor && "value" in descriptor) {
            var s = sources.get(prop2);
            if (s) descriptor.value = get2(s);
          } else if (descriptor === void 0) {
            var source2 = sources.get(prop2);
            var value2 = source2?.v;
            if (source2 !== void 0 && value2 !== UNINITIALIZED) {
              return {
                enumerable: true,
                configurable: true,
                value: value2,
                writable: true
              };
            }
          }
          return descriptor;
        },
        has(target2, prop2) {
          if (prop2 === STATE_SYMBOL) {
            return true;
          }
          var s = sources.get(prop2);
          var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target2, prop2);
          if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target2, prop2)?.writable)) {
            if (s === void 0) {
              s = with_parent(() => {
                var p = has ? proxy(target2[prop2]) : UNINITIALIZED;
                var s2 = state(p, stack2);
                if (dev_fallback_default) {
                  tag(s2, get_label(path, prop2));
                }
                return s2;
              });
              sources.set(prop2, s);
            }
            var value2 = get2(s);
            if (value2 === UNINITIALIZED) {
              return false;
            }
          }
          return has;
        },
        set(target2, prop2, value2, receiver) {
          var s = sources.get(prop2);
          var has = prop2 in target2;
          if (is_proxied_array && prop2 === "length") {
            for (var i = value2; i < /** @type {Source<number>} */
            s.v; i += 1) {
              var other_s = sources.get(i + "");
              if (other_s !== void 0) {
                set(other_s, UNINITIALIZED);
              } else if (i in target2) {
                other_s = with_parent(() => state(UNINITIALIZED, stack2));
                sources.set(i + "", other_s);
                if (dev_fallback_default) {
                  tag(other_s, get_label(path, i));
                }
              }
            }
          }
          if (s === void 0) {
            if (!has || get_descriptor(target2, prop2)?.writable) {
              s = with_parent(() => state(void 0, stack2));
              if (dev_fallback_default) {
                tag(s, get_label(path, prop2));
              }
              set(s, proxy(value2));
              sources.set(prop2, s);
            }
          } else {
            has = s.v !== UNINITIALIZED;
            var p = with_parent(() => proxy(value2));
            set(s, p);
          }
          var descriptor = Reflect.getOwnPropertyDescriptor(target2, prop2);
          if (descriptor?.set) {
            descriptor.set.call(receiver, value2);
          }
          if (!has) {
            if (is_proxied_array && typeof prop2 === "string") {
              var ls = (
                /** @type {Source<number>} */
                sources.get("length")
              );
              var n = Number(prop2);
              if (Number.isInteger(n) && n >= ls.v) {
                set(ls, n + 1);
              }
            }
            increment(version);
          }
          return true;
        },
        ownKeys(target2) {
          get2(version);
          var own_keys = Reflect.ownKeys(target2).filter((key3) => {
            var source3 = sources.get(key3);
            return source3 === void 0 || source3.v !== UNINITIALIZED;
          });
          for (var [key2, source2] of sources) {
            if (source2.v !== UNINITIALIZED && !(key2 in target2)) {
              own_keys.push(key2);
            }
          }
          return own_keys;
        },
        setPrototypeOf() {
          state_prototype_fixed();
        }
      }
    );
  }
  function get_label(path, prop2) {
    if (typeof prop2 === "symbol") return `${path}[Symbol(${prop2.description ?? ""})]`;
    if (regex_is_valid_identifier.test(prop2)) return `${path}.${prop2}`;
    return /^\d+$/.test(prop2) ? `${path}[${prop2}]` : `${path}['${prop2}']`;
  }
  function get_proxied_value(value) {
    try {
      if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
        return value[STATE_SYMBOL];
      }
    } catch {
    }
    return value;
  }
  function is(a, b) {
    return Object.is(get_proxied_value(a), get_proxied_value(b));
  }
  var ARRAY_MUTATING_METHODS = /* @__PURE__ */ new Set([
    "copyWithin",
    "fill",
    "pop",
    "push",
    "reverse",
    "shift",
    "sort",
    "splice",
    "unshift"
  ]);
  function inspectable_array(array) {
    return new Proxy(array, {
      get(target2, prop2, receiver) {
        var value = Reflect.get(target2, prop2, receiver);
        if (!ARRAY_MUTATING_METHODS.has(
          /** @type {string} */
          prop2
        )) {
          return value;
        }
        return function(...args) {
          set_eager_effects_deferred();
          var result = value.apply(this, args);
          flush_eager_effects();
          return result;
        };
      }
    });
  }

  // node_modules/svelte/src/internal/client/dev/equality.js
  function init_array_prototype_warnings() {
    const array_prototype2 = Array.prototype;
    const cleanup = Array.__svelte_cleanup;
    if (cleanup) {
      cleanup();
    }
    const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
    array_prototype2.indexOf = function(item, from_index) {
      const index2 = indexOf.call(this, item, from_index);
      if (index2 === -1) {
        for (let i = from_index ?? 0; i < this.length; i += 1) {
          if (get_proxied_value(this[i]) === item) {
            state_proxy_equality_mismatch("array.indexOf(...)");
            break;
          }
        }
      }
      return index2;
    };
    array_prototype2.lastIndexOf = function(item, from_index) {
      const index2 = lastIndexOf.call(this, item, from_index ?? this.length - 1);
      if (index2 === -1) {
        for (let i = 0; i <= (from_index ?? this.length - 1); i += 1) {
          if (get_proxied_value(this[i]) === item) {
            state_proxy_equality_mismatch("array.lastIndexOf(...)");
            break;
          }
        }
      }
      return index2;
    };
    array_prototype2.includes = function(item, from_index) {
      const has = includes2.call(this, item, from_index);
      if (!has) {
        for (let i = 0; i < this.length; i += 1) {
          if (get_proxied_value(this[i]) === item) {
            state_proxy_equality_mismatch("array.includes(...)");
            break;
          }
        }
      }
      return has;
    };
    Array.__svelte_cleanup = () => {
      array_prototype2.indexOf = indexOf;
      array_prototype2.lastIndexOf = lastIndexOf;
      array_prototype2.includes = includes2;
    };
  }

  // node_modules/svelte/src/internal/client/dom/operations.js
  var $window;
  var $document;
  var is_firefox;
  var first_child_getter;
  var next_sibling_getter;
  function init_operations() {
    if ($window !== void 0) {
      return;
    }
    $window = window;
    $document = document;
    is_firefox = /Firefox/.test(navigator.userAgent);
    var element_prototype = Element.prototype;
    var node_prototype = Node.prototype;
    var text_prototype = Text.prototype;
    first_child_getter = get_descriptor(node_prototype, "firstChild").get;
    next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
    if (is_extensible(element_prototype)) {
      element_prototype[CLASS_CACHE] = void 0;
      element_prototype[ATTRIBUTES_CACHE] = null;
      element_prototype[STYLE_CACHE] = void 0;
      element_prototype.__e = void 0;
    }
    if (is_extensible(text_prototype)) {
      text_prototype[TEXT_CACHE] = void 0;
    }
    if (dev_fallback_default) {
      element_prototype.__svelte_meta = null;
      init_array_prototype_warnings();
    }
  }
  function create_text(value = "") {
    return document.createTextNode(value);
  }
  // @__NO_SIDE_EFFECTS__
  function get_first_child(node) {
    return (
      /** @type {TemplateNode | null} */
      first_child_getter.call(node)
    );
  }
  // @__NO_SIDE_EFFECTS__
  function get_next_sibling(node) {
    return (
      /** @type {TemplateNode | null} */
      next_sibling_getter.call(node)
    );
  }
  function child(node, is_text) {
    if (!hydrating) {
      return /* @__PURE__ */ get_first_child(node);
    }
    var child2 = /* @__PURE__ */ get_first_child(hydrate_node);
    if (child2 === null) {
      child2 = hydrate_node.appendChild(create_text());
    } else if (is_text && child2.nodeType !== TEXT_NODE) {
      var text2 = create_text();
      child2?.before(text2);
      set_hydrate_node(text2);
      return text2;
    }
    if (is_text) {
      merge_text_nodes(
        /** @type {Text} */
        child2
      );
    }
    set_hydrate_node(child2);
    return child2;
  }
  function first_child(node, is_text = false) {
    if (!hydrating) {
      var first = /* @__PURE__ */ get_first_child(node);
      if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
      return first;
    }
    if (is_text) {
      if (hydrate_node?.nodeType !== TEXT_NODE) {
        var text2 = create_text();
        hydrate_node?.before(text2);
        set_hydrate_node(text2);
        return text2;
      }
      merge_text_nodes(
        /** @type {Text} */
        hydrate_node
      );
    }
    return hydrate_node;
  }
  function sibling(node, count = 1, is_text = false) {
    let next_sibling = hydrating ? hydrate_node : node;
    var last_sibling;
    while (count--) {
      last_sibling = next_sibling;
      next_sibling = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(next_sibling);
    }
    if (!hydrating) {
      return next_sibling;
    }
    if (is_text) {
      if (next_sibling?.nodeType !== TEXT_NODE) {
        var text2 = create_text();
        if (next_sibling === null) {
          last_sibling?.after(text2);
        } else {
          next_sibling.before(text2);
        }
        set_hydrate_node(text2);
        return text2;
      }
      merge_text_nodes(
        /** @type {Text} */
        next_sibling
      );
    }
    set_hydrate_node(next_sibling);
    return next_sibling;
  }
  function clear_text_content(node) {
    node.textContent = "";
  }
  function should_defer_append() {
    if (!async_mode_flag) return false;
    if (eager_block_effects !== null) return false;
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    return (flags2 & REACTION_RAN) !== 0;
  }
  function create_element(tag2, namespace, is2) {
    let options = is2 ? { is: is2 } : void 0;
    return (
      /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
      document.createElementNS(namespace ?? NAMESPACE_HTML, tag2, options)
    );
  }
  function merge_text_nodes(text2) {
    if (
      /** @type {string} */
      text2.nodeValue.length < 65536
    ) {
      return;
    }
    let next2 = text2.nextSibling;
    while (next2 !== null && next2.nodeType === TEXT_NODE) {
      next2.remove();
      text2.nodeValue += /** @type {string} */
      next2.nodeValue;
      next2 = text2.nextSibling;
    }
  }

  // node_modules/svelte/src/internal/client/dom/elements/misc.js
  var listening_to_form_reset = false;
  function add_form_reset_listener() {
    if (!listening_to_form_reset) {
      listening_to_form_reset = true;
      document.addEventListener(
        "reset",
        (evt) => {
          Promise.resolve().then(() => {
            if (!evt.defaultPrevented) {
              for (
                const e of
                /**@type {HTMLFormElement} */
                evt.target.elements
              ) {
                e[FORM_RESET_HANDLER]?.();
              }
            }
          });
        },
        // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
        { capture: true }
      );
    }
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
  function without_reactive_context(fn) {
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      return fn();
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }
  function listen_to_event_and_reset_event(element2, event2, handler, on_reset = handler) {
    element2.addEventListener(event2, () => without_reactive_context(handler));
    const prev = (
      /** @type {any} */
      element2[FORM_RESET_HANDLER]
    );
    if (prev) {
      element2[FORM_RESET_HANDLER] = () => {
        prev();
        on_reset(true);
      };
    } else {
      element2[FORM_RESET_HANDLER] = () => on_reset(true);
    }
    add_form_reset_listener();
  }

  // node_modules/svelte/src/internal/client/reactivity/effects.js
  function validate_effect(rune) {
    if (active_effect === null) {
      if (active_reaction === null) {
        effect_orphan(rune);
      }
      effect_in_unowned_derived();
    }
    if (is_destroying_effect) {
      effect_in_teardown(rune);
    }
  }
  function push_effect(effect2, parent_effect) {
    var parent_last = parent_effect.last;
    if (parent_last === null) {
      parent_effect.last = parent_effect.first = effect2;
    } else {
      parent_last.next = effect2;
      effect2.prev = parent_last;
      parent_effect.last = effect2;
    }
  }
  function create_effect(type, fn) {
    var parent = active_effect;
    if (dev_fallback_default) {
      while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
        parent = parent.parent;
      }
    }
    if (parent !== null && (parent.f & INERT) !== 0) {
      type |= INERT;
    }
    var effect2 = {
      ctx: component_context,
      deps: null,
      nodes: null,
      f: type | DIRTY | CONNECTED,
      first: null,
      fn,
      last: null,
      next: null,
      parent,
      b: parent && parent.b,
      prev: null,
      teardown: null,
      wv: 0,
      ac: null
    };
    if (dev_fallback_default) {
      effect2.component_function = dev_current_component_function;
    }
    current_batch?.register_created_effect(effect2);
    var e = effect2;
    if ((type & EFFECT) !== 0) {
      if (collected_effects !== null) {
        collected_effects.push(effect2);
      } else {
        Batch.ensure().schedule(effect2);
      }
    } else if (fn !== null) {
      try {
        update_effect(effect2);
      } catch (e2) {
        destroy_effect(effect2);
        throw e2;
      }
      if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
      (e.f & EFFECT_PRESERVED) === 0) {
        e = e.first;
        if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
          e.f |= EFFECT_TRANSPARENT;
        }
      }
    }
    if (e !== null) {
      e.parent = parent;
      if (parent !== null) {
        push_effect(e, parent);
      }
      if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
        var derived3 = (
          /** @type {Derived} */
          active_reaction
        );
        (derived3.effects ?? (derived3.effects = [])).push(e);
      }
    }
    return effect2;
  }
  function effect_tracking() {
    return active_reaction !== null && !untracking;
  }
  function teardown(fn) {
    const effect2 = create_effect(RENDER_EFFECT, null);
    set_signal_status(effect2, CLEAN);
    effect2.teardown = fn;
    return effect2;
  }
  function user_effect(fn) {
    validate_effect("$effect");
    if (dev_fallback_default) {
      define_property(fn, "name", {
        value: "$effect"
      });
    }
    var flags2 = (
      /** @type {Effect} */
      active_effect.f
    );
    var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && (flags2 & REACTION_RAN) === 0;
    if (defer) {
      var context = (
        /** @type {ComponentContext} */
        component_context
      );
      (context.e ?? (context.e = [])).push(fn);
    } else {
      return create_user_effect(fn);
    }
  }
  function create_user_effect(fn) {
    return create_effect(EFFECT | USER_EFFECT, fn);
  }
  function user_pre_effect(fn) {
    validate_effect("$effect.pre");
    if (dev_fallback_default) {
      define_property(fn, "name", {
        value: "$effect.pre"
      });
    }
    return create_effect(RENDER_EFFECT | USER_EFFECT, fn);
  }
  function effect_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
    return () => {
      destroy_effect(effect2);
    };
  }
  function component_root(fn) {
    Batch.ensure();
    const effect2 = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
    return (options = {}) => {
      return new Promise((fulfil) => {
        if (options.outro) {
          pause_effect(effect2, () => {
            destroy_effect(effect2);
            fulfil(void 0);
          });
        } else {
          destroy_effect(effect2);
          fulfil(void 0);
        }
      });
    };
  }
  function effect(fn) {
    return create_effect(EFFECT, fn);
  }
  function legacy_pre_effect(deps, fn) {
    var context = (
      /** @type {ComponentContextLegacy} */
      component_context
    );
    var token = { effect: null, ran: false, deps };
    context.l.$.push(token);
    token.effect = render_effect(() => {
      deps();
      if (token.ran) return;
      token.ran = true;
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      try {
        set_active_effect(effect2.parent);
        untrack(fn);
      } finally {
        set_active_effect(effect2);
      }
    });
  }
  function legacy_pre_effect_reset() {
    var context = (
      /** @type {ComponentContextLegacy} */
      component_context
    );
    render_effect(() => {
      for (var token of context.l.$) {
        token.deps();
        var effect2 = token.effect;
        if ((effect2.f & CLEAN) !== 0 && effect2.deps !== null) {
          set_signal_status(effect2, MAYBE_DIRTY);
        }
        if (is_dirty(effect2)) {
          update_effect(effect2);
        }
        token.ran = false;
      }
    });
  }
  function async_effect(fn) {
    return create_effect(ASYNC | EFFECT_PRESERVED, fn);
  }
  function render_effect(fn, flags2 = 0) {
    return create_effect(RENDER_EFFECT | flags2, fn);
  }
  function template_effect(fn, sync = [], async2 = [], blockers = []) {
    flatten(blockers, sync, async2, (values) => {
      create_effect(RENDER_EFFECT, () => fn(...values.map(get2)));
    });
  }
  function block(fn, flags2 = 0) {
    var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
    if (dev_fallback_default) {
      effect2.dev_stack = dev_stack;
    }
    return effect2;
  }
  function branch(fn) {
    return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
  }
  function execute_effect_teardown(effect2) {
    var teardown2 = effect2.teardown;
    if (teardown2 !== null) {
      const previously_destroying_effect = is_destroying_effect;
      const previous_reaction = active_reaction;
      set_is_destroying_effect(true);
      set_active_reaction(null);
      try {
        teardown2.call(null);
      } finally {
        set_is_destroying_effect(previously_destroying_effect);
        set_active_reaction(previous_reaction);
      }
    }
  }
  function destroy_effect_children(signal, remove_dom = false) {
    var effect2 = signal.first;
    signal.first = signal.last = null;
    while (effect2 !== null) {
      const controller = effect2.ac;
      if (controller !== null) {
        without_reactive_context(() => {
          controller.abort(STALE_REACTION);
        });
      }
      var next2 = effect2.next;
      if ((effect2.f & ROOT_EFFECT) !== 0) {
        effect2.parent = null;
      } else {
        destroy_effect(effect2, remove_dom);
      }
      effect2 = next2;
    }
  }
  function destroy_block_effect_children(signal) {
    var effect2 = signal.first;
    while (effect2 !== null) {
      var next2 = effect2.next;
      if ((effect2.f & BRANCH_EFFECT) === 0) {
        destroy_effect(effect2);
      }
      effect2 = next2;
    }
  }
  function destroy_effect(effect2, remove_dom = true) {
    var removed = false;
    if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
      remove_effect_dom(
        effect2.nodes.start,
        /** @type {TemplateNode} */
        effect2.nodes.end
      );
      removed = true;
    }
    set_signal_status(effect2, DESTROYING);
    destroy_effect_children(effect2, remove_dom && !removed);
    remove_reactions(effect2, 0);
    var transitions = effect2.nodes && effect2.nodes.t;
    if (transitions !== null) {
      for (const transition2 of transitions) {
        transition2.stop();
      }
    }
    execute_effect_teardown(effect2);
    effect2.f ^= DESTROYING;
    effect2.f |= DESTROYED;
    var parent = effect2.parent;
    if (parent !== null && parent.first !== null) {
      unlink_effect(effect2);
    }
    if (dev_fallback_default) {
      effect2.component_function = null;
    }
    effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
  }
  function remove_effect_dom(node, end) {
    while (node !== null) {
      var next2 = node === end ? null : get_next_sibling(node);
      node.remove();
      node = next2;
    }
  }
  function unlink_effect(effect2) {
    var parent = effect2.parent;
    var prev = effect2.prev;
    var next2 = effect2.next;
    if (prev !== null) prev.next = next2;
    if (next2 !== null) next2.prev = prev;
    if (parent !== null) {
      if (parent.first === effect2) parent.first = next2;
      if (parent.last === effect2) parent.last = prev;
    }
  }
  function pause_effect(effect2, callback, destroy = true) {
    var transitions = [];
    pause_children(effect2, transitions, true);
    var fn = () => {
      if (destroy) destroy_effect(effect2);
      if (callback) callback();
    };
    var remaining = transitions.length;
    if (remaining > 0) {
      var check = () => --remaining || fn();
      for (var transition2 of transitions) {
        transition2.out(check);
      }
    } else {
      fn();
    }
  }
  function pause_children(effect2, transitions, local) {
    if ((effect2.f & INERT) !== 0) return;
    effect2.f ^= INERT;
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition2 of t) {
        if (transition2.is_global || local) {
          transitions.push(transition2);
        }
      }
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      if ((child2.f & ROOT_EFFECT) === 0) {
        var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
        pause_children(child2, transitions, transparent ? local : false);
      }
      child2 = sibling2;
    }
  }
  function resume_effect(effect2) {
    resume_children(effect2, true);
  }
  function resume_children(effect2, local) {
    if ((effect2.f & INERT) === 0) return;
    effect2.f ^= INERT;
    if ((effect2.f & CLEAN) === 0) {
      set_signal_status(effect2, DIRTY);
      Batch.ensure().schedule(effect2);
    }
    var child2 = effect2.first;
    while (child2 !== null) {
      var sibling2 = child2.next;
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
      resume_children(child2, transparent ? local : false);
      child2 = sibling2;
    }
    var t = effect2.nodes && effect2.nodes.t;
    if (t !== null) {
      for (const transition2 of t) {
        if (transition2.is_global || local) {
          transition2.in();
        }
      }
    }
  }
  function move_effect(effect2, fragment) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    while (node !== null) {
      var next2 = node === end ? null : get_next_sibling(node);
      fragment.append(node);
      node = next2;
    }
  }

  // node_modules/svelte/src/internal/client/legacy.js
  var captured_signals = null;

  // node_modules/svelte/src/internal/client/runtime.js
  var is_updating_effect = false;
  var is_destroying_effect = false;
  function set_is_destroying_effect(value) {
    is_destroying_effect = value;
  }
  var active_reaction = null;
  var untracking = false;
  function set_active_reaction(reaction) {
    active_reaction = reaction;
  }
  var active_effect = null;
  function set_active_effect(effect2) {
    active_effect = effect2;
  }
  var current_sources = null;
  function push_reaction_value(value) {
    if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
      if (current_sources === null) {
        current_sources = [value];
      } else {
        current_sources.push(value);
      }
    }
  }
  var new_deps = null;
  var skipped_deps = 0;
  var untracked_writes = null;
  function set_untracked_writes(value) {
    untracked_writes = value;
  }
  var write_version = 1;
  var read_version = 0;
  var update_version = read_version;
  function set_update_version(value) {
    update_version = value;
  }
  function increment_write_version() {
    return ++write_version;
  }
  function is_dirty(reaction) {
    var flags2 = reaction.f;
    if ((flags2 & DIRTY) !== 0) {
      return true;
    }
    if (flags2 & DERIVED) {
      reaction.f &= ~WAS_MARKED;
    }
    if ((flags2 & MAYBE_DIRTY) !== 0) {
      var dependencies = (
        /** @type {Value[]} */
        reaction.deps
      );
      var length = dependencies.length;
      for (var i = 0; i < length; i++) {
        var dependency = dependencies[i];
        if (is_dirty(
          /** @type {Derived} */
          dependency
        )) {
          update_derived(
            /** @type {Derived} */
            dependency
          );
        }
        if (dependency.wv > reaction.wv) {
          return true;
        }
      }
      if ((flags2 & CONNECTED) !== 0 && // During time traveling we don't want to reset the status so that
      // traversal of the graph in the other batches still happens
      batch_values === null) {
        set_signal_status(reaction, CLEAN);
      }
    }
    return false;
  }
  function schedule_possible_effect_self_invalidation(signal, effect2, root14 = true) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    if (!async_mode_flag && current_sources !== null && includes.call(current_sources, signal)) {
      return;
    }
    for (var i = 0; i < reactions.length; i++) {
      var reaction = reactions[i];
      if ((reaction.f & DERIVED) !== 0) {
        schedule_possible_effect_self_invalidation(
          /** @type {Derived} */
          reaction,
          effect2,
          false
        );
      } else if (effect2 === reaction) {
        if (root14) {
          set_signal_status(reaction, DIRTY);
        } else if ((reaction.f & CLEAN) !== 0) {
          set_signal_status(reaction, MAYBE_DIRTY);
        }
        schedule_effect(
          /** @type {Effect} */
          reaction
        );
      }
    }
  }
  function update_reaction(reaction) {
    var _a2;
    var previous_deps = new_deps;
    var previous_skipped_deps = skipped_deps;
    var previous_untracked_writes = untracked_writes;
    var previous_reaction = active_reaction;
    var previous_sources = current_sources;
    var previous_component_context = component_context;
    var previous_untracking = untracking;
    var previous_update_version = update_version;
    var flags2 = reaction.f;
    new_deps = /** @type {null | Value[]} */
    null;
    skipped_deps = 0;
    untracked_writes = null;
    active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
    current_sources = null;
    set_component_context(reaction.ctx);
    untracking = false;
    update_version = ++read_version;
    if (reaction.ac !== null) {
      without_reactive_context(() => {
        reaction.ac.abort(STALE_REACTION);
      });
      reaction.ac = null;
    }
    try {
      reaction.f |= REACTION_IS_UPDATING;
      var fn = (
        /** @type {Function} */
        reaction.fn
      );
      var result = fn();
      reaction.f |= REACTION_RAN;
      var deps = reaction.deps;
      var is_fork = current_batch?.is_fork;
      if (new_deps !== null) {
        var i;
        if (!is_fork) {
          remove_reactions(reaction, skipped_deps);
        }
        if (deps !== null && skipped_deps > 0) {
          deps.length = skipped_deps + new_deps.length;
          for (i = 0; i < new_deps.length; i++) {
            deps[skipped_deps + i] = new_deps[i];
          }
        } else {
          reaction.deps = deps = new_deps;
        }
        if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
          for (i = skipped_deps; i < deps.length; i++) {
            ((_a2 = deps[i]).reactions ?? (_a2.reactions = [])).push(reaction);
          }
        }
      } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
        remove_reactions(reaction, skipped_deps);
        deps.length = skipped_deps;
      }
      if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
        for (i = 0; i < /** @type {Source[]} */
        untracked_writes.length; i++) {
          schedule_possible_effect_self_invalidation(
            untracked_writes[i],
            /** @type {Effect} */
            reaction
          );
        }
      }
      if (previous_reaction !== null && previous_reaction !== reaction) {
        read_version++;
        if (previous_reaction.deps !== null) {
          for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
            previous_reaction.deps[i2].rv = read_version;
          }
        }
        if (previous_deps !== null) {
          for (const dep of previous_deps) {
            dep.rv = read_version;
          }
        }
        if (untracked_writes !== null) {
          if (previous_untracked_writes === null) {
            previous_untracked_writes = untracked_writes;
          } else {
            previous_untracked_writes.push(.../** @type {Source[]} */
            untracked_writes);
          }
        }
      }
      if ((reaction.f & ERROR_VALUE) !== 0) {
        reaction.f ^= ERROR_VALUE;
      }
      return result;
    } catch (error) {
      return handle_error(error);
    } finally {
      reaction.f ^= REACTION_IS_UPDATING;
      new_deps = previous_deps;
      skipped_deps = previous_skipped_deps;
      untracked_writes = previous_untracked_writes;
      active_reaction = previous_reaction;
      current_sources = previous_sources;
      set_component_context(previous_component_context);
      untracking = previous_untracking;
      update_version = previous_update_version;
    }
  }
  function remove_reaction(signal, dependency) {
    let reactions = dependency.reactions;
    if (reactions !== null) {
      var index2 = index_of.call(reactions, signal);
      if (index2 !== -1) {
        var new_length = reactions.length - 1;
        if (new_length === 0) {
          reactions = dependency.reactions = null;
        } else {
          reactions[index2] = reactions[new_length];
          reactions.pop();
        }
      }
    }
    if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
    // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
    // allows us to skip the expensive work of disconnecting and immediately reconnecting it
    (new_deps === null || !includes.call(new_deps, dependency))) {
      var derived3 = (
        /** @type {Derived} */
        dependency
      );
      if ((derived3.f & CONNECTED) !== 0) {
        derived3.f ^= CONNECTED;
        derived3.f &= ~WAS_MARKED;
      }
      if (derived3.v !== UNINITIALIZED) {
        update_derived_status(derived3);
      }
      freeze_derived_effects(derived3);
      remove_reactions(derived3, 0);
    }
  }
  function remove_reactions(signal, start_index) {
    var dependencies = signal.deps;
    if (dependencies === null) return;
    for (var i = start_index; i < dependencies.length; i++) {
      remove_reaction(signal, dependencies[i]);
    }
  }
  function update_effect(effect2) {
    var flags2 = effect2.f;
    if ((flags2 & DESTROYED) !== 0) {
      return;
    }
    set_signal_status(effect2, CLEAN);
    var previous_effect = active_effect;
    var was_updating_effect = is_updating_effect;
    active_effect = effect2;
    is_updating_effect = true;
    if (dev_fallback_default) {
      var previous_component_fn = dev_current_component_function;
      set_dev_current_component_function(effect2.component_function);
      var previous_stack = (
        /** @type {any} */
        dev_stack
      );
      set_dev_stack(effect2.dev_stack ?? dev_stack);
    }
    try {
      if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
        destroy_block_effect_children(effect2);
      } else {
        destroy_effect_children(effect2);
      }
      execute_effect_teardown(effect2);
      var teardown2 = update_reaction(effect2);
      effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
      effect2.wv = write_version;
      if (dev_fallback_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
        for (var dep of effect2.deps) {
          if (dep.set_during_effect) {
            dep.wv = increment_write_version();
            dep.set_during_effect = false;
          }
        }
      }
    } finally {
      is_updating_effect = was_updating_effect;
      active_effect = previous_effect;
      if (dev_fallback_default) {
        set_dev_current_component_function(previous_component_fn);
        set_dev_stack(previous_stack);
      }
    }
  }
  async function tick() {
    if (async_mode_flag) {
      return new Promise((f) => {
        requestAnimationFrame(() => f());
        setTimeout(() => f());
      });
    }
    await Promise.resolve();
    flushSync();
  }
  function get2(signal) {
    var flags2 = signal.f;
    var is_derived = (flags2 & DERIVED) !== 0;
    captured_signals?.add(signal);
    if (active_reaction !== null && !untracking) {
      var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
      if (!destroyed && (current_sources === null || !includes.call(current_sources, signal))) {
        var deps = active_reaction.deps;
        if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
          if (signal.rv < read_version) {
            signal.rv = read_version;
            if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
              skipped_deps++;
            } else if (new_deps === null) {
              new_deps = [signal];
            } else {
              new_deps.push(signal);
            }
          }
        } else {
          active_reaction.deps ?? (active_reaction.deps = []);
          if (!includes.call(active_reaction.deps, signal)) {
            active_reaction.deps.push(signal);
          }
          var reactions = signal.reactions;
          if (reactions === null) {
            signal.reactions = [active_reaction];
          } else if (!includes.call(reactions, active_reaction)) {
            reactions.push(active_reaction);
          }
        }
      }
    }
    if (dev_fallback_default) {
      if (!untracking && reactivity_loss_tracker && !reactivity_loss_tracker.warned && (reactivity_loss_tracker.effect.f & REACTION_IS_UPDATING) === 0 && !reactivity_loss_tracker.effect_deps.has(signal)) {
        reactivity_loss_tracker.warned = true;
        await_reactivity_loss(
          /** @type {string} */
          signal.label
        );
        var trace2 = get_error("traced at");
        if (trace2) console.warn(trace2);
      }
      recent_async_deriveds.delete(signal);
      if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
        if (signal.trace) {
          signal.trace();
        } else {
          trace2 = get_error("traced at");
          if (trace2) {
            var entry = tracing_expressions.entries.get(signal);
            if (entry === void 0) {
              entry = { traces: [] };
              tracing_expressions.entries.set(signal, entry);
            }
            var last = entry.traces[entry.traces.length - 1];
            if (trace2.stack !== last?.stack) {
              entry.traces.push(trace2);
            }
          }
        }
      }
    }
    if (is_destroying_effect && old_values.has(signal)) {
      return old_values.get(signal);
    }
    if (is_derived) {
      var derived3 = (
        /** @type {Derived} */
        signal
      );
      if (is_destroying_effect) {
        var value = derived3.v;
        if ((derived3.f & CLEAN) === 0 && derived3.reactions !== null || depends_on_old_values(derived3)) {
          value = execute_derived(derived3);
        }
        old_values.set(derived3, value);
        return value;
      }
      var should_connect = (derived3.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
      var is_new = (derived3.f & REACTION_RAN) === 0;
      if (is_dirty(derived3)) {
        if (should_connect) {
          derived3.f |= CONNECTED;
        }
        update_derived(derived3);
      }
      if (should_connect && !is_new) {
        unfreeze_derived_effects(derived3);
        reconnect(derived3);
      }
    }
    if (batch_values?.has(signal)) {
      return batch_values.get(signal);
    }
    if ((signal.f & ERROR_VALUE) !== 0) {
      throw signal.v;
    }
    return signal.v;
  }
  function reconnect(derived3) {
    derived3.f |= CONNECTED;
    if (derived3.deps === null) return;
    for (const dep of derived3.deps) {
      (dep.reactions ?? (dep.reactions = [])).push(derived3);
      if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
        unfreeze_derived_effects(
          /** @type {Derived} */
          dep
        );
        reconnect(
          /** @type {Derived} */
          dep
        );
      }
    }
  }
  function depends_on_old_values(derived3) {
    if (derived3.v === UNINITIALIZED) return true;
    if (derived3.deps === null) return false;
    for (const dep of derived3.deps) {
      if (old_values.has(dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on_old_values(
        /** @type {Derived} */
        dep
      )) {
        return true;
      }
    }
    return false;
  }
  function untrack(fn) {
    var previous_untracking = untracking;
    try {
      untracking = true;
      return fn();
    } finally {
      untracking = previous_untracking;
    }
  }
  function deep_read_state(value) {
    if (typeof value !== "object" || !value || value instanceof EventTarget) {
      return;
    }
    if (STATE_SYMBOL in value) {
      deep_read(value);
    } else if (!Array.isArray(value)) {
      for (let key2 in value) {
        const prop2 = value[key2];
        if (typeof prop2 === "object" && prop2 && STATE_SYMBOL in prop2) {
          deep_read(prop2);
        }
      }
    }
  }
  function deep_read(value, visited = /* @__PURE__ */ new Set()) {
    if (typeof value === "object" && value !== null && // We don't want to traverse DOM elements
    !(value instanceof EventTarget) && !visited.has(value)) {
      visited.add(value);
      if (value instanceof Date) {
        value.getTime();
      }
      for (let key2 in value) {
        try {
          deep_read(value[key2], visited);
        } catch (e) {
        }
      }
      const proto = get_prototype_of(value);
      if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
        const descriptors = get_descriptors(proto);
        for (let key2 in descriptors) {
          const get3 = descriptors[key2].get;
          if (get3) {
            try {
              get3.call(value);
            } catch (e) {
            }
          }
        }
      }
    }
  }

  // node_modules/svelte/src/internal/client/dom/elements/events.js
  var event_symbol = /* @__PURE__ */ Symbol("events");
  var all_registered_events = /* @__PURE__ */ new Set();
  var root_event_handles = /* @__PURE__ */ new Set();
  function delegated(event_name, element2, handler) {
    (element2[event_symbol] ?? (element2[event_symbol] = {}))[event_name] = handler;
  }
  function delegate(events) {
    for (var i = 0; i < events.length; i++) {
      all_registered_events.add(events[i]);
    }
    for (var fn of root_event_handles) {
      fn(events);
    }
  }
  var last_propagated_event = null;
  function handle_event_propagation(event2) {
    var handler_element = this;
    var owner_document = (
      /** @type {Node} */
      handler_element.ownerDocument
    );
    var event_name = event2.type;
    var path = event2.composedPath?.() || [];
    var current_target = (
      /** @type {null | Element} */
      path[0] || event2.target
    );
    last_propagated_event = event2;
    var path_idx = 0;
    var handled_at = last_propagated_event === event2 && event2[event_symbol];
    if (handled_at) {
      var at_idx = path.indexOf(handled_at);
      if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
      window)) {
        event2[event_symbol] = handler_element;
        return;
      }
      var handler_idx = path.indexOf(handler_element);
      if (handler_idx === -1) {
        return;
      }
      if (at_idx <= handler_idx) {
        path_idx = at_idx;
      }
    }
    current_target = /** @type {Element} */
    path[path_idx] || event2.target;
    if (current_target === handler_element) return;
    define_property(event2, "currentTarget", {
      configurable: true,
      get() {
        return current_target || owner_document;
      }
    });
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(null);
    set_active_effect(null);
    try {
      var throw_error;
      var other_errors = [];
      while (current_target !== null) {
        var parent_element = current_target.assignedSlot || current_target.parentNode || /** @type {any} */
        current_target.host || null;
        try {
          var delegated2 = current_target[event_symbol]?.[event_name];
          if (delegated2 != null && (!/** @type {any} */
          current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          event2.target === current_target)) {
            delegated2.call(current_target, event2);
          }
        } catch (error) {
          if (throw_error) {
            other_errors.push(error);
          } else {
            throw_error = error;
          }
        }
        if (event2.cancelBubble || parent_element === handler_element || parent_element === null) {
          break;
        }
        current_target = parent_element;
      }
      if (throw_error) {
        for (let error of other_errors) {
          queueMicrotask(() => {
            throw error;
          });
        }
        throw throw_error;
      }
    } finally {
      event2[event_symbol] = handler_element;
      delete event2.currentTarget;
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
  }

  // node_modules/svelte/src/internal/client/dom/reconciler.js
  var policy = (
    // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
    globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
      /** @param {string} html */
      createHTML: (html2) => {
        return html2;
      }
    })
  );
  function create_trusted_html(html2) {
    return (
      /** @type {string} */
      policy?.createHTML(html2) ?? html2
    );
  }
  function create_fragment_from_html(html2) {
    var elem = create_element("template");
    elem.innerHTML = create_trusted_html(html2.replaceAll("<!>", "<!---->"));
    return elem.content;
  }

  // node_modules/svelte/src/internal/client/dom/template.js
  function assign_nodes(start, end) {
    var effect2 = (
      /** @type {Effect} */
      active_effect
    );
    if (effect2.nodes === null) {
      effect2.nodes = { start, end, a: null, t: null };
    }
  }
  // @__NO_SIDE_EFFECTS__
  function from_html(content, flags2) {
    var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
    var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
    var node;
    var has_start = !content.startsWith("<!>");
    return () => {
      if (hydrating) {
        assign_nodes(hydrate_node, null);
        return hydrate_node;
      }
      if (node === void 0) {
        node = create_fragment_from_html(has_start ? content : "<!>" + content);
        if (!is_fragment) node = /** @type {TemplateNode} */
        get_first_child(node);
      }
      var clone = (
        /** @type {TemplateNode} */
        use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
      );
      if (is_fragment) {
        var start = (
          /** @type {TemplateNode} */
          get_first_child(clone)
        );
        var end = (
          /** @type {TemplateNode} */
          clone.lastChild
        );
        assign_nodes(start, end);
      } else {
        assign_nodes(clone, clone);
      }
      return clone;
    };
  }
  function text(value = "") {
    if (!hydrating) {
      var t = create_text(value + "");
      assign_nodes(t, t);
      return t;
    }
    var node = hydrate_node;
    if (node.nodeType !== TEXT_NODE) {
      node.before(node = create_text());
      set_hydrate_node(node);
    } else {
      merge_text_nodes(
        /** @type {Text} */
        node
      );
    }
    assign_nodes(node, node);
    return node;
  }
  function comment() {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    var frag = document.createDocumentFragment();
    var start = document.createComment("");
    var anchor = create_text();
    frag.append(start, anchor);
    assign_nodes(start, anchor);
    return frag;
  }
  function append(anchor, dom) {
    if (hydrating) {
      var effect2 = (
        /** @type {Effect & { nodes: EffectNodes }} */
        active_effect
      );
      if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
        effect2.nodes.end = hydrate_node;
      }
      hydrate_next();
      return;
    }
    if (anchor === null) {
      return;
    }
    anchor.before(
      /** @type {Node} */
      dom
    );
  }

  // node_modules/svelte/src/utils.js
  var regex_return_characters = /\r/g;
  function hash(str) {
    str = str.replace(regex_return_characters, "");
    let hash2 = 5381;
    let i = str.length;
    while (i--) hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return (hash2 >>> 0).toString(36);
  }
  var DOM_BOOLEAN_ATTRIBUTES = [
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "disabled",
    "formnovalidate",
    "indeterminate",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "seamless",
    "selected",
    "webkitdirectory",
    "defer",
    "disablepictureinpicture",
    "disableremoteplayback"
  ];
  var DOM_PROPERTIES = [
    ...DOM_BOOLEAN_ATTRIBUTES,
    "formNoValidate",
    "isMap",
    "noModule",
    "playsInline",
    "readOnly",
    "value",
    "volume",
    "defaultValue",
    "defaultChecked",
    "srcObject",
    "noValidate",
    "allowFullscreen",
    "disablePictureInPicture",
    "disableRemotePlayback"
  ];
  var PASSIVE_EVENTS = ["touchstart", "touchmove"];
  function is_passive_event(name) {
    return PASSIVE_EVENTS.includes(name);
  }
  var STATE_CREATION_RUNES = (
    /** @type {const} */
    [
      "$state",
      "$state.raw",
      "$derived",
      "$derived.by"
    ]
  );
  var RUNES = (
    /** @type {const} */
    [
      ...STATE_CREATION_RUNES,
      "$state.eager",
      "$state.snapshot",
      "$props",
      "$props.id",
      "$bindable",
      "$effect",
      "$effect.pre",
      "$effect.tracking",
      "$effect.root",
      "$effect.pending",
      "$inspect",
      "$inspect().with",
      "$inspect.trace",
      "$host"
    ]
  );
  function sanitize_location(location) {
    return (
      /** @type {T} */
      location?.replace(/\//g, "/\u200B")
    );
  }

  // node_modules/svelte/src/internal/client/render.js
  var should_intro = true;
  function set_text(text2, value) {
    var _a2;
    var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
    if (str !== /** @type {any} */
    (text2[_a2 = TEXT_CACHE] ?? (text2[_a2] = text2.nodeValue))) {
      text2[TEXT_CACHE] = str;
      text2.nodeValue = `${str}`;
    }
  }
  function mount(component2, options) {
    return _mount(component2, options);
  }
  function hydrate(component2, options) {
    init_operations();
    options.intro = options.intro ?? false;
    const target2 = options.target;
    const was_hydrating = hydrating;
    const previous_hydrate_node = hydrate_node;
    try {
      var anchor = get_first_child(target2);
      while (anchor && (anchor.nodeType !== COMMENT_NODE || /** @type {Comment} */
      anchor.data !== HYDRATION_START)) {
        anchor = get_next_sibling(anchor);
      }
      if (!anchor) {
        throw HYDRATION_ERROR;
      }
      set_hydrating(true);
      set_hydrate_node(
        /** @type {Comment} */
        anchor
      );
      const instance = _mount(component2, { ...options, anchor });
      set_hydrating(false);
      return (
        /**  @type {Exports} */
        instance
      );
    } catch (error) {
      if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
        throw error;
      }
      if (error !== HYDRATION_ERROR) {
        console.warn("Failed to hydrate: ", error);
      }
      if (options.recover === false) {
        hydration_failed();
      }
      init_operations();
      clear_text_content(target2);
      set_hydrating(false);
      return mount(component2, options);
    } finally {
      set_hydrating(was_hydrating);
      set_hydrate_node(previous_hydrate_node);
    }
  }
  var listeners = /* @__PURE__ */ new Map();
  function _mount(Component, { target: target2, anchor, props = {}, events, context, intro = true, transformError }) {
    init_operations();
    var component2 = void 0;
    var unmount2 = component_root(() => {
      var anchor_node = anchor ?? target2.appendChild(create_text());
      boundary(
        /** @type {TemplateNode} */
        anchor_node,
        {
          pending: () => {
          }
        },
        (anchor_node2) => {
          push({});
          var ctx = (
            /** @type {ComponentContext} */
            component_context
          );
          if (context) ctx.c = context;
          if (events) {
            props.$$events = events;
          }
          if (hydrating) {
            assign_nodes(
              /** @type {TemplateNode} */
              anchor_node2,
              null
            );
          }
          should_intro = intro;
          component2 = Component(anchor_node2, props) || {};
          should_intro = true;
          if (hydrating) {
            active_effect.nodes.end = hydrate_node;
            if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || /** @type {Comment} */
            hydrate_node.data !== HYDRATION_END) {
              hydration_mismatch();
              throw HYDRATION_ERROR;
            }
          }
          pop();
        },
        transformError
      );
      var registered_events = /* @__PURE__ */ new Set();
      var event_handle = (events2) => {
        for (var i = 0; i < events2.length; i++) {
          var event_name = events2[i];
          if (registered_events.has(event_name)) continue;
          registered_events.add(event_name);
          var passive2 = is_passive_event(event_name);
          for (const node of [target2, document]) {
            var counts = listeners.get(node);
            if (counts === void 0) {
              counts = /* @__PURE__ */ new Map();
              listeners.set(node, counts);
            }
            var count = counts.get(event_name);
            if (count === void 0) {
              node.addEventListener(event_name, handle_event_propagation, { passive: passive2 });
              counts.set(event_name, 1);
            } else {
              counts.set(event_name, count + 1);
            }
          }
        }
      };
      event_handle(array_from(all_registered_events));
      root_event_handles.add(event_handle);
      return () => {
        for (var event_name of registered_events) {
          for (const node of [target2, document]) {
            var counts = (
              /** @type {Map<string, number>} */
              listeners.get(node)
            );
            var count = (
              /** @type {number} */
              counts.get(event_name)
            );
            if (--count == 0) {
              node.removeEventListener(event_name, handle_event_propagation);
              counts.delete(event_name);
              if (counts.size === 0) {
                listeners.delete(node);
              }
            } else {
              counts.set(event_name, count);
            }
          }
        }
        root_event_handles.delete(event_handle);
        if (anchor_node !== anchor) {
          anchor_node.parentNode?.removeChild(anchor_node);
        }
      };
    });
    mounted_components.set(component2, unmount2);
    return component2;
  }
  var mounted_components = /* @__PURE__ */ new WeakMap();
  function unmount(component2, options) {
    const fn = mounted_components.get(component2);
    if (fn) {
      mounted_components.delete(component2);
      return fn(options);
    }
    if (dev_fallback_default) {
      if (STATE_SYMBOL in component2) {
        state_proxy_unmount();
      } else {
        lifecycle_double_unmount();
      }
    }
    return Promise.resolve();
  }

  // node_modules/svelte/src/internal/client/dom/blocks/branches.js
  var _batches, _onscreen, _offscreen, _outroing, _transition, _commit, _discard;
  var BranchManager = class {
    /**
     * @param {TemplateNode} anchor
     * @param {boolean} transition
     */
    constructor(anchor, transition2 = true) {
      /** @type {TemplateNode} */
      __publicField(this, "anchor");
      /** @type {Map<Batch, Key>} */
      __privateAdd(this, _batches, /* @__PURE__ */ new Map());
      /**
       * Map of keys to effects that are currently rendered in the DOM.
       * These effects are visible and actively part of the document tree.
       * Example:
       * ```
       * {#if condition}
       * 	foo
       * {:else}
       * 	bar
       * {/if}
       * ```
       * Can result in the entries `true->Effect` and `false->Effect`
       * @type {Map<Key, Effect>}
       */
      __privateAdd(this, _onscreen, /* @__PURE__ */ new Map());
      /**
       * Similar to #onscreen with respect to the keys, but contains branches that are not yet
       * in the DOM, because their insertion is deferred.
       * @type {Map<Key, Branch>}
       */
      __privateAdd(this, _offscreen, /* @__PURE__ */ new Map());
      /**
       * Keys of effects that are currently outroing
       * @type {Set<Key>}
       */
      __privateAdd(this, _outroing, /* @__PURE__ */ new Set());
      /**
       * Whether to pause (i.e. outro) on change, or destroy immediately.
       * This is necessary for `<svelte:element>`
       */
      __privateAdd(this, _transition, true);
      /**
       * @param {Batch} batch
       */
      __privateAdd(this, _commit, (batch) => {
        if (!__privateGet(this, _batches).has(batch)) return;
        var key2 = (
          /** @type {Key} */
          __privateGet(this, _batches).get(batch)
        );
        var onscreen = __privateGet(this, _onscreen).get(key2);
        if (onscreen) {
          resume_effect(onscreen);
          __privateGet(this, _outroing).delete(key2);
        } else {
          var offscreen = __privateGet(this, _offscreen).get(key2);
          if (offscreen) {
            __privateGet(this, _onscreen).set(key2, offscreen.effect);
            __privateGet(this, _offscreen).delete(key2);
            if (dev_fallback_default) {
              offscreen.fragment.lastChild[HMR_ANCHOR] = this.anchor;
            }
            offscreen.fragment.lastChild.remove();
            this.anchor.before(offscreen.fragment);
            onscreen = offscreen.effect;
          }
        }
        for (const [b, k] of __privateGet(this, _batches)) {
          __privateGet(this, _batches).delete(b);
          if (b === batch) {
            break;
          }
          const offscreen2 = __privateGet(this, _offscreen).get(k);
          if (offscreen2) {
            destroy_effect(offscreen2.effect);
            __privateGet(this, _offscreen).delete(k);
          }
        }
        for (const [k, effect2] of __privateGet(this, _onscreen)) {
          if (k === key2 || __privateGet(this, _outroing).has(k)) continue;
          const on_destroy = () => {
            const keys = Array.from(__privateGet(this, _batches).values());
            if (keys.includes(k)) {
              var fragment = document.createDocumentFragment();
              move_effect(effect2, fragment);
              fragment.append(create_text());
              __privateGet(this, _offscreen).set(k, { effect: effect2, fragment });
            } else {
              destroy_effect(effect2);
            }
            __privateGet(this, _outroing).delete(k);
            __privateGet(this, _onscreen).delete(k);
          };
          if (__privateGet(this, _transition) || !onscreen) {
            __privateGet(this, _outroing).add(k);
            pause_effect(effect2, on_destroy, false);
          } else {
            on_destroy();
          }
        }
      });
      /**
       * @param {Batch} batch
       */
      __privateAdd(this, _discard, (batch) => {
        __privateGet(this, _batches).delete(batch);
        const keys = Array.from(__privateGet(this, _batches).values());
        for (const [k, branch2] of __privateGet(this, _offscreen)) {
          if (!keys.includes(k)) {
            destroy_effect(branch2.effect);
            __privateGet(this, _offscreen).delete(k);
          }
        }
      });
      this.anchor = anchor;
      __privateSet(this, _transition, transition2);
    }
    /**
     *
     * @param {any} key
     * @param {null | ((target: TemplateNode) => void)} fn
     */
    ensure(key2, fn) {
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var defer = should_defer_append();
      if (fn && !__privateGet(this, _onscreen).has(key2) && !__privateGet(this, _offscreen).has(key2)) {
        if (defer) {
          var fragment = document.createDocumentFragment();
          var target2 = create_text();
          fragment.append(target2);
          __privateGet(this, _offscreen).set(key2, {
            effect: branch(() => fn(target2)),
            fragment
          });
        } else {
          __privateGet(this, _onscreen).set(
            key2,
            branch(() => fn(this.anchor))
          );
        }
      }
      __privateGet(this, _batches).set(batch, key2);
      if (defer) {
        for (const [k, effect2] of __privateGet(this, _onscreen)) {
          if (k === key2) {
            batch.unskip_effect(effect2);
          } else {
            batch.skip_effect(effect2);
          }
        }
        for (const [k, branch2] of __privateGet(this, _offscreen)) {
          if (k === key2) {
            batch.unskip_effect(branch2.effect);
          } else {
            batch.skip_effect(branch2.effect);
          }
        }
        batch.oncommit(__privateGet(this, _commit));
        batch.ondiscard(__privateGet(this, _discard));
      } else {
        if (hydrating) {
          this.anchor = hydrate_node;
        }
        __privateGet(this, _commit).call(this, batch);
      }
    }
  };
  _batches = new WeakMap();
  _onscreen = new WeakMap();
  _offscreen = new WeakMap();
  _outroing = new WeakMap();
  _transition = new WeakMap();
  _commit = new WeakMap();
  _discard = new WeakMap();

  // node_modules/svelte/src/index-client.js
  if (dev_fallback_default) {
    let throw_rune_error = function(rune) {
      if (!(rune in globalThis)) {
        let value;
        Object.defineProperty(globalThis, rune, {
          configurable: true,
          // eslint-disable-next-line getter-return
          get: () => {
            if (value !== void 0) {
              return value;
            }
            rune_outside_svelte(rune);
          },
          set: (v) => {
            value = v;
          }
        });
      }
    };
    throw_rune_error("$state");
    throw_rune_error("$effect");
    throw_rune_error("$derived");
    throw_rune_error("$inspect");
    throw_rune_error("$props");
    throw_rune_error("$bindable");
  }
  function onMount(fn) {
    if (component_context === null) {
      lifecycle_outside_component("onMount");
    }
    if (legacy_mode_flag && component_context.l !== null) {
      init_update_callbacks(component_context).m.push(fn);
    } else {
      user_effect(() => {
        const cleanup = untrack(fn);
        if (typeof cleanup === "function") return (
          /** @type {() => void} */
          cleanup
        );
      });
    }
  }
  function onDestroy(fn) {
    if (component_context === null) {
      lifecycle_outside_component("onDestroy");
    }
    onMount(() => () => untrack(fn));
  }
  function init_update_callbacks(context) {
    var l = (
      /** @type {ComponentContextLegacy} */
      context.l
    );
    return l.u ?? (l.u = { a: [], b: [], m: [] });
  }

  // node_modules/svelte/src/internal/client/dom/blocks/if.js
  function if_block(node, fn, elseif = false) {
    var marker;
    if (hydrating) {
      marker = hydrate_node;
      hydrate_next();
    }
    var branches = new BranchManager(node);
    var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
    function update_branch(key2, fn2) {
      if (hydrating) {
        var data = read_hydration_instruction(
          /** @type {TemplateNode} */
          marker
        );
        if (key2 !== parseInt(data.substring(1))) {
          var anchor = skip_nodes();
          set_hydrate_node(anchor);
          branches.anchor = anchor;
          set_hydrating(false);
          branches.ensure(key2, fn2);
          set_hydrating(true);
          return;
        }
      }
      branches.ensure(key2, fn2);
    }
    block(() => {
      var has_branch = false;
      fn((fn2, key2 = 0) => {
        has_branch = true;
        update_branch(key2, fn2);
      });
      if (!has_branch) {
        update_branch(-1, null);
      }
    }, flags2);
  }

  // node_modules/svelte/src/internal/client/dom/blocks/each.js
  function index(_, i) {
    return i;
  }
  function pause_effects(state2, to_destroy, controlled_anchor) {
    var transitions = [];
    var length = to_destroy.length;
    var group;
    var remaining = to_destroy.length;
    for (var i = 0; i < length; i++) {
      let effect2 = to_destroy[i];
      pause_effect(
        effect2,
        () => {
          if (group) {
            group.pending.delete(effect2);
            group.done.add(effect2);
            if (group.pending.size === 0) {
              var groups = (
                /** @type {Set<EachOutroGroup>} */
                state2.outrogroups
              );
              destroy_effects(state2, array_from(group.done));
              groups.delete(group);
              if (groups.size === 0) {
                state2.outrogroups = null;
              }
            }
          } else {
            remaining -= 1;
          }
        },
        false
      );
    }
    if (remaining === 0) {
      var fast_path = transitions.length === 0 && controlled_anchor !== null;
      if (fast_path) {
        var anchor = (
          /** @type {Element} */
          controlled_anchor
        );
        var parent_node = (
          /** @type {Element} */
          anchor.parentNode
        );
        clear_text_content(parent_node);
        parent_node.append(anchor);
        state2.items.clear();
      }
      destroy_effects(state2, to_destroy, !fast_path);
    } else {
      group = {
        pending: new Set(to_destroy),
        done: /* @__PURE__ */ new Set()
      };
      (state2.outrogroups ?? (state2.outrogroups = /* @__PURE__ */ new Set())).add(group);
    }
  }
  function destroy_effects(state2, to_destroy, remove_dom = true) {
    var preserved_effects;
    if (state2.pending.size > 0) {
      preserved_effects = /* @__PURE__ */ new Set();
      for (const keys of state2.pending.values()) {
        for (const key2 of keys) {
          preserved_effects.add(
            /** @type {EachItem} */
            state2.items.get(key2).e
          );
        }
      }
    }
    for (var i = 0; i < to_destroy.length; i++) {
      var e = to_destroy[i];
      if (preserved_effects?.has(e)) {
        e.f |= EFFECT_OFFSCREEN;
        const fragment = document.createDocumentFragment();
        move_effect(e, fragment);
      } else {
        destroy_effect(to_destroy[i], remove_dom);
      }
    }
  }
  var offscreen_anchor;
  function each(node, flags2, get_collection, get_key, render_fn2, fallback_fn = null) {
    var anchor = node;
    var items = /* @__PURE__ */ new Map();
    var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
    }
    if (hydrating) {
      hydrate_next();
    }
    var fallback2 = null;
    var each_array = derived_safe_equal(() => {
      var collection = get_collection();
      return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
    });
    if (dev_fallback_default) {
      tag(each_array, "{#each ...}");
    }
    var array;
    var pending2 = /* @__PURE__ */ new Map();
    var first_run = true;
    function commit(batch) {
      if ((state2.effect.f & DESTROYED) !== 0) {
        return;
      }
      state2.pending.delete(batch);
      state2.fallback = fallback2;
      reconcile(state2, array, anchor, flags2, get_key);
      if (fallback2 !== null) {
        if (array.length === 0) {
          if ((fallback2.f & EFFECT_OFFSCREEN) === 0) {
            resume_effect(fallback2);
          } else {
            fallback2.f ^= EFFECT_OFFSCREEN;
            move(fallback2, null, anchor);
          }
        } else {
          pause_effect(fallback2, () => {
            fallback2 = null;
          });
        }
      }
    }
    function discard(batch) {
      state2.pending.delete(batch);
    }
    var effect2 = block(() => {
      array = /** @type {V[]} */
      get2(each_array);
      var length = array.length;
      let mismatch = false;
      if (hydrating) {
        var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
        if (is_else !== (length === 0)) {
          anchor = skip_nodes();
          set_hydrate_node(anchor);
          set_hydrating(false);
          mismatch = true;
        }
      }
      var keys = /* @__PURE__ */ new Set();
      var batch = (
        /** @type {Batch} */
        current_batch
      );
      var defer = should_defer_append();
      for (var index2 = 0; index2 < length; index2 += 1) {
        if (hydrating && hydrate_node.nodeType === COMMENT_NODE && /** @type {Comment} */
        hydrate_node.data === HYDRATION_END) {
          anchor = /** @type {Comment} */
          hydrate_node;
          mismatch = true;
          set_hydrating(false);
        }
        var value = array[index2];
        var key2 = get_key(value, index2);
        if (dev_fallback_default) {
          var key_again = get_key(value, index2);
          if (key2 !== key_again) {
            each_key_volatile(String(index2), String(key2), String(key_again));
          }
        }
        var item = first_run ? null : items.get(key2);
        if (item) {
          if (item.v) internal_set(item.v, value);
          if (item.i) internal_set(item.i, index2);
          if (defer) {
            batch.unskip_effect(item.e);
          }
        } else {
          item = create_item(
            items,
            first_run ? anchor : offscreen_anchor ?? (offscreen_anchor = create_text()),
            value,
            key2,
            index2,
            render_fn2,
            flags2,
            get_collection
          );
          if (!first_run) {
            item.e.f |= EFFECT_OFFSCREEN;
          }
          items.set(key2, item);
        }
        keys.add(key2);
      }
      if (length === 0 && fallback_fn && !fallback2) {
        if (first_run) {
          fallback2 = branch(() => fallback_fn(anchor));
        } else {
          fallback2 = branch(() => fallback_fn(offscreen_anchor ?? (offscreen_anchor = create_text())));
          fallback2.f |= EFFECT_OFFSCREEN;
        }
      }
      if (length > keys.size) {
        if (dev_fallback_default) {
          validate_each_keys(array, get_key);
        } else {
          each_key_duplicate("", "", "");
        }
      }
      if (hydrating && length > 0) {
        set_hydrate_node(skip_nodes());
      }
      if (!first_run) {
        pending2.set(batch, keys);
        if (defer) {
          for (const [key3, item2] of items) {
            if (!keys.has(key3)) {
              batch.skip_effect(item2.e);
            }
          }
          batch.oncommit(commit);
          batch.ondiscard(discard);
        } else {
          commit(batch);
        }
      }
      if (mismatch) {
        set_hydrating(true);
      }
      get2(each_array);
    });
    var state2 = { effect: effect2, flags: flags2, items, pending: pending2, outrogroups: null, fallback: fallback2 };
    first_run = false;
    if (hydrating) {
      anchor = hydrate_node;
    }
  }
  function skip_to_branch(effect2) {
    while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
      effect2 = effect2.next;
    }
    return effect2;
  }
  function reconcile(state2, array, anchor, flags2, get_key) {
    var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
    var length = array.length;
    var items = state2.items;
    var current = skip_to_branch(state2.effect.first);
    var seen;
    var prev = null;
    var to_animate;
    var matched = [];
    var stashed = [];
    var value;
    var key2;
    var effect2;
    var i;
    if (is_animated) {
      for (i = 0; i < length; i += 1) {
        value = array[i];
        key2 = get_key(value, i);
        effect2 = /** @type {EachItem} */
        items.get(key2).e;
        if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
          effect2.nodes?.a?.measure();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).add(effect2);
        }
      }
    }
    for (i = 0; i < length; i += 1) {
      value = array[i];
      key2 = get_key(value, i);
      effect2 = /** @type {EachItem} */
      items.get(key2).e;
      if (state2.outrogroups !== null) {
        for (const group of state2.outrogroups) {
          group.pending.delete(effect2);
          group.done.delete(effect2);
        }
      }
      if ((effect2.f & INERT) !== 0) {
        resume_effect(effect2);
        if (is_animated) {
          effect2.nodes?.a?.unfix();
          (to_animate ?? (to_animate = /* @__PURE__ */ new Set())).delete(effect2);
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
        effect2.f ^= EFFECT_OFFSCREEN;
        if (effect2 === current) {
          move(effect2, null, anchor);
        } else {
          var next2 = prev ? prev.next : current;
          if (effect2 === state2.effect.last) {
            state2.effect.last = effect2.prev;
          }
          if (effect2.prev) effect2.prev.next = effect2.next;
          if (effect2.next) effect2.next.prev = effect2.prev;
          link(state2, prev, effect2);
          link(state2, effect2, next2);
          move(effect2, next2, anchor);
          prev = effect2;
          matched = [];
          stashed = [];
          current = skip_to_branch(prev.next);
          continue;
        }
      }
      if (effect2 !== current) {
        if (seen !== void 0 && seen.has(effect2)) {
          if (matched.length < stashed.length) {
            var start = stashed[0];
            var j;
            prev = start.prev;
            var a = matched[0];
            var b = matched[matched.length - 1];
            for (j = 0; j < matched.length; j += 1) {
              move(matched[j], start, anchor);
            }
            for (j = 0; j < stashed.length; j += 1) {
              seen.delete(stashed[j]);
            }
            link(state2, a.prev, b.next);
            link(state2, prev, a);
            link(state2, b, start);
            current = start;
            prev = b;
            i -= 1;
            matched = [];
            stashed = [];
          } else {
            seen.delete(effect2);
            move(effect2, current, anchor);
            link(state2, effect2.prev, effect2.next);
            link(state2, effect2, prev === null ? state2.effect.first : prev.next);
            link(state2, prev, effect2);
            prev = effect2;
          }
          continue;
        }
        matched = [];
        stashed = [];
        while (current !== null && current !== effect2) {
          (seen ?? (seen = /* @__PURE__ */ new Set())).add(current);
          stashed.push(current);
          current = skip_to_branch(current.next);
        }
        if (current === null) {
          continue;
        }
      }
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        matched.push(effect2);
      }
      prev = effect2;
      current = skip_to_branch(effect2.next);
    }
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        if (group.pending.size === 0) {
          destroy_effects(state2, array_from(group.done));
          state2.outrogroups?.delete(group);
        }
      }
      if (state2.outrogroups.size === 0) {
        state2.outrogroups = null;
      }
    }
    if (current !== null || seen !== void 0) {
      var to_destroy = [];
      if (seen !== void 0) {
        for (effect2 of seen) {
          if ((effect2.f & INERT) === 0) {
            to_destroy.push(effect2);
          }
        }
      }
      while (current !== null) {
        if ((current.f & INERT) === 0 && current !== state2.fallback) {
          to_destroy.push(current);
        }
        current = skip_to_branch(current.next);
      }
      var destroy_length = to_destroy.length;
      if (destroy_length > 0) {
        var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
        if (is_animated) {
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].nodes?.a?.measure();
          }
          for (i = 0; i < destroy_length; i += 1) {
            to_destroy[i].nodes?.a?.fix();
          }
        }
        pause_effects(state2, to_destroy, controlled_anchor);
      }
    }
    if (is_animated) {
      queue_micro_task(() => {
        if (to_animate === void 0) return;
        for (effect2 of to_animate) {
          effect2.nodes?.a?.apply();
        }
      });
    }
  }
  function create_item(items, anchor, value, key2, index2, render_fn2, flags2, get_collection) {
    var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
    var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
    if (dev_fallback_default && v) {
      v.trace = () => {
        get_collection()[i?.v ?? index2];
      };
    }
    return {
      v,
      i,
      e: branch(() => {
        render_fn2(anchor, v ?? value, i ?? index2, get_collection);
        return () => {
          items.delete(key2);
        };
      })
    };
  }
  function move(effect2, next2, anchor) {
    if (!effect2.nodes) return;
    var node = effect2.nodes.start;
    var end = effect2.nodes.end;
    var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? (
      /** @type {EffectNodes} */
      next2.nodes.start
    ) : anchor;
    while (node !== null) {
      var next_node = (
        /** @type {TemplateNode} */
        get_next_sibling(node)
      );
      dest.before(node);
      if (node === end) {
        return;
      }
      node = next_node;
    }
  }
  function link(state2, prev, next2) {
    if (prev === null) {
      state2.effect.first = next2;
    } else {
      prev.next = next2;
    }
    if (next2 === null) {
      state2.effect.last = prev;
    } else {
      next2.prev = prev;
    }
  }
  function validate_each_keys(array, key_fn) {
    const keys = /* @__PURE__ */ new Map();
    const length = array.length;
    for (let i = 0; i < length; i++) {
      const key2 = key_fn(array[i], i);
      if (keys.has(key2)) {
        const a = String(keys.get(key2));
        const b = String(i);
        let k = String(key2);
        if (k.startsWith("[object ")) k = null;
        each_key_duplicate(a, b, k);
      }
      keys.set(key2, i);
    }
  }

  // node_modules/svelte/src/internal/client/dom/blocks/html.js
  function check_hash(element2, server_hash, value) {
    if (!server_hash || server_hash === hash(String(value ?? ""))) return;
    let location;
    const loc = element2.__svelte_meta?.loc;
    if (loc) {
      location = `near ${loc.file}:${loc.line}:${loc.column}`;
    } else if (dev_current_component_function?.[FILENAME]) {
      location = `in ${dev_current_component_function[FILENAME]}`;
    }
    hydration_html_changed(sanitize_location(location));
  }
  function html(node, get_value, is_controlled = false, svg = false, mathml = false, skip_warning = false) {
    var anchor = node;
    var value = "";
    if (is_controlled) {
      var parent_node = (
        /** @type {Element} */
        node
      );
      if (hydrating) {
        anchor = set_hydrate_node(get_first_child(parent_node));
      }
    }
    template_effect(() => {
      var effect2 = (
        /** @type {Effect} */
        active_effect
      );
      if (value === (value = get_value() ?? "")) {
        if (hydrating) hydrate_next();
        return;
      }
      if (is_controlled && !hydrating) {
        effect2.nodes = null;
        parent_node.innerHTML = /** @type {string} */
        value;
        if (value !== "") {
          assign_nodes(
            /** @type {TemplateNode} */
            get_first_child(parent_node),
            /** @type {TemplateNode} */
            parent_node.lastChild
          );
        }
        return;
      }
      if (effect2.nodes !== null) {
        remove_effect_dom(
          effect2.nodes.start,
          /** @type {TemplateNode} */
          effect2.nodes.end
        );
        effect2.nodes = null;
      }
      if (value === "") return;
      if (hydrating) {
        var hash2 = (
          /** @type {Comment} */
          hydrate_node.data
        );
        var next2 = hydrate_next();
        var last = next2;
        while (next2 !== null && (next2.nodeType !== COMMENT_NODE || /** @type {Comment} */
        next2.data !== "")) {
          last = next2;
          next2 = get_next_sibling(next2);
        }
        if (next2 === null) {
          hydration_mismatch();
          throw HYDRATION_ERROR;
        }
        if (dev_fallback_default && !skip_warning) {
          check_hash(
            /** @type {Element} */
            next2.parentNode,
            hash2,
            value
          );
        }
        assign_nodes(hydrate_node, last);
        anchor = set_hydrate_node(next2);
        return;
      }
      var ns = svg ? NAMESPACE_SVG : mathml ? NAMESPACE_MATHML : void 0;
      var wrapper = (
        /** @type {HTMLTemplateElement | SVGElement | MathMLElement} */
        create_element(svg ? "svg" : mathml ? "math" : "template", ns)
      );
      wrapper.innerHTML = /** @type {any} */
      value;
      var node2 = svg || mathml ? wrapper : (
        /** @type {HTMLTemplateElement} */
        wrapper.content
      );
      assign_nodes(
        /** @type {TemplateNode} */
        get_first_child(node2),
        /** @type {TemplateNode} */
        node2.lastChild
      );
      if (svg || mathml) {
        while (get_first_child(node2)) {
          anchor.before(
            /** @type {TemplateNode} */
            get_first_child(node2)
          );
        }
      } else {
        anchor.before(node2);
      }
    });
  }

  // node_modules/svelte/src/internal/shared/attributes.js
  var whitespace = [..." 	\n\r\f\xA0\v\uFEFF"];
  function to_class(value, hash2, directives) {
    var classname = value == null ? "" : "" + value;
    if (hash2) {
      classname = classname ? classname + " " + hash2 : hash2;
    }
    if (directives) {
      for (var key2 of Object.keys(directives)) {
        if (directives[key2]) {
          classname = classname ? classname + " " + key2 : key2;
        } else if (classname.length) {
          var len = key2.length;
          var a = 0;
          while ((a = classname.indexOf(key2, a)) >= 0) {
            var b = a + len;
            if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
              classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
            } else {
              a = b;
            }
          }
        }
      }
    }
    return classname === "" ? null : classname;
  }
  function append_styles(styles, important = false) {
    var separator = important ? " !important;" : ";";
    var css = "";
    for (var key2 of Object.keys(styles)) {
      var value = styles[key2];
      if (value != null && value !== "") {
        css += " " + key2 + ": " + value + separator;
      }
    }
    return css;
  }
  function to_css_name(name) {
    if (name[0] !== "-" || name[1] !== "-") {
      return name.toLowerCase();
    }
    return name;
  }
  function to_style(value, styles) {
    if (styles) {
      var new_style = "";
      var normal_styles;
      var important_styles;
      if (Array.isArray(styles)) {
        normal_styles = styles[0];
        important_styles = styles[1];
      } else {
        normal_styles = styles;
      }
      if (value) {
        value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
        var in_str = false;
        var in_apo = 0;
        var in_comment = false;
        var reserved_names = [];
        if (normal_styles) {
          reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
        }
        if (important_styles) {
          reserved_names.push(...Object.keys(important_styles).map(to_css_name));
        }
        var start_index = 0;
        var name_index = -1;
        const len = value.length;
        for (var i = 0; i < len; i++) {
          var c = value[i];
          if (in_comment) {
            if (c === "/" && value[i - 1] === "*") {
              in_comment = false;
            }
          } else if (in_str) {
            if (in_str === c) {
              in_str = false;
            }
          } else if (c === "/" && value[i + 1] === "*") {
            in_comment = true;
          } else if (c === '"' || c === "'") {
            in_str = c;
          } else if (c === "(") {
            in_apo++;
          } else if (c === ")") {
            in_apo--;
          }
          if (!in_comment && in_str === false && in_apo === 0) {
            if (c === ":" && name_index === -1) {
              name_index = i;
            } else if (c === ";" || i === len - 1) {
              if (name_index !== -1) {
                var name = to_css_name(value.substring(start_index, name_index).trim());
                if (!reserved_names.includes(name)) {
                  if (c !== ";") {
                    i++;
                  }
                  var property = value.substring(start_index, i).trim();
                  new_style += " " + property + ";";
                }
              }
              start_index = i + 1;
              name_index = -1;
            }
          }
        }
      }
      if (normal_styles) {
        new_style += append_styles(normal_styles);
      }
      if (important_styles) {
        new_style += append_styles(important_styles, true);
      }
      new_style = new_style.trim();
      return new_style === "" ? null : new_style;
    }
    return value == null ? null : String(value);
  }

  // node_modules/svelte/src/internal/client/dom/elements/class.js
  function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
    var prev = (
      /** @type {any} */
      dom[CLASS_CACHE]
    );
    if (hydrating || prev !== value || prev === void 0) {
      var next_class_name = to_class(value, hash2, next_classes);
      if (!hydrating || next_class_name !== dom.getAttribute("class")) {
        if (next_class_name == null) {
          dom.removeAttribute("class");
        } else if (is_html) {
          dom.className = next_class_name;
        } else {
          dom.setAttribute("class", next_class_name);
        }
      }
      dom[CLASS_CACHE] = value;
    } else if (next_classes && prev_classes !== next_classes) {
      for (var key2 in next_classes) {
        var is_present = !!next_classes[key2];
        if (prev_classes == null || is_present !== !!prev_classes[key2]) {
          dom.classList.toggle(key2, is_present);
        }
      }
    }
    return next_classes;
  }

  // node_modules/svelte/src/internal/client/dom/elements/style.js
  function update_styles(dom, prev = {}, next2, priority) {
    for (var key2 in next2) {
      var value = next2[key2];
      if (prev[key2] !== value) {
        if (next2[key2] == null) {
          dom.style.removeProperty(key2);
        } else {
          dom.style.setProperty(key2, value, priority);
        }
      }
    }
  }
  function set_style(dom, value, prev_styles, next_styles) {
    var prev = (
      /** @type {any} */
      dom[STYLE_CACHE]
    );
    if (hydrating || prev !== value) {
      var next_style_attr = to_style(value, next_styles);
      if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
        if (next_style_attr == null) {
          dom.removeAttribute("style");
        } else {
          dom.style.cssText = next_style_attr;
        }
      }
      dom[STYLE_CACHE] = value;
    } else if (next_styles) {
      if (Array.isArray(next_styles)) {
        update_styles(dom, prev_styles?.[0], next_styles[0]);
        update_styles(dom, prev_styles?.[1], next_styles[1], "important");
      } else {
        update_styles(dom, prev_styles, next_styles);
      }
    }
    return next_styles;
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
  function select_option(select, value, mounting = false) {
    if (select.multiple) {
      if (value == void 0) {
        return;
      }
      if (!is_array(value)) {
        return select_multiple_invalid_value();
      }
      for (var option of select.options) {
        option.selected = value.includes(get_option_value(option));
      }
      return;
    }
    for (option of select.options) {
      var option_value = get_option_value(option);
      if (is(option_value, value)) {
        option.selected = true;
        return;
      }
    }
    if (!mounting || value !== void 0) {
      select.selectedIndex = -1;
    }
  }
  function init_select(select) {
    var observer = new MutationObserver(() => {
      select_option(select, select.__value);
    });
    observer.observe(select, {
      // Listen to option element changes
      childList: true,
      subtree: true,
      // because of <optgroup>
      // Listen to option element value attribute changes
      // (doesn't get notified of select value changes,
      // because that property is not reflected as an attribute)
      attributes: true,
      attributeFilter: ["value"]
    });
    teardown(() => {
      observer.disconnect();
    });
  }
  function bind_select_value(select, get3, set2 = get3) {
    var batches = /* @__PURE__ */ new WeakSet();
    var mounting = true;
    listen_to_event_and_reset_event(select, "change", (is_reset) => {
      var query = is_reset ? "[selected]" : ":checked";
      var value;
      if (select.multiple) {
        value = [].map.call(select.querySelectorAll(query), get_option_value);
      } else {
        var selected_option = select.querySelector(query) ?? // will fall back to first non-disabled option if no option is selected
        select.querySelector("option:not([disabled])");
        value = selected_option && get_option_value(selected_option);
      }
      set2(value);
      select.__value = value;
      if (current_batch !== null) {
        batches.add(current_batch);
      }
    });
    effect(() => {
      var value = get3();
      if (select === document.activeElement) {
        var batch = (
          /** @type {Batch} */
          async_mode_flag ? previous_batch : current_batch
        );
        if (batches.has(batch)) {
          return;
        }
      }
      select_option(select, value, mounting);
      if (mounting && value === void 0) {
        var selected_option = select.querySelector(":checked");
        if (selected_option !== null) {
          value = get_option_value(selected_option);
          set2(value);
        }
      }
      select.__value = value;
      mounting = false;
    });
    init_select(select);
  }
  function get_option_value(option) {
    if ("__value" in option) {
      return option.__value;
    } else {
      return option.value;
    }
  }

  // node_modules/svelte/src/internal/client/dom/elements/attributes.js
  var IS_CUSTOM_ELEMENT = /* @__PURE__ */ Symbol("is custom element");
  var IS_HTML = /* @__PURE__ */ Symbol("is html");
  var LINK_TAG = IS_XHTML ? "link" : "LINK";
  var PROGRESS_TAG = IS_XHTML ? "progress" : "PROGRESS";
  function remove_input_defaults(input) {
    if (!hydrating) return;
    var already_removed = false;
    var remove_defaults = () => {
      if (already_removed) return;
      already_removed = true;
      if (input.hasAttribute("value")) {
        var value = input.value;
        set_attribute2(input, "value", null);
        input.value = value;
      }
      if (input.hasAttribute("checked")) {
        var checked = input.checked;
        set_attribute2(input, "checked", null);
        input.checked = checked;
      }
    };
    input[FORM_RESET_HANDLER] = remove_defaults;
    queue_micro_task(remove_defaults);
    add_form_reset_listener();
  }
  function set_value(element2, value) {
    var attributes = get_attributes(element2);
    if (attributes.value === (attributes.value = // treat null and undefined the same for the initial value
    value ?? void 0) || // @ts-expect-error
    // `progress` elements always need their value set when it's `0`
    element2.value === value && (value !== 0 || element2.nodeName !== PROGRESS_TAG)) {
      return;
    }
    element2.value = value ?? "";
  }
  function set_checked(element2, checked) {
    var attributes = get_attributes(element2);
    if (attributes.checked === (attributes.checked = // treat null and undefined the same for the initial value
    checked ?? void 0)) {
      return;
    }
    element2.checked = checked;
  }
  function set_attribute2(element2, attribute, value, skip_warning) {
    var attributes = get_attributes(element2);
    if (hydrating) {
      attributes[attribute] = element2.getAttribute(attribute);
      if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
        if (!skip_warning) {
          check_src_in_dev_hydration(element2, attribute, value ?? "");
        }
        return;
      }
    }
    if (attributes[attribute] === (attributes[attribute] = value)) return;
    if (attribute === "loading") {
      element2[LOADING_ATTR_SYMBOL] = value;
    }
    if (value == null) {
      element2.removeAttribute(attribute);
    } else if (typeof value !== "string" && get_setters(element2).includes(attribute)) {
      element2[attribute] = value;
    } else {
      element2.setAttribute(attribute, value);
    }
  }
  function get_attributes(element2) {
    var _a2;
    return (
      /** @type {Record<string | symbol, unknown>} **/
      /** @type {any} */
      element2[_a2 = ATTRIBUTES_CACHE] ?? (element2[_a2] = {
        [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
        [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
      })
    );
  }
  var setters_cache = /* @__PURE__ */ new Map();
  function get_setters(element2) {
    var cache_key = element2.getAttribute("is") || element2.nodeName;
    var setters = setters_cache.get(cache_key);
    if (setters) return setters;
    setters_cache.set(cache_key, setters = []);
    var descriptors;
    var proto = element2;
    var element_proto = Element.prototype;
    while (element_proto !== proto) {
      descriptors = get_descriptors(proto);
      for (var key2 in descriptors) {
        if (descriptors[key2].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
        key2 !== "innerHTML" && key2 !== "textContent" && key2 !== "innerText") {
          setters.push(key2);
        }
      }
      proto = get_prototype_of(proto);
    }
    return setters;
  }
  function check_src_in_dev_hydration(element2, attribute, value) {
    if (!dev_fallback_default) return;
    if (attribute === "srcset" && srcset_url_equal(element2, value)) return;
    if (src_url_equal(element2.getAttribute(attribute) ?? "", value)) return;
    hydration_attribute_changed(
      attribute,
      element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."),
      String(value)
    );
  }
  function src_url_equal(element_src, url) {
    if (element_src === url) return true;
    return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
  }
  function split_srcset(srcset) {
    return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
  }
  function srcset_url_equal(element2, srcset) {
    var element_urls = split_srcset(element2.srcset);
    var urls = split_srcset(srcset);
    return urls.length === element_urls.length && urls.every(
      ([url, width], i) => width === element_urls[i][1] && // We need to test both ways because Vite will create an a full URL with
      // `new URL(asset, import.meta.url).href` for the client when `base: './'`, and the
      // relative URLs inside srcset are not automatically resolved to absolute URLs by
      // browsers (in contrast to img.src). This means both SSR and DOM code could
      // contain relative or absolute URLs.
      (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0]))
    );
  }

  // node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
  function bind_value(input, get3, set2 = get3) {
    var batches = /* @__PURE__ */ new WeakSet();
    listen_to_event_and_reset_event(input, "input", async (is_reset) => {
      if (dev_fallback_default && input.type === "checkbox") {
        bind_invalid_checkbox_value();
      }
      var value = is_reset ? input.defaultValue : input.value;
      value = is_numberlike_input(input) ? to_number(value) : value;
      set2(value);
      if (current_batch !== null) {
        batches.add(current_batch);
      }
      await tick();
      if (value !== (value = get3())) {
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var length = input.value.length;
        input.value = value ?? "";
        if (end !== null) {
          var new_length = input.value.length;
          if (start === end && end === length && new_length > length) {
            input.selectionStart = new_length;
            input.selectionEnd = new_length;
          } else {
            input.selectionStart = start;
            input.selectionEnd = Math.min(end, new_length);
          }
        }
      }
    });
    if (
      // If we are hydrating and the value has since changed,
      // then use the updated value from the input instead.
      hydrating && input.defaultValue !== input.value || // If defaultValue is set, then value == defaultValue
      // TODO Svelte 6: remove input.value check and set to empty string?
      untrack(get3) == null && input.value
    ) {
      set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
      if (current_batch !== null) {
        batches.add(current_batch);
      }
    }
    render_effect(() => {
      if (dev_fallback_default && input.type === "checkbox") {
        bind_invalid_checkbox_value();
      }
      var value = get3();
      if (input === document.activeElement) {
        var batch = (
          /** @type {Batch} */
          async_mode_flag ? previous_batch : current_batch
        );
        if (batches.has(batch)) {
          return;
        }
      }
      if (is_numberlike_input(input) && value === to_number(input.value)) {
        return;
      }
      if (input.type === "date" && !value && !input.value) {
        return;
      }
      if (value !== input.value) {
        input.value = value ?? "";
      }
    });
  }
  function is_numberlike_input(input) {
    var type = input.type;
    return type === "number" || type === "range";
  }
  function to_number(value) {
    return value === "" ? null : +value;
  }

  // node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
  function init(immutable = false) {
    const context = (
      /** @type {ComponentContextLegacy} */
      component_context
    );
    const callbacks = context.l.u;
    if (!callbacks) return;
    let props = () => deep_read_state(context.s);
    if (immutable) {
      let version = 0;
      let prev = (
        /** @type {Record<string, any>} */
        {}
      );
      const d = derived(() => {
        let changed = false;
        const props2 = context.s;
        for (const key2 in props2) {
          if (props2[key2] !== prev[key2]) {
            prev[key2] = props2[key2];
            changed = true;
          }
        }
        if (changed) version++;
        return version;
      });
      props = () => get2(d);
    }
    if (callbacks.b.length) {
      user_pre_effect(() => {
        observe_all(context, props);
        run_all(callbacks.b);
      });
    }
    user_effect(() => {
      const fns = untrack(() => callbacks.m.map(run));
      return () => {
        for (const fn of fns) {
          if (typeof fn === "function") {
            fn();
          }
        }
      };
    });
    if (callbacks.a.length) {
      user_effect(() => {
        observe_all(context, props);
        run_all(callbacks.a);
      });
    }
  }
  function observe_all(context, props) {
    if (context.l.s) {
      for (const signal of context.l.s) get2(signal);
    }
    props();
  }

  // node_modules/svelte/src/internal/client/reactivity/props.js
  function prop(props, key2, flags2, fallback2) {
    var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
    var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
    var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
    var fallback_value = (
      /** @type {V} */
      fallback2
    );
    var fallback_dirty = true;
    var fallback_signal = (
      /** @type {Derived<V> | undefined} */
      void 0
    );
    var get_fallback = () => {
      if (lazy && runes) {
        fallback_signal ?? (fallback_signal = derived(
          /** @type {() => V} */
          fallback2
        ));
        return get2(fallback_signal);
      }
      if (fallback_dirty) {
        fallback_dirty = false;
        fallback_value = lazy ? untrack(
          /** @type {() => V} */
          fallback2
        ) : (
          /** @type {V} */
          fallback2
        );
      }
      return fallback_value;
    };
    let setter;
    if (bindable) {
      var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
      setter = get_descriptor(props, key2)?.set ?? (is_entry_props && key2 in props ? (v) => props[key2] = v : void 0);
    }
    var initial_value;
    var is_store_sub = false;
    if (bindable) {
      [initial_value, is_store_sub] = capture_store_binding(() => (
        /** @type {V} */
        props[key2]
      ));
    } else {
      initial_value = /** @type {V} */
      props[key2];
    }
    if (initial_value === void 0 && fallback2 !== void 0) {
      initial_value = get_fallback();
      if (setter) {
        if (runes) props_invalid_value(key2);
        setter(initial_value);
      }
    }
    var getter;
    if (runes) {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key2]
        );
        if (value === void 0) return get_fallback();
        fallback_dirty = true;
        return value;
      };
    } else {
      getter = () => {
        var value = (
          /** @type {V} */
          props[key2]
        );
        if (value !== void 0) {
          fallback_value = /** @type {V} */
          void 0;
        }
        return value === void 0 ? fallback_value : value;
      };
    }
    if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
      return getter;
    }
    if (setter) {
      var legacy_parent = props.$$legacy;
      return (
        /** @type {() => V} */
        (function(value, mutation) {
          if (arguments.length > 0) {
            if (!runes || !mutation || legacy_parent || is_store_sub) {
              setter(mutation ? getter() : value);
            }
            return value;
          }
          return getter();
        })
      );
    }
    var overridden = false;
    var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
      overridden = false;
      return getter();
    });
    if (dev_fallback_default) {
      d.label = key2;
    }
    if (bindable) get2(d);
    var parent_effect = (
      /** @type {Effect} */
      active_effect
    );
    return (
      /** @type {() => V} */
      (function(value, mutation) {
        if (arguments.length > 0) {
          const new_value = mutation ? get2(d) : runes && bindable ? proxy(value) : value;
          set(d, new_value);
          overridden = true;
          if (fallback_value !== void 0) {
            fallback_value = new_value;
          }
          return value;
        }
        if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
          return d.v;
        }
        return get2(d);
      })
    );
  }

  // node_modules/svelte/src/legacy/legacy-client.js
  function createClassComponent(options) {
    return new Svelte4Component(options);
  }
  var _events, _instance;
  var Svelte4Component = class {
    /**
     * @param {ComponentConstructorOptions & {
     *  component: any;
     * }} options
     */
    constructor(options) {
      /** @type {any} */
      __privateAdd(this, _events);
      /** @type {Record<string, any>} */
      __privateAdd(this, _instance);
      var sources = /* @__PURE__ */ new Map();
      var add_source = (key2, value) => {
        var s = mutable_source(value, false, false);
        sources.set(key2, s);
        return s;
      };
      const props = new Proxy(
        { ...options.props || {}, $$events: {} },
        {
          get(target2, prop2) {
            return get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target2, prop2)));
          },
          has(target2, prop2) {
            if (prop2 === LEGACY_PROPS) return true;
            get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target2, prop2)));
            return Reflect.has(target2, prop2);
          },
          set(target2, prop2, value) {
            set(sources.get(prop2) ?? add_source(prop2, value), value);
            return Reflect.set(target2, prop2, value);
          }
        }
      );
      __privateSet(this, _instance, (options.hydrate ? hydrate : mount)(options.component, {
        target: options.target,
        anchor: options.anchor,
        props,
        context: options.context,
        intro: options.intro ?? false,
        recover: options.recover,
        transformError: options.transformError
      }));
      if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
        flushSync();
      }
      __privateSet(this, _events, props.$$events);
      for (const key2 of Object.keys(__privateGet(this, _instance))) {
        if (key2 === "$set" || key2 === "$destroy" || key2 === "$on") continue;
        define_property(this, key2, {
          get() {
            return __privateGet(this, _instance)[key2];
          },
          /** @param {any} value */
          set(value) {
            __privateGet(this, _instance)[key2] = value;
          },
          enumerable: true
        });
      }
      __privateGet(this, _instance).$set = /** @param {Record<string, any>} next */
      (next2) => {
        Object.assign(props, next2);
      };
      __privateGet(this, _instance).$destroy = () => {
        unmount(__privateGet(this, _instance));
      };
    }
    /** @param {Record<string, any>} props */
    $set(props) {
      __privateGet(this, _instance).$set(props);
    }
    /**
     * @param {string} event
     * @param {(...args: any[]) => any} callback
     * @returns {any}
     */
    $on(event2, callback) {
      __privateGet(this, _events)[event2] = __privateGet(this, _events)[event2] || [];
      const cb = (...args) => callback.call(this, ...args);
      __privateGet(this, _events)[event2].push(cb);
      return () => {
        __privateGet(this, _events)[event2] = __privateGet(this, _events)[event2].filter(
          /** @param {any} fn */
          (fn) => fn !== cb
        );
      };
    }
    $destroy() {
      __privateGet(this, _instance).$destroy();
    }
  };
  _events = new WeakMap();
  _instance = new WeakMap();

  // node_modules/svelte/src/internal/client/dom/elements/custom-element.js
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      /**
       * @param {*} $$componentCtor
       * @param {*} $$slots
       * @param {ShadowRootInit | undefined} shadow_root_init
       */
      constructor($$componentCtor, $$slots, shadow_root_init) {
        super();
        /** The Svelte component constructor */
        __publicField(this, "$$ctor");
        /** Slots */
        __publicField(this, "$$s");
        /** @type {any} The Svelte component instance */
        __publicField(this, "$$c");
        /** Whether or not the custom element is connected */
        __publicField(this, "$$cn", false);
        /** @type {Record<string, any>} Component props data */
        __publicField(this, "$$d", {});
        /** `true` if currently in the process of reflecting component props back to attributes */
        __publicField(this, "$$r", false);
        /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
        __publicField(this, "$$p_d", {});
        /** @type {Record<string, EventListenerOrEventListenerObject[]>} Event listeners */
        __publicField(this, "$$l", {});
        /** @type {Map<EventListenerOrEventListenerObject, Function>} Event listener unsubscribe functions */
        __publicField(this, "$$l_u", /* @__PURE__ */ new Map());
        /** @type {any} The managed render effect for reflecting attributes */
        __publicField(this, "$$me");
        /** @type {ShadowRoot | null} The ShadowRoot of the custom element */
        __publicField(this, "$$shadowRoot", null);
        this.$$ctor = $$componentCtor;
        this.$$s = $$slots;
        if (shadow_root_init) {
          this.$$shadowRoot = this.attachShadow(shadow_root_init);
        }
      }
      /**
       * @param {string} type
       * @param {EventListenerOrEventListenerObject} listener
       * @param {boolean | AddEventListenerOptions} [options]
       */
      addEventListener(type, listener, options) {
        this.$$l[type] = this.$$l[type] || [];
        this.$$l[type].push(listener);
        if (this.$$c) {
          const unsub = this.$$c.$on(type, listener);
          this.$$l_u.set(listener, unsub);
        }
        super.addEventListener(type, listener, options);
      }
      /**
       * @param {string} type
       * @param {EventListenerOrEventListenerObject} listener
       * @param {boolean | AddEventListenerOptions} [options]
       */
      removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
        if (this.$$c) {
          const unsub = this.$$l_u.get(listener);
          if (unsub) {
            unsub();
            this.$$l_u.delete(listener);
          }
        }
      }
      async connectedCallback() {
        this.$$cn = true;
        if (!this.$$c) {
          let create_slot = function(name) {
            return (anchor) => {
              const slot2 = create_element("slot");
              if (name !== "default") slot2.name = name;
              append(anchor, slot2);
            };
          };
          await Promise.resolve();
          if (!this.$$cn || this.$$c) {
            return;
          }
          const $$slots = {};
          const existing_slots = get_custom_elements_slots(this);
          for (const name of this.$$s) {
            if (name in existing_slots) {
              if (name === "default" && !this.$$d.children) {
                this.$$d.children = create_slot(name);
                $$slots.default = true;
              } else {
                $$slots[name] = create_slot(name);
              }
            }
          }
          for (const attribute of this.attributes) {
            const name = this.$$g_p(attribute.name);
            if (!(name in this.$$d)) {
              this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
            }
          }
          for (const key2 in this.$$p_d) {
            if (!(key2 in this.$$d) && this[key2] !== void 0) {
              this.$$d[key2] = this[key2];
              delete this[key2];
            }
          }
          this.$$c = createClassComponent({
            component: this.$$ctor,
            target: this.$$shadowRoot || this,
            props: {
              ...this.$$d,
              $$slots,
              $$host: this
            }
          });
          this.$$me = effect_root(() => {
            render_effect(() => {
              this.$$r = true;
              for (const key2 of object_keys(this.$$c)) {
                if (!this.$$p_d[key2]?.reflect) continue;
                this.$$d[key2] = this.$$c[key2];
                const attribute_value = get_custom_element_value(
                  key2,
                  this.$$d[key2],
                  this.$$p_d,
                  "toAttribute"
                );
                if (attribute_value == null) {
                  this.removeAttribute(this.$$p_d[key2].attribute || key2);
                } else {
                  this.setAttribute(this.$$p_d[key2].attribute || key2, attribute_value);
                }
              }
              this.$$r = false;
            });
          });
          for (const type in this.$$l) {
            for (const listener of this.$$l[type]) {
              const unsub = this.$$c.$on(type, listener);
              this.$$l_u.set(listener, unsub);
            }
          }
          this.$$l = {};
        }
      }
      // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
      // and setting attributes through setAttribute etc, this is helpful
      /**
       * @param {string} attr
       * @param {string} _oldValue
       * @param {string} newValue
       */
      attributeChangedCallback(attr2, _oldValue, newValue) {
        if (this.$$r) return;
        attr2 = this.$$g_p(attr2);
        this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
        this.$$c?.$set({ [attr2]: this.$$d[attr2] });
      }
      disconnectedCallback() {
        this.$$cn = false;
        Promise.resolve().then(() => {
          if (!this.$$cn && this.$$c) {
            this.$$c.$destroy();
            this.$$me();
            this.$$c = void 0;
          }
        });
      }
      /**
       * @param {string} attribute_name
       */
      $$g_p(attribute_name) {
        return object_keys(this.$$p_d).find(
          (key2) => this.$$p_d[key2].attribute === attribute_name || !this.$$p_d[key2].attribute && key2.toLowerCase() === attribute_name
        ) || attribute_name;
      }
    };
  }
  function get_custom_element_value(prop2, value, props_definition, transform) {
    const type = props_definition[prop2]?.type;
    value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
    if (!transform || !props_definition[prop2]) {
      return value;
    } else if (transform === "toAttribute") {
      switch (type) {
        case "Object":
        case "Array":
          return value == null ? null : JSON.stringify(value);
        case "Boolean":
          return value ? "" : null;
        case "Number":
          return value == null ? null : value;
        default:
          return value;
      }
    } else {
      switch (type) {
        case "Object":
        case "Array":
          return value && JSON.parse(value);
        case "Boolean":
          return value;
        // conversion already handled above
        case "Number":
          return value != null ? +value : value;
        default:
          return value;
      }
    }
  }
  function get_custom_elements_slots(element2) {
    const result = {};
    element2.childNodes.forEach((node) => {
      result[
        /** @type {Element} node */
        node.slot || "default"
      ] = true;
    });
    return result;
  }

  // node_modules/svelte/src/version.js
  var PUBLIC_VERSION = "5";

  // node_modules/svelte/src/internal/disclose-version.js
  var _a;
  if (typeof window !== "undefined") {
    ((_a = window.__svelte ?? (window.__svelte = {})).v ?? (_a.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
  }

  // node_modules/svelte/src/internal/flags/legacy.js
  enable_legacy_mode_flag();

  // _states/tabs.js
  var tabs = [
    { id: "browse", label: "Browse" },
    { id: "indexer", label: "Indexer" },
    { id: "search", label: "Search" },
    { id: "duplicates", label: "Duplicates" },
    { id: "manage", label: "Manage" },
    { id: "queue", label: "Queue" }
  ];
  var tabs_default = tabs;

  // _states/activeTab.js
  var activeTab = writable("browse");
  function restoreActiveTab(storage) {
    try {
      return storage?.getItem("indexer.activeTab") || "browse";
    } catch (_) {
      return "browse";
    }
  }
  function setActiveTab(tab, storage) {
    activeTab.set(tab || "browse");
    try {
      storage?.setItem("indexer.activeTab", tab || "browse");
    } catch (_) {
    }
  }
  function bindActiveTab(windowRef, storage) {
    const initial = restoreActiveTab(storage);
    activeTab.set(initial);
    const handler = (event2) => {
      const tab = event2?.detail?.tab || "browse";
      setActiveTab(tab, storage);
    };
    windowRef?.addEventListener?.("indexer:tab", handler);
    return () => windowRef?.removeEventListener?.("indexer:tab", handler);
  }

  // _states/uiCommands.js
  function emit(name, detail = {}) {
    if (typeof window === "undefined" || !window.dispatchEvent) return;
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
  function requestSwitchTab(tab) {
    emit("indexer:uiCommand", { scope: "tab", tab });
  }
  function requestSwitchManageTab(tab) {
    emit("indexer:uiCommand", { scope: "manageTab", tab });
  }
  function requestManageAction(action2, detail = {}) {
    emit("indexer:uiCommand", { scope: "manageAction", action: action2, ...detail });
  }
  function requestManageFormPatch(patch = {}) {
    emit("indexer:manageForm", { patch });
  }

  // _components/TabBar.svelte
  var root_1 = from_html(`<button> </button>`);
  var root = from_html(`<div class="tabs"></div>`);
  function TabBar($$anchor, $$props) {
    push($$props, false);
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    onMount(() => {
      cleanup = bindActiveTab(window, localStorage);
      return () => cleanup();
    });
    function clickTab(tab, event2) {
      setActiveTab(tab.id, localStorage);
      requestSwitchTab(tab.id);
    }
    init();
    var div = root();
    each(div, 5, () => tabs_default, index, ($$anchor2, tab) => {
      var button = root_1();
      let classes;
      var text2 = child(button, true);
      reset(button);
      template_effect(() => {
        classes = set_class(button, 1, "tabBtn", null, classes, { active: $activeTab() === get2(tab).id });
        set_attribute2(button, "data-tab", get2(tab).id);
        set_text(text2, get2(tab).label);
      });
      delegated("click", button, (event2) => clickTab(get2(tab), event2));
      append($$anchor2, button);
    });
    reset(div);
    append($$anchor, div);
    pop();
    $$cleanup();
  }
  delegate(["click"]);

  // _components/BrowseTreeNode.svelte
  var root_2 = from_html(`<div class="progressBar" style="margin:4px 0 6px 28px"><div class="progressFill"></div></div>`);
  var root_3 = from_html(`<div class="children"></div>`);
  var root2 = from_html(`<div class="treeNode"><div><span class="treeIndent"></span> <span class="twisty"> </span> <span class="treeName"> </span> <span class="treeMeta"><!> <!></span></div> <!> <!></div>`);
  function BrowseTreeNode($$anchor, $$props) {
    push($$props, false);
    const path = mutable_source();
    const isExpanded = mutable_source();
    const children = mutable_source();
    const isActive = mutable_source();
    const rootPct = mutable_source();
    let item = prop($$props, "item", 8);
    let depth = prop($$props, "depth", 8, 0);
    let expanded = prop($$props, "expanded", 8);
    let loaded = prop($$props, "loaded", 8);
    let selectedPath = prop($$props, "selectedPath", 8, "");
    let maxRootBytes = prop($$props, "maxRootBytes", 8, 0);
    let onSelect = prop($$props, "onSelect", 8, () => {
    });
    let onToggle = prop($$props, "onToggle", 8, () => {
    });
    let formatBytesHtml2 = prop($$props, "formatBytesHtml", 8, (bytes) => String(bytes || 0));
    function fdCounts(entry) {
      if (entry?.isDir) {
        return `${entry.fileCount || 0} F \u2022 ${entry.dirCount || 0} D`;
      }
      return "1 F";
    }
    legacy_pre_effect(() => deep_read_state(item()), () => {
      set(path, item()?.path || "");
    });
    legacy_pre_effect(() => (deep_read_state(expanded()), get2(path)), () => {
      set(isExpanded, expanded()?.has?.(get2(path)));
    });
    legacy_pre_effect(() => (deep_read_state(loaded()), get2(path)), () => {
      set(children, loaded()?.[get2(path)] || []);
    });
    legacy_pre_effect(() => (deep_read_state(selectedPath()), get2(path)), () => {
      set(isActive, selectedPath() === get2(path));
    });
    legacy_pre_effect(
      () => (deep_read_state(depth()), deep_read_state(maxRootBytes()), deep_read_state(item())),
      () => {
        set(rootPct, depth() === 0 && maxRootBytes() > 0 ? Number(item()?.size || 0) / maxRootBytes() * 100 : 0);
      }
    );
    legacy_pre_effect_reset();
    init();
    var div = root2();
    var div_1 = child(div);
    let classes;
    var span = child(div_1);
    var span_1 = sibling(span, 2);
    var text2 = child(span_1, true);
    reset(span_1);
    var span_2 = sibling(span_1, 2);
    var text_1 = child(span_2, true);
    reset(span_2);
    var span_3 = sibling(span_2, 2);
    var node = child(span_3);
    {
      var consequent = ($$anchor2) => {
        var text_2 = text();
        template_effect(($0) => set_text(text_2, `${$0 ?? ""} \u2022`), [
          () => (deep_read_state(item()), untrack(() => fdCounts(item())))
        ]);
        append($$anchor2, text_2);
      };
      if_block(node, ($$render) => {
        if (deep_read_state(item()), untrack(() => item()?.isDir)) $$render(consequent);
      });
    }
    var node_1 = sibling(node, 2);
    html(node_1, () => (deep_read_state(formatBytesHtml2()), deep_read_state(item()), untrack(() => formatBytesHtml2()(item()?.size || 0))));
    reset(span_3);
    reset(div_1);
    var node_2 = sibling(div_1, 2);
    {
      var consequent_1 = ($$anchor2) => {
        var div_2 = root_2();
        var div_3 = child(div_2);
        reset(div_2);
        template_effect(($0) => set_style(div_3, $0), [
          () => (get2(rootPct), untrack(() => `width:${get2(rootPct).toFixed(2)}%`))
        ]);
        append($$anchor2, div_2);
      };
      if_block(node_2, ($$render) => {
        if (depth() === 0) $$render(consequent_1);
      });
    }
    var node_3 = sibling(node_2, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var div_4 = root_3();
        each(div_4, 5, () => get2(children), index, ($$anchor3, child2) => {
          var fragment_1 = comment();
          var node_4 = first_child(fragment_1);
          {
            let $0 = derived_safe_equal(() => depth() + 1);
            BrowseTreeNode(node_4, {
              get item() {
                return get2(child2);
              },
              get depth() {
                return get2($0);
              },
              get expanded() {
                return expanded();
              },
              get loaded() {
                return loaded();
              },
              get selectedPath() {
                return selectedPath();
              },
              get maxRootBytes() {
                return maxRootBytes();
              },
              get onSelect() {
                return onSelect();
              },
              get onToggle() {
                return onToggle();
              },
              get formatBytesHtml() {
                return formatBytesHtml2();
              }
            });
          }
          append($$anchor3, fragment_1);
        });
        reset(div_4);
        append($$anchor2, div_4);
      };
      if_block(node_3, ($$render) => {
        if (get2(isExpanded)) $$render(consequent_2);
      });
    }
    reset(div);
    template_effect(() => {
      classes = set_class(div_1, 1, "treeRow", null, classes, { active: get2(isActive) });
      set_style(span, `width:${depth() * 14}px`);
      set_text(text2, get2(isExpanded) ? "\u25BE" : "\u25B8");
      set_text(text_1, (deep_read_state(item()), untrack(() => item()?.base || "")));
    });
    delegated("click", div_1, () => onSelect()(get2(path)));
    delegated("click", span_1, (event2) => {
      event2.stopPropagation();
      onToggle()(get2(path));
    });
    append($$anchor, div);
    pop();
  }
  delegate(["click"]);

  // jsApi.GEN.js
  var IndexerApi = {
    status: "/api/status",
    reindex: "/api/reindex",
    browse: "/api/browse",
    open: "/api/open",
    duplicates: "/api/duplicates",
    search: "/api/search",
    suggest: "/api/suggest",
    suggestSubtitle: "/api/suggest-subtitle",
    scanSubtitles: "/api/scan-subtitles",
    categorizePreview: "/api/categorize/preview",
    move: "/api/move",
    rename: "/api/rename",
    delete: "/api/delete",
    manageQueue: "/api/manage/queue",
    manageCancel: "/api/manage/cancel",
    manageRetry: "/api/manage/retry",
    manageStatus: "/api/manage/status",
    manageHistory: "/api/manage/history"
  };
  var jsApi_GEN_default = IndexerApi;
  (function(global) {
    global.IndexerApi = IndexerApi;
  })(typeof window !== "undefined" ? window : globalThis);

  // _helpers/xNotifier.js
  function showToast(message, doc2 = document) {
    const wrap = doc2.getElementById("toastWrap");
    if (!wrap) return;
    const el = doc2.createElement("div");
    el.className = "toast";
    const text2 = String(message);
    if (/(\binvalid\b|\berror\b|\bfailed\b|\bfail\b|\bpassword\b|\brequired\b|\boutside\b|\bunsupported\b|\bcannot\b|\bmissing\b)/i.test(text2)) {
      el.classList.add("toastError");
    } else {
      el.classList.add("toastSuccess");
    }
    el.textContent = text2;
    wrap.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 5e3);
  }

  // _helpers/xFormatter.js
  function escapeHtml2(text2) {
    return String(text2 || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
  function valueOrDash(value) {
    return value ? escapeHtml2(value) : '<span style="color:var(--muted)">-</span>';
  }
  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx++;
    }
    return value.toFixed(idx === 0 ? 0 : 2) + " " + units[idx];
  }
  function formatBytesHtml(bytes) {
    if (!bytes) return '<span class="unit-b">0 B</span>';
    const units = ["B", "KB", "MB", "GB", "TB"];
    const classes = ["unit-b", "unit-kb", "unit-mb", "unit-gb", "unit-tb"];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx++;
    }
    return '<span class="' + classes[idx] + '">' + value.toFixed(idx === 0 ? 0 : 2) + " " + units[idx] + "</span>";
  }
  function formatAgeByMode(iso, useRelative) {
    if (!useRelative || !iso) return escapeHtml2(iso || "");
    const then = new Date(iso);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now - then;
    const dayMs = 24 * 60 * 60 * 1e3;
    if (diffMs < dayMs) {
      const hours = Math.floor(diffMs / (60 * 60 * 1e3));
      const mins = Math.floor(diffMs % (60 * 60 * 1e3) / (60 * 1e3));
      return '<span class="ageDay">' + String(hours).padStart(2, "0") + ":" + String(mins).padStart(2, "0") + "</span>";
    }
    const days = diffMs / dayMs;
    if (days >= 365) {
      return '<span class="ageYear">' + (days / 365).toFixed(2) + " Y</span>";
    }
    return '<span class="ageDay">' + Math.floor(days) + " D</span>";
  }

  // _components/BrowseTabPane.svelte
  var root_22 = from_html(`<div class="empty"> </div>`);
  var root_32 = from_html(`<div class="empty">Loading roots...</div>`);
  var root_4 = from_html(`<div class="empty">No configured roots</div>`);
  var root_7 = from_html(`<th class="clickable"> </th>`);
  var root_8 = from_html(`<tr><td colspan="5" class="empty"> </td></tr>`);
  var root_9 = from_html(`<tr><td colspan="5" class="empty">Loading directory...</td></tr>`);
  var root_10 = from_html(`<tr><td colspan="5" class="empty">Empty directory</td></tr>`);
  var root_13 = from_html(`<button class="ghost iconBtn" title="Open directory">\u2197</button>`);
  var root_14 = from_html(`<span class="fdFile tooltipish" title="descendant files"> </span> <span class="fdDir tooltipish" title="descendant directories"> </span>`, 1);
  var root_15 = from_html(`<span class="fdFile">1 F</span>`);
  var root_12 = from_html(`<tr><td><div class="nameCell"><span class="nameLabel cellEllipsis"> </span> <span class="rowActions"><button class="ghost iconBtn">\u29C9</button> <button class="ghost iconBtn" title="Rename">\u270E</button></span></div></td><td><span class="typeCell"><span> </span> <button class="ghost iconBtn" title="Open externally">\u2934</button> <!></span></td><td><!></td><td></td><td class="mono"></td></tr>`);
  var root_16 = from_html(`<section id="tab-browse"><div class="workspace"><div class="treePane"><div class="treeHeader"><h2>Roots</h2> <div class="row" style="margin:0"><button class="ghost">Reload</button></div></div> <div class="treeScroll"><!></div></div> <div class="resultPane"><div class="resultHeader"><div><h2>Directory Listing</h2> <div class="mono" style="color:var(--muted); margin-top:4px"> </div></div> <div class="row" style="margin:0"><button class="ghost">Back</button> <button class="ghost">Forward</button> <button class="ghost">Up</button> <input placeholder="Filter by name" style="max-width:180px"/> <button class="ghost"> </button></div></div> <div class="resultScroll"><table style="table-layout:fixed"><thead><tr></tr></thead><tbody><!></tbody></table></div></div></div></section>`);
  function BrowseTabPane($$anchor, $$props) {
    push($$props, false);
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    const maxRootBytes = mutable_source();
    const filteredRows = mutable_source();
    let roots = mutable_source([]);
    let expanded = mutable_source(/* @__PURE__ */ new Set());
    let loaded = mutable_source({});
    let selectedPath = mutable_source("");
    let history = mutable_source([]);
    let historyIndex = mutable_source(-1);
    let currentRows = mutable_source([]);
    let sortBy = "isDir";
    let sortDesc = false;
    let relativeTime = mutable_source(true);
    let filterText = mutable_source("");
    let loadingRoots = mutable_source(true);
    let loadingRows = mutable_source(false);
    let treeError = mutable_source("");
    let tableError = mutable_source("");
    const headers = [
      { field: "base", label: "Name", width: "47%" },
      { field: "isDir", label: "Type", width: "8%" },
      { field: "contents", label: "Contents", width: "12%" },
      { field: "size", label: "Size", width: "10%" },
      { field: "modifiedAt", label: "Modified", width: "13%" }
    ];
    function apiUrl(key2, fallback2) {
      return jsApi_GEN_default[key2] || fallback2;
    }
    function toast(message) {
      if (!message) return;
      showToast(String(message));
    }
    function relativeTimeButtonText2(enabled) {
      return "Relative Time: " + (enabled ? "On" : "Off");
    }
    function sortHeaderText2(label, field) {
      return label + (sortBy === field ? sortDesc ? " \u2193" : " \u2191" : "");
    }
    function compareByField2(a, b) {
      let av;
      let bv;
      switch (sortBy) {
        case "base":
          av = a.base || "";
          bv = b.base || "";
          break;
        case "contents":
          av = (a.fileCount || 0) + (a.dirCount || 0);
          bv = (b.fileCount || 0) + (b.dirCount || 0);
          break;
        case "size":
          av = a.size || 0;
          bv = b.size || 0;
          break;
        case "isDir":
          av = a.isDir ? 1 : 0;
          bv = b.isDir ? 1 : 0;
          break;
        case "modifiedAt":
        default:
          av = a.modifiedAt || "";
          bv = b.modifiedAt || "";
          break;
      }
      if (av < bv) return sortDesc ? 1 : -1;
      if (av > bv) return sortDesc ? -1 : 1;
      return String(a.base || "").localeCompare(String(b.base || ""));
    }
    function parentDir2(path) {
      const clean = String(path || "").trim().replace(/\/+$/, "");
      if (!clean) return "";
      const idx = clean.lastIndexOf("/");
      if (idx <= 0) return clean;
      return clean.slice(0, idx);
    }
    function browseTarget2(path, isDir) {
      return Number(isDir) === 1 || isDir === true ? path : parentDir2(path);
    }
    function needsPasswordPrompt() {
      const host = String(window.location.hostname || "").trim().toLowerCase();
      return !(host === "localhost" || host === "127.0.0.1" || host === "::1");
    }
    async function getJSON(url, options = {}) {
      const res = await fetch(url, options);
      const text2 = await res.text();
      if (!res.ok) throw new Error(text2 || "HTTP " + res.status);
      return text2 ? JSON.parse(text2) : {};
    }
    function syncBrowseState() {
      window.dispatchEvent(new CustomEvent("indexer:browseState", {
        detail: {
          roots: get2(roots),
          selectedPath: get2(selectedPath),
          history: get2(history),
          historyIndex: get2(historyIndex),
          currentRows: get2(currentRows),
          relativeTime: get2(relativeTime),
          sortBy,
          sortDesc
        }
      }));
    }
    async function reloadTree() {
      set(loadingRoots, true);
      set(treeError, "");
      set(expanded, /* @__PURE__ */ new Set());
      set(loaded, {});
      set(selectedPath, "");
      set(history, []);
      set(historyIndex, -1);
      set(currentRows, []);
      syncBrowseState();
      try {
        const rows = await getJSON(apiUrl("browse", "/api/browse"));
        set(roots, Array.isArray(rows) ? rows : []);
        if (get2(roots).length) {
          await selectPath(get2(roots)[0].path);
        }
      } catch (err) {
        set(roots, []);
        set(treeError, String(err?.message || err));
        toast(get2(treeError));
      } finally {
        set(loadingRoots, false);
        syncBrowseState();
      }
    }
    async function toggleNode(path) {
      if (get2(expanded).has(path)) {
        set(expanded, new Set([...get2(expanded)].filter((item) => item !== path)));
        return;
      }
      set(expanded, /* @__PURE__ */ new Set([...get2(expanded), path]));
      if (!get2(loaded)[path]) {
        try {
          const rows = await getJSON(apiUrl("browse", "/api/browse") + "?path=" + encodeURIComponent(path));
          set(loaded, {
            ...get2(loaded),
            [path]: (rows || []).filter((item) => item.isDir)
          });
        } catch (err) {
          toast(String(err?.message || err));
        }
      }
    }
    async function selectPath(path, options = {}) {
      const pushHistory = options.pushHistory !== false;
      if (pushHistory) {
        let nextHistory = get2(history);
        let nextIndex = get2(historyIndex);
        if (nextIndex < nextHistory.length - 1) {
          nextHistory = nextHistory.slice(0, nextIndex + 1);
        }
        if (nextHistory[nextHistory.length - 1] !== path) {
          nextHistory = [...nextHistory, path];
          nextIndex = nextHistory.length - 1;
        }
        set(history, nextHistory);
        set(historyIndex, nextIndex);
      }
      set(selectedPath, path);
      set(loadingRows, true);
      set(tableError, "");
      try {
        const rows = await getJSON(apiUrl("browse", "/api/browse") + "?path=" + encodeURIComponent(path));
        set(currentRows, Array.isArray(rows) ? rows : []);
      } catch (err) {
        set(currentRows, []);
        set(tableError, String(err?.message || err));
        toast(get2(tableError));
      } finally {
        set(loadingRows, false);
        syncBrowseState();
      }
    }
    function setSort(field) {
      if (sortBy === field) {
        sortDesc = !sortDesc;
      } else {
        sortBy = field;
        sortDesc = false;
      }
      syncBrowseState();
    }
    function browseUp() {
      const parent = parentDir2(get2(selectedPath));
      if (!parent || parent === get2(selectedPath)) return;
      selectPath(parent);
    }
    function browseBack() {
      if (get2(historyIndex) <= 0) return;
      set(historyIndex, get2(historyIndex) - 1);
      selectPath(get2(history)[get2(historyIndex)], { pushHistory: false });
    }
    function browseForward() {
      if (get2(historyIndex) >= get2(history).length - 1) return;
      set(historyIndex, get2(historyIndex) + 1);
      selectPath(get2(history)[get2(historyIndex)], { pushHistory: false });
    }
    async function copyPath(path, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      try {
        await navigator.clipboard.writeText(path || "");
        toast("Copied path");
      } catch (err) {
        toast("Copy failed: " + err);
      }
    }
    async function openExternal(path, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      try {
        const url = new URL(apiUrl("open", "/api/open"), window.location.origin);
        url.searchParams.set("path", path || "");
        const res = await getJSON(url.toString());
        toast(res?.message || "Opened file");
      } catch (err) {
        toast("Open failed: " + err);
      }
    }
    async function renameFromBrowse(path) {
      const oldPath = String(path || "").trim();
      if (!oldPath) {
        toast("Rename path is required");
        return;
      }
      const nextPath = window.prompt("Rename to path", oldPath);
      if (!nextPath) return;
      let password = "";
      if (needsPasswordPrompt()) {
        password = window.prompt("Manage password?") || "";
        if (!password) {
          toast("Password is required");
          return;
        }
      }
      try {
        const res = await getJSON(apiUrl("rename", "/api/rename"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, oldPath, newPath: nextPath, confirm: "CONFIRM" })
        });
        toast(res?.message || "Renamed");
        await selectPath(get2(selectedPath) || parentDir2(oldPath), { pushHistory: false });
      } catch (err) {
        toast(String(err?.message || err));
      }
    }
    async function showInBrowse(path, isDir, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      const target2 = browseTarget2(path, isDir);
      if (!target2) {
        toast("No browse target for this row");
        return;
      }
      setActiveTab("browse", localStorage);
      window.dispatchEvent(new CustomEvent("indexer:tab", { detail: { tab: "browse" } }));
      await selectPath(target2);
    }
    function handleBrowseCommand(event2) {
      const detail = event2?.detail || {};
      switch (detail.kind) {
        case "reload":
          reloadTree();
          break;
        case "toggleNode":
          if (detail.path) toggleNode(detail.path);
          break;
        case "selectPath":
          if (detail.path) selectPath(detail.path, detail.options || {});
          break;
        case "show":
          showInBrowse(detail.path || "", detail.isDir, null);
          break;
        case "up":
          browseUp();
          break;
        case "back":
          browseBack();
          break;
        case "forward":
          browseForward();
          break;
      }
    }
    onMount(() => {
      window.addEventListener("indexer:browseCommand", handleBrowseCommand);
      reloadTree();
    });
    onDestroy(() => {
      window.removeEventListener("indexer:browseCommand", handleBrowseCommand);
    });
    legacy_pre_effect(() => get2(roots), () => {
      set(maxRootBytes, get2(roots).reduce((mx, root14) => Math.max(mx, Number(root14.size || 0)), 0));
    });
    legacy_pre_effect(() => (get2(currentRows), get2(filterText)), () => {
      set(filteredRows, get2(currentRows).filter((item) => {
        const filter = get2(filterText).trim().toLowerCase();
        if (!filter) return true;
        return String(item.base || "").toLowerCase().includes(filter);
      }).slice().sort(compareByField2));
    });
    legacy_pre_effect_reset();
    init();
    var section = root_16();
    let classes;
    var div = child(section);
    var div_1 = child(div);
    var div_2 = child(div_1);
    var div_3 = sibling(child(div_2), 2);
    var button = child(div_3);
    reset(div_3);
    reset(div_2);
    var div_4 = sibling(div_2, 2);
    var node = child(div_4);
    {
      var consequent = ($$anchor2) => {
        var div_5 = root_22();
        var text_1 = child(div_5, true);
        reset(div_5);
        template_effect(() => set_text(text_1, get2(treeError)));
        append($$anchor2, div_5);
      };
      var consequent_1 = ($$anchor2) => {
        var div_6 = root_32();
        append($$anchor2, div_6);
      };
      var consequent_2 = ($$anchor2) => {
        var div_7 = root_4();
        append($$anchor2, div_7);
      };
      var alternate = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        each(node_1, 1, () => get2(roots), index, ($$anchor3, root14) => {
          BrowseTreeNode($$anchor3, {
            get item() {
              return get2(root14);
            },
            depth: 0,
            get expanded() {
              return get2(expanded);
            },
            get loaded() {
              return get2(loaded);
            },
            get selectedPath() {
              return get2(selectedPath);
            },
            get maxRootBytes() {
              return get2(maxRootBytes);
            },
            onSelect: selectPath,
            onToggle: toggleNode,
            get formatBytesHtml() {
              return formatBytesHtml;
            }
          });
        });
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (get2(treeError)) $$render(consequent);
        else if (get2(loadingRoots)) $$render(consequent_1, 1);
        else if (get2(roots), untrack(() => !get2(roots).length)) $$render(consequent_2, 2);
        else $$render(alternate, -1);
      });
    }
    reset(div_4);
    reset(div_1);
    var div_8 = sibling(div_1, 2);
    var div_9 = child(div_8);
    var div_10 = child(div_9);
    var div_11 = sibling(child(div_10), 2);
    var text_2 = child(div_11, true);
    reset(div_11);
    reset(div_10);
    var div_12 = sibling(div_10, 2);
    var button_1 = child(div_12);
    var button_2 = sibling(button_1, 2);
    var button_3 = sibling(button_2, 2);
    var input = sibling(button_3, 2);
    remove_input_defaults(input);
    var button_4 = sibling(input, 2);
    var text_3 = child(button_4, true);
    reset(button_4);
    reset(div_12);
    reset(div_9);
    var div_13 = sibling(div_9, 2);
    var table = child(div_13);
    var thead = child(table);
    var tr = child(thead);
    each(tr, 5, () => headers, index, ($$anchor2, header) => {
      var th = root_7();
      var text_4 = child(th, true);
      reset(th);
      template_effect(
        ($0) => {
          set_style(th, (get2(header), untrack(() => `width:${get2(header).width}`)));
          set_text(text_4, $0);
        },
        [
          () => (get2(header), untrack(() => sortHeaderText2(get2(header).label, get2(header).field)))
        ]
      );
      delegated("click", th, () => setSort(get2(header).field));
      append($$anchor2, th);
    });
    reset(tr);
    reset(thead);
    var tbody = sibling(thead);
    var node_2 = child(tbody);
    {
      var consequent_3 = ($$anchor2) => {
        var tr_1 = root_8();
        var td = child(tr_1);
        var text_5 = child(td, true);
        reset(td);
        reset(tr_1);
        template_effect(() => set_text(text_5, get2(tableError)));
        append($$anchor2, tr_1);
      };
      var consequent_4 = ($$anchor2) => {
        var tr_2 = root_9();
        append($$anchor2, tr_2);
      };
      var consequent_5 = ($$anchor2) => {
        var tr_3 = root_10();
        append($$anchor2, tr_3);
      };
      var alternate_2 = ($$anchor2) => {
        var fragment_2 = comment();
        var node_3 = first_child(fragment_2);
        each(node_3, 1, () => get2(filteredRows), index, ($$anchor3, item) => {
          var tr_4 = root_12();
          var td_1 = child(tr_4);
          var div_14 = child(td_1);
          var span = child(div_14);
          var text_6 = child(span, true);
          reset(span);
          var span_1 = sibling(span, 2);
          var button_5 = child(span_1);
          var button_6 = sibling(button_5, 2);
          reset(span_1);
          reset(div_14);
          reset(td_1);
          var td_2 = sibling(td_1);
          var span_2 = child(td_2);
          var span_3 = child(span_2);
          var text_7 = child(span_3, true);
          reset(span_3);
          var button_7 = sibling(span_3, 2);
          var node_4 = sibling(button_7, 2);
          {
            var consequent_6 = ($$anchor4) => {
              var button_8 = root_13();
              delegated("click", button_8, () => selectPath(get2(item).path || ""));
              append($$anchor4, button_8);
            };
            if_block(node_4, ($$render) => {
              if (get2(item), untrack(() => get2(item).isDir)) $$render(consequent_6);
            });
          }
          reset(span_2);
          reset(td_2);
          var td_3 = sibling(td_2);
          var node_5 = child(td_3);
          {
            var consequent_7 = ($$anchor4) => {
              var fragment_3 = root_14();
              var span_4 = first_child(fragment_3);
              var text_8 = child(span_4);
              reset(span_4);
              var span_5 = sibling(span_4, 2);
              var text_9 = child(span_5);
              reset(span_5);
              template_effect(() => {
                set_text(text_8, `${(get2(item), untrack(() => get2(item).fileCount || 0)) ?? ""} F`);
                set_text(text_9, `${(get2(item), untrack(() => get2(item).dirCount || 0)) ?? ""} D`);
              });
              append($$anchor4, fragment_3);
            };
            var alternate_1 = ($$anchor4) => {
              var span_6 = root_15();
              append($$anchor4, span_6);
            };
            if_block(node_5, ($$render) => {
              if (get2(item), untrack(() => get2(item).isDir)) $$render(consequent_7);
              else $$render(alternate_1, -1);
            });
          }
          reset(td_3);
          var td_4 = sibling(td_3);
          html(
            td_4,
            () => (deep_read_state(formatBytesHtml), get2(item), untrack(() => formatBytesHtml(get2(item).size || 0))),
            true
          );
          reset(td_4);
          var td_5 = sibling(td_4);
          html(
            td_5,
            () => (deep_read_state(formatAgeByMode), get2(item), get2(relativeTime), untrack(() => formatAgeByMode(get2(item).modifiedAt || "", get2(relativeTime)))),
            true
          );
          reset(td_5);
          reset(tr_4);
          template_effect(() => {
            set_attribute2(span, "title", (get2(item), untrack(() => get2(item).path || "")));
            set_text(text_6, (get2(item), untrack(() => get2(item).base || "")));
            set_attribute2(button_5, "title", (get2(item), untrack(() => get2(item).path || "")));
            set_class(span_3, 1, (get2(item), untrack(() => `pill ${get2(item).isDir ? "pillDir" : "pillFile"}`)));
            set_text(text_7, (get2(item), untrack(() => get2(item).isDir ? "DIR" : "FILE")));
          });
          delegated("dblclick", tr_4, () => get2(item).isDir && selectPath(get2(item).path || ""));
          delegated("click", button_5, (event2) => copyPath(get2(item).path || "", event2));
          delegated("click", button_6, () => renameFromBrowse(get2(item).path || ""));
          delegated("click", button_7, (event2) => openExternal(get2(item).path || "", event2));
          append($$anchor3, tr_4);
        });
        append($$anchor2, fragment_2);
      };
      if_block(node_2, ($$render) => {
        if (get2(tableError)) $$render(consequent_3);
        else if (get2(loadingRows)) $$render(consequent_4, 1);
        else if (get2(filteredRows), untrack(() => !get2(filteredRows).length)) $$render(consequent_5, 2);
        else $$render(alternate_2, -1);
      });
    }
    reset(tbody);
    reset(table);
    reset(div_13);
    reset(div_8);
    reset(div);
    reset(section);
    template_effect(
      ($0) => {
        classes = set_class(section, 1, "tabPane", null, classes, { active: $activeTab() === "browse" });
        set_text(text_2, get2(selectedPath) || "");
        button_1.disabled = get2(historyIndex) <= 0;
        button_2.disabled = (get2(historyIndex), get2(history), untrack(() => get2(historyIndex) < 0 || get2(historyIndex) >= get2(history).length - 1));
        set_text(text_3, $0);
      },
      [
        () => (get2(relativeTime), untrack(() => relativeTimeButtonText2(get2(relativeTime))))
      ]
    );
    delegated("click", button, reloadTree);
    delegated("click", button_1, browseBack);
    delegated("click", button_2, browseForward);
    delegated("click", button_3, browseUp);
    bind_value(input, () => get2(filterText), ($$value) => set(filterText, $$value));
    delegated("click", button_4, () => set(relativeTime, !get2(relativeTime)));
    append($$anchor, section);
    pop();
    $$cleanup();
  }
  delegate(["click", "dblclick"]);

  // _components/DuplicatesTabPane.svelte
  var root_33 = from_html(`<tr><td colspan="4" class="empty"> </td></tr>`);
  var root_42 = from_html(`<tr><td colspan="4" class="empty">No duplicate groups</td></tr>`);
  var root_72 = from_html(`<div class="nameCell"><span class="nameLabel cellEllipsis"> </span> <span class="rowActions"><button class="ghost iconBtn">\u29C9</button></span></div>`);
  var root_6 = from_html(`<tr><td> </td><td></td><td class="mono"><span class="cellEllipsis"> </span></td><td class="mono"></td></tr>`);
  var root3 = from_html(`<section id="tab-duplicates"><div class="card"><div class="cardInner"><div class="row"><button class="secondary">Refresh Duplicates</button></div> <div class="resultPane" style="margin-top:16px"><div class="resultHeader"><h2>Duplicate Groups</h2> <div class="mono" style="color:var(--muted)"><!></div></div> <div class="resultScroll"><table style="table-layout:fixed"><thead><tr><th style="width:9%">Copies</th><th style="width:11%">Size</th><th style="width:20%">Fingerprint</th><th style="width:60%">Paths</th></tr></thead><tbody><!></tbody></table></div></div></div></div></section>`);
  function DuplicatesTabPane($$anchor, $$props) {
    push($$props, false);
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let rows = mutable_source([]);
    let loading = mutable_source(false);
    let error = mutable_source("");
    function toast(message) {
      showToast(message);
    }
    async function copyPath(path, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      try {
        await navigator.clipboard.writeText(path || "");
        toast("Copied path");
      } catch (err) {
        toast("Copy failed: " + err);
      }
    }
    async function refreshDuplicates() {
      set(loading, true);
      set(error, "");
      try {
        const res = await fetch(jsApi_GEN_default.duplicates || "/api/duplicates");
        const text2 = await res.text();
        if (!res.ok) throw new Error(text2 || "HTTP " + res.status);
        set(rows, text2 ? JSON.parse(text2) : []);
      } catch (err) {
        set(rows, []);
        set(error, String(err?.message || err));
        toast(get2(error));
      } finally {
        set(loading, false);
      }
    }
    onMount(() => {
      refreshDuplicates();
    });
    init();
    var section = root3();
    let classes;
    var div = child(section);
    var div_1 = child(div);
    var div_2 = child(div_1);
    var button = child(div_2);
    reset(div_2);
    var div_3 = sibling(div_2, 2);
    var div_4 = child(div_3);
    var div_5 = sibling(child(div_4), 2);
    var node = child(div_5);
    {
      var consequent = ($$anchor2) => {
        var text_1 = text("loading...");
        append($$anchor2, text_1);
      };
      var alternate = ($$anchor2) => {
        var text_2 = text();
        template_effect(() => set_text(text_2, `${get2(rows).length ?? ""} groups`));
        append($$anchor2, text_2);
      };
      if_block(node, ($$render) => {
        if (get2(loading)) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    reset(div_5);
    reset(div_4);
    var div_6 = sibling(div_4, 2);
    var table = child(div_6);
    var tbody = sibling(child(table));
    var node_1 = child(tbody);
    {
      var consequent_1 = ($$anchor2) => {
        var tr = root_33();
        var td = child(tr);
        var text_3 = child(td, true);
        reset(td);
        reset(tr);
        template_effect(() => set_text(text_3, get2(error)));
        append($$anchor2, tr);
      };
      var consequent_2 = ($$anchor2) => {
        var tr_1 = root_42();
        append($$anchor2, tr_1);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(node_2, 1, () => get2(rows), index, ($$anchor3, item) => {
          var tr_2 = root_6();
          var td_1 = child(tr_2);
          var text_4 = child(td_1, true);
          reset(td_1);
          var td_2 = sibling(td_1);
          html(td_2, () => formatBytesHtml(get2(item).size || 0), true);
          reset(td_2);
          var td_3 = sibling(td_2);
          var span = child(td_3);
          var text_5 = child(span, true);
          reset(span);
          reset(td_3);
          var td_4 = sibling(td_3);
          each(td_4, 5, () => get2(item).paths || [], index, ($$anchor4, path) => {
            var div_7 = root_72();
            var span_1 = child(div_7);
            var text_6 = child(span_1, true);
            reset(span_1);
            var span_2 = sibling(span_1, 2);
            var button_1 = child(span_2);
            reset(span_2);
            reset(div_7);
            template_effect(() => {
              set_attribute2(span_1, "title", get2(path));
              set_text(text_6, get2(path));
              set_attribute2(button_1, "title", get2(path));
            });
            delegated("click", button_1, (event2) => copyPath(get2(path), event2));
            append($$anchor4, div_7);
          });
          reset(td_4);
          reset(tr_2);
          template_effect(() => {
            set_text(text_4, (get2(item).paths || []).length);
            set_attribute2(span, "title", get2(item).fingerprint || "");
            set_text(text_5, get2(item).fingerprint || "");
          });
          append($$anchor3, tr_2);
        });
        append($$anchor2, fragment_1);
      };
      if_block(node_1, ($$render) => {
        if (get2(error)) $$render(consequent_1);
        else if (!get2(rows).length && !get2(loading)) $$render(consequent_2, 1);
        else $$render(alternate_1, -1);
      });
    }
    reset(tbody);
    reset(table);
    reset(div_6);
    reset(div_3);
    reset(div_1);
    reset(div);
    reset(section);
    template_effect(() => classes = set_class(section, 1, "tabPane", null, classes, { active: $activeTab() === "duplicates" }));
    delegated("click", button, refreshDuplicates);
    append($$anchor, section);
    pop();
    $$cleanup();
  }
  delegate(["click"]);

  // _components/IndexerTabPane.svelte
  var root_23 = from_html(`<option> </option>`);
  var root_5 = from_html(`<pre> </pre>`);
  var root_62 = from_html(`<div class="empty">No mounted root progress yet</div>`);
  var root_92 = from_html(`<div class="rootCard"><div><span class="pill"> </span> </div> <div class="mono" style="color:var(--muted); margin-top:3px"><!> / <!></div> <div class="progressBar" style="margin-top:4px"><div class="progressFill"></div></div></div>`);
  var root_82 = from_html(`<div class="mountCard"><div><strong> </strong> <span class="mono"> </span></div> <div class="progressBar" style="margin:6px 0 8px"><div class="progressFill"></div></div> <!></div>`);
  var root_17 = from_html(`<section id="tab-indexer"><section class="hero"><div class="card"><div class="cardInner"><h1>Indexer</h1> <p>Local media indexer for video libraries. Search is built from folder names and video filenames, with resumable mount-aware reindex and safe local file operations.</p> <div class="row" style="margin-top:14px"><button> </button> <select multiple="" size="5" style="min-width:340px"></select></div> <div class="progressWrap"><div class="progressBar"><div class="progressFill"></div></div> <div class="progressMeta"> </div></div> <div class="heroMeta"><div class="metric"><div class="metricLabel">Workers</div><div class="metricValue"> </div></div> <div class="metric"><div class="metricLabel">Roots</div><div class="metricValue"> </div></div> <div class="metric"><div class="metricLabel">Files / Dirs</div><div class="metricValue"> </div></div> <div class="metric"><div class="metricLabel">Indexed Size</div><div class="metricValue"></div></div> <div class="metric"><div class="metricLabel">Duration</div><div class="metricValue mono"> </div></div></div></div></div> <div class="card"><div class="cardInner"><h2>Status</h2> <div class="statusBox"><!></div></div></div></section> <div class="card"><div class="cardInner"><h2>Per Root Progress</h2> <div class="progressGrid"><!></div></div></div></section>`);
  function IndexerTabPane($$anchor, $$props) {
    push($$props, false);
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    const shouldPollStatus = mutable_source();
    let availableRoots = mutable_source([]);
    let selectedPriorityRoots2 = mutable_source([]);
    let status = mutable_source({});
    let loadingStatus = mutable_source(true);
    let startingReindex = mutable_source(false);
    let statusError = mutable_source("");
    let pollTimer = mutable_source(null);
    let mounted = mutable_source(false);
    function apiUrl(key2, fallback2) {
      return jsApi_GEN_default[key2] || fallback2;
    }
    function toast(message) {
      if (!message) return;
      showToast(String(message));
    }
    function rootLabel(root14) {
      if (!root14) return "";
      return root14.base && root14.base !== root14.path ? `${root14.base} \xB7 ${root14.path}` : root14.path || "";
    }
    function progressPct(snapshot2) {
      const mounts = snapshot2?.mounts || [];
      const allRoots = mounts.flatMap((mount2) => mount2.roots || []);
      if (allRoots.length) {
        return allRoots.reduce((acc, root14) => acc + Number(root14.progressPct || 0), 0) / allRoots.length;
      }
      return Number(snapshot2?.progressPct || 0);
    }
    function progressMeta(snapshot2) {
      const s = snapshot2 || {};
      return [
        "resumed=" + Boolean(s.resumed) + "  workers=" + (s.activeWorkers || 0) + "/" + (s.workerCount || 0) + "  roots=" + (s.estimatedRoots || 0) + "/" + (s.totalRoots || 0),
        "duration=" + (s.duration || "0s"),
        "estimated=" + formatBytes(s.totalBytes || 0) + "  processed=" + formatBytes(s.processedBytes || 0) + "  indexed=" + (s.indexed || 0) + "  files=" + (s.files || 0) + "  dirs=" + (s.directories || 0),
        "current=" + (s.currentPath || "")
      ].join("\n");
    }
    async function getJSON(url, options = {}) {
      const res = await fetch(url, options);
      const text2 = await res.text();
      if (!res.ok) {
        throw new Error(text2 || "HTTP " + res.status);
      }
      return text2 ? JSON.parse(text2) : {};
    }
    async function loadRoots() {
      try {
        const rows = await getJSON(apiUrl("browse", "/api/browse"));
        set(availableRoots, (Array.isArray(rows) ? rows : []).map((row) => ({ path: row.path || "", base: row.base || "" })));
        const valid = new Set(get2(availableRoots).map((row) => row.path));
        set(selectedPriorityRoots2, get2(selectedPriorityRoots2).filter((path) => valid.has(path)));
      } catch (err) {
        toast("Browse roots failed: " + (err?.message || err));
      }
    }
    async function refreshStatus2() {
      try {
        const next2 = await getJSON(apiUrl("status", "/api/status"));
        set(status, next2 || {});
        set(statusError, "");
      } catch (err) {
        set(statusError, String(err?.message || err));
      } finally {
        set(loadingStatus, false);
      }
    }
    async function startReindex2() {
      set(startingReindex, true);
      try {
        const url = new URL(apiUrl("reindex", "/api/reindex"), window.location.origin);
        if (get2(selectedPriorityRoots2).length) {
          url.searchParams.set("priority", get2(selectedPriorityRoots2).join(","));
        }
        const res = await getJSON(url.toString(), { method: "POST" });
        if (res?.message) toast(res.message);
        await refreshStatus2();
      } catch (err) {
        toast(err?.message || err);
        set(statusError, String(err?.message || err));
      } finally {
        set(startingReindex, false);
      }
    }
    function syncPolling() {
      if (!get2(mounted)) return;
      const shouldPoll = $activeTab() === "indexer" && (get2(startingReindex) || Boolean(get2(status)?.running));
      if (shouldPoll && !get2(pollTimer)) {
        set(pollTimer, window.setInterval(refreshStatus2, 3e3));
      } else if (!shouldPoll && get2(pollTimer)) {
        window.clearInterval(get2(pollTimer));
        set(pollTimer, null);
      }
    }
    onMount(async () => {
      await Promise.all([loadRoots(), refreshStatus2()]);
      set(mounted, true);
      syncPolling();
    });
    onDestroy(() => {
      if (get2(pollTimer)) window.clearInterval(get2(pollTimer));
    });
    legacy_pre_effect(
      () => (get2(mounted), $activeTab(), get2(startingReindex), get2(status)),
      () => {
        set(shouldPollStatus, get2(mounted) && $activeTab() === "indexer" && (get2(startingReindex) || Boolean(get2(status)?.running)));
      }
    );
    legacy_pre_effect(() => (get2(mounted), get2(shouldPollStatus), get2(pollTimer)), () => {
      if (get2(mounted)) {
        if (get2(shouldPollStatus) && !get2(pollTimer)) {
          set(pollTimer, window.setInterval(refreshStatus2, 3e3));
        } else if (!get2(shouldPollStatus) && get2(pollTimer)) {
          window.clearInterval(get2(pollTimer));
          set(pollTimer, null);
        }
      }
    });
    legacy_pre_effect_reset();
    init();
    var section = root_17();
    let classes;
    var section_1 = child(section);
    var div = child(section_1);
    var div_1 = child(div);
    var div_2 = sibling(child(div_1), 4);
    var button = child(div_2);
    var text_1 = child(button, true);
    reset(button);
    var select = sibling(button, 2);
    each(select, 5, () => get2(availableRoots), index, ($$anchor2, root14) => {
      var option = root_23();
      var text_2 = child(option, true);
      reset(option);
      var option_value = {};
      template_effect(
        ($0) => {
          set_text(text_2, $0);
          if (option_value !== (option_value = (get2(root14), untrack(() => get2(root14).path)))) {
            option.value = (option.__value = (get2(root14), untrack(() => get2(root14).path))) ?? "";
          }
        },
        [() => (get2(root14), untrack(() => rootLabel(get2(root14))))]
      );
      append($$anchor2, option);
    });
    reset(select);
    reset(div_2);
    var div_3 = sibling(div_2, 2);
    var div_4 = child(div_3);
    var div_5 = child(div_4);
    reset(div_4);
    var div_6 = sibling(div_4, 2);
    var text_3 = child(div_6, true);
    reset(div_6);
    reset(div_3);
    var div_7 = sibling(div_3, 2);
    var div_8 = child(div_7);
    var div_9 = sibling(child(div_8));
    var text_4 = child(div_9);
    reset(div_9);
    reset(div_8);
    var div_10 = sibling(div_8, 2);
    var div_11 = sibling(child(div_10));
    var text_5 = child(div_11);
    reset(div_11);
    reset(div_10);
    var div_12 = sibling(div_10, 2);
    var div_13 = sibling(child(div_12));
    var text_6 = child(div_13);
    reset(div_13);
    reset(div_12);
    var div_14 = sibling(div_12, 2);
    var div_15 = sibling(child(div_14));
    html(
      div_15,
      () => (deep_read_state(formatBytesHtml), get2(status), untrack(() => formatBytesHtml(get2(status).totalBytes || 0))),
      true
    );
    reset(div_15);
    reset(div_14);
    var div_16 = sibling(div_14, 2);
    var div_17 = sibling(child(div_16));
    var text_7 = child(div_17, true);
    reset(div_17);
    reset(div_16);
    reset(div_7);
    reset(div_1);
    reset(div);
    var div_18 = sibling(div, 2);
    var div_19 = child(div_18);
    var div_20 = sibling(child(div_19), 2);
    var node = child(div_20);
    {
      var consequent = ($$anchor2) => {
        var text_8 = text();
        template_effect(() => set_text(text_8, get2(statusError)));
        append($$anchor2, text_8);
      };
      var consequent_1 = ($$anchor2) => {
        var text_9 = text("loading...");
        append($$anchor2, text_9);
      };
      var alternate = ($$anchor2) => {
        var pre = root_5();
        var text_10 = child(pre, true);
        reset(pre);
        template_effect(($0) => set_text(text_10, $0), [
          () => (get2(status), untrack(() => JSON.stringify(get2(status) || {}, null, 2)))
        ]);
        append($$anchor2, pre);
      };
      if_block(node, ($$render) => {
        if (get2(statusError)) $$render(consequent);
        else if (get2(loadingStatus)) $$render(consequent_1, 1);
        else $$render(alternate, -1);
      });
    }
    reset(div_20);
    reset(div_19);
    reset(div_18);
    reset(section_1);
    var div_21 = sibling(section_1, 2);
    var div_22 = child(div_21);
    var div_23 = sibling(child(div_22), 2);
    var node_1 = child(div_23);
    {
      var consequent_2 = ($$anchor2) => {
        var div_24 = root_62();
        append($$anchor2, div_24);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_1 = comment();
        var node_2 = first_child(fragment_1);
        each(node_2, 1, () => (get2(status), untrack(() => get2(status).mounts || [])), index, ($$anchor3, mount2) => {
          var div_25 = root_82();
          var div_26 = child(div_25);
          var strong = child(div_26);
          var text_11 = child(strong, true);
          reset(strong);
          var span = sibling(strong, 2);
          var text_12 = child(span);
          reset(span);
          reset(div_26);
          var div_27 = sibling(div_26, 2);
          var div_28 = child(div_27);
          reset(div_27);
          var node_3 = sibling(div_27, 2);
          each(node_3, 1, () => (get2(mount2), untrack(() => get2(mount2).roots || [])), index, ($$anchor4, root14) => {
            var div_29 = root_92();
            var div_30 = child(div_29);
            var span_1 = child(div_30);
            var text_13 = child(span_1, true);
            reset(span_1);
            var text_14 = sibling(span_1, 1, true);
            reset(div_30);
            var div_31 = sibling(div_30, 2);
            var node_4 = child(div_31);
            html(node_4, () => (deep_read_state(formatBytesHtml), get2(root14), untrack(() => formatBytesHtml(get2(root14).processedBytes || 0))));
            var node_5 = sibling(node_4, 2);
            html(node_5, () => (deep_read_state(formatBytesHtml), get2(root14), untrack(() => formatBytesHtml(get2(root14).totalBytes || 0))));
            reset(div_31);
            var div_32 = sibling(div_31, 2);
            var div_33 = child(div_32);
            reset(div_32);
            reset(div_29);
            template_effect(
              ($0) => {
                set_text(text_13, (get2(root14), untrack(() => get2(root14).kind || "")));
                set_text(text_14, (get2(root14), untrack(() => get2(root14).path || "")));
                set_style(div_33, $0);
              },
              [
                () => (get2(root14), untrack(() => `width:${Number(get2(root14).progressPct || 0).toFixed(2)}%`))
              ]
            );
            append($$anchor4, div_29);
          });
          reset(div_25);
          template_effect(
            ($0, $1) => {
              set_text(text_11, (get2(mount2), untrack(() => get2(mount2).mountPoint || "(unknown)")));
              set_text(text_12, `${$0 ?? ""}%`);
              set_style(div_28, $1);
            },
            [
              () => (get2(mount2), untrack(() => Number(get2(mount2).progressPct || 0).toFixed(2))),
              () => (get2(mount2), untrack(() => `width:${Number(get2(mount2).progressPct || 0).toFixed(2)}%`))
            ]
          );
          append($$anchor3, div_25);
        });
        append($$anchor2, fragment_1);
      };
      if_block(node_1, ($$render) => {
        if (get2(status), untrack(() => !get2(status).mounts?.length)) $$render(consequent_2);
        else $$render(alternate_1, -1);
      });
    }
    reset(div_23);
    reset(div_22);
    reset(div_21);
    reset(section);
    template_effect(
      ($0, $1, $2) => {
        classes = set_class(section, 1, "tabPane", null, classes, { active: $activeTab() === "indexer" });
        button.disabled = $0;
        set_text(text_1, (get2(startingReindex), get2(status), untrack(() => get2(startingReindex) ? "Starting..." : get2(status)?.running ? "Running..." : "Start Reindex")));
        set_style(div_5, $1);
        set_text(text_3, $2);
        set_text(text_4, `${(get2(status), untrack(() => get2(status).activeWorkers || 0)) ?? ""} / ${(get2(status), untrack(() => get2(status).workerCount || 0)) ?? ""}`);
        set_text(text_5, `${(get2(status), untrack(() => get2(status).estimatedRoots || 0)) ?? ""} / ${(get2(status), untrack(() => get2(status).totalRoots || 0)) ?? ""}`);
        set_text(text_6, `${(get2(status), untrack(() => get2(status).files || 0)) ?? ""} / ${(get2(status), untrack(() => get2(status).directories || 0)) ?? ""}`);
        set_text(text_7, (get2(status), untrack(() => get2(status).duration || "0s")));
      },
      [
        () => (get2(startingReindex), get2(status), untrack(() => get2(startingReindex) || Boolean(get2(status)?.running))),
        () => (get2(status), untrack(() => `width:${progressPct(get2(status)).toFixed(2)}%`)),
        () => (get2(status), untrack(() => progressMeta(get2(status))))
      ]
    );
    delegated("click", button, startReindex2);
    bind_select_value(select, () => get2(selectedPriorityRoots2), ($$value) => set(selectedPriorityRoots2, $$value));
    append($$anchor, section);
    pop();
    $$cleanup();
  }
  delegate(["click"]);

  // _states/manageTabs.js
  var manageTabs_default = [
    { id: "suggest", label: "Name Fix" },
    { id: "subtitles", label: "Subtitle Rename" },
    { id: "rename", label: "Apply Rename" },
    { id: "move", label: "Sorted Move" },
    { id: "delete", label: "Delete Target" }
  ];

  // _states/manageTab.js
  var manageTab = writable("suggest");
  function setManageTab(tab) {
    manageTab.set(tab || "suggest");
  }
  function bindManageTab(windowRef) {
    const handler = (event2) => {
      setManageTab(event2?.detail?.tab || "suggest");
    };
    windowRef?.addEventListener?.("indexer:manageTab", handler);
    return () => windowRef?.removeEventListener?.("indexer:manageTab", handler);
  }

  // _states/browseBridgeState.js
  var initialState = {
    roots: [],
    selectedPath: ""
  };
  var browseBridgeState = writable(initialState);
  function bindBrowseBridgeState(windowRef) {
    const handler = (event2) => {
      const detail = event2?.detail || {};
      browseBridgeState.update((current) => ({
        ...current,
        roots: detail.roots || current.roots,
        selectedPath: detail.selectedPath || current.selectedPath
      }));
    };
    windowRef?.addEventListener?.("indexer:browseState", handler);
    return () => windowRef?.removeEventListener?.("indexer:browseState", handler);
  }

  // _states/manageFormState.js
  var initialState2 = {
    scanRoot: "",
    scanPath: "",
    subtitleRoot: "",
    subtitlePath: "",
    suggestedName: "",
    renameTarget: "",
    dstRoot: "",
    dstSubdir: "",
    categorizeWatched: 0,
    categorizeVideosOnly: false,
    categorizeRemoveEmpty: true
  };
  var manageFormState = writable(initialState2);
  function bindManageFormState(windowRef) {
    const handler = (event2) => {
      const patch = event2?.detail?.patch || {};
      manageFormState.update((current) => ({
        ...current,
        ...patch
      }));
    };
    windowRef?.addEventListener?.("indexer:manageForm", handler);
    return () => windowRef?.removeEventListener?.("indexer:manageForm", handler);
  }

  // _states/manageWorkflowState.js
  var initialState3 = {
    tab: "suggest",
    scanConfig: {
      title: "Step 2: Scan Suggest Candidates",
      button: "Scan Suggest Candidates",
      empty: "No suggestion candidates found in this scan path"
    },
    scanRows: [],
    selectedScanRows: [],
    subtitleRows: []
  };
  var manageWorkflowState = writable(initialState3);
  function bindManageWorkflowState(windowRef) {
    const handler = (event2) => {
      const detail = event2?.detail || {};
      manageWorkflowState.update((current) => ({
        ...current,
        ...detail,
        scanConfig: detail.scanConfig || current.scanConfig,
        scanRows: detail.scanRows || current.scanRows,
        selectedScanRows: detail.selectedScanRows || current.selectedScanRows,
        subtitleRows: detail.subtitleRows || current.subtitleRows,
        tab: detail.tab || current.tab
      }));
    };
    windowRef?.addEventListener?.("indexer:manageWorkflow", handler);
    return () => windowRef?.removeEventListener?.("indexer:manageWorkflow", handler);
  }

  // _components/ManageCommonPane.svelte
  var root_24 = from_html(`<option> </option>`);
  var root_34 = from_html(`<tr><td colspan="6" class="empty"> </td></tr>`);
  var root_63 = from_html(`<button class="ghost"> </button>`);
  var root_52 = from_html(`<tr><td><input type="checkbox"/></td><td class="mono"><span class="cellEllipsis"> </span></td><td><span> </span></td><td class="mono"><span class="cellEllipsis"> </span></td><td><span class="fdFile tooltipish" title="descendant files"> </span> <span class="fdDir tooltipish" title="descendant directories"> </span></td><td><div class="row" style="margin:0"><button>Preview</button> <!> <button class="ghost iconBtn" title="Show in Browse">\u2197</button></div></td></tr>`);
  var root_18 = from_html(`<div class="resultPane" style="margin-bottom:16px"><div class="resultHeader"><h2 id="manageScanTitle"> </h2> <div id="manageScanCount" class="mono" style="color:var(--muted)"> </div></div> <div class="field"><label for="manageScanRoot">Scan Root</label> <select id="manageScanRoot"></select></div> <div class="field"><label for="manageScanPath">Optional Subdirectory</label> <input id="manageScanPath" placeholder="Leave empty to scan the whole selected root"/></div> <div class="row" style="margin-top:14px"><button id="manageScanBtn" class="secondary"> </button> <button class="ghost">Use Current Browse Path</button></div> <div id="manageBatchActions" class="row" style="margin-top:12px"><div class="mono" style="color:var(--muted); align-self:center"> </div> <button> </button></div> <div class="resultScroll" style="max-height:320px; margin-top:14px"><table style="table-layout:fixed"><thead><tr><th style="width:5%"><input id="manageSelectAll" type="checkbox"/></th><th id="manageScanHeadCurrent" style="width:25%">Current</th><th id="manageScanHeadStatus" style="width:15%"> </th><th id="manageScanHeadSuggested" style="width:23%"> </th><th id="manageScanHeadContents" style="width:12%">Contents</th><th id="manageScanHeadAction" style="width:20%">Action</th></tr></thead><tbody id="manageScanTable"><!></tbody></table></div></div>`);
  function ManageCommonPane($$anchor, $$props) {
    push($$props, false);
    const $manageWorkflowState = () => store_get(manageWorkflowState, "$manageWorkflowState", $$stores);
    const $manageFormState = () => store_get(manageFormState, "$manageFormState", $$stores);
    const $browseBridgeState = () => store_get(browseBridgeState, "$browseBridgeState", $$stores);
    const $manageTab = () => store_get(manageTab, "$manageTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    let cleanupForm = () => {
    };
    let cleanupBrowse = () => {
    };
    onMount(() => {
      cleanup = bindManageWorkflowState(window);
      cleanupForm = bindManageFormState(window);
      cleanupBrowse = bindBrowseBridgeState(window);
      return () => {
        cleanup();
        cleanupForm();
        cleanupBrowse();
      };
    });
    function rowAction(tab, idx) {
      if (tab === "suggest") return () => requestManageAction("previewScannedSuggest", { index: idx });
      if (tab === "rename") return () => requestManageAction("previewScannedRename", { index: idx });
      if (tab === "move") return () => requestManageAction("previewScannedMove", { index: idx });
      return () => requestManageAction("previewScannedDelete", { index: idx });
    }
    function secondaryAction(tab, idx) {
      if (tab === "suggest") return () => requestManageAction("previewScannedCategorize", { index: idx });
      return null;
    }
    function secondaryLabel(tab) {
      return tab === "suggest" ? "Categorize" : "";
    }
    function batchLabel(tab) {
      if (tab === "suggest") return "Queue Categorize Selected";
      if (tab === "rename") return "Queue Rename Selected";
      if (tab === "move") return "Queue Move Selected";
      return "Queue Delete Selected";
    }
    function batchAction(tab) {
      if (tab === "suggest") return "queueSelectedCategorize";
      if (tab === "rename") return "queueSelectedRenames";
      if (tab === "move") return "queueSelectedMoves";
      return "queueSelectedDeletes";
    }
    function statusLabel(tab, item) {
      return item?.statusLabel || (tab === "delete" ? "TARGET" : "");
    }
    function rootLabel(root14) {
      if (!root14) return "";
      return root14.base && root14.base !== root14.path ? `${root14.base} \xB7 ${root14.path}` : root14.path || "";
    }
    function showInBrowse(path, isDir, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      requestManageAction("showInBrowse", { path, isDir });
    }
    init();
    var div = root_18();
    var div_1 = child(div);
    var h2 = child(div_1);
    var text2 = child(h2, true);
    reset(h2);
    var div_2 = sibling(h2, 2);
    var text_1 = child(div_2);
    reset(div_2);
    reset(div_1);
    var div_3 = sibling(div_1, 2);
    var select = sibling(child(div_3), 2);
    each(select, 5, () => $browseBridgeState().roots, index, ($$anchor2, root14) => {
      var option = root_24();
      var text_2 = child(option, true);
      reset(option);
      var option_value = {};
      template_effect(
        ($0) => {
          set_text(text_2, $0);
          if (option_value !== (option_value = get2(root14).path)) {
            option.value = (option.__value = get2(root14).path) ?? "";
          }
        },
        [() => rootLabel(get2(root14))]
      );
      append($$anchor2, option);
    });
    reset(select);
    var select_value;
    init_select(select);
    reset(div_3);
    var div_4 = sibling(div_3, 2);
    var input = sibling(child(div_4), 2);
    remove_input_defaults(input);
    reset(div_4);
    var div_5 = sibling(div_4, 2);
    var button = child(div_5);
    var text_3 = child(button, true);
    reset(button);
    var button_1 = sibling(button, 2);
    reset(div_5);
    var div_6 = sibling(div_5, 2);
    var div_7 = child(div_6);
    var text_4 = child(div_7);
    reset(div_7);
    var button_2 = sibling(div_7, 2);
    let classes;
    var text_5 = child(button_2, true);
    reset(button_2);
    reset(div_6);
    var div_8 = sibling(div_6, 2);
    var table = child(div_8);
    var thead = child(table);
    var tr = child(thead);
    var th = child(tr);
    var input_1 = child(th);
    remove_input_defaults(input_1);
    reset(th);
    var th_1 = sibling(th, 2);
    var text_6 = child(th_1, true);
    reset(th_1);
    var th_2 = sibling(th_1);
    var text_7 = child(th_2, true);
    reset(th_2);
    next(2);
    reset(tr);
    reset(thead);
    var tbody = sibling(thead);
    var node = child(tbody);
    {
      var consequent = ($$anchor2) => {
        var tr_1 = root_34();
        var td = child(tr_1);
        var text_8 = child(td, true);
        reset(td);
        reset(tr_1);
        template_effect(() => set_text(text_8, $manageWorkflowState().scanConfig.empty));
        append($$anchor2, tr_1);
      };
      var alternate = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        each(node_1, 1, () => $manageWorkflowState().scanRows, index, ($$anchor3, item, idx) => {
          var tr_2 = root_52();
          var td_1 = child(tr_2);
          var input_2 = child(td_1);
          remove_input_defaults(input_2);
          reset(td_1);
          var td_2 = sibling(td_1);
          var span = child(td_2);
          var text_9 = child(span, true);
          reset(span);
          reset(td_2);
          var td_3 = sibling(td_2);
          var span_1 = child(td_3);
          var text_10 = child(span_1, true);
          reset(span_1);
          reset(td_3);
          var td_4 = sibling(td_3);
          var span_2 = child(td_4);
          var text_11 = child(span_2, true);
          reset(span_2);
          reset(td_4);
          var td_5 = sibling(td_4);
          var span_3 = child(td_5);
          var text_12 = child(span_3);
          reset(span_3);
          var span_4 = sibling(span_3, 2);
          var text_13 = child(span_4);
          reset(span_4);
          reset(td_5);
          var td_6 = sibling(td_5);
          var div_9 = child(td_6);
          var button_3 = child(div_9);
          var event_handler = user_derived(() => rowAction($manageTab(), idx));
          let classes_1;
          var node_2 = sibling(button_3, 2);
          {
            var consequent_1 = ($$anchor4) => {
              var button_4 = root_63();
              var event_handler_1 = user_derived(() => secondaryAction($manageTab(), idx));
              var text_14 = child(button_4, true);
              reset(button_4);
              template_effect(($0) => set_text(text_14, $0), [() => secondaryLabel($manageTab())]);
              delegated("click", button_4, function(...$$args) {
                get2(event_handler_1)?.apply(this, $$args);
              });
              append($$anchor4, button_4);
            };
            var d = user_derived(() => secondaryAction($manageTab(), idx));
            if_block(node_2, ($$render) => {
              if (get2(d)) $$render(consequent_1);
            });
          }
          var button_5 = sibling(node_2, 2);
          reset(div_9);
          reset(td_6);
          reset(tr_2);
          template_effect(
            ($0, $1) => {
              set_checked(input_2, $0);
              set_attribute2(span, "title", get2(item).path || "");
              set_text(text_9, get2(item).current || get2(item).base || "");
              set_class(span_1, 1, `pill ${$manageTab() === "move" || get2(item).isDir ? "pillDir" : "pillFile"}`);
              set_text(text_10, $1);
              set_attribute2(span_2, "title", $manageTab() === "delete" ? get2(item).path || "" : get2(item).newPath || get2(item).suggested || get2(item).path || "");
              set_text(text_11, $manageTab() === "delete" ? get2(item).path || "" : get2(item).suggested || "");
              set_text(text_12, `${(get2(item).fileCount || 0) ?? ""} F`);
              set_text(text_13, `${(get2(item).dirCount || 0) ?? ""} D`);
              classes_1 = set_class(button_3, 1, "", null, classes_1, { warn: $manageTab() === "delete" });
            },
            [
              () => $manageWorkflowState().selectedScanRows.includes(idx),
              () => statusLabel($manageTab(), get2(item))
            ]
          );
          delegated("change", input_2, (event2) => requestManageAction("toggleManageRowSelection", { index: idx, checked: event2.currentTarget.checked }));
          delegated("click", button_3, function(...$$args) {
            get2(event_handler)?.apply(this, $$args);
          });
          delegated("click", button_5, (event2) => showInBrowse(get2(item).path || "", get2(item).isDir !== false, event2));
          append($$anchor3, tr_2);
        });
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (!$manageWorkflowState().scanRows.length) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    reset(tbody);
    reset(table);
    reset(div_8);
    reset(div);
    template_effect(
      ($0) => {
        set_text(text2, $manageWorkflowState().scanConfig.title);
        set_text(text_1, `${$manageWorkflowState().scanRows.length ?? ""} rows`);
        if (select_value !== (select_value = $manageFormState().scanRoot)) {
          select.value = (select.__value = $manageFormState().scanRoot) ?? "", select_option(select, $manageFormState().scanRoot);
        }
        set_value(input, $manageFormState().scanPath);
        set_text(text_3, $manageWorkflowState().scanConfig.button);
        set_text(text_4, `${$manageWorkflowState().selectedScanRows.length ?? ""} selected`);
        classes = set_class(button_2, 1, "ghost", null, classes, { warn: $manageTab() === "delete" });
        set_text(text_5, $0);
        set_checked(input_1, $manageWorkflowState().scanRows.length > 0 && $manageWorkflowState().selectedScanRows.length === $manageWorkflowState().scanRows.length);
        set_text(text_6, $manageTab() === "delete" ? "Type" : "Status");
        set_text(text_7, $manageTab() === "delete" ? "Path" : "Suggested");
      },
      [() => batchLabel($manageTab())]
    );
    delegated("change", select, (event2) => requestManageFormPatch({ scanRoot: event2.currentTarget.value }));
    delegated("input", input, (event2) => {
      event2.currentTarget.dataset.manual = event2.currentTarget.value.trim() ? "1" : "";
      requestManageFormPatch({ scanPath: event2.currentTarget.value });
    });
    delegated("click", button, () => requestManageAction("runManageModeScan"));
    delegated("click", button_1, () => requestManageAction("prefillManageFromBrowse", { kind: "scan" }));
    delegated("click", button_2, () => requestManageAction(batchAction($manageTab())));
    delegated("change", input_1, (event2) => requestManageAction("toggleManageSelectAll", { checked: event2.currentTarget.checked }));
    append($$anchor, div);
    pop();
    $$cleanup();
  }
  delegate(["change", "input", "click"]);

  // _components/ManageDeletePane.svelte
  var root4 = from_html(`<div class="previewBox" style="margin-bottom:16px; min-height:auto; padding:12px 14px; color:var(--muted)"><div class="previewLabel">Steps</div> <div>1. Scan the area you want to review for deletion.</div> <div>2. Preview one exact target carefully.</div> <div>3. Queue only the item or selected rows you really want removed.</div> <div>Delete is destructive, so preview first and batch only when you are sure.</div></div>`);
  function ManageDeletePane($$anchor) {
    var div = root4();
    append($$anchor, div);
  }

  // _components/ManageMovePane.svelte
  var root_25 = from_html(`<option> </option>`);
  var root_19 = from_html(`<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)"><div class="previewLabel">Steps</div> <div>1. Scan only move-ready folders that already match the final <span class="mono">[...,of_wN]</span> form.</div> <div>2. Choose destination root and optional bucket.</div> <div>3. Preview one candidate, then queue it.</div> <div>Example: move <span class="mono">Show Name S01 [12of_w0]</span> into sorted root bucket <span class="mono">_w</span>.</div></div> <div class="field"><label for="manageDstRoot">Destination Root</label> <select id="manageDstRoot"></select></div> <div class="field"><label for="manageDstSubdir">Destination Subdirectory</label> <input id="manageDstSubdir" placeholder="_ws or optional relative folder inside selected root"/></div>`, 1);
  function ManageMovePane($$anchor, $$props) {
    push($$props, false);
    const $manageFormState = () => store_get(manageFormState, "$manageFormState", $$stores);
    const $browseBridgeState = () => store_get(browseBridgeState, "$browseBridgeState", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    let cleanupBrowse = () => {
    };
    onMount(() => {
      cleanup = bindManageFormState(window);
      cleanupBrowse = bindBrowseBridgeState(window);
      return () => {
        cleanup();
        cleanupBrowse();
      };
    });
    function rootLabel(root14) {
      if (!root14) return "";
      return root14.base && root14.base !== root14.path ? `${root14.base} \xB7 ${root14.path}` : root14.path || "";
    }
    init();
    var fragment = root_19();
    var div = sibling(first_child(fragment), 2);
    var select = sibling(child(div), 2);
    each(select, 5, () => $browseBridgeState().roots, index, ($$anchor2, root14) => {
      var option = root_25();
      var text2 = child(option, true);
      reset(option);
      var option_value = {};
      template_effect(
        ($0) => {
          set_text(text2, $0);
          if (option_value !== (option_value = get2(root14).path)) {
            option.value = (option.__value = get2(root14).path) ?? "";
          }
        },
        [() => rootLabel(get2(root14))]
      );
      append($$anchor2, option);
    });
    reset(select);
    var select_value;
    init_select(select);
    reset(div);
    var div_1 = sibling(div, 2);
    var input = sibling(child(div_1), 2);
    remove_input_defaults(input);
    reset(div_1);
    template_effect(() => {
      if (select_value !== (select_value = $manageFormState().dstRoot)) {
        select.value = (select.__value = $manageFormState().dstRoot) ?? "", select_option(select, $manageFormState().dstRoot);
      }
      set_value(input, $manageFormState().dstSubdir);
    });
    delegated("change", select, (event2) => requestManageFormPatch({ dstRoot: event2.currentTarget.value }));
    delegated("input", input, (event2) => requestManageFormPatch({ dstSubdir: event2.currentTarget.value }));
    append($$anchor, fragment);
    pop();
    $$cleanup();
  }
  delegate(["change", "input"]);

  // _components/ManageRenamePane.svelte
  var root5 = from_html(`<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)"><div class="previewLabel">Steps</div> <div>1. Scan rename candidates.</div> <div>2. Preview a row to review the suggested target path.</div> <div>3. Adjust the target only if needed, then queue it.</div> <div>Example: rename a temporary episodic folder into the grouped folder form before moving it later.</div></div> <div class="field"><label for="manageSuggestedName">Suggested Name</label> <div class="row"><input id="manageSuggestedName" placeholder="Series Name S01 12Ew0"/> <button class="secondary">Suggest</button> <button class="ghost">Subtitle</button></div></div> <div class="field"><label for="manageRenameTarget">Rename To Path</label> <input id="manageRenameTarget" placeholder="/path/to/Series Name S01 12Ew0"/></div> <div class="row" style="margin-top:14px"><button>Preview Rename</button> <button class="ghost">Use Current Browse Path</button></div>`, 1);
  function ManageRenamePane($$anchor, $$props) {
    push($$props, false);
    const $manageFormState = () => store_get(manageFormState, "$manageFormState", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    onMount(() => {
      cleanup = bindManageFormState(window);
      return () => cleanup();
    });
    init();
    var fragment = root5();
    var div = sibling(first_child(fragment), 2);
    var div_1 = sibling(child(div), 2);
    var input = child(div_1);
    remove_input_defaults(input);
    var button = sibling(input, 2);
    var button_1 = sibling(button, 2);
    reset(div_1);
    reset(div);
    var div_2 = sibling(div, 2);
    var input_1 = sibling(child(div_2), 2);
    remove_input_defaults(input_1);
    reset(div_2);
    var div_3 = sibling(div_2, 2);
    var button_2 = child(div_3);
    var button_3 = sibling(button_2, 2);
    reset(div_3);
    template_effect(() => {
      set_value(input, $manageFormState().suggestedName);
      set_value(input_1, $manageFormState().renameTarget);
    });
    delegated("input", input, (event2) => requestManageFormPatch({ suggestedName: event2.currentTarget.value }));
    delegated("click", button, () => requestManageAction("suggestRenameFromRenameTab"));
    delegated("click", button_1, () => requestManageAction("suggestSubtitleRenameFromRenameTab"));
    delegated("input", input_1, (event2) => {
      event2.currentTarget.dataset.manual = event2.currentTarget.value.trim() ? "1" : "";
      requestManageFormPatch({ renameTarget: event2.currentTarget.value });
    });
    delegated("click", button_2, () => requestManageAction("previewManage", { mode: "rename" }));
    delegated("click", button_3, () => requestManageAction("setManageSelectedSourceFromBrowse"));
    append($$anchor, fragment);
    pop();
    $$cleanup();
  }
  delegate(["input", "click"]);

  // _components/ManageSuggestPane.svelte
  var root6 = from_html(`<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)"><div class="previewLabel">Steps</div> <div>1. Pick a root and optional subdirectory.</div> <div>2. Scan only directories whose names look fixable.</div> <div>3. Preview one row to see the suggested cleaned folder name, grouped moves, ambiguous subtitles, and queueable categorize action.</div> <div>Example: <span class="mono">Show.Name.S01.[12Ew0]</span> becomes a cleaner grouped folder proposal before rename or categorize.</div></div> <div class="field"><label for="manageCategorizeWatched">Categorize Watched Count</label> <input id="manageCategorizeWatched" type="number" min="0" step="1" placeholder="0"/></div> <div class="row" style="margin-top:8px"><label class="checkRow"><input id="manageCategorizeVideosOnly" type="checkbox"/>videos only</label> <label class="checkRow"><input id="manageCategorizeRemoveEmpty" type="checkbox"/>remove empty dirs when applying</label></div>`, 1);
  function ManageSuggestPane($$anchor, $$props) {
    push($$props, false);
    const $manageFormState = () => store_get(manageFormState, "$manageFormState", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    onMount(() => {
      cleanup = bindManageFormState(window);
      return () => cleanup();
    });
    init();
    var fragment = root6();
    var div = sibling(first_child(fragment), 2);
    var input = sibling(child(div), 2);
    remove_input_defaults(input);
    reset(div);
    var div_1 = sibling(div, 2);
    var label = child(div_1);
    var input_1 = child(label);
    remove_input_defaults(input_1);
    next();
    reset(label);
    var label_1 = sibling(label, 2);
    var input_2 = child(label_1);
    remove_input_defaults(input_2);
    next();
    reset(label_1);
    reset(div_1);
    template_effect(() => {
      set_value(input, $manageFormState().categorizeWatched);
      set_checked(input_1, $manageFormState().categorizeVideosOnly);
      set_checked(input_2, $manageFormState().categorizeRemoveEmpty);
    });
    delegated("input", input, (event2) => requestManageFormPatch({
      categorizeWatched: Number(event2.currentTarget.value || 0) || 0
    }));
    delegated("change", input_1, (event2) => requestManageFormPatch({ categorizeVideosOnly: !!event2.currentTarget.checked }));
    delegated("change", input_2, (event2) => requestManageFormPatch({ categorizeRemoveEmpty: !!event2.currentTarget.checked }));
    append($$anchor, fragment);
    pop();
    $$cleanup();
  }
  delegate(["input", "change"]);

  // _components/ManageSubtitlePane.svelte
  var root_26 = from_html(`<option> </option>`);
  var root_35 = from_html(`<tr><td colspan="3" class="empty">No subtitle rename candidates</td></tr>`);
  var root_53 = from_html(`<tr><td class="mono"><span class="cellEllipsis"> </span></td><td class="mono"><span class="cellEllipsis"> </span></td><td><div class="row" style="margin:0"><button class="ghost iconBtn">\u29C9</button><button>Rename</button></div></td></tr>`);
  var root_110 = from_html(`<div class="previewBox" style="margin-bottom:12px; min-height:auto; padding:10px 12px; color:var(--muted)"><div class="previewLabel">Steps</div> <div>1. Choose the root to scan for subtitle fixes.</div> <div>2. Optionally narrow the subtitle scan path.</div> <div>3. Scan subtitle renames, then queue rows one by one.</div> <div>Example: <span class="mono">2_English.srt</span> can become <span class="mono">Episode.Name.en.srt</span>.</div></div> <div class="field"><label for="manageSubtitleRoot">Scan Root</label> <select id="manageSubtitleRoot"></select></div> <div class="field"><label for="manageSubtitlePath">Optional Subdirectory</label> <input id="manageSubtitlePath" placeholder="Series/Season/Subs"/></div> <div class="row" style="margin-top:14px"><button class="secondary">Scan Subtitle Renames</button> <button class="ghost">Use Current Browse Path</button></div> <div class="resultPane" style="margin-top:16px"><div class="resultHeader"><h2>Subtitle Rename Candidates</h2> <div id="subtitleScanCount" class="mono" style="color:var(--muted)"> </div></div> <div class="resultScroll" style="max-height:360px"><table style="table-layout:fixed"><thead><tr><th style="width:38%">Current</th><th style="width:38%">Suggested</th><th style="width:24%">Action</th></tr></thead><tbody id="subtitleScanTable"><!></tbody></table></div></div>`, 1);
  function ManageSubtitlePane($$anchor, $$props) {
    push($$props, false);
    const $manageFormState = () => store_get(manageFormState, "$manageFormState", $$stores);
    const $browseBridgeState = () => store_get(browseBridgeState, "$browseBridgeState", $$stores);
    const $manageWorkflowState = () => store_get(manageWorkflowState, "$manageWorkflowState", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    let cleanupForm = () => {
    };
    let cleanupBrowse = () => {
    };
    onMount(() => {
      cleanup = bindManageWorkflowState(window);
      cleanupForm = bindManageFormState(window);
      cleanupBrowse = bindBrowseBridgeState(window);
      return () => {
        cleanup();
        cleanupForm();
        cleanupBrowse();
      };
    });
    async function copyPath(path, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      try {
        await navigator.clipboard.writeText(path || "");
        showToast("Copied path");
      } catch (err) {
        showToast("Copy failed: " + err);
      }
    }
    function rootLabel(root14) {
      if (!root14) return "";
      return root14.base && root14.base !== root14.path ? `${root14.base} \xB7 ${root14.path}` : root14.path || "";
    }
    init();
    var fragment = root_110();
    var div = sibling(first_child(fragment), 2);
    var select = sibling(child(div), 2);
    each(select, 5, () => $browseBridgeState().roots, index, ($$anchor2, root14) => {
      var option = root_26();
      var text2 = child(option, true);
      reset(option);
      var option_value = {};
      template_effect(
        ($0) => {
          set_text(text2, $0);
          if (option_value !== (option_value = get2(root14).path)) {
            option.value = (option.__value = get2(root14).path) ?? "";
          }
        },
        [() => rootLabel(get2(root14))]
      );
      append($$anchor2, option);
    });
    reset(select);
    var select_value;
    init_select(select);
    reset(div);
    var div_1 = sibling(div, 2);
    var input = sibling(child(div_1), 2);
    remove_input_defaults(input);
    reset(div_1);
    var div_2 = sibling(div_1, 2);
    var button = child(div_2);
    var button_1 = sibling(button, 2);
    reset(div_2);
    var div_3 = sibling(div_2, 2);
    var div_4 = child(div_3);
    var div_5 = sibling(child(div_4), 2);
    var text_1 = child(div_5);
    reset(div_5);
    reset(div_4);
    var div_6 = sibling(div_4, 2);
    var table = child(div_6);
    var tbody = sibling(child(table));
    var node = child(tbody);
    {
      var consequent = ($$anchor2) => {
        var tr = root_35();
        append($$anchor2, tr);
      };
      var alternate = ($$anchor2) => {
        var fragment_1 = comment();
        var node_1 = first_child(fragment_1);
        each(node_1, 1, () => $manageWorkflowState().subtitleRows, index, ($$anchor3, item, idx) => {
          var tr_1 = root_53();
          var td = child(tr_1);
          var span = child(td);
          var text_2 = child(span, true);
          reset(span);
          reset(td);
          var td_1 = sibling(td);
          var span_1 = child(td_1);
          var text_3 = child(span_1, true);
          reset(span_1);
          reset(td_1);
          var td_2 = sibling(td_1);
          var div_7 = child(td_2);
          var button_2 = child(div_7);
          var button_3 = sibling(button_2);
          reset(div_7);
          reset(td_2);
          reset(tr_1);
          template_effect(() => {
            set_attribute2(span, "title", get2(item).path || "");
            set_text(text_2, get2(item).current || "");
            set_attribute2(span_1, "title", get2(item).newPath || "");
            set_text(text_3, get2(item).suggested || "");
            set_attribute2(button_2, "title", get2(item).path || "");
          });
          delegated("click", button_2, (event2) => copyPath(get2(item).path || "", event2));
          delegated("click", button_3, () => requestManageAction("queueSubtitleRename", { index: idx }));
          append($$anchor3, tr_1);
        });
        append($$anchor2, fragment_1);
      };
      if_block(node, ($$render) => {
        if (!$manageWorkflowState().subtitleRows.length) $$render(consequent);
        else $$render(alternate, -1);
      });
    }
    reset(tbody);
    reset(table);
    reset(div_6);
    reset(div_3);
    template_effect(() => {
      if (select_value !== (select_value = $manageFormState().subtitleRoot)) {
        select.value = (select.__value = $manageFormState().subtitleRoot) ?? "", select_option(select, $manageFormState().subtitleRoot);
      }
      set_value(input, $manageFormState().subtitlePath);
      set_text(text_1, `${$manageWorkflowState().subtitleRows.length ?? ""} rows`);
    });
    delegated("change", select, (event2) => requestManageFormPatch({ subtitleRoot: event2.currentTarget.value }));
    delegated("input", input, (event2) => {
      event2.currentTarget.dataset.manual = event2.currentTarget.value.trim() ? "1" : "";
      requestManageFormPatch({ subtitlePath: event2.currentTarget.value });
    });
    delegated("click", button, () => requestManageAction("scanSubtitleCandidates"));
    delegated("click", button_1, () => requestManageAction("prefillManageFromBrowse", { kind: "subtitles" }));
    append($$anchor, fragment);
    pop();
    $$cleanup();
  }
  delegate(["change", "input", "click"]);

  // _components/ManageWorkflowCard.svelte
  var root_111 = from_html(`<button> </button>`);
  var root7 = from_html(`<div class="card"><div class="cardInner"><h2>Manage</h2> <div class="previewBox" style="margin-bottom:16px"><div class="previewLabel">Flow</div> <div style="color:var(--muted); line-height:1.55">Step 1: choose what kind of maintenance you want to do. <br/>Step 2: scan only for candidates relevant to that mode. <br/>Step 3: preview one candidate or queue the action. <br/>Only the real action asks for password. Preview and scan stay password-free. <br/><strong>Root</strong> is the configured top-level media root. <br/><strong>Optional Subdirectory</strong> narrows the scan inside that root. Leave it empty to scan the whole root. <br/>Use <strong>Current Browse Path</strong> to avoid typing when you already navigated to the right area in Browse.</div></div> <div class="subTabs"></div> <div id="manage-pane-suggest"><!></div> <div id="manage-pane-common"><!></div> <div id="manage-pane-subtitles"><!></div> <div id="manage-pane-rename"><!></div> <div id="manage-pane-move"><!></div> <div id="manage-pane-delete"><!></div></div></div>`);
  function ManageWorkflowCard($$anchor, $$props) {
    push($$props, false);
    const $manageTab = () => store_get(manageTab, "$manageTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    onMount(() => {
      cleanup = bindManageTab(window);
      return () => cleanup();
    });
    function clickManageTab(tab, event2) {
      setManageTab(tab.id);
      requestSwitchManageTab(tab.id);
    }
    init();
    var div = root7();
    var div_1 = child(div);
    var div_2 = sibling(child(div_1), 4);
    each(div_2, 5, () => manageTabs_default, index, ($$anchor2, tab) => {
      var button = root_111();
      let classes;
      var text2 = child(button, true);
      reset(button);
      template_effect(() => {
        classes = set_class(button, 1, "subTabBtn", null, classes, { active: $manageTab() === get2(tab).id });
        set_attribute2(button, "data-manage-tab", get2(tab).id);
        set_text(text2, get2(tab).label);
      });
      delegated("click", button, (event2) => clickManageTab(get2(tab), event2));
      append($$anchor2, button);
    });
    reset(div_2);
    var div_3 = sibling(div_2, 2);
    let classes_1;
    var node = child(div_3);
    ManageSuggestPane(node, {});
    reset(div_3);
    var div_4 = sibling(div_3, 2);
    let classes_2;
    var node_1 = child(div_4);
    ManageCommonPane(node_1, {});
    reset(div_4);
    var div_5 = sibling(div_4, 2);
    let classes_3;
    var node_2 = child(div_5);
    ManageSubtitlePane(node_2, {});
    reset(div_5);
    var div_6 = sibling(div_5, 2);
    let classes_4;
    var node_3 = child(div_6);
    ManageRenamePane(node_3, {});
    reset(div_6);
    var div_7 = sibling(div_6, 2);
    let classes_5;
    var node_4 = child(div_7);
    ManageMovePane(node_4, {});
    reset(div_7);
    var div_8 = sibling(div_7, 2);
    let classes_6;
    var node_5 = child(div_8);
    ManageDeletePane(node_5, {});
    reset(div_8);
    reset(div_1);
    reset(div);
    template_effect(() => {
      classes_1 = set_class(div_3, 1, "subPane", null, classes_1, { active: $manageTab() === "suggest" });
      classes_2 = set_class(div_4, 1, "subPane", null, classes_2, { active: $manageTab() !== "subtitles" });
      classes_3 = set_class(div_5, 1, "subPane", null, classes_3, { active: $manageTab() === "subtitles" });
      classes_4 = set_class(div_6, 1, "subPane", null, classes_4, { active: $manageTab() === "rename" });
      classes_5 = set_class(div_7, 1, "subPane", null, classes_5, { active: $manageTab() === "move" });
      classes_6 = set_class(div_8, 1, "subPane", null, classes_6, { active: $manageTab() === "delete" });
    });
    append($$anchor, div);
    pop();
    $$cleanup();
  }
  delegate(["click"]);

  // _states/managePreview.js
  var initialState4 = {
    title: "Step 3: Name Fix Preview / Queue",
    selectedSource: "",
    previewHtml: "Fill the flow above, then click <strong>Preview</strong>.",
    locked: false,
    resultText: ""
  };
  var managePreview = writable(initialState4);
  function stringifyResult(value) {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }
  function bindManagePreview(windowRef) {
    const previewHandler = (event2) => {
      const detail = event2?.detail || {};
      managePreview.update((current) => {
        if (detail.kind === "unlock") {
          return { ...current, locked: false };
        }
        if (detail.kind === "meta") {
          return {
            ...current,
            title: detail.title || current.title,
            previewHtml: current.locked ? current.previewHtml : detail.previewHtml || current.previewHtml
          };
        }
        if (detail.kind === "preview") {
          return {
            ...current,
            previewHtml: detail.previewHtml || "",
            locked: true
          };
        }
        if (detail.kind === "selectedSource") {
          return {
            ...current,
            selectedSource: detail.selectedSource || ""
          };
        }
        return current;
      });
    };
    const resultHandler = (event2) => {
      const detail = event2?.detail || {};
      managePreview.update((current) => ({
        ...current,
        resultText: stringifyResult(detail.value)
      }));
    };
    windowRef?.addEventListener?.("indexer:managePreview", previewHandler);
    windowRef?.addEventListener?.("indexer:manageResult", resultHandler);
    return () => {
      windowRef?.removeEventListener?.("indexer:managePreview", previewHandler);
      windowRef?.removeEventListener?.("indexer:manageResult", resultHandler);
    };
  }

  // _components/ManagePreviewCard.svelte
  var root8 = from_html(`<div class="card"><div class="cardInner"><h2 id="managePreviewTitle"> </h2> <div class="previewBox mono" style="margin-bottom:14px; min-height:auto; padding:10px 12px" id="manageSelectedSource"> </div> <div id="managePreview" class="previewBox"></div> <div class="previewLabel" style="margin-top:14px">Last Response / Queue Result</div> <div id="manageResult" class="statusBox" style="margin-top:14px; min-height:180px"> </div></div></div>`);
  function ManagePreviewCard($$anchor, $$props) {
    push($$props, false);
    const $managePreview = () => store_get(managePreview, "$managePreview", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    onMount(() => {
      cleanup = bindManagePreview(window);
      return () => cleanup();
    });
    init();
    var div = root8();
    var div_1 = child(div);
    var h2 = child(div_1);
    var text2 = child(h2, true);
    reset(h2);
    var div_2 = sibling(h2, 2);
    var text_1 = child(div_2, true);
    reset(div_2);
    var div_3 = sibling(div_2, 2);
    html(div_3, () => $managePreview().previewHtml, true);
    reset(div_3);
    var div_4 = sibling(div_3, 4);
    var text_2 = child(div_4, true);
    reset(div_4);
    reset(div_1);
    reset(div);
    template_effect(() => {
      set_text(text2, $managePreview().title);
      set_text(text_1, $managePreview().selectedSource);
      set_attribute2(div_3, "data-locked", $managePreview().locked ? "1" : "");
      set_text(text_2, $managePreview().resultText);
    });
    append($$anchor, div);
    pop();
    $$cleanup();
  }

  // _components/ManageTabPane.svelte
  var root9 = from_html(`<section id="tab-manage"><div class="split"><!> <!></div></section>`);
  function ManageTabPane($$anchor) {
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    var section = root9();
    let classes;
    var div = child(section);
    var node = child(div);
    ManageWorkflowCard(node, {});
    var node_1 = sibling(node, 2);
    ManagePreviewCard(node_1, {});
    reset(div);
    reset(section);
    template_effect(() => classes = set_class(section, 1, "tabPane", null, classes, { active: $activeTab() === "manage" }));
    append($$anchor, section);
    $$cleanup();
  }

  // _helpers/categorizeQueue.js
  function parseCategorizeMessage(message) {
    const raw = String(message || "");
    const out = {};
    ["moved", "skipped_existing", "removed_aux", "removed_screens", "removed_empty_dirs"].forEach((key2) => {
      const m = raw.match(new RegExp(key2 + "=(\\d+)"));
      if (m) out[key2] = Number(m[1]);
    });
    return out;
  }
  function categorizeSummaryLabel(key2) {
    switch (key2) {
      case "moved":
        return "Moved";
      case "skipped_existing":
        return "Skipped Existing";
      case "removed_aux":
        return "Removed Aux";
      case "removed_screens":
        return "Removed Screens";
      case "removed_empty_dirs":
        return "Removed Empty Dirs";
      default:
        return String(key2 || "").replaceAll("_", " ");
    }
  }
  function renderManageTaskMeta(task) {
    if (!task || task.action !== "categorize") return "";
    const bits = [];
    if (task.watchedCount) bits.push("watched=" + escapeHtml2(String(task.watchedCount)));
    bits.push("videosOnly=" + escapeHtml2(String(!!task.videosOnly)));
    bits.push("removeEmpty=" + escapeHtml2(String(!!task.removeEmptyDirs)));
    return '<div class="mono" style="margin-top:4px; color:var(--muted)">' + bits.join(" ") + "</div>";
  }
  function categorizeKindLabel(kind) {
    switch (String(kind || "")) {
      case "subtitle":
        return "SUB";
      case "auxiliary":
        return "AUX";
      default:
        return "VID";
    }
  }
  function categorizeKindClass(kind) {
    switch (String(kind || "")) {
      case "subtitle":
        return "pillFile";
      case "auxiliary":
        return "pillFile";
      default:
        return "pillDir";
    }
  }
  function escapeJSString(text2) {
    return String(text2 || "").replaceAll("\\", "\\\\").replaceAll("'", "\\'").replaceAll("\n", "\\n");
  }
  function renderManageMessage(message) {
    const raw = String(message || "");
    const summary = parseCategorizeMessage(raw);
    const keys = Object.keys(summary);
    if (!keys.length) {
      return '<div class="mono">' + escapeHtml2(raw) + "</div>";
    }
    const summaryHtml = '<div class="previewList">' + keys.map(
      (key2) => '<div class="previewItem"><div class="previewLabel">' + escapeHtml2(categorizeSummaryLabel(key2)) + '</div><div class="mono">' + escapeHtml2(String(summary[key2])) + "</div></div>"
    ).join("") + "</div>";
    const rawTrim = raw.trim();
    const summaryOnly = /^categorize completed\b/i.test(rawTrim);
    if (summaryOnly) {
      return summaryHtml;
    }
    return summaryHtml + '<details style="margin-top:8px"><summary class="mono" style="color:var(--muted); cursor:pointer">Raw output</summary><div class="mono" style="margin-top:6px; color:var(--muted); white-space:pre-wrap">' + escapeHtml2(raw) + "</div></details>";
  }
  function sortLabel(state2, which, field, label) {
    const sortByKey = which === "groups" ? "categorizeGroupSortBy" : which === "ops" ? "categorizeOpSortBy" : "categorizeAmbiguousSortBy";
    const sortDescKey = which === "groups" ? "categorizeGroupSortDesc" : which === "ops" ? "categorizeOpSortDesc" : "categorizeAmbiguousSortDesc";
    if (state2[sortByKey] !== field) return label;
    return label + (state2[sortDescKey] ? " \u2193" : " \u2191");
  }
  function buildCategorizePreviewHtml(res, opts, state2) {
    const ops = res.operations || [];
    const groups = res.groups || [];
    const ambiguous = res.ambiguousSubtitles || [];
    const kindFilter = state2.categorizeKindFilter || "all";
    const groupFilter = state2.categorizeGroupFilter || "";
    const groupTextFilter = String(state2.categorizeGroupTextFilter || "").trim().toLowerCase();
    const textFilter = String(state2.categorizeTextFilter || "").trim().toLowerCase();
    const ambiguousFilter = String(state2.categorizeAmbiguousFilter || "").trim().toLowerCase();
    const filteredOps = ops.filter((item) => {
      if (kindFilter !== "all" && String(item.kind || "") !== kindFilter) return false;
      if (groupFilter && String(item.targetDir || "") !== groupFilter) return false;
      if (textFilter) {
        const hay = ((item.source || "") + " " + (item.target || "") + " " + (item.targetDir || "")).toLowerCase();
        if (!hay.includes(textFilter)) return false;
      }
      return true;
    });
    const filteredAmbiguous = ambiguous.filter((item) => {
      if (!ambiguousFilter) return true;
      const hay = ((item.video || "") + " " + (item.candidates || []).join(" ")).toLowerCase();
      return hay.includes(ambiguousFilter);
    });
    const visibleGroups = groups.filter((group) => {
      if (groupFilter && String(group.targetDir || "") !== groupFilter) return false;
      if (groupTextFilter) {
        const hay = String(group.targetDir || "").toLowerCase();
        if (!hay.includes(groupTextFilter)) return false;
      }
      return true;
    });
    const sortedGroups = [...visibleGroups].sort((a, b) => {
      const field = state2.categorizeGroupSortBy || "targetDir";
      const desc = !!state2.categorizeGroupSortDesc;
      const av = field === "count" ? a.count || 0 : field === "videoMoves" ? a.videoMoves || 0 : field === "subtitleMoves" ? a.subtitleMoves || 0 : field === "auxiliaryMoves" ? a.auxiliaryMoves || 0 : String(a.targetDir || "");
      const bv = field === "count" ? b.count || 0 : field === "videoMoves" ? b.videoMoves || 0 : field === "subtitleMoves" ? b.subtitleMoves || 0 : field === "auxiliaryMoves" ? b.auxiliaryMoves || 0 : String(b.targetDir || "");
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return String(a.targetDir || "").localeCompare(String(b.targetDir || ""));
    });
    const sortedFilteredOps = [...filteredOps].sort((a, b) => {
      const field = state2.categorizeOpSortBy || "target";
      const desc = !!state2.categorizeOpSortDesc;
      const av = String(field === "kind" ? a.kind || "" : field === "source" ? a.source || "" : a.target || "");
      const bv = String(field === "kind" ? b.kind || "" : field === "source" ? b.source || "" : b.target || "");
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return String(a.target || "").localeCompare(String(b.target || ""));
    });
    const sortedFilteredAmbiguous = [...filteredAmbiguous].sort((a, b) => {
      const field = state2.categorizeAmbiguousSortBy || "video";
      const desc = !!state2.categorizeAmbiguousSortDesc;
      const av = String(field === "candidates" ? (a.candidates || []).join(", ") : a.video || "");
      const bv = String(field === "candidates" ? (b.candidates || []).join(", ") : b.video || "");
      if (av < bv) return desc ? 1 : -1;
      if (av > bv) return desc ? -1 : 1;
      return String(a.video || "").localeCompare(String(b.video || ""));
    });
    const kindButtons = [
      ["all", "ALL"],
      ["video", "VID"],
      ["subtitle", "SUB"],
      ["auxiliary", "AUX"]
    ].map(
      ([value, label]) => '<button class="' + (kindFilter === value ? "" : "ghost") + `" onclick="setCategorizeKindFilter('` + value + `')">` + label + "</button>"
    ).join("");
    const activeFilters = [];
    if (kindFilter !== "all") activeFilters.push("kind=" + kindFilter);
    if (groupFilter) activeFilters.push("group=" + groupFilter);
    if (groupTextFilter) activeFilters.push("groups=" + groupTextFilter);
    if (textFilter) activeFilters.push("ops=" + textFilter);
    if (ambiguousFilter) activeFilters.push("ambiguous=" + ambiguousFilter);
    const warnings = [];
    if (res.truncated) warnings.push("preview truncated");
    if (ambiguous.length) warnings.push("ambiguous subtitles: " + ambiguous.length);
    return '<div class="previewLabel">Categorize Preview</div><div class="previewList"><div class="previewItem"><div class="previewLabel">Detected Videos</div><div class="mono">' + escapeHtml2(String(res.detectedVideoFiles || 0)) + '</div></div><div class="previewItem"><div class="previewLabel">Detected Groups</div><div class="mono">' + escapeHtml2(String(res.detectedGroups || 0)) + '</div></div><div class="previewItem"><div class="previewLabel">Planned Moves</div><div class="mono">' + escapeHtml2(String(res.plannedMoves || 0)) + (res.truncated ? " (truncated)" : "") + '</div></div><div class="previewItem"><div class="previewLabel">Video / Subtitle / Aux</div><div class="mono">' + escapeHtml2(String(res.videoMoves || 0)) + " / " + escapeHtml2(String(res.subtitleMoves || 0)) + " / " + escapeHtml2(String(res.auxiliaryMoves || 0)) + '</div></div><div class="previewItem"><div class="previewLabel">Watched Count / Videos Only</div><div class="mono">' + escapeHtml2(String(opts.watchedCount)) + " / " + escapeHtml2(String(!!opts.videosOnly)) + '</div></div><div class="previewItem"><div class="previewLabel">Warnings</div><div class="mono">' + (warnings.length ? escapeHtml2(warnings.join(" | ")) : "none") + '</div></div></div><div class="row" style="margin:0 0 12px 0"><button onclick="queueCategorize()">Queue Categorize Apply</button><button class="ghost" onclick="copyCategorizeCurrentView()">Copy Current View</button><button class="ghost" onclick="copyCategorizeFilteredOperations()">Copy Filtered Ops</button><button class="ghost" onclick="resetCategorizeFilters()">Reset Filters</button></div><div class="previewBox mono" style="margin-bottom:12px; min-height:auto; padding:8px 10px">' + (activeFilters.length ? "Active Filters: " + escapeHtml2(activeFilters.join(" | ")) : "Active Filters: none") + '</div><div class="resultPane" style="margin-bottom:12px"><div class="resultHeader"><h2>Target Groups</h2><div class="row" style="margin:0"><div class="mono" style="color:var(--muted)">' + visibleGroups.length + " / " + groups.length + ' groups</div><button class="ghost" onclick="copyCategorizeFilteredGroups()">Copy Filtered</button>' + (groupFilter ? `<button class="ghost" onclick="setCategorizeGroupFilter('')">Clear Group</button>` : "") + '</div></div><div class="row" style="margin:0 0 10px 0"><input value="' + escapeHtml2(state2.categorizeGroupTextFilter || "") + `" oninput="setCategorizeGroupTextFilter(this.value)" placeholder="Filter groups by target folder"><button class="ghost" onclick="setCategorizeGroupTextFilter('')">Clear</button></div><div class="resultScroll" style="max-height:220px"><table><thead><tr><th class="clickable" onclick="toggleCategorizeSort('groups', 'targetDir')" style="width:44%">` + sortLabel(state2, "groups", "targetDir", "Target Folder") + `</th><th class="clickable" onclick="toggleCategorizeSort('groups', 'count')" style="width:10%">` + sortLabel(state2, "groups", "count", "Items") + `</th><th class="clickable" onclick="toggleCategorizeSort('groups', 'videoMoves')" style="width:10%">` + sortLabel(state2, "groups", "videoMoves", "VID") + `</th><th class="clickable" onclick="toggleCategorizeSort('groups', 'subtitleMoves')" style="width:10%">` + sortLabel(state2, "groups", "subtitleMoves", "SUB") + `</th><th class="clickable" onclick="toggleCategorizeSort('groups', 'auxiliaryMoves')" style="width:10%">` + sortLabel(state2, "groups", "auxiliaryMoves", "AUX") + '</th><th style="width:16%">Action</th></tr></thead><tbody>' + (sortedGroups.length ? sortedGroups.map(
      (group) => `<tr class="clickable" onclick="setCategorizeGroupFilter('` + escapeJSString(group.targetDir || "") + `')"><td class="mono"><span class="cellEllipsis" title="` + escapeHtml2(group.targetDir || "") + '">' + escapeHtml2(group.targetDir || "") + "</span>" + (groupFilter === String(group.targetDir || "") ? ' <span class="pill pillDir">FILTER</span>' : "") + '</td><td class="mono">' + escapeHtml2(String(group.count || 0)) + '</td><td class="mono">' + escapeHtml2(String(group.videoMoves || 0)) + '</td><td class="mono">' + escapeHtml2(String(group.subtitleMoves || 0)) + '</td><td class="mono">' + escapeHtml2(String(group.auxiliaryMoves || 0)) + `</td><td><div class="row" style="margin:0"><button class="ghost iconBtn" title="Copy folder" onclick="copyPlainText('` + escapeJSString(group.targetDir || "") + `', event)">\u29C9F</button><button class="ghost iconBtn" title="Filter this folder" onclick="setCategorizeGroupFilter('` + escapeJSString(group.targetDir || "") + `'); event.stopPropagation()">\u2197</button></div></td></tr>`
    ).join("") : '<tr><td colspan="6" class="empty">No target folders for the current filters</td></tr>') + '</tbody></table></div></div><div class="resultPane" style="margin-bottom:12px"><div class="resultHeader"><h2>Planned Operations</h2><div class="row" style="margin:0"><div class="mono" style="color:var(--muted)">' + filteredOps.length + " / " + ops.length + " rows</div>" + kindButtons + '</div></div><div class="row" style="margin:0 0 10px 0"><input value="' + escapeHtml2(state2.categorizeTextFilter || "") + `" oninput="setCategorizeTextFilter(this.value)" placeholder="Filter operations by source, target, or folder"><button class="ghost" onclick="setCategorizeTextFilter('')">Clear</button></div><div class="resultScroll" style="max-height:280px"><table><thead><tr><th class="clickable" onclick="toggleCategorizeSort('ops', 'kind')" style="width:10%">` + sortLabel(state2, "ops", "kind", "Kind") + `</th><th class="clickable" onclick="toggleCategorizeSort('ops', 'source')" style="width:31%">` + sortLabel(state2, "ops", "source", "Source") + `</th><th class="clickable" onclick="toggleCategorizeSort('ops', 'target')" style="width:31%">` + sortLabel(state2, "ops", "target", "Target") + '</th><th style="width:28%">Action</th></tr></thead><tbody>' + (sortedFilteredOps.length ? sortedFilteredOps.map(
      (item) => '<tr><td><button class="ghost pill ' + categorizeKindClass(item.kind) + `" title="Filter this kind" onclick="setCategorizeKindFilter('` + escapeJSString(item.kind || "all") + `'); event.stopPropagation()">` + escapeHtml2(categorizeKindLabel(item.kind)) + '</button></td><td class="mono"><span class="cellEllipsis" title="' + escapeHtml2(item.source || "") + '">' + escapeHtml2(item.source || "") + '</span></td><td class="mono"><span class="cellEllipsis" title="' + escapeHtml2(item.target || "") + '">' + escapeHtml2(item.target || "") + `</span></td><td><div class="row" style="margin:0"><button class="ghost iconBtn" title="Copy source" onclick="copyPlainText('` + escapeJSString(item.source || "") + `', event)">\u29C9S</button><button class="ghost iconBtn" title="Copy target" onclick="copyPlainText('` + escapeJSString(item.target || "") + `', event)">\u29C9T</button><button class="ghost iconBtn" title="Filter target folder" onclick="setCategorizeGroupFilter('` + escapeJSString(item.targetDir || "") + `'); event.stopPropagation()">\u2197G</button></div></td></tr>`
    ).join("") : '<tr><td colspan="4" class="empty">No planned operations for the current filters</td></tr>') + "</tbody></table></div></div>" + (ambiguous.length ? '<div class="resultPane" style="margin-bottom:12px"><div class="resultHeader"><h2>Ambiguous Subtitles Skipped</h2><div class="row" style="margin:0"><div class="mono" style="color:var(--muted)">' + filteredAmbiguous.length + " / " + ambiguous.length + ' rows</div><button class="ghost" onclick="copyCategorizeFilteredAmbiguous()">Copy Filtered</button></div></div><div class="row" style="margin:0 0 10px 0"><input value="' + escapeHtml2(state2.categorizeAmbiguousFilter || "") + `" oninput="setCategorizeAmbiguousFilter(this.value)" placeholder="Filter ambiguous subtitles by video or candidate"><button class="ghost" onclick="setCategorizeAmbiguousFilter('')">Clear</button></div><div class="resultScroll" style="max-height:220px"><table><thead><tr><th class="clickable" onclick="toggleCategorizeSort('ambiguous', 'video')" style="width:28%">` + sortLabel(state2, "ambiguous", "video", "Video") + `</th><th class="clickable" onclick="toggleCategorizeSort('ambiguous', 'candidates')" style="width:54%">` + sortLabel(state2, "ambiguous", "candidates", "Candidates") + '</th><th style="width:18%">Action</th></tr></thead><tbody>' + (sortedFilteredAmbiguous.length ? sortedFilteredAmbiguous.map(
      (item) => '<tr><td class="mono"><span class="cellEllipsis" title="' + escapeHtml2(item.video || "") + '">' + escapeHtml2(item.video || "") + '</span></td><td class="mono"><span class="cellEllipsis" title="' + escapeHtml2((item.candidates || []).join(", ")) + '">' + escapeHtml2((item.candidates || []).join(", ")) + `</span></td><td><div class="row" style="margin:0"><button class="ghost iconBtn" title="Copy video" onclick="copyPlainText('` + escapeJSString(item.video || "") + `', event)">\u29C9V</button><button class="ghost iconBtn" title="Copy candidates" onclick="copyPlainText('` + escapeJSString((item.candidates || []).join(", ")) + `', event)">\u29C9C</button></div></td></tr>`
    ).join("") : '<tr><td colspan="3" class="empty">No ambiguous subtitle rows for the current filter</td></tr>') + "</tbody></table></div></div>" : "") + `<details class="previewBox" style="min-height:auto; padding:10px 12px"><summary class="mono" style="cursor:pointer">Raw Script Output</summary><div class="row" style="margin:10px 0"><button class="ghost" onclick="copyPlainText('` + escapeJSString(res.output || "") + `', event)">Copy Raw Output</button></div><div class="statusBox" style="min-height:140px; max-height:320px; margin-top:0">` + escapeHtml2(res.output || "") + "</div></details>";
  }

  // _components/QueueTabPane.svelte
  var root_112 = from_html(`<div class="mono"> </div>`);
  var root_43 = from_html(`<div class="previewItem"><div class="previewLabel">Running</div> <div class="mono"> <br/> </div> <!> <!></div>`);
  var root_54 = from_html(`<div class="previewItem"><div class="previewLabel">Queued</div> <div class="mono"> <br/> </div> <!> <div class="row" style="margin:6px 0 0 0"><input type="checkbox"/> <button class="ghost warn">Cancel</button></div> <!></div>`);
  var root_36 = from_html(`<!> <!>`, 1);
  var root_64 = from_html(`<div class="previewBox mono" style="min-height:auto; margin-top:12px"> </div>`);
  var root_73 = from_html(`<tr><td colspan="5" class="empty"> </td></tr>`);
  var root_83 = from_html(`<tr><td colspan="5" class="empty">No history yet</td></tr>`);
  var root_11 = from_html(`<div style="margin-top:4px"></div>`);
  var root_102 = from_html(`<tr><td><div class="row" style="margin:0"><input type="checkbox"/> <span> </span></div></td><td> </td><td><span class="cellEllipsis mono"> </span></td><td><span class="cellEllipsis mono"> </span></td><td><div class="mono"> </div> <!> <div class="row" style="margin:6px 0 0 0"><button class="ghost">Retry</button></div> <!></td></tr>`);
  var root10 = from_html(`<section id="tab-queue"><div class="split"><div class="card"><div class="cardInner"><div class="resultHeader"><h2>Queue</h2> <div class="row" style="margin:0"><button class="ghost warn">Cancel Selected</button> <button class="ghost">Refresh</button></div></div> <div class="previewBox"><!></div> <!></div></div> <div class="card"><div class="cardInner"><div class="resultHeader"><h2>History</h2> <div class="row" style="margin:0"><button class="ghost">Retry Selected</button> <button class="ghost">Refresh</button></div></div> <div class="resultScroll" style="max-height:520px"><table><thead><tr><th>Action</th><th>Status</th><th>Source</th><th>Target</th><th>Finished</th></tr></thead><tbody><!></tbody></table></div></div></div></div></section>`);
  function QueueTabPane($$anchor, $$props) {
    push($$props, false);
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    const shouldPollQueue = mutable_source();
    let runningTasks = mutable_source([]);
    let queued = mutable_source([]);
    let historyRows = mutable_source([]);
    let selectedQueueRows = mutable_source([]);
    let selectedHistoryRows = mutable_source([]);
    let queueError = mutable_source("");
    let historyError = mutable_source("");
    let resultText = mutable_source("");
    let queueTimer = mutable_source(null);
    let historyTimer = mutable_source(null);
    let mounted = mutable_source(false);
    function apiUrl(key2, fallback2) {
      return jsApi_GEN_default[key2] || fallback2;
    }
    function toast(message) {
      if (!message) return;
      showToast(String(message));
    }
    function renderMetaHtml(task) {
      return renderManageTaskMeta(task) || "";
    }
    function renderMessageHtml(message) {
      return renderManageMessage(message) || "";
    }
    async function getJSON(url, options = {}) {
      const res = await fetch(url, options);
      const text2 = await res.text();
      if (!res.ok) {
        throw new Error(text2 || "HTTP " + res.status);
      }
      return text2 ? JSON.parse(text2) : {};
    }
    async function postJSON2(url, body) {
      return getJSON(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body || {})
      });
    }
    function updateSelectedRows(existing, rows) {
      const valid = new Set((rows || []).map((item) => item?.id).filter(Boolean));
      return (existing || []).filter((id) => valid.has(id));
    }
    async function refreshQueue() {
      try {
        const res = await getJSON(apiUrl("manageStatus", "/api/manage/status"));
        set(runningTasks, (res.runningTasks && res.runningTasks.length ? res.runningTasks : res.running?.id ? [res.running] : []) || []);
        set(queued, res.queued || []);
        set(selectedQueueRows, updateSelectedRows(get2(selectedQueueRows), get2(queued)));
        set(queueError, "");
      } catch (err) {
        set(queueError, String(err?.message || err));
      }
    }
    async function refreshHistory() {
      try {
        const rows = await getJSON(apiUrl("manageHistory", "/api/manage/history") + "?limit=100");
        set(historyRows, Array.isArray(rows) ? rows : []);
        set(selectedHistoryRows, updateSelectedRows(get2(selectedHistoryRows), get2(historyRows)));
        set(historyError, "");
      } catch (err) {
        set(historyError, String(err?.message || err));
      }
    }
    function toggleQueueSelection(id, checked) {
      set(selectedQueueRows, checked ? [...get2(selectedQueueRows), id].filter((value, idx, arr) => arr.indexOf(value) === idx) : get2(selectedQueueRows).filter((value) => value !== id));
    }
    function toggleHistorySelection(id, checked) {
      set(selectedHistoryRows, checked ? [...get2(selectedHistoryRows), id].filter((value, idx, arr) => arr.indexOf(value) === idx) : get2(selectedHistoryRows).filter((value) => value !== id));
    }
    async function cancelTask2(id) {
      if (!id) return;
      try {
        const res = await postJSON2(apiUrl("manageCancel", "/api/manage/cancel"), { id });
        set(resultText, res?.message || "Queued task cancelled");
        toast(get2(resultText));
        await Promise.all([refreshQueue(), refreshHistory()]);
      } catch (err) {
        const message = String(err?.message || err);
        set(resultText, message);
        toast(message);
      }
    }
    async function cancelSelected2() {
      if (!get2(selectedQueueRows).length) {
        toast("No queued tasks selected");
        return;
      }
      let cancelled = 0;
      const errors = [];
      for (const id of get2(selectedQueueRows)) {
        try {
          await postJSON2(apiUrl("manageCancel", "/api/manage/cancel"), { id });
          cancelled += 1;
        } catch (err) {
          errors.push(String(err?.message || err));
        }
      }
      set(selectedQueueRows, []);
      set(resultText, errors.length ? `cancelled=${cancelled} errors=${errors.length}` : `cancelled=${cancelled}`);
      toast(errors.length ? "Batch cancel finished with errors" : `Batch cancel: ${cancelled}`);
      await Promise.all([refreshQueue(), refreshHistory()]);
    }
    async function retryTask(id) {
      if (!id) return;
      const password = window.prompt("Manage password?") || "";
      if (!password) {
        toast("Password is required to retry this action");
        return;
      }
      try {
        const res = await postJSON2(apiUrl("manageRetry", "/api/manage/retry"), { id, password });
        set(resultText, res?.message || "Manage action retried");
        toast(get2(resultText));
        await Promise.all([refreshQueue(), refreshHistory()]);
      } catch (err) {
        const message = String(err?.message || err);
        set(resultText, message);
        toast(message);
      }
    }
    async function retrySelected2() {
      if (!get2(selectedHistoryRows).length) {
        toast("No history rows selected");
        return;
      }
      const password = window.prompt("Manage password?") || "";
      if (!password) {
        toast("Password is required to retry these actions");
        return;
      }
      let retried = 0;
      const errors = [];
      for (const id of get2(selectedHistoryRows)) {
        try {
          await postJSON2(apiUrl("manageRetry", "/api/manage/retry"), { id, password });
          retried += 1;
        } catch (err) {
          errors.push(String(err?.message || err));
        }
      }
      set(selectedHistoryRows, []);
      set(resultText, errors.length ? `retried=${retried} errors=${errors.length}` : `retried=${retried}`);
      toast(errors.length ? "Batch retry finished with errors" : `Batch retry: ${retried}`);
      await Promise.all([refreshQueue(), refreshHistory()]);
    }
    function handleQueueRefreshRequest() {
      refreshQueue();
    }
    function handleHistoryRefreshRequest() {
      refreshHistory();
    }
    function syncPolling() {
      if (!get2(mounted)) return;
      const shouldPoll = $activeTab() === "queue" && (get2(runningTasks) && get2(runningTasks).length > 0 || get2(queued) && get2(queued).length > 0);
      if (shouldPoll && !get2(queueTimer)) {
        set(queueTimer, window.setInterval(refreshQueue, 3e3));
      } else if (!shouldPoll && get2(queueTimer)) {
        window.clearInterval(get2(queueTimer));
        set(queueTimer, null);
      }
      if (shouldPoll && !get2(historyTimer)) {
        set(historyTimer, window.setInterval(refreshHistory, 5e3));
      } else if (!shouldPoll && get2(historyTimer)) {
        window.clearInterval(get2(historyTimer));
        set(historyTimer, null);
      }
    }
    onMount(async () => {
      await Promise.all([refreshQueue(), refreshHistory()]);
      window.addEventListener("indexer:queueRefreshRequest", handleQueueRefreshRequest);
      window.addEventListener("indexer:historyRefreshRequest", handleHistoryRefreshRequest);
      set(mounted, true);
      syncPolling();
    });
    onDestroy(() => {
      window.removeEventListener("indexer:queueRefreshRequest", handleQueueRefreshRequest);
      window.removeEventListener("indexer:historyRefreshRequest", handleHistoryRefreshRequest);
      if (get2(queueTimer)) window.clearInterval(get2(queueTimer));
      if (get2(historyTimer)) window.clearInterval(get2(historyTimer));
    });
    legacy_pre_effect(
      () => (get2(mounted), $activeTab(), get2(runningTasks), get2(queued)),
      () => {
        set(shouldPollQueue, get2(mounted) && $activeTab() === "queue" && (get2(runningTasks) && get2(runningTasks).length > 0 || get2(queued) && get2(queued).length > 0));
      }
    );
    legacy_pre_effect(
      () => (get2(mounted), get2(shouldPollQueue), get2(queueTimer), get2(historyTimer)),
      () => {
        if (get2(mounted)) {
          if (get2(shouldPollQueue) && !get2(queueTimer)) {
            set(queueTimer, window.setInterval(refreshQueue, 3e3));
          } else if (!get2(shouldPollQueue) && get2(queueTimer)) {
            window.clearInterval(get2(queueTimer));
            set(queueTimer, null);
          }
          if (get2(shouldPollQueue) && !get2(historyTimer)) {
            set(historyTimer, window.setInterval(refreshHistory, 5e3));
          } else if (!get2(shouldPollQueue) && get2(historyTimer)) {
            window.clearInterval(get2(historyTimer));
            set(historyTimer, null);
          }
        }
      }
    );
    legacy_pre_effect_reset();
    init();
    var section = root10();
    let classes;
    var div = child(section);
    var div_1 = child(div);
    var div_2 = child(div_1);
    var div_3 = child(div_2);
    var div_4 = sibling(child(div_3), 2);
    var button = child(div_4);
    var button_1 = sibling(button, 2);
    reset(div_4);
    reset(div_3);
    var div_5 = sibling(div_3, 2);
    var node = child(div_5);
    {
      var consequent = ($$anchor2) => {
        var div_6 = root_112();
        var text_1 = child(div_6, true);
        reset(div_6);
        template_effect(() => set_text(text_1, get2(queueError)));
        append($$anchor2, div_6);
      };
      var consequent_1 = ($$anchor2) => {
        var text_2 = text("No queued actions.");
        append($$anchor2, text_2);
      };
      var alternate = ($$anchor2) => {
        var fragment = root_36();
        var node_1 = first_child(fragment);
        each(node_1, 1, () => get2(runningTasks), index, ($$anchor3, task) => {
          var div_7 = root_43();
          var div_8 = sibling(child(div_7), 2);
          var text_3 = child(div_8);
          var text_4 = sibling(text_3, 2, true);
          reset(div_8);
          var node_2 = sibling(div_8, 2);
          html(node_2, () => (get2(task), untrack(() => renderMetaHtml(get2(task)))));
          var node_3 = sibling(node_2, 2);
          html(node_3, () => (get2(task), untrack(() => renderMessageHtml(get2(task).message || ""))));
          reset(div_7);
          template_effect(() => {
            set_text(text_3, `${(get2(task), untrack(() => get2(task).action || "")) ?? ""} \u2022 ${(get2(task), untrack(() => get2(task).srcPath || "")) ?? ""}${(get2(task), untrack(() => get2(task).dstPath ? ` \u2192 ${get2(task).dstPath}` : "")) ?? ""} `);
            set_text(text_4, (get2(task), untrack(() => get2(task).status || "")));
          });
          append($$anchor3, div_7);
        });
        var node_4 = sibling(node_1, 2);
        each(node_4, 1, () => get2(queued), index, ($$anchor3, task) => {
          var div_9 = root_54();
          var div_10 = sibling(child(div_9), 2);
          var text_5 = child(div_10);
          var text_6 = sibling(text_5, 2, true);
          reset(div_10);
          var node_5 = sibling(div_10, 2);
          html(node_5, () => (get2(task), untrack(() => renderMetaHtml(get2(task)))));
          var div_11 = sibling(node_5, 2);
          var input = child(div_11);
          remove_input_defaults(input);
          var button_2 = sibling(input, 2);
          reset(div_11);
          var node_6 = sibling(div_11, 2);
          html(node_6, () => (get2(task), untrack(() => renderMessageHtml(get2(task).message || ""))));
          reset(div_9);
          template_effect(
            ($0) => {
              set_text(text_5, `${(get2(task), untrack(() => get2(task).action || "")) ?? ""} \u2022 ${(get2(task), untrack(() => get2(task).srcPath || "")) ?? ""}${(get2(task), untrack(() => get2(task).dstPath ? ` \u2192 ${get2(task).dstPath}` : "")) ?? ""} `);
              set_text(text_6, (get2(task), untrack(() => get2(task).status || "")));
              set_checked(input, $0);
            },
            [
              () => (get2(selectedQueueRows), get2(task), untrack(() => get2(selectedQueueRows).includes(get2(task).id)))
            ]
          );
          delegated("change", input, (event2) => toggleQueueSelection(get2(task).id, event2.currentTarget.checked));
          delegated("click", button_2, () => cancelTask2(get2(task).id));
          append($$anchor3, div_9);
        });
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (get2(queueError)) $$render(consequent);
        else if (get2(runningTasks), get2(queued), untrack(() => !get2(runningTasks).length && !get2(queued).length)) $$render(consequent_1, 1);
        else $$render(alternate, -1);
      });
    }
    reset(div_5);
    var node_7 = sibling(div_5, 2);
    {
      var consequent_2 = ($$anchor2) => {
        var div_12 = root_64();
        var text_7 = child(div_12, true);
        reset(div_12);
        template_effect(() => set_text(text_7, get2(resultText)));
        append($$anchor2, div_12);
      };
      if_block(node_7, ($$render) => {
        if (get2(resultText)) $$render(consequent_2);
      });
    }
    reset(div_2);
    reset(div_1);
    var div_13 = sibling(div_1, 2);
    var div_14 = child(div_13);
    var div_15 = child(div_14);
    var div_16 = sibling(child(div_15), 2);
    var button_3 = child(div_16);
    var button_4 = sibling(button_3, 2);
    reset(div_16);
    reset(div_15);
    var div_17 = sibling(div_15, 2);
    var table = child(div_17);
    var tbody = sibling(child(table));
    var node_8 = child(tbody);
    {
      var consequent_3 = ($$anchor2) => {
        var tr = root_73();
        var td = child(tr);
        var text_8 = child(td, true);
        reset(td);
        reset(tr);
        template_effect(() => set_text(text_8, get2(historyError)));
        append($$anchor2, tr);
      };
      var consequent_4 = ($$anchor2) => {
        var tr_1 = root_83();
        append($$anchor2, tr_1);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment_1 = comment();
        var node_9 = first_child(fragment_1);
        each(node_9, 1, () => get2(historyRows), index, ($$anchor3, item) => {
          var tr_2 = root_102();
          var td_1 = child(tr_2);
          var div_18 = child(td_1);
          var input_1 = child(div_18);
          remove_input_defaults(input_1);
          var span = sibling(input_1, 2);
          var text_9 = child(span, true);
          reset(span);
          reset(div_18);
          reset(td_1);
          var td_2 = sibling(td_1);
          var text_10 = child(td_2, true);
          reset(td_2);
          var td_3 = sibling(td_2);
          var span_1 = child(td_3);
          var text_11 = child(span_1, true);
          reset(span_1);
          reset(td_3);
          var td_4 = sibling(td_3);
          var span_2 = child(td_4);
          var text_12 = child(span_2, true);
          reset(span_2);
          reset(td_4);
          var td_5 = sibling(td_4);
          var div_19 = child(td_5);
          var text_13 = child(div_19, true);
          reset(div_19);
          var node_10 = sibling(div_19, 2);
          html(node_10, () => (get2(item), untrack(() => renderMetaHtml(get2(item)))));
          var div_20 = sibling(node_10, 2);
          var button_5 = child(div_20);
          reset(div_20);
          var node_11 = sibling(div_20, 2);
          {
            var consequent_5 = ($$anchor4) => {
              var div_21 = root_11();
              html(
                div_21,
                () => (get2(item), untrack(() => renderMessageHtml(get2(item).message))),
                true
              );
              reset(div_21);
              append($$anchor4, div_21);
            };
            if_block(node_11, ($$render) => {
              if (get2(item), untrack(() => get2(item).message)) $$render(consequent_5);
            });
          }
          reset(td_5);
          reset(tr_2);
          template_effect(
            ($0) => {
              set_checked(input_1, $0);
              set_text(text_9, (get2(item), untrack(() => get2(item).action || "")));
              set_text(text_10, (get2(item), untrack(() => get2(item).status || "")));
              set_attribute2(span_1, "title", (get2(item), untrack(() => get2(item).srcPath || "")));
              set_text(text_11, (get2(item), untrack(() => get2(item).srcPath || "")));
              set_attribute2(span_2, "title", (get2(item), untrack(() => get2(item).dstPath || "")));
              set_text(text_12, (get2(item), untrack(() => get2(item).dstPath || "")));
              set_text(text_13, (get2(item), untrack(() => get2(item).finishedAt || "")));
            },
            [
              () => (get2(selectedHistoryRows), get2(item), untrack(() => get2(selectedHistoryRows).includes(get2(item).id)))
            ]
          );
          delegated("change", input_1, (event2) => toggleHistorySelection(get2(item).id, event2.currentTarget.checked));
          delegated("click", button_5, () => retryTask(get2(item).id));
          append($$anchor3, tr_2);
        });
        append($$anchor2, fragment_1);
      };
      if_block(node_8, ($$render) => {
        if (get2(historyError)) $$render(consequent_3);
        else if (get2(historyRows), untrack(() => !get2(historyRows).length)) $$render(consequent_4, 1);
        else $$render(alternate_1, -1);
      });
    }
    reset(tbody);
    reset(table);
    reset(div_17);
    reset(div_14);
    reset(div_13);
    reset(div);
    reset(section);
    template_effect(() => classes = set_class(section, 1, "tabPane", null, classes, { active: $activeTab() === "queue" }));
    delegated("click", button, cancelSelected2);
    delegated("click", button_1, refreshQueue);
    delegated("click", button_3, retrySelected2);
    delegated("click", button_4, refreshHistory);
    append($$anchor, section);
    pop();
    $$cleanup();
  }
  delegate(["click", "change"]);

  // _components/SearchTabPane.svelte
  var root_113 = from_html(`<th class="clickable"> </th>`);
  var root_27 = from_html(`<tr><td colspan="6" class="empty"> </td></tr>`);
  var root_37 = from_html(`<tr><td colspan="6" class="empty">No results</td></tr>`);
  var root_65 = from_html(`<span class="fdFile tooltipish" title="descendant files"> </span> <span class="fdDir tooltipish" title="descendant directories"> </span>`, 1);
  var root_74 = from_html(`<span class="fdFile">1 F</span>`);
  var root_55 = from_html(`<tr><td><span> </span></td><td><div class="nameCell"><span class="nameLabel cellEllipsis"> </span> <span class="rowActions"><button class="ghost iconBtn">\u29C9</button></span></div></td><td><span class="typeCell"><span class="cellEllipsis"> </span> <button class="ghost iconBtn" title="Open externally">\u2934</button> <button class="ghost iconBtn" title="Show in Browse">\u2197</button></span></td><td><!></td><td></td><td class="mono"></td></tr>`);
  var root11 = from_html(`<section id="tab-search"><div class="card"><div class="cardInner"><div class="row singleRow"><input placeholder="Search directory names and video filenames"/> <div class="checkRow"><label class="checkInline"><input type="checkbox"/> directories</label> <label class="checkInline"><input type="checkbox"/> video files</label></div> <button class="secondary"> </button></div> <div class="resultPane" style="margin-top:16px"><div class="resultHeader"><div class="toolbarRow"><div class="toolbarGroup"><h2>Search Results</h2> <input placeholder="Filter results" style="max-width:180px"/> <div class="toolbarMeta"> </div></div> <div class="toolbarGroup right"><div class="toolbarMeta"> </div> <button class="ghost iconBtn iconBtnWide">\u25F7</button> <button class="ghost iconBtn iconBtnWide" title="Previous page">\u2039</button> <button class="ghost iconBtn iconBtnWide" title="Next page">\u203A</button></div></div></div> <div class="resultScroll"><table style="table-layout:fixed"><thead><tr></tr></thead><tbody><!></tbody></table></div> <div class="toolbarRow" style="margin-top:12px"><div class="toolbarGroup right"><div class="toolbarMeta"> </div> <button class="ghost iconBtn iconBtnWide" title="Previous page">\u2039</button> <button class="ghost iconBtn iconBtnWide" title="Next page">\u203A</button></div></div></div></div></div></section>`);
  function SearchTabPane($$anchor, $$props) {
    push($$props, false);
    const $activeTab = () => store_get(activeTab, "$activeTab", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    const filteredRows = mutable_source();
    const totalPages = mutable_source();
    const pageInfo = mutable_source();
    const countText = mutable_source();
    let query = mutable_source("");
    let dirChecked = mutable_source(true);
    let fileChecked = mutable_source(false);
    let filterText = mutable_source("");
    let relativeTime = mutable_source(true);
    let rows = mutable_source([]);
    let total = mutable_source(0);
    let page = mutable_source(0);
    let pageSize = 100;
    let sortBy = "modifiedAt";
    let sortDesc = true;
    let loading = mutable_source(false);
    let error = mutable_source("");
    const headers = [
      { field: "isDir", label: "Type", width: "8%" },
      { field: "base", label: "Name", width: "45%" },
      { field: "root", label: "Root", width: "16%" },
      { field: "contents", label: "Contents", width: "10%" },
      { field: "size", label: "Size", width: "9%" },
      { field: "modifiedAt", label: "Modified", width: "12%" }
    ];
    function apiUrl(key2, fallback2) {
      return jsApi_GEN_default[key2] || fallback2;
    }
    function toast(message) {
      if (!message) return;
      showToast(String(message));
    }
    function renderAge(value, useRelative) {
      return formatAgeByMode(value || "", useRelative) || escapeHtml2(value || "");
    }
    function searchRelativeTimeTitle2(enabled) {
      return "Relative time: " + (enabled ? "On" : "Off");
    }
    function sortHeaderText2(label, field) {
      return label + (sortBy === field ? sortDesc ? " \u2193" : " \u2191" : "");
    }
    function currentSearchKind3() {
      if (get2(dirChecked) && get2(fileChecked)) return "all";
      if (get2(fileChecked)) return "file";
      return "dir";
    }
    function compareByField2(a, b) {
      let av;
      let bv;
      switch (sortBy) {
        case "base":
          av = a.base || "";
          bv = b.base || "";
          break;
        case "root":
          av = (a.rootKind || "") + "/" + (a.root || "");
          bv = (b.rootKind || "") + "/" + (b.root || "");
          break;
        case "contents":
          av = (a.fileCount || 0) + (a.dirCount || 0);
          bv = (b.fileCount || 0) + (b.dirCount || 0);
          break;
        case "size":
          av = a.size || 0;
          bv = b.size || 0;
          break;
        case "isDir":
          av = a.isDir ? 1 : 0;
          bv = b.isDir ? 1 : 0;
          break;
        case "modifiedAt":
        default:
          av = a.modifiedAt || "";
          bv = b.modifiedAt || "";
          break;
      }
      if (av < bv) return sortDesc ? 1 : -1;
      if (av > bv) return sortDesc ? -1 : 1;
      return String(a.base || "").localeCompare(String(b.base || ""));
    }
    async function getJSON(url) {
      const res = await fetch(url);
      const text2 = await res.text();
      if (!res.ok) {
        throw new Error(text2 || "HTTP " + res.status);
      }
      return text2 ? JSON.parse(text2) : {};
    }
    async function runSearch2(resetPage = false) {
      if (resetPage) set(page, 0);
      set(loading, true);
      set(error, "");
      try {
        const url = new URL(apiUrl("search", "/api/search"), window.location.origin);
        url.searchParams.set("q", get2(query).trim());
        const kind = currentSearchKind3();
        if (kind) url.searchParams.set("kind", kind);
        url.searchParams.set("limit", String(pageSize));
        url.searchParams.set("offset", String(get2(page) * pageSize));
        const res = await getJSON(url.toString());
        set(rows, Array.isArray(res?.rows) ? res.rows : []);
        set(total, Number(res?.total || 0));
      } catch (err) {
        set(rows, []);
        set(total, 0);
        set(error, String(err?.message || err));
        toast(get2(error));
      } finally {
        set(loading, false);
      }
    }
    function toggleSearchKind(kind, checked) {
      if (kind === "dir") {
        set(dirChecked, checked);
        if (!get2(dirChecked) && !get2(fileChecked)) set(fileChecked, true);
        return;
      }
      set(fileChecked, checked);
      if (!get2(dirChecked) && !get2(fileChecked)) set(dirChecked, true);
    }
    function setSort(field) {
      if (sortBy === field) {
        sortDesc = !sortDesc;
      } else {
        sortBy = field;
        sortDesc = false;
      }
    }
    function changePage(delta) {
      const totalPages2 = Math.max(1, Math.ceil((get2(total) || 0) / pageSize));
      const nextPage = get2(page) + delta;
      if (nextPage < 0 || nextPage >= totalPages2) return;
      set(page, nextPage);
      runSearch2(false);
    }
    async function showInBrowse(path, isDir, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      setActiveTab("browse", localStorage);
      window.dispatchEvent(new CustomEvent("indexer:tab", { detail: { tab: "browse" } }));
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "show", path: path || "", isDir: !!isDir } }));
    }
    async function copyPath(path, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      try {
        await navigator.clipboard.writeText(path || "");
        toast("Copied path");
      } catch (err) {
        toast("Copy failed: " + err);
      }
    }
    async function openExternal(path, event2) {
      if (event2) {
        event2.preventDefault();
        event2.stopPropagation();
      }
      try {
        const url = new URL(apiUrl("open", "/api/open"), window.location.origin);
        url.searchParams.set("path", path || "");
        const res = await getJSON(url.toString());
        toast(res?.message || "Opened file");
      } catch (err) {
        toast("Open failed: " + err);
      }
    }
    legacy_pre_effect(() => (get2(rows), get2(filterText)), () => {
      set(filteredRows, get2(rows).filter((item) => {
        const filter = get2(filterText).trim().toLowerCase();
        if (!filter) return true;
        return String(item.base || "").toLowerCase().includes(filter) || String(item.path || "").toLowerCase().includes(filter) || String(item.root || "").toLowerCase().includes(filter);
      }).slice().sort(compareByField2));
    });
    legacy_pre_effect(() => get2(total), () => {
      set(totalPages, Math.max(1, Math.ceil((get2(total) || 0) / pageSize)));
    });
    legacy_pre_effect(() => (get2(page), get2(totalPages)), () => {
      set(pageInfo, `Page ${get2(page) + 1} / ${get2(totalPages)}`);
    });
    legacy_pre_effect(() => (get2(filteredRows), get2(total)), () => {
      set(countText, `${get2(filteredRows).length} / ${get2(total) || get2(filteredRows).length} rows`);
    });
    legacy_pre_effect_reset();
    init();
    var section = root11();
    let classes;
    var div = child(section);
    var div_1 = child(div);
    var div_2 = child(div_1);
    var input = child(div_2);
    remove_input_defaults(input);
    var div_3 = sibling(input, 2);
    var label_1 = child(div_3);
    var input_1 = child(label_1);
    remove_input_defaults(input_1);
    next();
    reset(label_1);
    var label_2 = sibling(label_1, 2);
    var input_2 = child(label_2);
    remove_input_defaults(input_2);
    next();
    reset(label_2);
    reset(div_3);
    var button = sibling(div_3, 2);
    var text_1 = child(button, true);
    reset(button);
    reset(div_2);
    var div_4 = sibling(div_2, 2);
    var div_5 = child(div_4);
    var div_6 = child(div_5);
    var div_7 = child(div_6);
    var input_3 = sibling(child(div_7), 2);
    remove_input_defaults(input_3);
    var div_8 = sibling(input_3, 2);
    var text_2 = child(div_8, true);
    reset(div_8);
    reset(div_7);
    var div_9 = sibling(div_7, 2);
    var div_10 = child(div_9);
    var text_3 = child(div_10, true);
    reset(div_10);
    var button_1 = sibling(div_10, 2);
    var button_2 = sibling(button_1, 2);
    var button_3 = sibling(button_2, 2);
    reset(div_9);
    reset(div_6);
    reset(div_5);
    var div_11 = sibling(div_5, 2);
    var table = child(div_11);
    var thead = child(table);
    var tr = child(thead);
    each(tr, 5, () => headers, index, ($$anchor2, header) => {
      var th = root_113();
      var text_4 = child(th, true);
      reset(th);
      template_effect(
        ($0) => {
          set_style(th, (get2(header), untrack(() => `width:${get2(header).width}`)));
          set_text(text_4, $0);
        },
        [
          () => (get2(header), untrack(() => sortHeaderText2(get2(header).label, get2(header).field)))
        ]
      );
      delegated("click", th, () => setSort(get2(header).field));
      append($$anchor2, th);
    });
    reset(tr);
    reset(thead);
    var tbody = sibling(thead);
    var node = child(tbody);
    {
      var consequent = ($$anchor2) => {
        var tr_1 = root_27();
        var td = child(tr_1);
        var text_5 = child(td, true);
        reset(td);
        reset(tr_1);
        template_effect(() => set_text(text_5, get2(error)));
        append($$anchor2, tr_1);
      };
      var consequent_1 = ($$anchor2) => {
        var tr_2 = root_37();
        append($$anchor2, tr_2);
      };
      var alternate_1 = ($$anchor2) => {
        var fragment = comment();
        var node_1 = first_child(fragment);
        each(node_1, 1, () => get2(filteredRows), index, ($$anchor3, item) => {
          var tr_3 = root_55();
          var td_1 = child(tr_3);
          var span = child(td_1);
          var text_6 = child(span, true);
          reset(span);
          reset(td_1);
          var td_2 = sibling(td_1);
          var div_12 = child(td_2);
          var span_1 = child(div_12);
          var text_7 = child(span_1, true);
          reset(span_1);
          var span_2 = sibling(span_1, 2);
          var button_4 = child(span_2);
          reset(span_2);
          reset(div_12);
          reset(td_2);
          var td_3 = sibling(td_2);
          var span_3 = child(td_3);
          var span_4 = child(span_3);
          var text_8 = child(span_4);
          reset(span_4);
          var button_5 = sibling(span_4, 2);
          var button_6 = sibling(button_5, 2);
          reset(span_3);
          reset(td_3);
          var td_4 = sibling(td_3);
          var node_2 = child(td_4);
          {
            var consequent_2 = ($$anchor4) => {
              var fragment_1 = root_65();
              var span_5 = first_child(fragment_1);
              var text_9 = child(span_5);
              reset(span_5);
              var span_6 = sibling(span_5, 2);
              var text_10 = child(span_6);
              reset(span_6);
              template_effect(() => {
                set_text(text_9, `${(get2(item), untrack(() => get2(item).fileCount || 0)) ?? ""} F`);
                set_text(text_10, `${(get2(item), untrack(() => get2(item).dirCount || 0)) ?? ""} D`);
              });
              append($$anchor4, fragment_1);
            };
            var alternate = ($$anchor4) => {
              var span_7 = root_74();
              append($$anchor4, span_7);
            };
            if_block(node_2, ($$render) => {
              if (get2(item), untrack(() => get2(item).isDir)) $$render(consequent_2);
              else $$render(alternate, -1);
            });
          }
          reset(td_4);
          var td_5 = sibling(td_4);
          html(
            td_5,
            () => (deep_read_state(formatBytesHtml), get2(item), untrack(() => formatBytesHtml(get2(item).size || 0))),
            true
          );
          reset(td_5);
          var td_6 = sibling(td_5);
          html(
            td_6,
            () => (get2(item), get2(relativeTime), untrack(() => renderAge(get2(item).modifiedAt || "", get2(relativeTime)))),
            true
          );
          reset(td_6);
          reset(tr_3);
          template_effect(() => {
            set_class(span, 1, (get2(item), untrack(() => `pill ${get2(item).isDir ? "pillDir" : "pillFile"}`)));
            set_text(text_6, (get2(item), untrack(() => get2(item).isDir ? "DIR" : "FILE")));
            set_attribute2(span_1, "title", (get2(item), untrack(() => get2(item).path || "")));
            set_text(text_7, (get2(item), untrack(() => get2(item).base || "")));
            set_attribute2(button_4, "title", (get2(item), untrack(() => get2(item).path || "")));
            set_attribute2(span_4, "title", (get2(item), untrack(() => `${get2(item).rootKind || ""} / ${get2(item).root || ""}`)));
            set_text(text_8, `${(get2(item), untrack(() => get2(item).rootKind || "")) ?? ""} / ${(get2(item), untrack(() => get2(item).root || "")) ?? ""}`);
          });
          delegated("click", button_4, (event2) => copyPath(get2(item).path || "", event2));
          delegated("click", button_5, (event2) => openExternal(get2(item).path || "", event2));
          delegated("click", button_6, (event2) => showInBrowse(get2(item).path || "", get2(item).isDir, event2));
          append($$anchor3, tr_3);
        });
        append($$anchor2, fragment);
      };
      if_block(node, ($$render) => {
        if (get2(error)) $$render(consequent);
        else if (get2(filteredRows), get2(loading), untrack(() => !get2(filteredRows).length && !get2(loading))) $$render(consequent_1, 1);
        else $$render(alternate_1, -1);
      });
    }
    reset(tbody);
    reset(table);
    reset(div_11);
    var div_13 = sibling(div_11, 2);
    var div_14 = child(div_13);
    var div_15 = child(div_14);
    var text_11 = child(div_15, true);
    reset(div_15);
    var button_7 = sibling(div_15, 2);
    var button_8 = sibling(button_7, 2);
    reset(div_14);
    reset(div_13);
    reset(div_4);
    reset(div_1);
    reset(div);
    reset(section);
    template_effect(
      ($0) => {
        classes = set_class(section, 1, "tabPane", null, classes, { active: $activeTab() === "search" });
        set_checked(input_1, get2(dirChecked));
        set_checked(input_2, get2(fileChecked));
        button.disabled = get2(loading);
        set_text(text_1, get2(loading) ? "Searching..." : "Search");
        set_text(text_2, get2(countText));
        set_text(text_3, get2(pageInfo));
        set_attribute2(button_1, "title", $0);
        button_2.disabled = get2(page) <= 0;
        button_3.disabled = get2(page) >= get2(totalPages) - 1;
        set_text(text_11, get2(pageInfo));
        button_7.disabled = get2(page) <= 0;
        button_8.disabled = get2(page) >= get2(totalPages) - 1;
      },
      [
        () => (get2(relativeTime), untrack(() => searchRelativeTimeTitle2(get2(relativeTime))))
      ]
    );
    delegated("keydown", input, (event2) => {
      if (event2.key !== "Enter") return;
      event2.preventDefault();
      runSearch2(true);
    });
    bind_value(input, () => get2(query), ($$value) => set(query, $$value));
    delegated("change", input_1, (event2) => toggleSearchKind("dir", event2.currentTarget.checked));
    delegated("change", input_2, (event2) => toggleSearchKind("file", event2.currentTarget.checked));
    delegated("click", button, () => runSearch2(true));
    bind_value(input_3, () => get2(filterText), ($$value) => set(filterText, $$value));
    delegated("click", button_1, () => set(relativeTime, !get2(relativeTime)));
    delegated("click", button_2, () => changePage(-1));
    delegated("click", button_3, () => changePage(1));
    delegated("click", button_7, () => changePage(-1));
    delegated("click", button_8, () => changePage(1));
    append($$anchor, section);
    pop();
    $$cleanup();
  }
  delegate(["keydown", "change", "click"]);

  // _components/TabPanes.svelte
  function TabPanes($$anchor) {
    var fragment = comment();
    var node = first_child(fragment);
    each(node, 1, () => tabs_default, index, ($$anchor2, tab) => {
      var fragment_1 = comment();
      var node_1 = first_child(fragment_1);
      {
        var consequent = ($$anchor3) => {
          BrowseTabPane($$anchor3, {});
        };
        var consequent_1 = ($$anchor3) => {
          IndexerTabPane($$anchor3, {});
        };
        var consequent_2 = ($$anchor3) => {
          DuplicatesTabPane($$anchor3, {});
        };
        var consequent_3 = ($$anchor3) => {
          ManageTabPane($$anchor3, {});
        };
        var consequent_4 = ($$anchor3) => {
          SearchTabPane($$anchor3, {});
        };
        var consequent_5 = ($$anchor3) => {
          QueueTabPane($$anchor3, {});
        };
        if_block(node_1, ($$render) => {
          if (get2(tab).id === "browse") $$render(consequent);
          else if (get2(tab).id === "indexer") $$render(consequent_1, 1);
          else if (get2(tab).id === "duplicates") $$render(consequent_2, 2);
          else if (get2(tab).id === "manage") $$render(consequent_3, 3);
          else if (get2(tab).id === "search") $$render(consequent_4, 4);
          else if (get2(tab).id === "queue") $$render(consequent_5, 5);
        });
      }
      append($$anchor2, fragment_1);
    });
    append($$anchor, fragment);
  }

  // _states/manageModal.js
  var initialState5 = {
    active: false,
    title: "Confirm Change",
    subtitle: "",
    bodyHtml: ""
  };
  var manageModal = writable(initialState5);
  function setManageModalState(next2) {
    manageModal.set({
      ...initialState5,
      ...next2,
      active: !!next2?.active
    });
  }
  function bindManageModal(windowRef) {
    const handler = (event2) => {
      const detail = event2?.detail || {};
      setManageModalState({
        active: !!detail.open,
        title: detail.title || initialState5.title,
        subtitle: detail.subtitle || "",
        bodyHtml: detail.bodyHtml || ""
      });
    };
    windowRef?.addEventListener?.("indexer:manageModal", handler);
    return () => windowRef?.removeEventListener?.("indexer:manageModal", handler);
  }

  // _components/ManageModal.svelte
  var root12 = from_html(`<div id="manageModal"><div class="modalCard"><div class="modalHeader"><div><h2 id="manageModalTitle"> </h2> <div id="manageModalSubtitle" class="mono" style="color:var(--muted); margin-top:4px"> </div></div> <button class="ghost">Cancel</button></div> <div class="modalBody"><div id="manageModalBody" class="previewList"></div></div> <div class="modalFooter"><div class="mono" style="color:var(--muted)">This will run immediately after confirmation.</div> <div class="row" style="margin:0"><button class="ghost">Cancel</button> <button id="manageConfirmBtn">OK</button></div></div></div></div>`);
  function ManageModal($$anchor, $$props) {
    push($$props, false);
    const $manageModal = () => store_get(manageModal, "$manageModal", $$stores);
    const [$$stores, $$cleanup] = setup_stores();
    let cleanup = () => {
    };
    onMount(() => {
      cleanup = bindManageModal(window);
      return () => cleanup();
    });
    init();
    var div = root12();
    let classes;
    var div_1 = child(div);
    var div_2 = child(div_1);
    var div_3 = child(div_2);
    var h2 = child(div_3);
    var text2 = child(h2, true);
    reset(h2);
    var div_4 = sibling(h2, 2);
    var text_1 = child(div_4, true);
    reset(div_4);
    reset(div_3);
    var button = sibling(div_3, 2);
    reset(div_2);
    var div_5 = sibling(div_2, 2);
    var div_6 = child(div_5);
    html(div_6, () => $manageModal().bodyHtml || "", true);
    reset(div_6);
    reset(div_5);
    var div_7 = sibling(div_5, 2);
    var div_8 = sibling(child(div_7), 2);
    var button_1 = child(div_8);
    var button_2 = sibling(button_1, 2);
    reset(div_8);
    reset(div_7);
    reset(div_1);
    reset(div);
    template_effect(() => {
      classes = set_class(div, 1, "modalWrap", null, classes, { active: $manageModal().active });
      set_text(text2, $manageModal().title || "Confirm Change");
      set_text(text_1, $manageModal().subtitle || "");
    });
    delegated("click", div, (event2) => requestManageAction("closeManageModal", { overlay: true }));
    delegated("click", div_1, (event2) => event2.stopPropagation());
    delegated("click", button, () => requestManageAction("closeManageModal"));
    delegated("click", button_1, () => requestManageAction("closeManageModal"));
    delegated("click", button_2, () => requestManageAction("confirmManage"));
    append($$anchor, div);
    pop();
    $$cleanup();
  }
  delegate(["click"]);

  // _components/AppShell.svelte
  var root13 = from_html(`<div id="toastWrap" class="toastWrap"></div> <div class="wrap"><!> <!></div> <!>`, 1);
  function AppShell($$anchor) {
    var fragment = root13();
    var div = sibling(first_child(fragment), 2);
    var node = child(div);
    TabBar(node, {});
    var node_1 = sibling(node, 2);
    TabPanes(node_1, {});
    reset(div);
    var node_2 = sibling(div, 2);
    ManageModal(node_2, {});
    append($$anchor, fragment);
  }

  // _components/AppPage.svelte
  function AppPage($$anchor) {
    AppShell($$anchor, {});
  }

  // _helpers/managePreview.js
  function renderSuggestionCards(res, title) {
    const s = res.suggestion || {};
    return '<div class="previewLabel">' + escapeHtml2(title || "Suggestion") + '</div><div class="previewList"><div class="previewItem"><div class="previewLabel">Rule Source</div><div class="mono">' + valueOrDash(s.ruleSource || "") + '</div></div><div class="previewItem"><div class="previewLabel">Original</div><div class="mono">' + valueOrDash(res.current || s.original || "") + '</div></div><div class="previewItem"><div class="previewLabel">Normalized Tokens</div><div class="mono">' + valueOrDash(s.normalized || "") + '</div></div><div class="previewItem"><div class="previewLabel">Clean Title Rule</div><div class="mono">' + valueOrDash(s.cleanTitle || "") + '</div></div><div class="previewItem"><div class="previewLabel">Season Rule</div><div class="mono">' + valueOrDash(s.season || "") + '</div></div><div class="previewItem"><div class="previewLabel">Year Rule</div><div class="mono">' + valueOrDash(s.year || "") + '</div></div><div class="previewItem"><div class="previewLabel">Episode Rule</div><div class="mono">' + valueOrDash(s.episode || "") + '</div></div><div class="previewItem"><div class="previewLabel">Extras Rule</div><div class="mono">' + valueOrDash(s.extras || "") + '</div></div><div class="previewItem"><div class="previewLabel">Final Suggestion</div><div class="mono">' + valueOrDash(res.suggested || s.suggested || "") + '</div></div><div class="previewItem"><div class="previewLabel">Target Path</div><div class="mono">' + valueOrDash(res.newPath || "") + "</div></div></div>";
  }

  // _helpers/browseSearch.js
  function sortHeaderText(label, isActive, isDesc) {
    return label + (isActive ? isDesc ? " \u2193" : " \u2191" : "");
  }
  function fdCountsHtml(item) {
    if (item.isDir) {
      return '<span class="fdFile tooltipish" title="descendant files">' + (item.fileCount || 0) + ' F</span> <span class="fdDir tooltipish" title="descendant directories">' + (item.dirCount || 0) + " D</span>";
    }
    return '<span class="fdFile">1 F</span>';
  }
  function compareByField(a, b, sortBy, sortDesc, rootAccessor) {
    let av;
    let bv;
    switch (sortBy) {
      case "base":
        av = a.base || "";
        bv = b.base || "";
        break;
      case "root":
        av = rootAccessor ? rootAccessor(a) : "";
        bv = rootAccessor ? rootAccessor(b) : "";
        break;
      case "contents":
        av = (a.fileCount || 0) + (a.dirCount || 0);
        bv = (b.fileCount || 0) + (b.dirCount || 0);
        break;
      case "size":
        av = a.size || 0;
        bv = b.size || 0;
        break;
      case "isDir":
        av = a.isDir ? 1 : 0;
        bv = b.isDir ? 1 : 0;
        break;
      case "modifiedAt":
      default:
        av = a.modifiedAt || "";
        bv = b.modifiedAt || "";
        break;
    }
    if (av < bv) return sortDesc ? 1 : -1;
    if (av > bv) return sortDesc ? -1 : 1;
    return String(a.base || "").localeCompare(String(b.base || ""));
  }
  function buildSearchRows(state2, options) {
    const rows = [...state2.rows || []].filter((item) => {
      if (!options.filter) return true;
      return String(item.base || "").toLowerCase().includes(options.filter) || String(item.path || "").toLowerCase().includes(options.filter) || String(item.root || "").toLowerCase().includes(options.filter);
    });
    rows.sort((a, b) => compareByField(a, b, state2.sortBy, state2.sortDesc, (item) => (item.rootKind || "") + "/" + (item.root || "")));
    const totalPages = Math.max(1, Math.ceil((state2.total || rows.length || 1) / state2.pageSize));
    const html2 = !rows.length ? '<tr><td colspan="6" class="empty">No results</td></tr>' : rows.map(
      (item) => '<tr><td><span class="pill ' + (item.isDir ? "pillDir" : "pillFile") + '">' + (item.isDir ? "DIR" : "FILE") + '</span></td><td><div class="nameCell"><span class="nameLabel cellEllipsis" title="' + escapeHtml2(item.path || "") + '">' + escapeHtml2(item.base) + `</span><span class="rowActions"><button class="ghost iconBtn" title="Show in Browse" onclick="showInBrowseEncoded('` + encodeURIComponent(item.path || "") + "'," + (item.isDir ? 1 : 0) + ', event)">\u2197</button><button class="ghost iconBtn" title="' + escapeHtml2(item.path || "") + `" onclick="copyPathEncoded('` + encodeURIComponent(item.path || "") + `', event)">\u29C9</button></span></div></td><td>` + escapeHtml2(item.rootKind || "") + " / " + escapeHtml2(item.root || "") + '</td><td><span class="cellEllipsis">' + fdCountsHtml(item) + "</span></td><td>" + formatBytesHtml(item.size || 0) + '</td><td class="mono">' + formatAgeByMode(item.modifiedAt || "", state2.relativeTime) + "</td></tr>"
    ).join("");
    return {
      rows,
      totalPages,
      prevDisabled: state2.page <= 0,
      nextDisabled: state2.page >= totalPages - 1,
      html: html2
    };
  }
  function buildBrowseRows(state2, options) {
    const filtered = [...state2.currentRows || []].filter((item) => !options.filter || String(item.base || "").toLowerCase().includes(options.filter));
    filtered.sort((a, b) => compareByField(a, b, state2.sortBy, state2.sortDesc));
    const html2 = !filtered.length ? '<tr><td colspan="5" class="empty">Empty directory</td></tr>' : filtered.map((item) => {
      const encodedPath = encodeURIComponent(item.path || "");
      return "<tr" + (item.isDir ? ` ondblclick="openBrowsePath('` + encodedPath + `')"` : "") + '><td><div class="nameCell"><span class="nameLabel cellEllipsis" title="' + escapeHtml2(item.path || "") + '">' + escapeHtml2(item.base) + '</span><span class="rowActions">' + (item.isDir ? `<button class="ghost iconBtn" title="Open directory" onclick="openBrowsePath('` + encodedPath + `')">\u2197</button>` : "") + '<button class="ghost iconBtn" title="' + escapeHtml2(item.path || "") + `" onclick="copyPathEncoded('` + encodedPath + `', event)">\u29C9</button></span></div></td><td><span class="pill ` + (item.isDir ? "pillDir" : "pillFile") + '">' + (item.isDir ? "DIR" : "FILE") + '</span></td><td><span class="cellEllipsis">' + fdCountsHtml(item) + "</span></td><td>" + formatBytesHtml(item.size || 0) + '</td><td class="mono">' + formatAgeByMode(item.modifiedAt || "", state2.relativeTime) + "</td></tr>";
    }).join("");
    return { rows: filtered, html: html2 };
  }
  function renderTreeNode(item, depth, state2) {
    const path = item.path;
    const expanded = state2.expanded.has(path);
    const children = state2.loaded.get(path) || [];
    const active = state2.selectedPath === path;
    const maxRootBytes = (state2.roots || []).reduce((mx, root14) => Math.max(mx, Number(root14.size || 0)), 0);
    const rootPct = depth === 0 && maxRootBytes > 0 ? Number(item.size || 0) / maxRootBytes * 100 : 0;
    return '<div class="treeNode"><div class="treeRow' + (active ? " active" : "") + `" onclick="selectNode('` + encodeURIComponent(path) + `')"><span class="treeIndent" style="width:` + depth * 14 + `px"></span><span class="twisty" onclick="event.stopPropagation(); toggleNode('` + encodeURIComponent(path) + `')">` + (expanded ? "\u25BE" : "\u25B8") + '</span><span class="treeName">' + escapeHtml2(item.base) + '</span><span class="treeMeta">' + (item.isDir ? fdCountsHtml(item) + " \u2022 " : "") + formatBytesHtml(item.size || 0) + "</span></div>" + (depth === 0 ? '<div class="progressBar" style="margin:4px 0 6px 28px; height:8px"><div class="progressFill" style="width:' + rootPct.toFixed(2) + '%"></div></div>' : "") + (expanded ? '<div class="children">' + children.map((child2) => renderTreeNode(child2, depth + 1, state2)).join("") + "</div>" : "") + "</div>";
  }

  // _helpers/manageUi.js
  function tabHelpText(tab) {
    const text2 = {
      suggest: "Step 1 chooses suggest mode. Step 2 scans only directories that look fixable. Step 3 previews one row to inspect the cleaned naming and categorized target.",
      subtitles: "Step 1 chooses subtitle mode. Step 2 scans one selected area for subtitle files that can be matched safely to a parent video stem. Step 3 queues one subtitle rename at a time.",
      rename: "Step 1 chooses rename mode. Step 2 scans only rename candidates. Step 3 previews one row, then lets you adjust the final target path before queuing it.",
      move: "Step 1 chooses move mode. Step 2 scans only folders already ready for sorted roots. Step 3 previews one row with its destination root and optional bucket.",
      delete: "Step 1 chooses delete mode. Step 2 scans the selected area for removable targets. Step 3 previews one exact target, or selects multiple rows and queues them together."
    };
    return text2[tab] || "";
  }
  function previewMeta(tab) {
    const titles = {
      suggest: "Step 3: Name Fix Preview / Queue",
      subtitles: "Step 3: Subtitle Rename Queue",
      rename: "Step 3: Rename Preview / Queue",
      move: "Step 3: Sorted Move Preview / Queue",
      delete: "Step 3: Delete Preview / Queue"
    };
    const placeholders = {
      suggest: "Scan and preview a candidate above to inspect the categorize plan, grouped moves, and ambiguous subtitles.",
      subtitles: "Scan subtitle rename candidates above, then queue one row at a time.",
      rename: "Preview a rename candidate above or from the current browse path.",
      move: "Preview a move-ready candidate above after choosing destination root and bucket.",
      delete: "Preview one delete target above before queuing it."
    };
    return {
      title: titles[tab] || "Step 3: Preview / Queue",
      placeholder: placeholders[tab] || "Fill the flow above, then click Preview."
    };
  }
  function modeConfig(tab) {
    const configs = {
      suggest: {
        title: "Step 2: Scan Suggest Candidates",
        button: "Scan Suggest Candidates",
        empty: "No suggestion candidates found in this scan path"
      },
      rename: {
        title: "Step 2: Scan Rename Candidates",
        button: "Scan Rename Candidates",
        empty: "No rename candidates found in this scan path"
      },
      move: {
        title: "Step 2: Scan Move-Ready Candidates",
        button: "Scan Move-Ready Candidates",
        empty: "No move-ready candidates found in this scan path"
      },
      delete: {
        title: "Step 2: Scan Delete Targets",
        button: "Scan Delete Targets",
        empty: "No delete targets found in this scan path"
      }
    };
    return configs[tab] || configs.suggest;
  }

  // _helpers/manageActions.js
  function buildManagePlan(action2, values) {
    if (action2 === "rename") {
      if (!values.path) throw new Error("Directory path is required");
      if (!values.newPath) throw new Error("Rename target path is required");
      return {
        action: action2,
        title: "Rename Directory",
        subtitle: values.path,
        endpoint: jsApi_GEN_default.rename,
        body: { oldPath: values.path, newPath: values.newPath, confirm: "CONFIRM" },
        items: [
          ["Action", "Rename directory"],
          ["From", values.path],
          ["To", values.newPath]
        ]
      };
    }
    if (action2 === "move") {
      if (!values.path) throw new Error("Source path is required");
      if (!values.dstRoot) throw new Error("Destination root is required");
      const dstDir = values.dstSubdir ? values.dstRoot.replace(/\/+$/, "") + "/" + values.dstSubdir : values.dstRoot;
      const dstPath = dstDir.replace(/\/+$/, "") + "/" + (values.path.split("/").pop() || "");
      return {
        action: action2,
        title: "Move Path",
        subtitle: values.path,
        endpoint: jsApi_GEN_default.move,
        body: { srcPath: values.path, dstDir, confirm: "CONFIRM" },
        items: [
          ["Action", "Move path"],
          ["From", values.path],
          ["Destination Dir", dstDir],
          ["Result Path", dstPath]
        ]
      };
    }
    if (!values.path) throw new Error("Delete path is required");
    return {
      action: action2,
      title: "Delete Path",
      subtitle: values.path,
      endpoint: jsApi_GEN_default.delete,
      body: { path: values.path, confirm: "CONFIRM" },
      items: [
        ["Action", "Delete path"],
        ["Target", values.path]
      ]
    };
  }
  function renderManagePlanHtml(plan) {
    return '<div class="previewLabel">' + escapeHtml2(plan.title) + '</div><div class="previewList">' + plan.items.map(
      ([label, value]) => '<div class="previewItem"><div class="previewLabel">' + escapeHtml2(label) + '</div><div class="mono">' + escapeHtml2(value) + "</div></div>"
    ).join("") + "</div>";
  }
  function renderManageModalBodyHtml(plan) {
    return plan.items.map(
      ([label, value]) => '<div class="previewItem"><div class="previewLabel">' + escapeHtml2(label) + '</div><div class="mono">' + escapeHtml2(value) + "</div></div>"
    ).join("");
  }
  function renderSubtitleSuggestionHtml(res, fallbackPath) {
    return '<div class="previewLabel">Subtitle Rename Suggestion</div><div class="previewList"><div class="previewItem"><div class="previewLabel">From</div><div class="mono">' + escapeHtml2(res.path || fallbackPath) + '</div></div><div class="previewItem"><div class="previewLabel">Suggested</div><div class="mono">' + escapeHtml2(res.suggested || "") + '</div></div><div class="previewItem"><div class="previewLabel">To</div><div class="mono">' + escapeHtml2(res.newPath || "") + "</div></div></div>";
  }

  // _helpers/manageState.js
  function toggleSelection(current, id, checked) {
    const next2 = new Set(current || []);
    if (checked) next2.add(id);
    else next2.delete(id);
    return Array.from(next2);
  }
  function hasSelection(current, id) {
    return !!id && (current || []).includes(id);
  }
  function filteredCategorizeOperations(state2) {
    const preview = state2.categorizePreview || {};
    const ops = preview.res?.operations || [];
    const kindFilter = state2.categorizeKindFilter || "all";
    const groupFilter = String(state2.categorizeGroupFilter || "");
    const textFilter = String(state2.categorizeTextFilter || "").trim().toLowerCase();
    return ops.filter((item) => {
      if (kindFilter !== "all" && String(item.kind || "") !== kindFilter) return false;
      if (groupFilter && String(item.targetDir || "") !== groupFilter) return false;
      if (textFilter) {
        const hay = ((item.source || "") + " " + (item.target || "") + " " + (item.targetDir || "")).toLowerCase();
        if (!hay.includes(textFilter)) return false;
      }
      return true;
    });
  }
  function filteredCategorizeGroups(state2) {
    const preview = state2.categorizePreview || {};
    const groups = preview.res?.groups || [];
    const groupFilter = String(state2.categorizeGroupFilter || "");
    const groupTextFilter = String(state2.categorizeGroupTextFilter || "").trim().toLowerCase();
    return groups.filter((group) => {
      if (groupFilter && String(group.targetDir || "") !== groupFilter) return false;
      if (groupTextFilter) {
        const hay = String(group.targetDir || "").toLowerCase();
        if (!hay.includes(groupTextFilter)) return false;
      }
      return true;
    });
  }
  function filteredCategorizeAmbiguous(state2) {
    const preview = state2.categorizePreview || {};
    const ambiguous = preview.res?.ambiguousSubtitles || [];
    const ambiguousFilter = String(state2.categorizeAmbiguousFilter || "").trim().toLowerCase();
    return ambiguous.filter((item) => {
      if (!ambiguousFilter) return true;
      const hay = ((item.video || "") + " " + (item.candidates || []).join(" ")).toLowerCase();
      return hay.includes(ambiguousFilter);
    });
  }
  function buildCategorizeOperationsText(state2, labelForKind) {
    return filteredCategorizeOperations(state2).map(
      (item) => "[" + labelForKind(item.kind) + "] " + (item.source || "") + " -> " + (item.target || "")
    ).join("\n");
  }
  function buildCategorizeGroupsText(state2) {
    return filteredCategorizeGroups(state2).map(
      (group) => (group.targetDir || "") + " | items=" + (group.count || 0) + " vid=" + (group.videoMoves || 0) + " sub=" + (group.subtitleMoves || 0) + " aux=" + (group.auxiliaryMoves || 0)
    ).join("\n");
  }
  function buildCategorizeAmbiguousText(state2) {
    return filteredCategorizeAmbiguous(state2).map(
      (item) => (item.video || "") + " :: " + (item.candidates || []).join(", ")
    ).join("\n");
  }
  function buildCategorizeCurrentViewText(state2, labelForKind) {
    const res = state2.categorizePreview?.res || {};
    const opts = state2.categorizePreview?.opts || {};
    const filteredGroups = filteredCategorizeGroups(state2);
    const filteredOps = filteredCategorizeOperations(state2);
    const filteredAmbiguous = filteredCategorizeAmbiguous(state2);
    return [
      "Categorize Preview",
      "Detected Videos: " + String(res.detectedVideoFiles || 0),
      "Detected Groups: " + String(res.detectedGroups || 0),
      "Planned Moves: " + String(res.plannedMoves || 0) + (res.truncated ? " (truncated)" : ""),
      "Video / Subtitle / Aux: " + String(res.videoMoves || 0) + " / " + String(res.subtitleMoves || 0) + " / " + String(res.auxiliaryMoves || 0),
      "Watched Count / Videos Only: " + String(opts.watchedCount || 0) + " / " + String(!!opts.videosOnly),
      "Filters: kind=" + (state2.categorizeKindFilter || "all") + " group=" + (state2.categorizeGroupFilter || "-") + " groups=" + (state2.categorizeGroupTextFilter || "-") + " ops=" + (state2.categorizeTextFilter || "-") + " ambiguous=" + (state2.categorizeAmbiguousFilter || "-"),
      "",
      "Target Groups:",
      ...filteredGroups.map((group) => (group.targetDir || "") + " | items=" + (group.count || 0) + " vid=" + (group.videoMoves || 0) + " sub=" + (group.subtitleMoves || 0) + " aux=" + (group.auxiliaryMoves || 0)),
      "",
      "Planned Operations:",
      ...filteredOps.map((item) => "[" + labelForKind(item.kind) + "] " + (item.source || "") + " -> " + (item.target || "")),
      "",
      "Ambiguous Subtitles:",
      ...filteredAmbiguous.map((item) => (item.video || "") + " :: " + (item.candidates || []).join(", "))
    ].join("\n");
  }

  // _helpers/statusQueue.js
  function buildStatusView(status) {
    const s = status || {};
    const allRoots = (s.mounts || []).flatMap((m) => m.roots || []);
    const pct = allRoots.length ? allRoots.reduce((acc, root14) => acc + Number(root14.progressPct || 0), 0) / allRoots.length : Number(s.progressPct || 0);
    const progressMeta = "resumed=" + Boolean(s.resumed) + "  workers=" + (s.activeWorkers || 0) + "/" + (s.workerCount || 0) + "  roots=" + (s.estimatedRoots || 0) + "/" + (s.totalRoots || 0) + "\nestimated=" + formatBytes(s.totalBytes || 0) + "  processed=" + formatBytes(s.processedBytes || 0) + "  indexed=" + (s.indexed || 0) + "  files=" + (s.files || 0) + "  dirs=" + (s.directories || 0) + "\ncurrent=" + (s.currentPath || "");
    const treeHtml = (s.mounts || []).map(
      (mount2) => '<div class="mountCard"><div><strong>' + escapeHtml2(mount2.mountPoint || "(unknown)") + '</strong> <span class="mono">' + Number(mount2.progressPct || 0).toFixed(2) + '%</span></div><div class="progressBar" style="margin:6px 0 8px"><div class="progressFill" style="width:' + Number(mount2.progressPct || 0).toFixed(2) + '%"></div></div>' + (mount2.roots || []).map(
        (root14) => '<div class="rootCard"><div><span class="pill">' + escapeHtml2(root14.kind) + "</span>" + escapeHtml2(root14.path) + '</div><div class="mono" style="color:var(--muted); margin-top:3px">' + formatBytesHtml(root14.processedBytes || 0) + " / " + formatBytesHtml(root14.totalBytes || 0) + '</div><div class="progressBar" style="margin-top:4px"><div class="progressFill" style="width:' + Number(root14.progressPct || 0).toFixed(2) + '%"></div></div></div>'
      ).join("") + "</div>"
    ).join("");
    return {
      pct,
      workersText: (s.activeWorkers || 0) + " / " + (s.workerCount || 0),
      totalSizeHtml: formatBytesHtml(s.totalBytes || 0),
      kindsText: (s.files || 0) + " / " + (s.directories || 0),
      rootsText: (s.estimatedRoots || 0) + " / " + (s.totalRoots || 0),
      progressMeta,
      statusJson: JSON.stringify(s, null, 2),
      treeHtml
    };
  }

  // _helpers/manageApi.js
  function categorizeOptionsFromState(formState) {
    const src = formState || {};
    return {
      videosOnly: !!src.categorizeVideosOnly,
      watchedCount: Number(src.categorizeWatched || 0) || 0,
      removeEmptyDirs: !!src.categorizeRemoveEmpty
    };
  }
  function applyCategorizeFilter(state2, patch) {
    Object.assign(state2, patch || {});
    return state2;
  }
  async function copyPlainText(text2, navigatorObj) {
    await navigatorObj.clipboard.writeText(String(text2 || ""));
  }
  async function postJSON(getJSON, url, body) {
    return getJSON(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }
  async function batchQueueActions(getJSON, items, buildBody) {
    let queued = 0;
    const errors = [];
    for (const item of items || []) {
      try {
        await postJSON(getJSON, jsApi_GEN_default.manageQueue, buildBody(item));
        queued++;
      } catch (err) {
        errors.push(String(err));
      }
    }
    return { queued, errors };
  }

  // _helpers/manageScan.js
  function detectCategorySubdir(path) {
    const parts = String(path || "").split("/").filter(Boolean);
    for (const part of parts) {
      if (["_a", "_e", "_w", "_i"].includes(part)) return part;
    }
    return "";
  }
  function isSortedReadyName(name) {
    return /\[[^\]]*of_w\d+\](?:=missing[\d,\-]+)?$/i.test(String(name || "").trim());
  }
  function buildSuggestedScanRow(item, res, mode) {
    const current = (res.current || item.base || "").trim();
    const suggested = (res.suggested || "").trim();
    const currentReady = isSortedReadyName(current);
    const suggestedReady = isSortedReadyName(suggested);
    let status = "";
    let statusLabel = "";
    if (currentReady) {
      status = "move_ready";
      statusLabel = "MOVE READY";
    } else if (suggested && suggested !== current) {
      status = suggestedReady ? "rename_then_move" : "rename";
      statusLabel = suggestedReady ? "RENAME \u2192 MOVE" : "RENAME";
    }
    if (mode === "move") {
      if (!currentReady) return null;
    } else {
      if (!status || currentReady) return null;
    }
    return {
      path: item.path,
      base: item.base,
      fileCount: item.fileCount,
      dirCount: item.dirCount,
      current,
      suggested,
      newPath: res.newPath || "",
      suggestion: res.suggestion || {},
      status,
      statusLabel,
      currentReady,
      suggestedReady,
      isDir: true
    };
  }
  function buildDeleteScanRows(rows) {
    return (rows || []).map((item) => ({
      path: item.path,
      base: item.base,
      fileCount: item.isDir ? item.fileCount || 0 : 1,
      dirCount: item.isDir ? item.dirCount || 0 : 0,
      current: item.base,
      suggested: item.path,
      newPath: "",
      status: item.isDir ? "dir" : "file",
      statusLabel: item.isDir ? "DIR" : "FILE",
      isDir: !!item.isDir
    }));
  }
  function toggleIndexSelection(current, idx, checked) {
    const next2 = new Set(current || []);
    if (checked) next2.add(idx);
    else next2.delete(idx);
    return Array.from(next2).sort((a, b) => a - b);
  }
  function selectAllRowIndexes(rows, checked) {
    if (!checked) return [];
    return (rows || []).map((_, idx) => idx);
  }
  function selectedRows(rows, selectedIndexes) {
    return (selectedIndexes || []).map((idx) => (rows || [])[idx]).filter(Boolean);
  }

  // _helpers/managePaths.js
  function pathRootAndRelative(path, roots) {
    const cleanPath = String(path || "").trim();
    const values = (roots || []).map((root14) => root14.path).filter(Boolean);
    for (const root14 of values) {
      if (cleanPath === root14) return { root: root14, rel: "" };
      if (cleanPath.startsWith(root14 + "/")) return { root: root14, rel: cleanPath.slice(root14.length + 1) };
    }
    return { root: values[0] || "", rel: cleanPath };
  }
  function buildManagePath(root14, rel) {
    const cleanRoot = String(root14 || "").trim().replace(/\/+$/, "");
    const cleanRel = String(rel || "").trim().replace(/^\/+/, "");
    if (!cleanRoot) return cleanRel;
    if (!cleanRel) return cleanRoot;
    return cleanRoot + "/" + cleanRel;
  }
  function renameTargetFromSource(path) {
    const clean = String(path || "");
    const base = clean.split("/").filter(Boolean).pop() || "";
    return base ? clean.slice(0, clean.length - base.length) : clean;
  }
  function nextSelectedSource(currentSelectedSource, browseSelectedPath) {
    return currentSelectedSource || browseSelectedPath || "";
  }

  // _helpers/manageSelection.js
  function selectedSourceText(path) {
    return path ? "Selected source: " + path : "(no candidate selected yet)";
  }
  function managePathSelection(kind, fullPath, roots, pathRootAndRelative2) {
    const parts = pathRootAndRelative2(fullPath, roots);
    if (kind === "scan") {
      return {
        selectedSource: "",
        root: parts.root,
        rel: "",
        markManual: false,
        clearPath: true
      };
    }
    if (kind === "subtitles") {
      return {
        selectedSource: "",
        root: parts.root,
        rel: parts.rel,
        markManual: true,
        clearPath: false
      };
    }
    return {
      selectedSource: fullPath,
      root: parts.root,
      rel: parts.rel,
      markManual: false,
      clearPath: false
    };
  }
  function requireScanRow(rows, index2, missingMessage) {
    const item = (rows || [])[index2];
    if (!item) throw new Error(missingMessage || "Scanned row not found");
    return item;
  }
  function suggestionPreviewData(item) {
    return {
      current: item.current,
      suggested: item.suggested,
      newPath: item.newPath,
      suggestion: item.suggestion || {}
    };
  }
  function renamePreviewState(item) {
    return {
      selectedSource: item.path || "",
      suggestedName: item.suggested || "",
      renameTarget: item.newPath || "",
      preview: suggestionPreviewData(item)
    };
  }
  function movePreviewState(item) {
    return {
      selectedSource: item.path || "",
      categoryPath: item.path || ""
    };
  }

  // _helpers/manageFlow.js
  async function collectManageDirectories(getJSON, rootPath, limit) {
    const queue = [rootPath];
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    while (queue.length && out.length < limit) {
      const current = queue.shift();
      if (!current || seen.has(current)) continue;
      seen.add(current);
      const rows = await getJSON(jsApi_GEN_default.browse + "?path=" + encodeURIComponent(current));
      for (const item of rows || []) {
        if (!item || !item.isDir) continue;
        out.push(item);
        if (out.length >= limit) break;
        queue.push(item.path);
      }
    }
    return out;
  }
  async function collectManageEntries(getJSON, rootPath, limit) {
    const queue = [rootPath];
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    while (queue.length && out.length < limit) {
      const current = queue.shift();
      if (!current || seen.has(current)) continue;
      seen.add(current);
      const rows = await getJSON(jsApi_GEN_default.browse + "?path=" + encodeURIComponent(current));
      for (const item of rows || []) {
        if (!item) continue;
        out.push(item);
        if (out.length >= limit) break;
        if (item.isDir) queue.push(item.path);
      }
    }
    return out;
  }
  async function scanSuggestedRows({ getJSON, postJSON: postJSON2, rootPath, limit, mode, buildSuggestedScanRow: buildSuggestedScanRow2 }) {
    const dirs = await collectManageDirectories(getJSON, rootPath, limit);
    const rows = [];
    for (const item of dirs) {
      try {
        const res = await postJSON2(getJSON, jsApi_GEN_default.suggest, { path: item.path });
        const row = buildSuggestedScanRow2(item, res, mode);
        if (row) rows.push(row);
      } catch (_) {
      }
    }
    return rows;
  }
  async function scanDeleteRows({ getJSON, rootPath, limit, buildDeleteScanRows: buildDeleteScanRows2 }) {
    const rows = await collectManageEntries(getJSON, rootPath, limit);
    return buildDeleteScanRows2(rows);
  }

  // _helpers/searchBrowseFlow.js
  function applySortHeaders(doc2, prefix, labels, state2, sortHeaderText2) {
    Object.entries(labels || {}).forEach(([field, label]) => {
      const el = doc2.getElementById(prefix + field);
      if (!el) return;
      el.textContent = sortHeaderText2(label, state2.sortBy === field, state2.sortDesc);
    });
  }
  function applySearchTable(doc2, searchState, buildSearchRows2) {
    const tbody = doc2.getElementById("searchTable");
    const filter = (doc2.getElementById("searchFilter")?.value || "").trim().toLowerCase();
    const view = buildSearchRows2(searchState, { filter });
    const rows = view.rows;
    doc2.getElementById("searchCount").textContent = rows.length + " / " + (searchState.total || rows.length) + " rows";
    const totalPages = view.totalPages;
    doc2.getElementById("searchPageInfo").textContent = "Page " + (searchState.page + 1) + " / " + totalPages;
    doc2.getElementById("searchPageInfoTop").textContent = "Page " + (searchState.page + 1) + " / " + totalPages;
    const prevDisabled = view.prevDisabled;
    const nextDisabled = view.nextDisabled;
    doc2.getElementById("searchPrevTop").disabled = prevDisabled;
    doc2.getElementById("searchPrevBottom").disabled = prevDisabled;
    doc2.getElementById("searchNextTop").disabled = nextDisabled;
    doc2.getElementById("searchNextBottom").disabled = nextDisabled;
    tbody.innerHTML = view.html;
  }
  function buildPriorityRootOptions(roots, selectedValues, escapeHtml3) {
    const current = new Set(selectedValues || []);
    const values = (roots || []).map((root14) => root14.path).filter(Boolean);
    return {
      html: values.map((root14) => '<option value="' + escapeHtml3(root14) + '">' + escapeHtml3(root14) + "</option>").join(""),
      selected: current
    };
  }
  function applyBrowseHistoryButtons(doc2, history, historyIndex, browseHistoryDisabled2) {
    const back = doc2.getElementById("browseBackBtn");
    const forward = doc2.getElementById("browseForwardBtn");
    const state2 = browseHistoryDisabled2(history, historyIndex);
    if (back) back.disabled = state2.backDisabled;
    if (forward) forward.disabled = state2.forwardDisabled;
  }
  function renderTreeHtml(roots, renderTreeNode2, state2) {
    if (!(roots || []).length) {
      return '<div class="empty">No configured roots</div>';
    }
    return roots.map((root14) => renderTreeNode2(root14, 0, state2)).join("");
  }
  function relativeTimeButtonText(enabled) {
    return "Relative Time: " + (enabled ? "On" : "Off");
  }
  function searchRelativeTimeTitle(enabled) {
    return "Relative time: " + (enabled ? "On" : "Off");
  }
  function applyBrowseTable(doc2, browseState, buildBrowseRows2) {
    const filter = (doc2.getElementById("browseFilter")?.value || "").trim().toLowerCase();
    const tbody = doc2.getElementById("browseTable");
    const view = buildBrowseRows2(browseState, { filter });
    tbody.innerHTML = view.html;
  }

  // _helpers/pageFlow.js
  function applyTabState() {
  }
  function selectedPriorityRoots(doc2) {
    return Array.from(doc2.getElementById("priorityRoot")?.selectedOptions || []).map((opt) => opt.value);
  }
  function reindexUrl(priorityRoots) {
    const priority = (priorityRoots || []).join(",");
    return priority ? jsApi_GEN_default.reindex + "?priority=" + encodeURIComponent(priority) : jsApi_GEN_default.reindex;
  }
  function applyStatusView(doc2, view) {
    doc2.getElementById("progressFill").style.width = view.pct.toFixed(2) + "%";
    doc2.getElementById("metricWorkers").textContent = view.workersText;
    doc2.getElementById("metricTotalSize").innerHTML = view.totalSizeHtml;
    doc2.getElementById("metricKinds").textContent = view.kindsText;
    doc2.getElementById("metricRoots").textContent = view.rootsText;
    doc2.getElementById("progressMeta").textContent = view.progressMeta;
    doc2.getElementById("status").textContent = view.statusJson;
    doc2.getElementById("treeProgress").innerHTML = view.treeHtml;
  }
  function searchRequestUrl(query, kind, pageSize, page) {
    const q = String(query || "").trim();
    const offset = Number(page || 0) * Number(pageSize || 0);
    return jsApi_GEN_default.search + "?q=" + encodeURIComponent(q) + "&kind=" + encodeURIComponent(kind || "") + "&limit=" + encodeURIComponent(pageSize || 0) + "&offset=" + encodeURIComponent(offset);
  }
  function currentSearchQuery(doc2) {
    return doc2.getElementById("searchQuery")?.value.trim() || "";
  }
  function currentSearchKind(doc2, deriveSearchKind) {
    return deriveSearchKind(
      Boolean(doc2.getElementById("searchDirOnly")?.checked),
      Boolean(doc2.getElementById("searchFileOnly")?.checked)
    );
  }
  function applySearchPage(searchState, page) {
    searchState.rows = page.rows || [];
    searchState.total = page.total || 0;
    return searchState;
  }

  // _helpers/manageController.js
  function applyManagePreview(doc2, html2) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: {
        kind: "preview",
        previewHtml: html2
      }
    }));
  }
  function applyManageModal(doc2, plan, bodyHtml) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:manageModal", {
      detail: {
        open: true,
        title: plan.title,
        subtitle: plan.subtitle,
        bodyHtml
      }
    }));
  }
  function closeManageModal(doc2, event2) {
    if (event2 && event2.target && event2.target !== doc2.getElementById("manageModal")) return false;
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:manageModal", { detail: { open: false } }));
    return true;
  }
  function queueBodyFromPlan(plan, password) {
    return {
      action: plan.action,
      password,
      srcPath: plan.body.oldPath || plan.body.srcPath || plan.body.path || "",
      dstDir: plan.body.dstDir || "",
      newPath: plan.body.newPath || ""
    };
  }
  function toggleCategorizeSortState(state2, which, field) {
    const sortByKey = which === "groups" ? "categorizeGroupSortBy" : which === "ops" ? "categorizeOpSortBy" : "categorizeAmbiguousSortBy";
    const sortDescKey = which === "groups" ? "categorizeGroupSortDesc" : which === "ops" ? "categorizeOpSortDesc" : "categorizeAmbiguousSortDesc";
    if (state2[sortByKey] === field) {
      state2[sortDescKey] = !state2[sortDescKey];
    } else {
      state2[sortByKey] = field;
      state2[sortDescKey] = false;
    }
    return state2;
  }

  // _helpers/managePane.js
  function applyManageTabState(doc2, tab) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:manageTab", {
      detail: { tab: tab || "suggest" }
    }));
  }
  function applyManageTabHelp(doc2, text2) {
    const help = doc2.getElementById("manageTabHelp");
    if (help) help.textContent = text2 || "";
  }
  function applyManagePreviewMeta(doc2, meta) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: {
        kind: "meta",
        title: meta.title || "",
        previewHtml: meta.placeholder || ""
      }
    }));
  }
  function unlockManagePreview(doc2) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: { kind: "unlock" }
    }));
  }
  function clearOptionalPaths(doc2, ids) {
    ;
    (ids || []).forEach((id) => {
      const el = doc2.getElementById(id);
      if (!el) return;
      if (!el.dataset.manual) el.value = "";
    });
  }
  function applyManageSelectedSource(doc2, text2) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: {
        kind: "selectedSource",
        selectedSource: text2 || ""
      }
    }));
  }
  function applyPathSelection(doc2, rootID, pathID, selection) {
    const rootEl = doc2.getElementById(rootID);
    const pathEl = doc2.getElementById(pathID);
    if (rootEl && selection.root) rootEl.value = selection.root;
    if (!pathEl) return;
    pathEl.value = selection.rel || "";
    if (selection.markManual) pathEl.dataset.manual = "1";
    else delete pathEl.dataset.manual;
  }
  function setManageScanCount(doc2, text2) {
    const el = doc2.getElementById("manageScanCount");
    if (el) el.textContent = text2;
  }

  // _helpers/manageOps.js
  function setManageResult(doc2, value) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:manageResult", {
      detail: { value }
    }));
  }
  function applySuggestionPreview(doc2, renderSuggestionCards2, data, title) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: {
        kind: "preview",
        previewHtml: renderSuggestionCards2(data, title)
      }
    }));
  }
  function applySubtitleSuggestionPreview(doc2, renderSubtitleSuggestionHtml2, res, path) {
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: {
        kind: "preview",
        previewHtml: renderSubtitleSuggestionHtml2(res, path)
      }
    }));
  }
  function resetCategorizePreviewState(state2, res, opts) {
    state2.categorizePreview = { res, opts };
    state2.categorizeKindFilter = "all";
    state2.categorizeGroupFilter = "";
    state2.categorizeTextFilter = "";
    state2.categorizeAmbiguousFilter = "";
    state2.categorizeGroupTextFilter = "";
  }
  function hasCategorizePreview(state2) {
    return Boolean(state2 && state2.categorizePreview);
  }
  async function queueBatchWithPassword(ctx) {
    const {
      rows,
      promptFn,
      promptText,
      missingRowsMessage,
      missingPasswordMessage,
      getJSON,
      batchQueueActions: batchQueueActions2,
      requestBuilder,
      doc: doc2,
      successMessage,
      partialMessage,
      resultBuilder,
      after
    } = ctx;
    if (!(rows || []).length) throw new Error(missingRowsMessage);
    const password = promptFn(promptText) || "";
    if (!password) throw new Error(missingPasswordMessage);
    const { queued, errors } = await batchQueueActions2(getJSON, rows, (item) => requestBuilder(item, password));
    setManageResult(doc2, resultBuilder ? resultBuilder({ queued, errors }) : { queued, errors });
    if (typeof after === "function") await after();
    return { queued, errors, toast: errors.length ? partialMessage : successMessage + queued };
  }
  async function queueSingleWithPassword(ctx) {
    const {
      item,
      promptFn,
      promptText,
      missingItemMessage,
      missingPasswordMessage,
      getJSON,
      postJSON: postJSON2,
      url,
      bodyBuilder,
      doc: doc2,
      after
    } = ctx;
    if (!item) throw new Error(missingItemMessage);
    const password = promptFn(promptText) || "";
    if (!password) throw new Error(missingPasswordMessage);
    const res = await postJSON2(getJSON, url, bodyBuilder(item, password));
    setManageResult(doc2, res);
    if (typeof after === "function") await after(res);
    return res;
  }
  function setFilterAndRerender(state2, patch, applyCategorizeFilter2, rerender) {
    applyCategorizeFilter2(state2, patch);
    rerender();
  }
  function toggleIdSelection(state2, key2, id, checked, toggleSelection2) {
    state2[key2] = toggleSelection2(state2[key2], id, checked);
    return state2[key2];
  }
  function idSelected(state2, key2, id, hasSelection2) {
    return hasSelection2(state2[key2], id);
  }

  // _helpers/pageState.js
  function nextSortState(state2, field) {
    const next2 = { ...state2 };
    if (next2.sortBy === field) {
      next2.sortDesc = !next2.sortDesc;
    } else {
      next2.sortBy = field;
      next2.sortDesc = false;
    }
    return next2;
  }
  function nextSearchPage(total, pageSize, currentPage, delta) {
    const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
    const next2 = currentPage + delta;
    if (next2 < 0 || next2 >= totalPages) {
      return { changed: false, page: currentPage, totalPages };
    }
    return { changed: true, page: next2, totalPages };
  }
  function currentSearchKind2(dirChecked, fileChecked) {
    if (dirChecked && fileChecked) return "";
    if (fileChecked) return "file";
    return "dir";
  }
  function normalizeSearchKinds(dirChecked, fileChecked, changed) {
    if (dirChecked || fileChecked) {
      return { dirChecked, fileChecked };
    }
    if (changed === "file") {
      return { dirChecked: true, fileChecked: false };
    }
    return { dirChecked: false, fileChecked: true };
  }
  function browseHistoryDisabled(history, historyIndex) {
    return {
      backDisabled: historyIndex <= 0,
      forwardDisabled: historyIndex < 0 || historyIndex >= (history || []).length - 1
    };
  }
  function parentDir(path) {
    const clean = String(path || "").trim().replace(/\/+$/, "");
    if (!clean) return "";
    const idx = clean.lastIndexOf("/");
    if (idx <= 0) return clean;
    return clean.slice(0, idx);
  }
  function browseTarget(path, isDir) {
    return Number(isDir) === 1 ? path : parentDir(path);
  }

  // _components/browsePane.js
  function renderTree(ctx) {
    const { doc: doc2, state: state2, renderTreeHtml: renderTreeHtml2, renderTreeNode: renderTreeNode2 } = ctx;
    const el = doc2.getElementById("browseTree");
    if (!el) return;
    el.innerHTML = renderTreeHtml2(state2.roots, renderTreeNode2, state2);
  }
  async function copyPathEncoded(ctx) {
    const { encodedPath, event: event2, navigatorRef, showToast: showToast2 } = ctx;
    if (event2) {
      event2.preventDefault();
      event2.stopPropagation();
    }
    try {
      await navigatorRef.clipboard.writeText(decodeURIComponent(encodedPath || ""));
      showToast2("Copied path");
    } catch (err) {
      showToast2("Copy failed: " + err);
    }
  }

  // _components/indexerPane.js
  async function refreshStatus(ctx) {
    const { getJSON, buildStatusView: buildStatusView2, applyStatusView: applyStatusView2, doc: doc2 } = ctx;
    try {
      const s = await getJSON(jsApi_GEN_default.status);
      const view = buildStatusView2(s);
      applyStatusView2(doc2, view);
    } catch (err) {
      doc2.getElementById("status").textContent = String(err);
    }
  }
  async function startReindex(ctx) {
    const { reindexUrl: reindexUrl2, selectedPriorityRoots: selectedPriorityRoots2, doc: doc2, getJSON, showToast: showToast2, refreshStatus: refreshStatus2 } = ctx;
    try {
      const url = reindexUrl2(selectedPriorityRoots2(doc2));
      const res = await getJSON(url, { method: "POST" });
      if (res && res.message) showToast2(res.message);
      refreshStatus2();
    } catch (err) {
      showToast2(String(err));
    }
  }
  function populatePriorityRoots(ctx) {
    const { doc: doc2, roots, buildPriorityRootOptions: buildPriorityRootOptions2, escapeHtml: escapeHtml3 } = ctx;
    const select = doc2.getElementById("priorityRoot");
    if (!select) return;
    const view = buildPriorityRootOptions2(
      roots,
      Array.from(select.selectedOptions || []).map((opt) => opt.value),
      escapeHtml3
    );
    select.innerHTML = view.html;
    Array.from(select.options).forEach((opt) => {
      if (view.selected.has(opt.value)) opt.selected = true;
    });
  }
  function updateBrowseHistoryButtons(ctx) {
    const { doc: doc2, history, historyIndex, applyBrowseHistoryButtons: applyBrowseHistoryButtons2, browseHistoryDisabled: browseHistoryDisabled2 } = ctx;
    applyBrowseHistoryButtons2(doc2, history, historyIndex, browseHistoryDisabled2);
  }

  // _components/manageChrome.js
  function updateTabHelp(ctx) {
    const { doc: doc2, tab, applyManageTabHelp: applyManageTabHelp2, tabHelpText: tabHelpText2 } = ctx;
    applyManageTabHelp2(doc2, tabHelpText2(tab));
  }
  function updatePreviewUI(ctx) {
    const { doc: doc2, tab, applyManagePreviewMeta: applyManagePreviewMeta2, previewMeta: previewMeta2 } = ctx;
    applyManagePreviewMeta2(doc2, previewMeta2(tab));
  }
  function clearOptionalPaths2(ctx) {
    const { doc: doc2, clearOptionalPaths: clearOptionalPaths3 } = ctx;
    clearOptionalPaths3(doc2, ["manageScanPath", "manageSubtitlePath"]);
  }
  function renderSelectedSource(ctx) {
    const { doc: doc2, selectedSource, applyManageSelectedSource: applyManageSelectedSource2, selectedSourceText: selectedSourceText2 } = ctx;
    applyManageSelectedSource2(doc2, selectedSourceText2(selectedSource));
  }

  // _components/manageActionsPane.js
  async function suggestRename(ctx) {
    const { state: state2, showToast: showToast2, getJSON, renderSuggestionCards: renderSuggestionCards2, applySuggestionPreview: applySuggestionPreview2, doc: doc2 } = ctx;
    const path = state2.selectedSource || "";
    if (!path) {
      showToast2("Source path is required");
      return;
    }
    const res = await getJSON(IndexerApi.suggest, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
    applySuggestionPreview2(doc2, renderSuggestionCards2, res, "Rename Suggestion");
  }
  async function previewCategorize(ctx) {
    const { state: state2, showToast: showToast2, categorizeOptionsFromUI: categorizeOptionsFromUI2, postJSON: postJSON2, getJSON, resetCategorizePreviewState: resetCategorizePreviewState2, renderCategorizePreview: renderCategorizePreview2 } = ctx;
    const path = state2.selectedSource || "";
    if (!path) {
      showToast2("Directory path is required");
      return;
    }
    const opts = categorizeOptionsFromUI2();
    const res = await postJSON2(getJSON, IndexerApi.categorizePreview, {
      path,
      previewLimit: 120,
      videosOnly: opts.videosOnly,
      watchedCount: opts.watchedCount
    });
    resetCategorizePreviewState2(state2, res, opts);
    renderCategorizePreview2(res, opts);
  }
  async function queueCategorize(ctx) {
    const { state: state2, showToast: showToast2, promptFn, categorizeOptionsFromUI: categorizeOptionsFromUI2, postJSON: postJSON2, getJSON, setManageResult: setManageResult2, doc: doc2, refreshManageQueue, refreshManageHistory } = ctx;
    const path = state2.selectedSource || "";
    if (!path) {
      showToast2("Directory path is required");
      return;
    }
    const password = promptFn("Manage password?") || "";
    if (!password) {
      showToast2("Password is required to queue categorize apply");
      return;
    }
    const opts = categorizeOptionsFromUI2();
    const res = await postJSON2(getJSON, IndexerApi.manageQueue, {
      action: "categorize",
      password,
      srcPath: path,
      videosOnly: opts.videosOnly,
      watchedCount: opts.watchedCount,
      removeEmptyDirs: opts.removeEmptyDirs
    });
    setManageResult2(doc2, res);
    showToast2("Categorize apply queued");
    refreshManageQueue();
    refreshManageHistory();
  }
  async function suggestRenameFromRenameTab(ctx) {
    const { state: state2, showToast: showToast2, postJSON: postJSON2, getJSON, syncManageFormState, doc: doc2, applySuggestionPreview: applySuggestionPreview2, renderSuggestionCards: renderSuggestionCards2 } = ctx;
    const path = state2.selectedSource || "";
    if (!path) {
      showToast2("Directory path is required");
      return;
    }
    const res = await postJSON2(getJSON, IndexerApi.suggest, { path });
    syncManageFormState({
      suggestedName: res.suggested || "",
      renameTarget: res.newPath || ""
    });
    const target2 = doc2.getElementById("manageRenameTarget");
    if (target2) delete target2.dataset.manual;
    applySuggestionPreview2(doc2, renderSuggestionCards2, res, "Rename Suggestion");
  }
  async function suggestSubtitleRenameFromRenameTab(ctx) {
    const { state: state2, showToast: showToast2, postJSON: postJSON2, getJSON, syncManageFormState, doc: doc2, applySubtitleSuggestionPreview: applySubtitleSuggestionPreview2, renderSubtitleSuggestionHtml: renderSubtitleSuggestionHtml2 } = ctx;
    const path = state2.selectedSource || "";
    if (!path) {
      showToast2("Subtitle path is required");
      return;
    }
    const res = await postJSON2(getJSON, IndexerApi.suggestSubtitle, { path });
    syncManageFormState({
      suggestedName: res.suggested || "",
      renameTarget: res.newPath || ""
    });
    const target2 = doc2.getElementById("manageRenameTarget");
    if (target2) delete target2.dataset.manual;
    applySubtitleSuggestionPreview2(doc2, renderSubtitleSuggestionHtml2, res, path);
  }
  function buildManagePlan2(ctx) {
    const { state: state2, formState, buildManagePlanImpl, action: action2 } = ctx;
    return buildManagePlanImpl(action2, {
      path: state2.selectedSource || "",
      newPath: String(formState.renameTarget || "").trim(),
      dstRoot: String(formState.dstRoot || "").trim(),
      dstSubdir: String(formState.dstSubdir || "").trim().replace(/^\/+/, "").replace(/\/+$/, "")
    });
  }
  function renderManagePlan(ctx) {
    const { doc: doc2, plan, applyManagePreview: applyManagePreview2, renderManagePlanHtml: renderManagePlanHtml2 } = ctx;
    applyManagePreview2(doc2, renderManagePlanHtml2(plan));
  }
  function renderManageModal(ctx) {
    const { doc: doc2, plan, applyManageModal: applyManageModal2, renderManageModalBodyHtml: renderManageModalBodyHtml2 } = ctx;
    applyManageModal2(doc2, plan, renderManageModalBodyHtml2(plan));
  }
  function closeManageModal2(ctx) {
    const { doc: doc2, event: event2, closeManageModalView } = ctx;
    return closeManageModalView(doc2, event2);
  }
  function categorizeOptionsFromUI(ctx) {
    const { formState, categorizeOptionsFromState: categorizeOptionsFromState2 } = ctx;
    return categorizeOptionsFromState2(formState);
  }
  function previewManage(ctx) {
    const { action: action2, state: state2, buildManagePlan: buildManagePlan3, renderManagePlan: renderManagePlan2, renderManageModal: renderManageModal2, showToast: showToast2 } = ctx;
    try {
      const plan = buildManagePlan3(action2);
      state2.plan = plan;
      renderManagePlan2(plan);
      renderManageModal2(plan);
    } catch (err) {
      showToast2(err.message || String(err));
    }
  }
  async function confirmManage(ctx) {
    const { state: state2, showToast: showToast2, promptFn, queueBodyFromPlan: queueBodyFromPlan2, postJSON: postJSON2, getJSON, setManageResult: setManageResult2, doc: doc2, closeManageModal: closeManageModal3, refreshManageQueue, refreshManageHistory } = ctx;
    if (!state2.plan) {
      showToast2("Nothing to confirm");
      return;
    }
    try {
      const password = promptFn("Manage password?") || "";
      if (!password) {
        showToast2("Password is required to queue this action");
        return;
      }
      const queueBody = queueBodyFromPlan2(state2.plan, password);
      const res = await postJSON2(getJSON, IndexerApi.manageQueue, queueBody);
      setManageResult2(doc2, res);
      closeManageModal3();
      showToast2("Manage action queued");
      refreshManageQueue();
      refreshManageHistory();
    } catch (err) {
      setManageResult2(doc2, String(err));
    }
  }
  async function copyPlainText2(ctx) {
    const { text: text2, event: event2, copyPlainTextHelper, navigatorRef, showToast: showToast2 } = ctx;
    if (event2) event2.stopPropagation();
    try {
      await copyPlainTextHelper(text2, navigatorRef);
      showToast2("Copied text");
    } catch (err) {
      showToast2("Copy failed: " + err);
    }
  }
  async function copyCategorizeFilteredOperations(ctx) {
    const { state: state2, hasCategorizePreview: hasCategorizePreview2, showToast: showToast2, buildCategorizeOperationsText: buildCategorizeOperationsText2, categorizeKindLabel: categorizeKindLabel2, copyPlainText: copyPlainText3 } = ctx;
    if (!hasCategorizePreview2(state2)) {
      showToast2("No categorize preview available");
      return;
    }
    const text2 = buildCategorizeOperationsText2(state2, categorizeKindLabel2);
    if (!text2) {
      showToast2("No filtered operations to copy");
      return;
    }
    await copyPlainText3(text2);
  }
  async function copyCategorizeFilteredAmbiguous(ctx) {
    const { state: state2, hasCategorizePreview: hasCategorizePreview2, showToast: showToast2, buildCategorizeAmbiguousText: buildCategorizeAmbiguousText2, copyPlainText: copyPlainText3 } = ctx;
    if (!hasCategorizePreview2(state2)) {
      showToast2("No categorize preview available");
      return;
    }
    const text2 = buildCategorizeAmbiguousText2(state2);
    if (!text2) {
      showToast2("No filtered ambiguous rows to copy");
      return;
    }
    await copyPlainText3(text2);
  }
  async function copyCategorizeFilteredGroups(ctx) {
    const { state: state2, hasCategorizePreview: hasCategorizePreview2, showToast: showToast2, buildCategorizeGroupsText: buildCategorizeGroupsText2, copyPlainText: copyPlainText3 } = ctx;
    if (!hasCategorizePreview2(state2)) {
      showToast2("No categorize preview available");
      return;
    }
    const text2 = buildCategorizeGroupsText2(state2);
    if (!text2) {
      showToast2("No filtered groups to copy");
      return;
    }
    await copyPlainText3(text2);
  }
  async function copyCategorizeCurrentView(ctx) {
    const { state: state2, hasCategorizePreview: hasCategorizePreview2, showToast: showToast2, buildCategorizeCurrentViewText: buildCategorizeCurrentViewText2, categorizeKindLabel: categorizeKindLabel2, copyPlainText: copyPlainText3 } = ctx;
    if (!hasCategorizePreview2(state2)) {
      showToast2("No categorize preview available");
      return;
    }
    await copyPlainText3(buildCategorizeCurrentViewText2(state2, categorizeKindLabel2));
  }
  function setCategorizeFilter(ctx) {
    const { state: state2, patch, applyCategorizeFilter: applyCategorizeFilter2, setFilterAndRerender: setFilterAndRerender2, renderStoredCategorizePreview: renderStoredCategorizePreview2 } = ctx;
    setFilterAndRerender2(state2, patch, applyCategorizeFilter2, renderStoredCategorizePreview2);
  }
  function resetCategorizeFilters(ctx) {
    const { state: state2, applyCategorizeFilter: applyCategorizeFilter2, setFilterAndRerender: setFilterAndRerender2, renderStoredCategorizePreview: renderStoredCategorizePreview2 } = ctx;
    setFilterAndRerender2(state2, {
      categorizeKindFilter: "all",
      categorizeGroupFilter: "",
      categorizeTextFilter: "",
      categorizeAmbiguousFilter: "",
      categorizeGroupTextFilter: ""
    }, applyCategorizeFilter2, renderStoredCategorizePreview2);
  }
  function toggleCategorizeSort(ctx) {
    const { state: state2, which, field, toggleCategorizeSortState: toggleCategorizeSortState2, renderStoredCategorizePreview: renderStoredCategorizePreview2 } = ctx;
    toggleCategorizeSortState2(state2, which, field);
    renderStoredCategorizePreview2();
  }
  function renderStoredCategorizePreview(ctx) {
    const { state: state2, renderCategorizePreview: renderCategorizePreview2 } = ctx;
    if (!state2.categorizePreview) return;
    renderCategorizePreview2(state2.categorizePreview.res, state2.categorizePreview.opts);
  }
  function renderCategorizePreview(ctx) {
    const { doc: doc2, res, opts, state: state2, buildCategorizePreviewHtml: buildCategorizePreviewHtml2 } = ctx;
    doc2.defaultView?.dispatchEvent?.(new CustomEvent("indexer:managePreview", {
      detail: {
        kind: "preview",
        previewHtml: buildCategorizePreviewHtml2(res, opts, state2)
      }
    }));
  }

  // _components/manageWorkflow.js
  function buildPath(doc2, rootID, pathID, buildManagePathValue, formState) {
    const keyMap = {
      manageScanRoot: "scanRoot",
      manageScanPath: "scanPath",
      manageSubtitleRoot: "subtitleRoot",
      manageSubtitlePath: "subtitlePath"
    };
    const root14 = (formState?.[keyMap[rootID]] ?? doc2.getElementById(rootID)?.value) || "";
    const rel = (formState?.[keyMap[pathID]] ?? doc2.getElementById(pathID)?.value) || "";
    return buildManagePathValue(root14, rel);
  }
  function prefillFromPath(ctx) {
    const { kind, fullPath, state: state2, roots, managePathSelection: managePathSelection2, applyPathSelection: applyPathSelection2, renderManageSelectedSource, syncManageRenamePath, populateManageCategorySubdir, syncManageFormState, doc: doc2 } = ctx;
    const mapping = {
      scan: ["manageScanRoot", "manageScanPath"],
      subtitles: ["manageSubtitleRoot", "manageSubtitlePath"]
    };
    const selection = managePathSelection2(kind, fullPath, roots.list, roots.pathRootAndRelative);
    if (selection.selectedSource) {
      state2.selectedSource = selection.selectedSource;
      renderManageSelectedSource();
      syncManageRenamePath();
      populateManageCategorySubdir(state2.selectedSource);
    }
    const pair = mapping[kind];
    if (!pair) return;
    applyPathSelection2(doc2, pair[0], pair[1], selection);
    if (kind === "scan") syncManageFormState({ scanRoot: selection.root || "", scanPath: selection.rel || "" });
    if (kind === "subtitles") syncManageFormState({ subtitleRoot: selection.root || "", subtitlePath: selection.rel || "" });
  }
  function syncDefaults(ctx) {
    const { browseState, state: state2, roots, manageFormState: manageFormState2, syncManageFormState, renderManageSelectedSource, syncManageRenamePath, populateManageCategorySubdir, clearManageOptionalPaths, updateManageScanUI } = ctx;
    const selected = browseState.selectedPath || "";
    if (selected) {
      if (!manageFormState2.scanRoot) {
        const parts = roots.pathRootAndRelative(selected, browseState.roots);
        if (parts.root) syncManageFormState({ scanRoot: parts.root });
      }
      state2.selectedSource = roots.nextSelectedSource(state2.selectedSource, selected);
    }
    renderManageSelectedSource();
    syncManageRenamePath();
    populateManageCategorySubdir(state2.selectedSource || selected);
    clearManageOptionalPaths();
    updateManageScanUI();
  }
  function switchTab(ctx) {
    const { tab, state: state2, applyManageTabState: applyManageTabState2, unlockManagePreview: unlockManagePreview2, updateManageTabHelp, syncManageDefaults, updateManageScanUI, updateManagePreviewUI, doc: doc2 } = ctx;
    state2.tab = tab;
    applyManageTabState2(doc2, tab);
    state2.plan = null;
    unlockManagePreview2(doc2);
    updateManageTabHelp();
    syncManageDefaults();
    updateManageScanUI();
    updateManagePreviewUI();
  }
  async function runModeScan(ctx) {
    if (ctx.state.tab === "delete") return ctx.scanManageDeleteTargets();
    return ctx.scanManageDirectories(ctx.state.tab);
  }
  async function scanManageDirectories(ctx) {
    const { doc: doc2, state: state2, formState, buildManagePathValue, showToast: showToast2, setManageScanCount: setManageScanCount2, scanSuggestedRows: scanSuggestedRows2, getJSON, postJSON: postJSON2, buildSuggestedScanRow: buildSuggestedScanRow2 } = ctx;
    const path = buildPath(doc2, "manageScanRoot", "manageScanPath", buildManagePathValue, formState);
    if (!path) {
      showToast2("Scan path is required");
      return;
    }
    setManageScanCount2(doc2, "scanning...");
    state2.scanRows = await scanSuggestedRows2({
      getJSON,
      postJSON: postJSON2,
      rootPath: path,
      limit: 300,
      mode: state2.tab,
      buildSuggestedScanRow: buildSuggestedScanRow2
    });
    state2.selectedScanRows = [];
  }
  async function scanManageDeleteTargets(ctx) {
    const { doc: doc2, state: state2, formState, buildManagePathValue, showToast: showToast2, setManageScanCount: setManageScanCount2, scanDeleteRows: scanDeleteRows2, getJSON, buildDeleteScanRows: buildDeleteScanRows2 } = ctx;
    const path = buildPath(doc2, "manageScanRoot", "manageScanPath", buildManagePathValue, formState);
    if (!path) {
      showToast2("Scan path is required");
      return;
    }
    setManageScanCount2(doc2, "scanning...");
    state2.scanRows = await scanDeleteRows2({
      getJSON,
      rootPath: path,
      limit: 300,
      buildDeleteScanRows: buildDeleteScanRows2
    });
    state2.selectedScanRows = [];
  }
  function previewScannedSuggest(ctx) {
    const { index: index2, state: state2, requireScanRow: requireScanRow2, showToast: showToast2, renderManageSelectedSource, applySuggestionPreview: applySuggestionPreview2, renderSuggestionCards: renderSuggestionCards2, suggestionPreviewData: suggestionPreviewData2, doc: doc2 } = ctx;
    let item;
    try {
      item = requireScanRow2(state2.scanRows, index2, "Scanned directory not found");
    } catch (err) {
      showToast2(String(err.message || err));
      return;
    }
    state2.selectedSource = item.path;
    renderManageSelectedSource();
    applySuggestionPreview2(doc2, renderSuggestionCards2, suggestionPreviewData2(item), "Suggestion Preview");
  }
  function previewScannedRename(ctx) {
    const { index: index2, state: state2, requireScanRow: requireScanRow2, showToast: showToast2, renamePreviewState: renamePreviewState2, renderManageSelectedSource, switchManageTab, syncManageFormState, doc: doc2, applySuggestionPreview: applySuggestionPreview2, renderSuggestionCards: renderSuggestionCards2 } = ctx;
    let item;
    try {
      item = requireScanRow2(state2.scanRows, index2, "Scanned directory not found");
    } catch (err) {
      showToast2(String(err.message || err));
      return;
    }
    const next2 = renamePreviewState2(item);
    state2.selectedSource = next2.selectedSource;
    renderManageSelectedSource();
    switchManageTab("rename");
    syncManageFormState({
      suggestedName: next2.suggestedName,
      renameTarget: next2.renameTarget
    });
    const target2 = doc2.getElementById("manageRenameTarget");
    if (target2) delete target2.dataset.manual;
    applySuggestionPreview2(doc2, renderSuggestionCards2, next2.preview, "Rename Suggestion");
  }
  function prepareScannedMove(ctx) {
    const { index: index2, state: state2, requireScanRow: requireScanRow2, showToast: showToast2, movePreviewState: movePreviewState2, renderManageSelectedSource, populateManageCategorySubdir, switchManageTab } = ctx;
    let item;
    try {
      item = requireScanRow2(state2.scanRows, index2, "Scanned directory not found");
    } catch (err) {
      showToast2(String(err.message || err));
      return;
    }
    const next2 = movePreviewState2(item);
    state2.selectedSource = next2.selectedSource;
    renderManageSelectedSource();
    populateManageCategorySubdir(next2.categoryPath);
    switchManageTab("move");
  }
  async function scanSubtitleCandidates(ctx) {
    const { doc: doc2, state: state2, formState, buildManagePathValue, showToast: showToast2, getJSON } = ctx;
    const path = buildPath(doc2, "manageSubtitleRoot", "manageSubtitlePath", buildManagePathValue, formState);
    if (!path) {
      showToast2("Scan path is required");
      return;
    }
    const rows = await getJSON(jsApi_GEN_default.scanSubtitles, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, limit: 500 })
    });
    state2.subtitleRows = rows || [];
  }

  // _components/manageBatchPane.js
  function isRowSelected(ctx) {
    const { state: state2, idx } = ctx;
    return (state2.selectedScanRows || []).includes(idx);
  }
  function toggleRowSelection(ctx) {
    const { state: state2, idx, checked, toggleIndexSelection: toggleIndexSelection2, renderManageBatchActions } = ctx;
    state2.selectedScanRows = toggleIndexSelection2(state2.selectedScanRows, idx, checked);
    renderManageBatchActions();
  }
  function toggleSelectAll(ctx) {
    const { state: state2, checked, selectAllRowIndexes: selectAllRowIndexes2, renderManageBatchActions } = ctx;
    state2.selectedScanRows = selectAllRowIndexes2(state2.scanRows, checked);
    renderManageBatchActions();
  }
  function selectedRowsForBatch(ctx) {
    const { state: state2, selectedRows: selectedRows2 } = ctx;
    return selectedRows2(state2.scanRows, state2.selectedScanRows);
  }
  async function queueSelectedCategorize(ctx) {
    const {
      state: state2,
      categorizeOptionsFromUI: categorizeOptionsFromUI2,
      queueBatchWithPassword: queueBatchWithPassword2,
      promptFn,
      getJSON,
      batchQueueActions: batchQueueActions2,
      doc: doc2,
      refreshManageQueue,
      refreshManageHistory,
      showToast: showToast2,
      selectedManageRows
    } = ctx;
    const opts = categorizeOptionsFromUI2();
    try {
      const res = await queueBatchWithPassword2({
        rows: selectedManageRows(),
        promptFn,
        promptText: "Manage password?",
        missingRowsMessage: "No scan rows selected",
        missingPasswordMessage: "Password is required to queue batch categorize",
        getJSON,
        batchQueueActions: batchQueueActions2,
        requestBuilder: (item, password) => ({
          action: "categorize",
          password,
          srcPath: item.path,
          videosOnly: opts.videosOnly,
          watchedCount: opts.watchedCount,
          removeEmptyDirs: opts.removeEmptyDirs
        }),
        doc: doc2,
        successMessage: "Batch categorize queued: ",
        partialMessage: "Batch categorize queued with errors",
        after: async () => {
          await refreshManageQueue();
          await refreshManageHistory();
        }
      });
      showToast2(res.toast);
    } catch (err) {
      showToast2(err.message || String(err));
    }
  }
  async function queueSelectedRenames(ctx) {
    const {
      queueBatchWithPassword: queueBatchWithPassword2,
      promptFn,
      getJSON,
      batchQueueActions: batchQueueActions2,
      doc: doc2,
      refreshManageQueue,
      refreshManageHistory,
      showToast: showToast2,
      selectedManageRows
    } = ctx;
    try {
      const res = await queueBatchWithPassword2({
        rows: selectedManageRows(),
        promptFn,
        promptText: "Manage password?",
        missingRowsMessage: "No scan rows selected",
        missingPasswordMessage: "Password is required to queue batch rename",
        getJSON,
        batchQueueActions: batchQueueActions2,
        requestBuilder: (item, password) => ({
          action: "rename",
          password,
          srcPath: item.path,
          newPath: item.newPath
        }),
        doc: doc2,
        successMessage: "Batch rename queued: ",
        partialMessage: "Batch rename queued with errors",
        after: async () => {
          await refreshManageQueue();
          await refreshManageHistory();
        }
      });
      showToast2(res.toast);
    } catch (err) {
      showToast2(err.message || String(err));
    }
  }
  async function queueSelectedMoves(ctx) {
    const {
      formState,
      queueBatchWithPassword: queueBatchWithPassword2,
      promptFn,
      getJSON,
      batchQueueActions: batchQueueActions2,
      refreshManageQueue,
      refreshManageHistory,
      showToast: showToast2,
      selectedManageRows
    } = ctx;
    const dstRoot = String(formState.dstRoot || "").trim();
    const dstSubdir = String(formState.dstSubdir || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
    const dstDir = dstSubdir ? dstRoot.replace(/\/+$/, "") + "/" + dstSubdir : dstRoot;
    if (!dstRoot) {
      showToast2("Destination root is required");
      return;
    }
    try {
      const res = await queueBatchWithPassword2({
        rows: selectedManageRows(),
        promptFn,
        promptText: "Manage password?",
        missingRowsMessage: "No scan rows selected",
        missingPasswordMessage: "Password is required to queue batch move",
        getJSON,
        batchQueueActions: batchQueueActions2,
        requestBuilder: (item, password) => ({
          action: "move",
          password,
          srcPath: item.path,
          dstDir
        }),
        doc,
        successMessage: "Batch move queued: ",
        partialMessage: "Batch move queued with errors",
        resultBuilder: ({ queued, errors }) => ({ queued, dstDir, errors }),
        after: async () => {
          await refreshManageQueue();
          await refreshManageHistory();
        }
      });
      showToast2(res.toast);
    } catch (err) {
      showToast2(err.message || String(err));
    }
  }
  async function queueSelectedDeletes(ctx) {
    const {
      queueBatchWithPassword: queueBatchWithPassword2,
      promptFn,
      getJSON,
      batchQueueActions: batchQueueActions2,
      doc: doc2,
      refreshManageQueue,
      refreshManageHistory,
      showToast: showToast2,
      selectedManageRows
    } = ctx;
    try {
      const res = await queueBatchWithPassword2({
        rows: selectedManageRows(),
        promptFn,
        promptText: "Manage password?",
        missingRowsMessage: "No scan rows selected",
        missingPasswordMessage: "Password is required to queue batch delete",
        getJSON,
        batchQueueActions: batchQueueActions2,
        requestBuilder: (item, password) => ({
          action: "delete",
          password,
          srcPath: item.path
        }),
        doc: doc2,
        successMessage: "Batch delete queued: ",
        partialMessage: "Batch delete queued with errors",
        after: async () => {
          await refreshManageQueue();
          await refreshManageHistory();
        }
      });
      showToast2(res.toast);
    } catch (err) {
      showToast2(err.message || String(err));
    }
  }
  async function queueSubtitleRename(ctx) {
    const {
      index: index2,
      event: event2,
      state: state2,
      queueSingleWithPassword: queueSingleWithPassword2,
      promptFn,
      getJSON,
      postJSON: postJSON2,
      doc: doc2,
      renderSubtitleCandidates,
      refreshManageQueue,
      refreshManageHistory,
      showToast: showToast2
    } = ctx;
    if (event2) event2.stopPropagation();
    const item = (state2.subtitleRows || [])[index2];
    try {
      await queueSingleWithPassword2({
        item,
        promptFn,
        promptText: "Manage password?",
        missingItemMessage: "Subtitle row not found",
        missingPasswordMessage: "Password is required to queue this action",
        getJSON,
        postJSON: postJSON2,
        url: jsApi_GEN_default.manageQueue,
        bodyBuilder: (row, password) => ({
          action: "rename",
          password,
          srcPath: row.path,
          newPath: row.newPath
        }),
        doc: doc2,
        after: async () => {
          state2.subtitleRows.splice(index2, 1);
          renderSubtitleCandidates();
          await refreshManageQueue();
          await refreshManageHistory();
        }
      });
      showToast2("Subtitle rename queued");
    } catch (err) {
      showToast2(err.message || String(err));
    }
  }

  // _components/searchPane.js
  async function runSearch(ctx) {
    const { doc: doc2, state: state2, getJSON, currentSearchQuery: currentSearchQuery2, currentSearchKind: currentSearchKind3, deriveSearchKind, searchRequestUrl: searchRequestUrl2, applySearchPage: applySearchPage2, renderSearchTable: renderSearchTable2 } = ctx;
    const q = currentSearchQuery2(doc2);
    const kind = currentSearchKind3(doc2, deriveSearchKind);
    const page = await getJSON(searchRequestUrl2(q, kind, state2.pageSize, state2.page));
    applySearchPage2(state2, page);
    renderSearchTable2();
  }
  function resetSearchAndRun(ctx) {
    ctx.state.page = 0;
    return ctx.runSearch();
  }
  function toggleRelativeTime(ctx) {
    const { doc: doc2, state: state2, searchRelativeTimeTitle: searchRelativeTimeTitle2, renderSearchTable: renderSearchTable2 } = ctx;
    state2.relativeTime = !state2.relativeTime;
    const el = doc2.getElementById("toggleSearchRelativeTime");
    if (el) el.title = searchRelativeTimeTitle2(state2.relativeTime);
    renderSearchTable2();
  }
  function updateSearchSortHeaders(ctx) {
    const { doc: doc2, state: state2, applySortHeaders: applySortHeaders2, sortHeaderText: sortHeaderText2 } = ctx;
    applySortHeaders2(doc2, "searchSort-", {
      isDir: "Type",
      base: "Name",
      root: "Root",
      contents: "Contents",
      size: "Size",
      modifiedAt: "Modified"
    }, state2, sortHeaderText2);
  }
  function renderSearchTable(ctx) {
    const { doc: doc2, state: state2, applySearchTable: applySearchTable2, buildSearchRows: buildSearchRows2 } = ctx;
    applySearchTable2(doc2, state2, buildSearchRows2);
  }
  function changeSearchPage(ctx) {
    const { delta, state: state2, nextSearchPage: nextSearchPage2, runSearch: runSearch2 } = ctx;
    const next2 = nextSearchPage2(state2.total, state2.pageSize, state2.page, delta);
    if (!next2.changed) return;
    state2.page = next2.page;
    runSearch2();
  }
  function normalizeSearchKinds2(ctx) {
    const { doc: doc2, changed, normalizeSearchKindsState } = ctx;
    const dir = doc2.getElementById("searchDirOnly");
    const file = doc2.getElementById("searchFileOnly");
    const next2 = normalizeSearchKindsState(dir.checked, file.checked, changed);
    dir.checked = next2.dirChecked;
    file.checked = next2.fileChecked;
  }
  function onSearchKey(ctx) {
    const { event: event2, resetSearchAndRun: resetSearchAndRun2 } = ctx;
    if (event2.key !== "Enter") return;
    event2.preventDefault();
    resetSearchAndRun2();
  }

  // _components/queuePane.js
  function isQueueRowSelected(ctx) {
    const { state: state2, id, idSelected: idSelected2, hasSelection: hasSelection2 } = ctx;
    return idSelected2(state2, "selectedQueueRows", id, hasSelection2);
  }
  function isHistoryRowSelected(ctx) {
    const { state: state2, id, idSelected: idSelected2, hasSelection: hasSelection2 } = ctx;
    return idSelected2(state2, "selectedHistoryRows", id, hasSelection2);
  }
  function toggleQueueRowSelected(ctx) {
    const { state: state2, id, checked, toggleIdSelection: toggleIdSelection2, toggleSelection: toggleSelection2 } = ctx;
    toggleIdSelection2(state2, "selectedQueueRows", id, checked, toggleSelection2);
  }
  function toggleHistoryRowSelected(ctx) {
    const { state: state2, id, checked, toggleIdSelection: toggleIdSelection2, toggleSelection: toggleSelection2 } = ctx;
    toggleIdSelection2(state2, "selectedHistoryRows", id, checked, toggleSelection2);
  }
  async function cancelTask(ctx) {
    const { id, showToast: showToast2, postJSON: postJSON2, getJSON, setManageResult: setManageResult2, doc: doc2, refreshManageQueue, refreshManageHistory } = ctx;
    if (!id) {
      showToast2("Task id is required");
      return;
    }
    const res = await postJSON2(getJSON, jsApi_GEN_default.manageCancel, { id });
    setManageResult2(doc2, res);
    showToast2("Queued task cancelled");
    refreshManageQueue();
    refreshManageHistory();
  }
  async function cancelSelected(ctx) {
    const { state: state2, showToast: showToast2, batchQueueActions: batchQueueActions2, getJSON, setManageResult: setManageResult2, doc: doc2, refreshManageQueue, refreshManageHistory } = ctx;
    const ids = [...state2.selectedQueueRows || []];
    if (!ids.length) {
      showToast2("No queued tasks selected");
      return;
    }
    const { queued: cancelled, errors } = await batchQueueActions2(getJSON, ids, (id) => ({ id }));
    state2.selectedQueueRows = [];
    setManageResult2(doc2, { cancelled, errors });
    if (errors.length) showToast2("Batch cancel finished with errors");
    else showToast2("Batch cancel: " + cancelled);
    refreshManageQueue();
    refreshManageHistory();
  }
  async function retryHistoryTask(ctx) {
    const { id, promptFn, showToast: showToast2, postJSON: postJSON2, getJSON, setManageResult: setManageResult2, doc: doc2, refreshManageQueue, refreshManageHistory } = ctx;
    if (!id) {
      showToast2("History id is required");
      return;
    }
    const password = promptFn("Manage password?") || "";
    if (!password) {
      showToast2("Password is required to retry this action");
      return;
    }
    const res = await postJSON2(getJSON, jsApi_GEN_default.manageRetry, { id, password });
    setManageResult2(doc2, res);
    showToast2("Manage action retried");
    refreshManageQueue();
    refreshManageHistory();
  }
  async function retrySelected(ctx) {
    const { state: state2, promptFn, showToast: showToast2, batchQueueActions: batchQueueActions2, getJSON, setManageResult: setManageResult2, doc: doc2, refreshManageQueue, refreshManageHistory } = ctx;
    const ids = [...state2.selectedHistoryRows || []];
    if (!ids.length) {
      showToast2("No history rows selected");
      return;
    }
    const password = promptFn("Manage password?") || "";
    if (!password) {
      showToast2("Password is required to retry these actions");
      return;
    }
    const { queued, errors } = await batchQueueActions2(getJSON, ids, (id) => ({ id, password }));
    state2.selectedHistoryRows = [];
    setManageResult2(doc2, { queued, errors });
    if (errors.length) showToast2("Batch retry finished with errors");
    else showToast2("Batch retry: " + queued);
    refreshManageQueue();
    refreshManageHistory();
  }

  // _components/shellControls.js
  function switchTab2(ctx) {
    const { tab, applyTabState: applyTabState2, doc: doc2, storage, syncManageDefaults, refreshManageQueue, refreshManageHistory } = ctx;
    applyTabState2(doc2, tab);
    try {
      storage.setItem("indexer.activeTab", tab);
    } catch (_) {
    }
    try {
      window.dispatchEvent(new CustomEvent("indexer:tab", { detail: { tab } }));
    } catch (_) {
    }
    if (tab === "manage") syncManageDefaults();
    if (tab === "queue") {
      refreshManageQueue();
      refreshManageHistory();
    }
  }
  function setSearchSort(ctx) {
    const { field, state: state2, nextSortState: nextSortState2, updateSearchSortHeaders: updateSearchSortHeaders2, renderSearchTable: renderSearchTable2 } = ctx;
    Object.assign(state2, nextSortState2(state2, field));
    updateSearchSortHeaders2();
    renderSearchTable2();
  }
  function setBrowseSort(ctx) {
    const { field, state: state2, nextSortState: nextSortState2, updateBrowseSortHeaders, renderBrowseTable } = ctx;
    Object.assign(state2, nextSortState2(state2, field));
    updateBrowseSortHeaders();
    renderBrowseTable();
  }
  function toggleBrowseRelativeTime(ctx) {
    const { state: state2, doc: doc2, relativeTimeButtonText: relativeTimeButtonText2, renderBrowseTable } = ctx;
    state2.relativeTime = !state2.relativeTime;
    doc2.getElementById("toggleRelativeTime").textContent = relativeTimeButtonText2(state2.relativeTime);
    renderBrowseTable();
  }
  function prefillManageFromBrowse(ctx) {
    const { browseState, kind, showToast: showToast2, prefillManageFromPath } = ctx;
    if (!browseState.selectedPath) {
      showToast2("No browse path selected");
      return;
    }
    prefillManageFromPath(kind, browseState.selectedPath);
  }
  function setManageSelectedSourceFromBrowse(ctx) {
    const { browseState, state: state2, showToast: showToast2, renderManageSelectedSource, syncManageRenamePath, populateManageCategorySubdir } = ctx;
    if (!browseState.selectedPath) {
      showToast2("No browse path selected");
      return;
    }
    state2.selectedSource = browseState.selectedPath;
    renderManageSelectedSource();
    syncManageRenamePath();
    populateManageCategorySubdir(state2.selectedSource);
  }
  function useScannedDirectory(ctx) {
    const { index: index2, state: state2, requireScanRow: requireScanRow2, showToast: showToast2, prefillManageFromPath } = ctx;
    let item;
    try {
      item = requireScanRow2(state2.scanRows, index2, "Scanned directory not found");
    } catch (err) {
      showToast2(String(err.message || err));
      return;
    }
    prefillManageFromPath(state2.tab, item.path);
  }
  function previewScannedCategorize(ctx) {
    const { index: index2, state: state2, requireScanRow: requireScanRow2, showToast: showToast2, renderManageSelectedSource, switchManageTab, previewCategorize: previewCategorize2 } = ctx;
    let item;
    try {
      item = requireScanRow2(state2.scanRows, index2, "Scanned directory not found");
    } catch (err) {
      showToast2(String(err.message || err));
      return;
    }
    state2.selectedSource = item.path;
    renderManageSelectedSource();
    switchManageTab("suggest");
    previewCategorize2();
  }
  function previewScannedMove(ctx) {
    const { index: index2, prepareScannedMove: prepareScannedMove2, previewManage: previewManage2 } = ctx;
    prepareScannedMove2(index2);
    previewManage2("move");
  }
  function previewScannedDelete(ctx) {
    const { index: index2, state: state2, requireScanRow: requireScanRow2, showToast: showToast2, renderManageSelectedSource, switchManageTab, previewManage: previewManage2 } = ctx;
    let item;
    try {
      item = requireScanRow2(state2.scanRows, index2, "Scanned target not found");
    } catch (err) {
      showToast2(String(err.message || err));
      return;
    }
    state2.selectedSource = item.path;
    renderManageSelectedSource();
    switchManageTab("delete");
    previewManage2("delete");
  }

  // appController.js
  function initAppController() {
    if (window.__indexerAppControllerBooted) return;
    window.__indexerAppControllerBooted = true;
    const browseState = {
      roots: [],
      expanded: /* @__PURE__ */ new Set(),
      loaded: /* @__PURE__ */ new Map(),
      selectedPath: "",
      history: [],
      historyIndex: -1,
      currentRows: [],
      sortBy: "isDir",
      sortDesc: false,
      relativeTime: true
    };
    window.addEventListener("indexer:browseState", (event2) => {
      const detail = event2?.detail || {};
      browseState.roots = detail.roots || [];
      browseState.selectedPath = detail.selectedPath || "";
      browseState.history = detail.history || [];
      browseState.historyIndex = Number.isInteger(detail.historyIndex) ? detail.historyIndex : -1;
      browseState.currentRows = detail.currentRows || [];
      browseState.relativeTime = detail.relativeTime !== false;
      browseState.sortBy = detail.sortBy || browseState.sortBy;
      browseState.sortDesc = !!detail.sortDesc;
      syncManageDefaults();
    });
    const manageState = {
      plan: null,
      tab: "suggest",
      subtitleRows: [],
      scanRows: [],
      selectedSource: "",
      selectedScanRows: [],
      queueRows: [],
      historyRows: [],
      selectedQueueRows: [],
      selectedHistoryRows: [],
      categorizePreview: null,
      categorizeKindFilter: "all",
      categorizeGroupFilter: "",
      categorizeTextFilter: "",
      categorizeAmbiguousFilter: "",
      categorizeGroupTextFilter: "",
      categorizeGroupSortBy: "targetDir",
      categorizeGroupSortDesc: false,
      categorizeOpSortBy: "target",
      categorizeOpSortDesc: false,
      categorizeAmbiguousSortBy: "video",
      categorizeAmbiguousSortDesc: false
    };
    const searchState = {
      relativeTime: true,
      rows: [],
      total: 0,
      page: 0,
      pageSize: 100,
      sortBy: "modifiedAt",
      sortDesc: true
    };
    const manageFormState2 = {
      scanRoot: "",
      scanPath: "",
      subtitleRoot: "",
      subtitlePath: "",
      suggestedName: "",
      renameTarget: "",
      dstRoot: "",
      dstSubdir: "",
      categorizeWatched: 0,
      categorizeVideosOnly: false,
      categorizeRemoveEmpty: true
    };
    function syncManageFormState(patch = {}) {
      Object.assign(manageFormState2, patch || {});
      window.dispatchEvent(new CustomEvent("indexer:manageForm", { detail: { patch } }));
    }
    window.addEventListener("indexer:manageForm", (event2) => {
      const patch = event2?.detail?.patch || {};
      Object.assign(manageFormState2, patch);
    });
    function syncManageWorkflowState() {
      window.dispatchEvent(new CustomEvent("indexer:manageWorkflow", {
        detail: {
          tab: manageState.tab,
          scanConfig: manageModeConfig(),
          scanRows: manageState.scanRows || [],
          selectedScanRows: manageState.selectedScanRows || [],
          subtitleRows: manageState.subtitleRows || []
        }
      }));
    }
    window.addEventListener("indexer:uiCommand", (event2) => {
      const detail = event2?.detail || {};
      if (detail.scope === "tab" && detail.tab) {
        switchTab3(detail.tab);
        return;
      }
      if (detail.scope === "manageTab" && detail.tab) {
        switchManageTab(detail.tab);
        return;
      }
      if (detail.scope !== "manageAction") return;
      switch (detail.action) {
        case "runManageModeScan":
          runManageModeScan();
          break;
        case "prefillManageFromBrowse":
          prefillManageFromBrowse2(detail.kind || "scan");
          break;
        case "toggleManageSelectAll":
          toggleManageSelectAll(!!detail.checked);
          break;
        case "toggleManageRowSelection":
          toggleManageRowSelection(detail.index, !!detail.checked);
          break;
        case "scanSubtitleCandidates":
          scanSubtitleCandidates2();
          break;
        case "suggestRenameFromRenameTab":
          suggestRenameFromRenameTab2();
          break;
        case "suggestSubtitleRenameFromRenameTab":
          suggestSubtitleRenameFromRenameTab2();
          break;
        case "previewManage":
          previewManage2(detail.mode || "rename");
          break;
        case "previewScannedSuggest":
          previewScannedSuggest2(detail.index);
          break;
        case "previewScannedRename":
          previewScannedRename2(detail.index);
          break;
        case "previewScannedCategorize":
          previewScannedCategorize2(detail.index);
          break;
        case "previewScannedMove":
          previewScannedMove2(detail.index);
          break;
        case "previewScannedDelete":
          previewScannedDelete2(detail.index);
          break;
        case "setManageSelectedSourceFromBrowse":
          setManageSelectedSourceFromBrowse2();
          break;
        case "prefillManageRenameFromPath":
          prefillManageRenameFromPath(detail.path || "");
          break;
        case "closeManageModal":
          closeManageModal3();
          break;
        case "confirmManage":
          confirmManage2();
          break;
        case "queueSelectedCategorize":
          queueSelectedCategorize2();
          break;
        case "queueSelectedRenames":
          queueSelectedRenames2();
          break;
        case "queueSelectedMoves":
          queueSelectedMoves2();
          break;
        case "queueSelectedDeletes":
          queueSelectedDeletes2();
          break;
        case "queueSubtitleRename":
          queueSubtitleRename2(detail.index);
          break;
        case "showInBrowse":
          showInBrowseEncoded(encodeURIComponent(detail.path || ""), detail.isDir ? 1 : 0);
          break;
      }
    });
    async function getJSON(url, options = {}) {
      const res = await fetch(url, options);
      const text2 = await res.text();
      if (!res.ok) {
        showToast(text2 || "HTTP " + res.status);
        throw new Error(text2);
      }
      return text2 ? JSON.parse(text2) : {};
    }
    function switchTab3(tab, event2) {
      switchTab2({
        tab,
        applyTabState,
        doc: document,
        storage: localStorage,
        syncManageDefaults,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    async function refreshStatus2() {
      await refreshStatus({
        getJSON,
        buildStatusView,
        applyStatusView,
        doc: document
      });
    }
    async function startReindex2() {
      await startReindex({
        reindexUrl,
        selectedPriorityRoots,
        doc: document,
        getJSON,
        showToast,
        refreshStatus: refreshStatus2
      });
    }
    async function runSearch2() {
      await runSearch({
        doc: document,
        state: searchState,
        getJSON,
        currentSearchQuery,
        currentSearchKind,
        deriveSearchKind: currentSearchKind2,
        searchRequestUrl,
        applySearchPage,
        renderSearchTable: renderSearchTable2
      });
    }
    function resetSearchAndRun2() {
      resetSearchAndRun({
        state: searchState,
        runSearch: runSearch2
      });
    }
    function toggleSearchRelativeTime() {
      toggleRelativeTime({
        doc: document,
        state: searchState,
        searchRelativeTimeTitle,
        renderSearchTable: renderSearchTable2
      });
    }
    function setSearchSort2(field) {
      setSearchSort({
        field,
        state: searchState,
        nextSortState,
        updateSearchSortHeaders: updateSearchSortHeaders2,
        renderSearchTable: renderSearchTable2
      });
    }
    function updateSearchSortHeaders2() {
      updateSearchSortHeaders({
        doc: document,
        state: searchState,
        applySortHeaders,
        sortHeaderText
      });
    }
    function renderSearchTable2() {
      renderSearchTable({
        doc: document,
        state: searchState,
        applySearchTable,
        buildSearchRows
      });
    }
    function changeSearchPage2(delta) {
      changeSearchPage({
        delta,
        state: searchState,
        nextSearchPage,
        runSearch: runSearch2
      });
    }
    function normalizeSearchKinds3(changed) {
      normalizeSearchKinds2({
        doc: document,
        changed,
        normalizeSearchKindsState: normalizeSearchKinds
      });
    }
    function onSearchKey2(event2) {
      onSearchKey({
        event: event2,
        resetSearchAndRun: resetSearchAndRun2
      });
    }
    function updateBrowseHistoryButtons2() {
      updateBrowseHistoryButtons({
        doc: document,
        history: browseState.history,
        historyIndex: browseState.historyIndex,
        applyBrowseHistoryButtons,
        browseHistoryDisabled
      });
    }
    async function reloadTree() {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "reload" } }));
    }
    function populatePriorityRoots2() {
      populatePriorityRoots({
        doc: document,
        roots: browseState.roots,
        buildPriorityRootOptions,
        escapeHtml
      });
    }
    async function toggleNode(path) {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "toggleNode", path } }));
    }
    function renderTree2() {
      renderTree({
        doc: document,
        state: browseState,
        renderTreeHtml,
        renderTreeNode
      });
    }
    async function selectNode(encodedPath) {
      await selectBrowsePath(decodeURIComponent(encodedPath));
    }
    async function selectBrowsePath(path, options = {}) {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "selectPath", path, options } }));
    }
    async function showInBrowseEncoded(encodedPath, isDir, event2) {
      if (event2) event2.stopPropagation();
      const path = decodeURIComponent(encodedPath || "");
      const target2 = browseTarget(path, isDir);
      if (!target2) {
        showToast("No browse target for this row");
        return;
      }
      switchTab3("browse");
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "show", path, isDir } }));
    }
    function setBrowseSort2(field) {
      setBrowseSort({
        field,
        state: browseState,
        nextSortState,
        updateBrowseSortHeaders,
        renderBrowseTable
      });
    }
    function updateBrowseSortHeaders() {
      applySortHeaders(document, "browseSort-", {
        base: "Name",
        isDir: "Type",
        contents: "Contents",
        size: "Size",
        modifiedAt: "Modified"
      }, browseState, sortHeaderText);
    }
    function toggleRelativeTime2() {
      toggleBrowseRelativeTime({
        state: browseState,
        doc: document,
        relativeTimeButtonText,
        renderBrowseTable
      });
    }
    function browseUp() {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "up" } }));
    }
    function browseBack() {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "back" } }));
    }
    function browseForward() {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "forward" } }));
    }
    async function openBrowsePath(encodedPath) {
      window.dispatchEvent(new CustomEvent("indexer:browseCommand", { detail: { kind: "selectPath", path: decodeURIComponent(encodedPath || "") } }));
    }
    async function copyPathEncoded2(encodedPath, event2) {
      await copyPathEncoded({
        encodedPath,
        event: event2,
        navigatorRef: navigator,
        showToast
      });
    }
    function renderBrowseTable() {
      applyBrowseTable(document, browseState, buildBrowseRows);
    }
    function switchManageTab(tab, event2) {
      switchTab({
        tab,
        state: manageState,
        applyManageTabState,
        unlockManagePreview,
        updateManageTabHelp,
        syncManageDefaults,
        updateManageScanUI,
        updateManagePreviewUI,
        doc: document
      });
      syncManageWorkflowState();
    }
    function updateManageTabHelp() {
      updateTabHelp({
        doc: document,
        tab: manageState.tab,
        applyManageTabHelp,
        tabHelpText
      });
    }
    function updateManagePreviewUI() {
      updatePreviewUI({
        doc: document,
        tab: manageState.tab,
        applyManagePreviewMeta,
        previewMeta
      });
    }
    function clearManageOptionalPaths() {
      clearOptionalPaths2({
        doc: document,
        clearOptionalPaths
      });
      syncManageFormState({ scanPath: "", subtitlePath: "" });
    }
    function manageModeConfig() {
      return modeConfig(manageState.tab);
    }
    function updateManageScanUI() {
      syncManageWorkflowState();
    }
    function renderManageBatchActions() {
      syncManageWorkflowState();
    }
    function syncManageRenamePath() {
      const renameTarget = document.getElementById("manageRenameTarget");
      if (!manageState.selectedSource) {
        syncManageFormState({ suggestedName: "", renameTarget: "" });
        return;
      }
      if (renameTarget?.dataset.manual) return;
      syncManageFormState({ renameTarget: renameTargetFromSource(manageState.selectedSource) });
    }
    function renderManageSelectedSource() {
      renderSelectedSource({
        doc: document,
        selectedSource: manageState.selectedSource,
        applyManageSelectedSource,
        selectedSourceText
      });
    }
    function buildManagePath2(rootID, pathID) {
      return buildPath(document, rootID, pathID, buildManagePath, manageFormState2);
    }
    function prefillManageFromBrowse2(kind) {
      prefillManageFromBrowse({
        browseState,
        kind,
        showToast,
        prefillManageFromPath
      });
    }
    function setManageSelectedSourceFromBrowse2() {
      setManageSelectedSourceFromBrowse({
        browseState,
        state: manageState,
        showToast,
        renderManageSelectedSource,
        syncManageRenamePath,
        populateManageCategorySubdir
      });
    }
    function prefillManageRenameFromPath(path) {
      const clean = String(path || "").trim();
      if (!clean) {
        showToast("Rename path is required");
        return;
      }
      switchTab3("manage");
      switchManageTab("rename");
      manageState.selectedSource = clean;
      renderManageSelectedSource();
      syncManageRenamePath();
      populateManageCategorySubdir(manageState.selectedSource);
    }
    function prefillManageFromPath(kind, fullPath) {
      prefillFromPath({
        kind,
        fullPath,
        state: manageState,
        roots: {
          list: browseState.roots,
          pathRootAndRelative
        },
        managePathSelection,
        applyPathSelection,
        renderManageSelectedSource,
        syncManageRenamePath,
        populateManageCategorySubdir,
        syncManageFormState,
        doc: document
      });
    }
    function syncManageDefaults() {
      syncDefaults({
        browseState,
        state: manageState,
        doc: document,
        manageFormState: manageFormState2,
        syncManageFormState,
        roots: {
          pathRootAndRelative,
          nextSelectedSource
        },
        renderManageSelectedSource,
        syncManageRenamePath,
        populateManageCategorySubdir,
        clearManageOptionalPaths,
        updateManageScanUI
      });
    }
    function populateManageCategorySubdir(path) {
      if (String(manageFormState2.dstSubdir || "").trim()) return;
      const detected = detectCategorySubdir(path);
      if (detected) syncManageFormState({ dstSubdir: detected });
    }
    async function suggestRename2() {
      await suggestRename({
        state: manageState,
        showToast,
        getJSON,
        renderSuggestionCards,
        applySuggestionPreview,
        doc: document
      });
    }
    async function runManageModeScan() {
      return runModeScan({
        state: manageState,
        scanManageDeleteTargets: scanManageDeleteTargets2,
        scanManageDirectories: scanManageDirectories2
      });
    }
    async function scanManageDirectories2(mode = manageState.tab) {
      await scanManageDirectories({
        doc: document,
        state: manageState,
        formState: manageFormState2,
        buildManagePathValue: buildManagePath,
        showToast,
        setManageScanCount,
        scanSuggestedRows,
        getJSON,
        postJSON,
        buildSuggestedScanRow
      });
      syncManageWorkflowState();
    }
    async function scanManageDeleteTargets2() {
      await scanManageDeleteTargets({
        doc: document,
        state: manageState,
        formState: manageFormState2,
        buildManagePathValue: buildManagePath,
        showToast,
        setManageScanCount,
        scanDeleteRows,
        getJSON,
        buildDeleteScanRows
      });
      syncManageWorkflowState();
    }
    function renderManageScanTable() {
      syncManageWorkflowState();
    }
    function isManageRowSelected(idx) {
      return isRowSelected({
        state: manageState,
        idx
      });
    }
    function toggleManageRowSelection(idx, checked) {
      toggleRowSelection({
        state: manageState,
        idx,
        checked,
        toggleIndexSelection,
        renderManageBatchActions
      });
      syncManageWorkflowState();
    }
    function toggleManageSelectAll(checked) {
      toggleSelectAll({
        state: manageState,
        checked,
        selectAllRowIndexes,
        renderManageBatchActions
      });
      syncManageWorkflowState();
    }
    function selectedManageRows() {
      return selectedRowsForBatch({
        state: manageState,
        selectedRows
      });
    }
    async function queueSelectedCategorize2() {
      await queueSelectedCategorize({
        state: manageState,
        categorizeOptionsFromUI: categorizeOptionsFromUI2,
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows
      });
    }
    async function queueSelectedRenames2() {
      await queueSelectedRenames({
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows
      });
    }
    async function queueSelectedMoves2() {
      await queueSelectedMoves({
        formState: manageFormState2,
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows
      });
    }
    async function queueSelectedDeletes2() {
      await queueSelectedDeletes({
        queueBatchWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        batchQueueActions,
        doc: document,
        refreshManageQueue,
        refreshManageHistory,
        showToast,
        selectedManageRows
      });
    }
    function useScannedDirectory2(index2) {
      useScannedDirectory({
        index: index2,
        state: manageState,
        requireScanRow,
        showToast,
        prefillManageFromPath
      });
    }
    function previewScannedSuggest2(index2) {
      previewScannedSuggest({
        index: index2,
        state: manageState,
        requireScanRow,
        showToast,
        renderManageSelectedSource,
        applySuggestionPreview,
        renderSuggestionCards,
        suggestionPreviewData,
        doc: document
      });
    }
    function previewScannedRename2(index2) {
      previewScannedRename({
        index: index2,
        state: manageState,
        requireScanRow,
        showToast,
        renamePreviewState,
        renderManageSelectedSource,
        switchManageTab,
        syncManageFormState,
        doc: document,
        applySuggestionPreview,
        renderSuggestionCards
      });
    }
    function previewScannedCategorize2(index2) {
      previewScannedCategorize({
        index: index2,
        state: manageState,
        requireScanRow,
        showToast,
        renderManageSelectedSource,
        switchManageTab,
        previewCategorize: previewCategorize2
      });
    }
    function prepareScannedMove2(index2) {
      prepareScannedMove({
        index: index2,
        state: manageState,
        requireScanRow,
        showToast,
        movePreviewState,
        renderManageSelectedSource,
        populateManageCategorySubdir,
        switchManageTab
      });
    }
    function previewScannedMove2(index2) {
      previewScannedMove({
        index: index2,
        prepareScannedMove: prepareScannedMove2,
        previewManage: previewManage2
      });
    }
    function previewScannedDelete2(index2) {
      previewScannedDelete({
        index: index2,
        state: manageState,
        requireScanRow,
        showToast,
        renderManageSelectedSource,
        switchManageTab,
        previewManage: previewManage2
      });
    }
    async function scanSubtitleCandidates2() {
      await scanSubtitleCandidates({
        doc: document,
        state: manageState,
        formState: manageFormState2,
        buildManagePathValue: buildManagePath,
        showToast,
        getJSON
      });
      syncManageWorkflowState();
    }
    async function queueSubtitleRename2(index2, event2) {
      await queueSubtitleRename({
        index: index2,
        event: event2,
        state: manageState,
        queueSingleWithPassword,
        promptFn: window.prompt.bind(window),
        getJSON,
        postJSON,
        doc: document,
        renderSubtitleCandidates: syncManageWorkflowState,
        refreshManageQueue,
        refreshManageHistory,
        showToast
      });
    }
    async function previewCategorize2() {
      await previewCategorize({
        state: manageState,
        showToast,
        categorizeOptionsFromUI: categorizeOptionsFromUI2,
        formState: manageFormState2,
        postJSON,
        getJSON,
        resetCategorizePreviewState,
        renderCategorizePreview: renderCategorizePreview2
      });
    }
    async function queueCategorize2() {
      await queueCategorize({
        state: manageState,
        showToast,
        promptFn: window.prompt.bind(window),
        categorizeOptionsFromUI: categorizeOptionsFromUI2,
        formState: manageFormState2,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    async function suggestRenameFromRenameTab2() {
      await suggestRenameFromRenameTab({
        state: manageState,
        showToast,
        postJSON,
        getJSON,
        syncManageFormState,
        doc: document,
        applySuggestionPreview,
        renderSuggestionCards
      });
    }
    async function suggestSubtitleRenameFromRenameTab2() {
      await suggestSubtitleRenameFromRenameTab({
        state: manageState,
        showToast,
        postJSON,
        getJSON,
        syncManageFormState,
        doc: document,
        applySubtitleSuggestionPreview,
        renderSubtitleSuggestionHtml
      });
    }
    function buildManagePlan3(action2) {
      return buildManagePlan2({
        state: manageState,
        formState: manageFormState2,
        buildManagePlanImpl: buildManagePlan,
        action: action2
      });
    }
    function renderManagePlan2(plan) {
      renderManagePlan({
        doc: document,
        plan,
        applyManagePreview,
        renderManagePlanHtml
      });
    }
    function renderManageModal2(plan) {
      renderManageModal({
        doc: document,
        plan,
        applyManageModal,
        renderManageModalBodyHtml
      });
    }
    async function refreshManageQueue() {
      window.dispatchEvent(new CustomEvent("indexer:queueRefreshRequest"));
    }
    async function refreshManageHistory() {
      window.dispatchEvent(new CustomEvent("indexer:historyRefreshRequest"));
    }
    function closeManageModal3(event2) {
      closeManageModal2({
        doc: document,
        event: event2,
        closeManageModalView: closeManageModal
      });
    }
    function previewManage2(action2) {
      previewManage({
        action: action2,
        state: manageState,
        buildManagePlan: buildManagePlan3,
        renderManagePlan: renderManagePlan2,
        renderManageModal: renderManageModal2,
        showToast
      });
    }
    async function confirmManage2() {
      await confirmManage({
        state: manageState,
        showToast,
        promptFn: window.prompt.bind(window),
        queueBodyFromPlan,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        closeManageModal: closeManageModal3,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    function categorizeOptionsFromUI2() {
      return categorizeOptionsFromUI({
        formState: manageFormState2,
        categorizeOptionsFromState
      });
    }
    async function copyPlainText3(text2, event2) {
      await copyPlainText2({
        text: text2,
        event: event2,
        copyPlainTextHelper: copyPlainText,
        navigatorRef: navigator,
        showToast
      });
    }
    async function copyCategorizeFilteredOperations2() {
      await copyCategorizeFilteredOperations({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeOperationsText,
        categorizeKindLabel,
        copyPlainText: copyPlainText3
      });
    }
    async function copyCategorizeFilteredAmbiguous2() {
      await copyCategorizeFilteredAmbiguous({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeAmbiguousText,
        copyPlainText: copyPlainText3
      });
    }
    async function copyCategorizeFilteredGroups2() {
      await copyCategorizeFilteredGroups({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeGroupsText,
        copyPlainText: copyPlainText3
      });
    }
    async function copyCategorizeCurrentView2() {
      await copyCategorizeCurrentView({
        state: manageState,
        hasCategorizePreview,
        showToast,
        buildCategorizeCurrentViewText,
        categorizeKindLabel,
        copyPlainText: copyPlainText3
      });
    }
    function setCategorizeKindFilter(kind) {
      setCategorizeFilter({
        state: manageState,
        patch: { categorizeKindFilter: kind || "all" },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function setCategorizeGroupFilter(group) {
      setCategorizeFilter({
        state: manageState,
        patch: { categorizeGroupFilter: String(group || "") },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function setCategorizeTextFilter(value) {
      setCategorizeFilter({
        state: manageState,
        patch: { categorizeTextFilter: String(value || "") },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function setCategorizeAmbiguousFilter(value) {
      setCategorizeFilter({
        state: manageState,
        patch: { categorizeAmbiguousFilter: String(value || "") },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function setCategorizeGroupTextFilter(value) {
      setCategorizeFilter({
        state: manageState,
        patch: { categorizeGroupTextFilter: String(value || "") },
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function resetCategorizeFilters2() {
      resetCategorizeFilters({
        state: manageState,
        applyCategorizeFilter,
        setFilterAndRerender,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function toggleCategorizeSort2(which, field) {
      toggleCategorizeSort({
        state: manageState,
        which,
        field,
        toggleCategorizeSortState,
        renderStoredCategorizePreview: renderStoredCategorizePreview2
      });
    }
    function renderStoredCategorizePreview2() {
      renderStoredCategorizePreview({
        state: manageState,
        renderCategorizePreview: renderCategorizePreview2
      });
    }
    function renderCategorizePreview2(res, opts) {
      renderCategorizePreview({
        doc: document,
        res,
        opts,
        state: manageState,
        buildCategorizePreviewHtml
      });
    }
    function isManageQueueSelected(id) {
      return isQueueRowSelected({
        state: manageState,
        id,
        idSelected,
        hasSelection
      });
    }
    function toggleManageQueueSelection(id, checked) {
      toggleQueueRowSelected({
        state: manageState,
        id,
        checked,
        toggleIdSelection,
        toggleSelection
      });
    }
    function isManageHistorySelected(id) {
      return isHistoryRowSelected({
        state: manageState,
        id,
        idSelected,
        hasSelection
      });
    }
    function toggleManageHistorySelection(id, checked) {
      toggleHistoryRowSelected({
        state: manageState,
        id,
        checked,
        toggleIdSelection,
        toggleSelection
      });
    }
    async function cancelManageTask(id) {
      await cancelTask({
        id,
        showToast,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    async function cancelSelectedManageTasks() {
      await cancelSelected({
        state: manageState,
        showToast,
        batchQueueActions,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    async function retryManageHistoryTask(id) {
      await retryHistoryTask({
        id,
        promptFn: window.prompt.bind(window),
        showToast,
        postJSON,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    async function retrySelectedManageHistoryTasks() {
      await retrySelected({
        state: manageState,
        promptFn: window.prompt.bind(window),
        showToast,
        batchQueueActions,
        getJSON,
        setManageResult,
        doc: document,
        refreshManageQueue,
        refreshManageHistory
      });
    }
    switchManageTab("suggest");
    clearManageOptionalPaths();
    syncManageFormState(manageFormState2);
    syncManageWorkflowState();
  }

  // _components/AppBootstrap.svelte
  function AppBootstrap($$anchor, $$props) {
    push($$props, false);
    onMount(() => {
      initAppController();
    });
    init();
    AppPage($$anchor, {});
    pop();
  }

  // index.svelte
  function Index($$anchor) {
    AppBootstrap($$anchor, {});
  }

  // index.svelte.ts
  var target = document.getElementById("app");
  if (target) {
    target.innerHTML = "";
    mount(Index, { target });
  }
})();
