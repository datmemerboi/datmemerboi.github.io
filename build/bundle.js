
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const intro = "<strong>Tips to avoid awkward silence when we next meet:</strong><br/>My typical day consists of unearthing secret JavaScript topics, reading modern web development methodologies, and a lot of deadpan humour.<br/>I lose track of time finding the right color for a palette or finding the right song to play or discussing about cinema/filmmaking.";
    const introTLDR = "Hi! I'm <strong>Shravan Dave</strong>.<br/> Coding and Designing might catch my eye<br/>but movies and music make my day";
    const projects = [
      {
        id: "tco",
        title: "Test Case Optimization",
        description: "Optimizing the testing process in Software Development by applying Meta-heuristic Algorithms on a test suite",
        url: "https://github.com/datmemerboi/Test-Case-Optimization",
        keywords: ["python", "testing", "meta-heuristic algorithms", "django"]
      },
      {
        id: "tdc",
        title: "TDC",
        description: "A complete system for dental patient management & billing built on MERN stack",
        url: "https://github.com/datmemerboi/TDC",
        keywords: ["javascript", "express", "react", "node", "mongodb"]
      }
    ];

    const jobs = [
      {
        id: "insider",
        title: "Techops Engineer",
        company: "Paytm Insider",
        description: "<ul style=\"padding:0;list-style-type:disc;\"><li>Rendered end-to-end support for movie ticket booking flow: handling DB queries, API calls & system logs</li><li>Enabled 30+ external clients to debug and integrate their MiniApps with Paytm</li><li>Developed significant scripts eliminating repetitive BE tasks and facilitating bulk data fetches</li><li>Reported scrum updates to <a href=\"mailto:shivramdega@gmail.com\" style=\"color: var(--theme-color-2)\">Mr. Shivram Dega</a>, <a href=\"mailto:\" style=\"color: var(--theme-color-2)\">Mr. Prashant Tiwari</a></li><li>Understood existing architecture by assisting devs & leads during RCA</li><li>Managed documenation of bridges and the database along with teammates</li></ul>",
        from: "OCT 2020",
        to: "NOV 2021"
      }
    ];

    const fancyWords = [
      "Be technical<br/>Look through my Github",
      "Be verbose<br/>Send me an email",
      "Be conventional<br/>Read my resume",
      "Be professional<br/>Go to my linkedin"
    ];

    const hyperlinks = [
      "https://github.com/datmemerboi",
      "mailto:appliedbyshravan@gmail.com",
      "https://drive.google.com/file/d/17hujcLpQl-Kelh2EPLFGf7OS9SHJKV69/view?usp=sharing",
      "https://in.linkedin.com/in/datmemerboi"
    ];

    const buildTime = 1638105200000;

    /* src/components/job/job-row.svelte generated by Svelte v3.42.6 */

    const file$i = "src/components/job/job-row.svelte";

    function create_fragment$j(ctx) {
    	let div10;
    	let div9;
    	let div3;
    	let div0;
    	let h20;
    	let t0_value = /*job*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let span0;
    	let t3;
    	let h21;
    	let t4_value = /*job*/ ctx[0].company + "";
    	let t4;
    	let t5;
    	let div2;
    	let div1;
    	let raw_value = /*job*/ ctx[0].description + "";
    	let t6;
    	let div8;
    	let div7;
    	let div4;
    	let span1;
    	let t7_value = /*job*/ ctx[0].from + "";
    	let t7;
    	let t8;
    	let div5;
    	let t9;
    	let div6;
    	let span2;
    	let t10_value = /*job*/ ctx[0].to + "";
    	let t10;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			t0 = text(t0_value);
    			t1 = text("\n         \n        ");
    			span0 = element("span");
    			span0.textContent = "at";
    			t3 = text("\n         \n        ");
    			h21 = element("h2");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t6 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div4 = element("div");
    			span1 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			div5 = element("div");
    			t9 = space();
    			div6 = element("div");
    			span2 = element("span");
    			t10 = text(t10_value);
    			attr_dev(h20, "class", "job-title__text svelte-1a2v2bb");
    			add_location(h20, file$i, 11, 8, 197);
    			attr_dev(span0, "class", "job-title__text svelte-1a2v2bb");
    			set_style(span0, "font-size", "24px");
    			add_location(span0, file$i, 13, 8, 265);
    			attr_dev(h21, "class", "job-title__text svelte-1a2v2bb");
    			add_location(h21, file$i, 15, 8, 352);
    			attr_dev(div0, "class", "job-title__wrapper svelte-1a2v2bb");
    			add_location(div0, file$i, 10, 6, 156);
    			attr_dev(div1, "class", "job-description__wrapper");
    			add_location(div1, file$i, 18, 8, 458);
    			attr_dev(div2, "class", "job-body__wrapper");
    			add_location(div2, file$i, 17, 6, 418);
    			attr_dev(div3, "class", "job-content svelte-1a2v2bb");
    			add_location(div3, file$i, 9, 4, 124);
    			attr_dev(span1, "id", "job-from");
    			attr_dev(span1, "class", "svelte-1a2v2bb");
    			add_location(span1, file$i, 26, 10, 702);
    			attr_dev(div4, "class", "job-duration-from__wrapper");
    			add_location(div4, file$i, 25, 8, 651);
    			attr_dev(div5, "class", "timeline svelte-1a2v2bb");
    			add_location(div5, file$i, 28, 8, 763);
    			attr_dev(span2, "id", "job-to");
    			attr_dev(span2, "class", "svelte-1a2v2bb");
    			add_location(span2, file$i, 30, 10, 845);
    			attr_dev(div6, "class", "job-duration-to__wrapper");
    			add_location(div6, file$i, 29, 8, 796);
    			attr_dev(div7, "class", "job-duration__wrapper svelte-1a2v2bb");
    			add_location(div7, file$i, 24, 6, 607);
    			attr_dev(div8, "class", "job-duration svelte-1a2v2bb");
    			add_location(div8, file$i, 23, 4, 574);
    			attr_dev(div9, "class", "job-container svelte-1a2v2bb");
    			add_location(div9, file$i, 8, 2, 92);
    			attr_dev(div10, "class", "job-row svelte-1a2v2bb");
    			add_location(div10, file$i, 7, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h20);
    			append_dev(h20, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(div0, t3);
    			append_dev(div0, h21);
    			append_dev(h21, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			div1.innerHTML = raw_value;
    			append_dev(div9, t6);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div4);
    			append_dev(div4, span1);
    			append_dev(span1, t7);
    			append_dev(div7, t8);
    			append_dev(div7, div5);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, span2);
    			append_dev(span2, t10);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*job*/ 1 && t0_value !== (t0_value = /*job*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*job*/ 1 && t4_value !== (t4_value = /*job*/ ctx[0].company + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*job*/ 1 && raw_value !== (raw_value = /*job*/ ctx[0].description + "")) div1.innerHTML = raw_value;			if (dirty & /*job*/ 1 && t7_value !== (t7_value = /*job*/ ctx[0].from + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*job*/ 1 && t10_value !== (t10_value = /*job*/ ctx[0].to + "")) set_data_dev(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Job_row', slots, []);
    	let { job } = $$props;
    	const writable_props = ['job'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Job_row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('job' in $$props) $$invalidate(0, job = $$props.job);
    	};

    	$$self.$capture_state = () => ({ job });

    	$$self.$inject_state = $$props => {
    		if ('job' in $$props) $$invalidate(0, job = $$props.job);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [job];
    }

    class Job_row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { job: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Job_row",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*job*/ ctx[0] === undefined && !('job' in props)) {
    			console.warn("<Job_row> was created without expected prop 'job'");
    		}
    	}

    	get job() {
    		throw new Error("<Job_row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set job(value) {
    		throw new Error("<Job_row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/project/project-bubbles.svelte generated by Svelte v3.42.6 */

    const file$h = "src/components/project/project-bubbles.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (10:2) {#each keywords as kw}
    function create_each_block$3(ctx) {
    	let div;
    	let span;
    	let t0_value = /*kw*/ ctx[1] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "keyword");
    			add_location(span, file$h, 11, 6, 192);
    			attr_dev(div, "class", "keyword-bubble svelte-18a1ald");
    			add_location(div, file$h, 10, 4, 157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*keywords*/ 1 && t0_value !== (t0_value = /*kw*/ ctx[1] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(10:2) {#each keywords as kw}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let each_value = /*keywords*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "keyword-container svelte-18a1ald");
    			add_location(div, file$h, 8, 0, 96);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*keywords*/ 1) {
    				each_value = /*keywords*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project_bubbles', slots, []);
    	let { keywords } = $$props;
    	const writable_props = ['keywords'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project_bubbles> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('keywords' in $$props) $$invalidate(0, keywords = $$props.keywords);
    	};

    	$$self.$capture_state = () => ({ keywords });

    	$$self.$inject_state = $$props => {
    		if ('keywords' in $$props) $$invalidate(0, keywords = $$props.keywords);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [keywords];
    }

    class Project_bubbles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { keywords: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project_bubbles",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*keywords*/ ctx[0] === undefined && !('keywords' in props)) {
    			console.warn("<Project_bubbles> was created without expected prop 'keywords'");
    		}
    	}

    	get keywords() {
    		throw new Error("<Project_bubbles>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywords(value) {
    		throw new Error("<Project_bubbles>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/project/project-card.svelte generated by Svelte v3.42.6 */
    const file$g = "src/components/project/project-card.svelte";

    function create_fragment$h(ctx) {
    	let div1;
    	let div0;
    	let h2;
    	let t0_value = /*project*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*project*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let bubble_1;
    	let div0_id_value;
    	let current;

    	bubble_1 = new Project_bubbles({
    			props: { keywords: /*project*/ ctx[0].keywords },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(bubble_1.$$.fragment);
    			attr_dev(h2, "class", "svelte-x3l8m2");
    			add_location(h2, file$g, 10, 4, 194);
    			add_location(p, file$g, 11, 4, 223);
    			attr_dev(div0, "id", div0_id_value = /*project*/ ctx[0].id);
    			attr_dev(div0, "class", "card svelte-x3l8m2");
    			add_location(div0, file$g, 9, 2, 155);
    			attr_dev(div1, "class", "card-wrapper svelte-x3l8m2");
    			add_location(div1, file$g, 8, 0, 126);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(div0, t3);
    			mount_component(bubble_1, div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*project*/ 1) && t0_value !== (t0_value = /*project*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*project*/ 1) && t2_value !== (t2_value = /*project*/ ctx[0].description + "")) set_data_dev(t2, t2_value);
    			const bubble_1_changes = {};
    			if (dirty & /*project*/ 1) bubble_1_changes.keywords = /*project*/ ctx[0].keywords;
    			bubble_1.$set(bubble_1_changes);

    			if (!current || dirty & /*project*/ 1 && div0_id_value !== (div0_id_value = /*project*/ ctx[0].id)) {
    				attr_dev(div0, "id", div0_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bubble_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bubble_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(bubble_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project_card', slots, []);
    	let { project } = $$props;
    	const writable_props = ['project'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project_card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	$$self.$capture_state = () => ({ Bubble: Project_bubbles, project });

    	$$self.$inject_state = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [project];
    }

    class Project_card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { project: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project_card",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*project*/ ctx[0] === undefined && !('project' in props)) {
    			console.warn("<Project_card> was created without expected prop 'project'");
    		}
    	}

    	get project() {
    		throw new Error("<Project_card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project(value) {
    		throw new Error("<Project_card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/work.svelte generated by Svelte v3.42.6 */
    const file$f = "src/components/work.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (18:6) {#each jobs as j}
    function create_each_block_1(ctx) {
    	let row;
    	let current;

    	row = new Job_row({
    			props: { job: /*j*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(18:6) {#each jobs as j}",
    		ctx
    	});

    	return block;
    }

    // (28:6) {#each projects.slice(0, 2) as p}
    function create_each_block$2(ctx) {
    	let card;
    	let t;
    	let current;

    	card = new Project_card({
    			props: { project: /*p*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(28:6) {#each projects.slice(0, 2) as p}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div4;
    	let div1;
    	let h10;
    	let t1;
    	let div0;
    	let t2;
    	let div3;
    	let h11;
    	let t4;
    	let div2;
    	let t5;
    	let footer;
    	let t6;
    	let code;
    	let t10;
    	let a;
    	let t12;
    	let current;
    	let each_value_1 = jobs;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = projects.slice(0, 2);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			h10 = element("h1");
    			h10.textContent = "At the office";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div3 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Outside of work";
    			t4 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			footer = element("footer");
    			t6 = text("This page was last updated at: ");
    			code = element("code");
    			code.textContent = `"${new Date(buildTime).toISOString()}"`;
    			t10 = text(". Those damn\n    ");
    			a = element("a");
    			a.textContent = "github repos";
    			t12 = text(" might have caught up.");
    			attr_dev(h10, "class", "svelte-141z5lo");
    			add_location(h10, file$f, 14, 4, 314);
    			attr_dev(div0, "class", "svelte-141z5lo");
    			add_location(div0, file$f, 15, 4, 341);
    			attr_dev(div1, "id", "at_office");
    			attr_dev(div1, "class", "svelte-141z5lo");
    			add_location(div1, file$f, 12, 2, 259);
    			attr_dev(h11, "class", "svelte-141z5lo");
    			add_location(h11, file$f, 24, 4, 522);
    			attr_dev(div2, "class", "card-container svelte-141z5lo");
    			add_location(div2, file$f, 25, 4, 551);
    			attr_dev(div3, "id", "outside_office");
    			attr_dev(div3, "class", "svelte-141z5lo");
    			add_location(div3, file$f, 22, 2, 461);
    			add_location(code, file$f, 34, 35, 809);
    			attr_dev(a, "href", "https://github.com/datmemerboi?tab=repositories");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noreferrer");
    			attr_dev(a, "class", "ext-link svelte-141z5lo");
    			add_location(a, file$f, 37, 4, 888);
    			attr_dev(footer, "class", "svelte-141z5lo");
    			add_location(footer, file$f, 33, 2, 765);
    			attr_dev(div4, "class", "svelte-141z5lo");
    			add_location(div4, file$f, 10, 0, 225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, h10);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, h11);
    			append_dev(div3, t4);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div4, t5);
    			append_dev(div4, footer);
    			append_dev(footer, t6);
    			append_dev(footer, code);
    			append_dev(footer, t10);
    			append_dev(footer, a);
    			append_dev(footer, t12);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*jobs*/ 0) {
    				each_value_1 = jobs;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*projects*/ 0) {
    				each_value = projects.slice(0, 2);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Work', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Work> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ projects, jobs, buildTime, Row: Job_row, Card: Project_card });
    	return [];
    }

    class Work$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Work",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/icons/github.svelte generated by Svelte v3.42.6 */

    const file$e = "src/components/icons/github.svelte";

    function create_fragment$f(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22");
    			add_location(path, file$e, 0, 207, 207);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "72");
    			attr_dev(svg, "height", "72");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "#000000");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-github");
    			add_location(svg, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Github', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Github> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Github extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Github",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/icons/mail.svelte generated by Svelte v3.42.6 */

    const file$d = "src/components/icons/mail.svelte";

    function create_fragment$e(ctx) {
    	let svg;
    	let path;
    	let polyline;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			polyline = svg_element("polyline");
    			attr_dev(path, "d", "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z");
    			add_location(path, file$d, 0, 205, 205);
    			attr_dev(polyline, "points", "22,6 12,13 2,6");
    			add_location(polyline, file$d, 0, 298, 298);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "72");
    			attr_dev(svg, "height", "72");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "#FF3D68");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-mail");
    			add_location(svg, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, polyline);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mail', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mail> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Mail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mail",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/icons/resume.svelte generated by Svelte v3.42.6 */

    const file$c = "src/components/icons/resume.svelte";

    function create_fragment$d(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			attr_dev(path0, "d", "M7.75635 37.9785H69.1827");
    			attr_dev(path0, "stroke", "#44475A");
    			attr_dev(path0, "stroke-width", "1.52171");
    			add_location(path0, file$c, 1, 0, 96);
    			attr_dev(path1, "d", "M7.75635 46.5H41.9136");
    			attr_dev(path1, "stroke", "#44475A");
    			attr_dev(path1, "stroke-width", "1.52171");
    			add_location(path1, file$c, 2, 0, 173);
    			attr_dev(path2, "d", "M7.75635 42.2393H56.1163");
    			attr_dev(path2, "stroke", "#44475A");
    			attr_dev(path2, "stroke-width", "1.52171");
    			add_location(path2, file$c, 3, 0, 247);
    			attr_dev(path3, "d", "M12.524 32.583C12.692 32.583 12.8227 32.6297 12.916 32.723C13.0131 32.8164 13.0617 32.9396 13.0617 33.0927V34H7.42717V33.496C7.42717 33.3989 7.4477 33.2943 7.48878 33.1823C7.52985 33.0665 7.59893 32.962 7.69601 32.8687L10.1044 30.4547C10.3098 30.2493 10.4909 30.0533 10.6477 29.8666C10.8045 29.6761 10.9352 29.4913 11.0397 29.3121C11.1443 29.1291 11.2227 28.9443 11.275 28.7576C11.3273 28.5709 11.3534 28.3749 11.3534 28.1695C11.3534 27.8073 11.26 27.5329 11.0733 27.3462C10.8867 27.1557 10.6234 27.0605 10.2836 27.0605C10.1343 27.0605 9.99611 27.0829 9.86916 27.1277C9.74594 27.1688 9.63392 27.2267 9.5331 27.3014C9.43602 27.376 9.35201 27.4638 9.28106 27.5646C9.21012 27.6654 9.15784 27.7756 9.12424 27.8951C9.05703 28.0818 8.96554 28.2068 8.84979 28.2703C8.73778 28.3301 8.57722 28.3431 8.36812 28.3095L7.55039 28.1639C7.61013 27.7681 7.72215 27.4208 7.88644 27.1221C8.05073 26.8234 8.2561 26.5751 8.50254 26.3772C8.74898 26.1793 9.03089 26.0318 9.34827 25.9347C9.66566 25.8339 10.0073 25.7835 10.3732 25.7835C10.7578 25.7835 11.107 25.8414 11.4206 25.9571C11.738 26.0692 12.0087 26.2279 12.2327 26.4332C12.4568 26.6349 12.6304 26.8794 12.7536 27.1669C12.8768 27.4545 12.9384 27.7718 12.9384 28.1191C12.9384 28.4178 12.8955 28.6941 12.8096 28.948C12.7237 29.2019 12.6061 29.4446 12.4568 29.6761C12.3111 29.9039 12.1413 30.1261 11.9471 30.3426C11.7529 30.5592 11.5476 30.7776 11.331 30.998L9.60591 32.7622C9.79634 32.7062 9.98491 32.6633 10.1716 32.6334C10.3583 32.5998 10.5338 32.583 10.6981 32.583H12.524ZM19.7836 29.9338C19.7836 30.6432 19.7071 31.2593 19.554 31.7821C19.4009 32.3048 19.1899 32.738 18.9211 33.0815C18.6522 33.4213 18.333 33.6752 17.9633 33.8432C17.5974 34.0075 17.2016 34.0896 16.7759 34.0896C16.3503 34.0896 15.9545 34.0075 15.5885 33.8432C15.2226 33.6752 14.9071 33.4213 14.642 33.0815C14.3769 32.738 14.1678 32.3048 14.0147 31.7821C13.8653 31.2593 13.7907 30.6432 13.7907 29.9338C13.7907 29.2243 13.8653 28.6101 14.0147 28.0911C14.1678 27.5683 14.3769 27.1371 14.642 26.7973C14.9071 26.4538 15.2226 26.1999 15.5885 26.0356C15.9545 25.8675 16.3503 25.7835 16.7759 25.7835C17.2016 25.7835 17.5974 25.8675 17.9633 26.0356C18.333 26.1999 18.6522 26.4538 18.9211 26.7973C19.1899 27.1371 19.4009 27.5683 19.554 28.0911C19.7071 28.6101 19.7836 29.2243 19.7836 29.9338ZM18.1874 29.9338C18.1874 29.3588 18.1463 28.8845 18.0641 28.5112C17.9857 28.1378 17.8812 27.8428 17.7505 27.6262C17.6198 27.4096 17.4686 27.2584 17.2968 27.1725C17.1288 27.0867 16.9552 27.0437 16.7759 27.0437C16.5967 27.0437 16.4231 27.0867 16.255 27.1725C16.0908 27.2584 15.9433 27.4096 15.8126 27.6262C15.6856 27.8428 15.5829 28.1378 15.5045 28.5112C15.4261 28.8845 15.3869 29.3588 15.3869 29.9338C15.3869 30.5125 15.4261 30.9886 15.5045 31.362C15.5829 31.7354 15.6856 32.0304 15.8126 32.247C15.9433 32.4635 16.0908 32.6147 16.255 32.7006C16.4231 32.7865 16.5967 32.8294 16.7759 32.8294C16.9552 32.8294 17.1288 32.7865 17.2968 32.7006C17.4686 32.6147 17.6198 32.4635 17.7505 32.247C17.8812 32.0304 17.9857 31.7354 18.0641 31.362C18.1463 30.9886 18.1874 30.5125 18.1874 29.9338ZM25.5198 32.583C25.6878 32.583 25.8185 32.6297 25.9119 32.723C26.0089 32.8164 26.0575 32.9396 26.0575 33.0927V34H20.423V33.496C20.423 33.3989 20.4435 33.2943 20.4846 33.1823C20.5257 33.0665 20.5947 32.962 20.6918 32.8687L23.1002 30.4547C23.3056 30.2493 23.4867 30.0533 23.6435 29.8666C23.8003 29.6761 23.931 29.4913 24.0356 29.3121C24.1401 29.1291 24.2185 28.9443 24.2708 28.7576C24.3231 28.5709 24.3492 28.3749 24.3492 28.1695C24.3492 27.8073 24.2559 27.5329 24.0692 27.3462C23.8825 27.1557 23.6192 27.0605 23.2794 27.0605C23.1301 27.0605 22.9919 27.0829 22.865 27.1277C22.7418 27.1688 22.6297 27.2267 22.5289 27.3014C22.4318 27.376 22.3478 27.4638 22.2769 27.5646C22.2059 27.6654 22.1537 27.7756 22.1201 27.8951C22.0528 28.0818 21.9614 28.2068 21.8456 28.2703C21.7336 28.3301 21.573 28.3431 21.3639 28.3095L20.5462 28.1639C20.606 27.7681 20.718 27.4208 20.8823 27.1221C21.0466 26.8234 21.2519 26.5751 21.4984 26.3772C21.7448 26.1793 22.0267 26.0318 22.3441 25.9347C22.6615 25.8339 23.0031 25.7835 23.3691 25.7835C23.7537 25.7835 24.1028 25.8414 24.4164 25.9571C24.7338 26.0692 25.0045 26.2279 25.2286 26.4332C25.4526 26.6349 25.6262 26.8794 25.7494 27.1669C25.8727 27.4545 25.9343 27.7718 25.9343 28.1191C25.9343 28.4178 25.8913 28.6941 25.8054 28.948C25.7196 29.2019 25.6019 29.4446 25.4526 29.6761C25.307 29.9039 25.1371 30.1261 24.9429 30.3426C24.7487 30.5592 24.5434 30.7776 24.3268 30.998L22.6017 32.7622C22.7922 32.7062 22.9807 32.6633 23.1674 32.6334C23.3541 32.5998 23.5296 32.583 23.6939 32.583H25.5198ZM32.7794 29.9338C32.7794 30.6432 32.7029 31.2593 32.5498 31.7821C32.3967 32.3048 32.1857 32.738 31.9169 33.0815C31.6481 33.4213 31.3288 33.6752 30.9591 33.8432C30.5932 34.0075 30.1974 34.0896 29.7718 34.0896C29.3461 34.0896 28.9503 34.0075 28.5844 33.8432C28.2184 33.6752 27.9029 33.4213 27.6378 33.0815C27.3727 32.738 27.1636 32.3048 27.0105 31.7821C26.8612 31.2593 26.7865 30.6432 26.7865 29.9338C26.7865 29.2243 26.8612 28.6101 27.0105 28.0911C27.1636 27.5683 27.3727 27.1371 27.6378 26.7973C27.9029 26.4538 28.2184 26.1999 28.5844 26.0356C28.9503 25.8675 29.3461 25.7835 29.7718 25.7835C30.1974 25.7835 30.5932 25.8675 30.9591 26.0356C31.3288 26.1999 31.6481 26.4538 31.9169 26.7973C32.1857 27.1371 32.3967 27.5683 32.5498 28.0911C32.7029 28.6101 32.7794 29.2243 32.7794 29.9338ZM31.1832 29.9338C31.1832 29.3588 31.1421 28.8845 31.06 28.5112C30.9815 28.1378 30.877 27.8428 30.7463 27.6262C30.6156 27.4096 30.4644 27.2584 30.2926 27.1725C30.1246 27.0867 29.951 27.0437 29.7718 27.0437C29.5925 27.0437 29.4189 27.0867 29.2509 27.1725C29.0866 27.2584 28.9391 27.4096 28.8084 27.6262C28.6814 27.8428 28.5788 28.1378 28.5004 28.5112C28.4219 28.8845 28.3827 29.3588 28.3827 29.9338C28.3827 30.5125 28.4219 30.9886 28.5004 31.362C28.5788 31.7354 28.6814 32.0304 28.8084 32.247C28.9391 32.4635 29.0866 32.6147 29.2509 32.7006C29.4189 32.7865 29.5925 32.8294 29.7718 32.8294C29.951 32.8294 30.1246 32.7865 30.2926 32.7006C30.4644 32.6147 30.6156 32.4635 30.7463 32.247C30.877 32.0304 30.9815 31.7354 31.06 31.362C31.1421 30.9886 31.1832 30.5125 31.1832 29.9338Z");
    			attr_dev(path3, "fill", "black");
    			add_location(path3, file$c, 4, 0, 324);
    			attr_dev(path4, "d", "M3 3H73V73H3V3Z");
    			attr_dev(path4, "stroke", "black");
    			attr_dev(path4, "stroke-width", "5");
    			add_location(path4, file$c, 5, 0, 6485);
    			attr_dev(svg, "width", "76");
    			attr_dev(svg, "height", "76");
    			attr_dev(svg, "viewBox", "0 0 76 76");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Resume', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Resume> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Resume extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resume",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/icons/linkedin.svelte generated by Svelte v3.42.6 */

    const file$b = "src/components/icons/linkedin.svelte";

    function create_fragment$c(ctx) {
    	let svg;
    	let path;
    	let rect;
    	let circle;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			rect = svg_element("rect");
    			circle = svg_element("circle");
    			attr_dev(path, "d", "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z");
    			add_location(path, file$b, 0, 209, 209);
    			attr_dev(rect, "x", "2");
    			attr_dev(rect, "y", "9");
    			attr_dev(rect, "width", "4");
    			attr_dev(rect, "height", "12");
    			add_location(rect, file$b, 0, 305, 305);
    			attr_dev(circle, "cx", "4");
    			attr_dev(circle, "cy", "4");
    			attr_dev(circle, "r", "2");
    			add_location(circle, file$b, 0, 352, 352);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "72");
    			attr_dev(svg, "height", "72");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "#9966CC");
    			attr_dev(svg, "stroke-width", "2");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-linkedin");
    			add_location(svg, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			append_dev(svg, rect);
    			append_dev(svg, circle);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Linkedin', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Linkedin> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Linkedin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Linkedin",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/contact.svelte generated by Svelte v3.42.6 */
    const file$a = "src/components/contact.svelte";

    function create_fragment$b(ctx) {
    	let div12;
    	let div2;
    	let div0;
    	let a0;
    	let github;
    	let t0;
    	let div1;
    	let raw0_value = fancyWords[0] + "";
    	let t1;
    	let div5;
    	let div3;
    	let a1;
    	let mail;
    	let t2;
    	let div4;
    	let raw1_value = fancyWords[1] + "";
    	let t3;
    	let div8;
    	let div6;
    	let a2;
    	let resume;
    	let t4;
    	let div7;
    	let raw2_value = fancyWords[2] + "";
    	let t5;
    	let div11;
    	let div9;
    	let a3;
    	let linked;
    	let t6;
    	let div10;
    	let raw3_value = fancyWords[3] + "";
    	let current;
    	github = new Github({ $$inline: true });
    	mail = new Mail({ $$inline: true });
    	resume = new Resume({ $$inline: true });
    	linked = new Linkedin({ $$inline: true });

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			create_component(github.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div3 = element("div");
    			a1 = element("a");
    			create_component(mail.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			t3 = space();
    			div8 = element("div");
    			div6 = element("div");
    			a2 = element("a");
    			create_component(resume.$$.fragment);
    			t4 = space();
    			div7 = element("div");
    			t5 = space();
    			div11 = element("div");
    			div9 = element("div");
    			a3 = element("a");
    			create_component(linked.$$.fragment);
    			t6 = space();
    			div10 = element("div");
    			attr_dev(a0, "href", hyperlinks[0]);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferrer");
    			attr_dev(a0, "class", "svelte-12e4fgn");
    			add_location(a0, file$a, 14, 6, 394);
    			attr_dev(div0, "class", "icon__holder svelte-12e4fgn");
    			add_location(div0, file$a, 13, 4, 361);
    			attr_dev(div1, "class", "icon__text svelte-12e4fgn");
    			add_location(div1, file$a, 18, 4, 497);
    			attr_dev(div2, "class", "icon__wrapper svelte-12e4fgn");
    			add_location(div2, file$a, 12, 2, 329);
    			attr_dev(a1, "href", hyperlinks[1]);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferrer");
    			attr_dev(a1, "class", "svelte-12e4fgn");
    			add_location(a1, file$a, 22, 6, 625);
    			attr_dev(div3, "class", "icon__holder svelte-12e4fgn");
    			add_location(div3, file$a, 21, 4, 592);
    			attr_dev(div4, "class", "icon__text svelte-12e4fgn");
    			add_location(div4, file$a, 26, 4, 726);
    			attr_dev(div5, "class", "icon__wrapper svelte-12e4fgn");
    			add_location(div5, file$a, 20, 2, 560);
    			attr_dev(a2, "href", hyperlinks[2]);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noreferrer");
    			attr_dev(a2, "class", "svelte-12e4fgn");
    			add_location(a2, file$a, 30, 6, 854);
    			attr_dev(div6, "class", "icon__holder svelte-12e4fgn");
    			add_location(div6, file$a, 29, 4, 821);
    			attr_dev(div7, "class", "icon__text svelte-12e4fgn");
    			add_location(div7, file$a, 34, 4, 957);
    			attr_dev(div8, "class", "icon__wrapper svelte-12e4fgn");
    			add_location(div8, file$a, 28, 2, 789);
    			attr_dev(a3, "href", hyperlinks[3]);
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noreferrer");
    			attr_dev(a3, "class", "svelte-12e4fgn");
    			add_location(a3, file$a, 38, 6, 1085);
    			attr_dev(div9, "class", "icon__holder svelte-12e4fgn");
    			add_location(div9, file$a, 37, 4, 1052);
    			attr_dev(div10, "class", "icon__text svelte-12e4fgn");
    			add_location(div10, file$a, 42, 4, 1188);
    			attr_dev(div11, "class", "icon__wrapper svelte-12e4fgn");
    			add_location(div11, file$a, 36, 2, 1020);
    			attr_dev(div12, "class", "icon__container svelte-12e4fgn");
    			add_location(div12, file$a, 11, 0, 297);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			mount_component(github, a0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			div1.innerHTML = raw0_value;
    			append_dev(div12, t1);
    			append_dev(div12, div5);
    			append_dev(div5, div3);
    			append_dev(div3, a1);
    			mount_component(mail, a1, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			div4.innerHTML = raw1_value;
    			append_dev(div12, t3);
    			append_dev(div12, div8);
    			append_dev(div8, div6);
    			append_dev(div6, a2);
    			mount_component(resume, a2, null);
    			append_dev(div8, t4);
    			append_dev(div8, div7);
    			div7.innerHTML = raw2_value;
    			append_dev(div12, t5);
    			append_dev(div12, div11);
    			append_dev(div11, div9);
    			append_dev(div9, a3);
    			mount_component(linked, a3, null);
    			append_dev(div11, t6);
    			append_dev(div11, div10);
    			div10.innerHTML = raw3_value;
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(github.$$.fragment, local);
    			transition_in(mail.$$.fragment, local);
    			transition_in(resume.$$.fragment, local);
    			transition_in(linked.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(github.$$.fragment, local);
    			transition_out(mail.$$.fragment, local);
    			transition_out(resume.$$.fragment, local);
    			transition_out(linked.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_component(github);
    			destroy_component(mail);
    			destroy_component(resume);
    			destroy_component(linked);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fancyWords,
    		hyperlinks,
    		Github,
    		Mail,
    		Resume,
    		Linked: Linkedin
    	});

    	return [];
    }

    class Contact$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/intro.svelte generated by Svelte v3.42.6 */
    const file$9 = "src/components/intro.svelte";

    // (31:4) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "long-intro svelte-gkn1bb");
    			add_location(p, file$9, 32, 6, 685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = intro;
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(31:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if tldr}
    function create_if_block$1(ctx) {
    	let p;
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = space();
    			span = element("span");
    			span.textContent = "pst.. pst.. over here! Click me";
    			attr_dev(p, "class", "svelte-gkn1bb");
    			add_location(p, file$9, 26, 6, 532);
    			attr_dev(span, "id", "extra");
    			attr_dev(span, "class", "svelte-gkn1bb");
    			add_location(span, file$9, 29, 6, 579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = introTLDR;
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(25:4) {#if tldr}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t;
    	let div2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*tldr*/ ctx[0]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t = space();
    			div2 = element("div");
    			if_block.c();
    			if (!src_url_equal(img.src, img_src_value = "https://github.com/datmemerboi.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Profile pic");
    			attr_dev(img, "width", "275");
    			attr_dev(img, "height", "275");
    			attr_dev(img, "class", "svelte-gkn1bb");
    			add_location(img, file$9, 15, 6, 274);
    			attr_dev(div0, "class", "img__wrapper svelte-gkn1bb");
    			add_location(div0, file$9, 14, 4, 241);
    			attr_dev(div1, "class", "img__container svelte-gkn1bb");
    			add_location(div1, file$9, 13, 2, 208);
    			attr_dev(div2, "class", "desc__container svelte-gkn1bb");
    			add_location(div2, file$9, 23, 2, 426);
    			attr_dev(div3, "class", "container svelte-gkn1bb");
    			add_location(div3, file$9, 12, 0, 182);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div3, t);
    			append_dev(div3, div2);
    			if_block.m(div2, null);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*toggleTLDR*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intro', slots, []);
    	let tldr = true;

    	function toggleTLDR() {
    		$$invalidate(0, tldr = !tldr);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ intro, introTLDR, tldr, toggleTLDR });

    	$$self.$inject_state = $$props => {
    		if ('tldr' in $$props) $$invalidate(0, tldr = $$props.tldr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tldr, toggleTLDR];
    }

    class Intro$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/nav-item.svelte generated by Svelte v3.42.6 */

    const file$8 = "src/components/nav-item.svelte";

    function create_fragment$9(ctx) {
    	let span;
    	let t;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*text*/ ctx[1]);
    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*selected*/ ctx[0] ? "selected" : "") + " svelte-jed7ap"));
    			add_location(span, file$8, 4, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(/*onClickHandler*/ ctx[2](/*text*/ ctx[1]))) /*onClickHandler*/ ctx[2](/*text*/ ctx[1]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);

    			if (dirty & /*selected*/ 1 && span_class_value !== (span_class_value = "" + (null_to_empty(/*selected*/ ctx[0] ? "selected" : "") + " svelte-jed7ap"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav_item', slots, []);
    	let { selected = false, text, onClickHandler } = $$props;
    	const writable_props = ['selected', 'text', 'onClickHandler'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav_item> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('onClickHandler' in $$props) $$invalidate(2, onClickHandler = $$props.onClickHandler);
    	};

    	$$self.$capture_state = () => ({ selected, text, onClickHandler });

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('onClickHandler' in $$props) $$invalidate(2, onClickHandler = $$props.onClickHandler);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, text, onClickHandler];
    }

    class Nav_item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { selected: 0, text: 1, onClickHandler: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav_item",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Nav_item> was created without expected prop 'text'");
    		}

    		if (/*onClickHandler*/ ctx[2] === undefined && !('onClickHandler' in props)) {
    			console.warn("<Nav_item> was created without expected prop 'onClickHandler'");
    		}
    	}

    	get selected() {
    		throw new Error("<Nav_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Nav_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Nav_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Nav_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClickHandler() {
    		throw new Error("<Nav_item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClickHandler(value) {
    		throw new Error("<Nav_item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/nav.svelte generated by Svelte v3.42.6 */
    const file$7 = "src/components/nav.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let ul;
    	let li0;
    	let navitem0;
    	let t0;
    	let li1;
    	let navitem1;
    	let t1;
    	let li2;
    	let navitem2;
    	let current;

    	navitem0 = new Nav_item({
    			props: {
    				selected: /*state*/ ctx[0] === "Who I am",
    				text: "Who I am",
    				onClickHandler: /*stateSetter*/ ctx[1]
    			},
    			$$inline: true
    		});

    	navitem1 = new Nav_item({
    			props: {
    				selected: /*state*/ ctx[0] === "What I do",
    				text: "What I do",
    				onClickHandler: /*stateSetter*/ ctx[1]
    			},
    			$$inline: true
    		});

    	navitem2 = new Nav_item({
    			props: {
    				selected: /*state*/ ctx[0] === "How to reach me",
    				text: "How to reach me",
    				onClickHandler: /*stateSetter*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			li2 = element("li");
    			create_component(navitem2.$$.fragment);
    			attr_dev(li0, "class", "svelte-m1amy5");
    			add_location(li0, file$7, 15, 8, 316);
    			attr_dev(li1, "class", "svelte-m1amy5");
    			add_location(li1, file$7, 22, 8, 490);
    			attr_dev(li2, "class", "svelte-m1amy5");
    			add_location(li2, file$7, 29, 8, 666);
    			attr_dev(ul, "class", "svelte-m1amy5");
    			add_location(ul, file$7, 14, 6, 303);
    			attr_dev(div0, "class", "nav-switch__wrapper svelte-m1amy5");
    			add_location(div0, file$7, 13, 4, 263);
    			attr_dev(div1, "class", "nav-switch__container svelte-m1amy5");
    			add_location(div1, file$7, 12, 2, 223);
    			attr_dev(div2, "class", "nav__container svelte-m1amy5");
    			add_location(div2, file$7, 11, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			mount_component(navitem0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(navitem1, li1, null);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			mount_component(navitem2, li2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navitem0_changes = {};
    			if (dirty & /*state*/ 1) navitem0_changes.selected = /*state*/ ctx[0] === "Who I am";
    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};
    			if (dirty & /*state*/ 1) navitem1_changes.selected = /*state*/ ctx[0] === "What I do";
    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};
    			if (dirty & /*state*/ 1) navitem2_changes.selected = /*state*/ ctx[0] === "How to reach me";
    			navitem2.$set(navitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(navitem0);
    			destroy_component(navitem1);
    			destroy_component(navitem2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	let { state = "Who I am" } = $$props;

    	function stateSetter(value) {
    		$$invalidate(0, state = value);
    	}

    	const writable_props = ['state'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({ NavItem: Nav_item, state, stateSetter });

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, stateSetter];
    }

    class Nav$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get state() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/content.svelte generated by Svelte v3.42.6 */

    const file$6 = "src/components/content.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "content svelte-1yos9al");
    			add_location(div, file$6, 4, 0, 39);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Content$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/mobile/tab.svelte generated by Svelte v3.42.6 */

    const file$5 = "src/components/mobile/tab.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(/*content*/ ctx[0]);
    			attr_dev(div0, "class", "tab__content svelte-lbms2t");
    			add_location(div0, file$5, 8, 2, 158);
    			attr_dev(div1, "class", "tab svelte-lbms2t");
    			add_location(div1, file$5, 7, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					div1,
    					"click",
    					function () {
    						if (is_function(/*onClickHandler*/ ctx[1](/*content*/ ctx[0]))) /*onClickHandler*/ ctx[1](/*content*/ ctx[0]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*content*/ 1) set_data_dev(t, /*content*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, []);
    	let { content = "", onClickHandler } = $$props;
    	const writable_props = ['content', 'onClickHandler'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('onClickHandler' in $$props) $$invalidate(1, onClickHandler = $$props.onClickHandler);
    	};

    	$$self.$capture_state = () => ({ content, onClickHandler });

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('onClickHandler' in $$props) $$invalidate(1, onClickHandler = $$props.onClickHandler);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content, onClickHandler];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { content: 0, onClickHandler: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClickHandler*/ ctx[1] === undefined && !('onClickHandler' in props)) {
    			console.warn("<Tab> was created without expected prop 'onClickHandler'");
    		}
    	}

    	get content() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClickHandler() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClickHandler(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/mobile/nav.svelte generated by Svelte v3.42.6 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (12:0) {#each titles.filter(t => t != state) as title}
    function create_each_block$1(ctx) {
    	let mobiletab;
    	let current;

    	mobiletab = new Tab({
    			props: {
    				content: /*title*/ ctx[4],
    				onClickHandler: /*stateSetter*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mobiletab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mobiletab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mobiletab_changes = {};
    			if (dirty & /*state*/ 1) mobiletab_changes.content = /*title*/ ctx[4];
    			mobiletab.$set(mobiletab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobiletab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobiletab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mobiletab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(12:0) {#each titles.filter(t => t != state) as title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*titles*/ ctx[1].filter(/*func*/ ctx[3]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*titles, state, stateSetter*/ 7) {
    				each_value = /*titles*/ ctx[1].filter(/*func*/ ctx[3]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	let titles = ["Who I am", "What I do", "How to reach me"];
    	let { state = titles[0] } = $$props;

    	function stateSetter(value) {
    		$$invalidate(0, state = value);
    	}

    	const writable_props = ['state'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const func = t => t != state;

    	$$self.$$set = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({ MobileTab: Tab, titles, state, stateSetter });

    	$$self.$inject_state = $$props => {
    		if ('titles' in $$props) $$invalidate(1, titles = $$props.titles);
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state, titles, stateSetter, func];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get state() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/mobile/content.svelte generated by Svelte v3.42.6 */

    const file$4 = "src/components/mobile/content.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "content svelte-ouq66a");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/mobile/intro.svelte generated by Svelte v3.42.6 */
    const file$3 = "src/components/mobile/intro.svelte";

    function create_fragment$3(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t;
    	let div2;
    	let p;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t = space();
    			div2 = element("div");
    			p = element("p");
    			if (!src_url_equal(img.src, img_src_value = "https://github.com/datmemerboi.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Profile pic");
    			attr_dev(img, "width", "215");
    			attr_dev(img, "height", "215");
    			attr_dev(img, "class", "svelte-10g0k0j");
    			add_location(img, file$3, 7, 6, 162);
    			attr_dev(div0, "class", "img__wrapper svelte-10g0k0j");
    			add_location(div0, file$3, 6, 4, 129);
    			attr_dev(div1, "class", "img__container svelte-10g0k0j");
    			add_location(div1, file$3, 5, 2, 96);
    			attr_dev(p, "class", "svelte-10g0k0j");
    			add_location(p, file$3, 16, 4, 348);
    			attr_dev(div2, "class", "desc__container svelte-10g0k0j");
    			add_location(div2, file$3, 15, 2, 314);
    			attr_dev(div3, "class", "container svelte-10g0k0j");
    			add_location(div3, file$3, 4, 0, 70);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div3, t);
    			append_dev(div3, div2);
    			append_dev(div2, p);
    			p.innerHTML = introTLDR;
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intro', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intro> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ introTLDR });
    	return [];
    }

    class Intro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intro",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/mobile/work.svelte generated by Svelte v3.42.6 */
    const file$2 = "src/components/mobile/work.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    // (24:6) {#each projects as proj}
    function create_each_block(ctx) {
    	let div;
    	let a;
    	let t0_value = /*proj*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let br;
    	let t2;
    	let span;
    	let t3_value = /*proj*/ ctx[0].description + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(a, "href", /*proj*/ ctx[0].url);
    			attr_dev(a, "class", "svelte-1bkxpxr");
    			add_location(a, file$2, 25, 10, 650);
    			add_location(br, file$2, 26, 10, 696);
    			attr_dev(span, "class", "desc svelte-1bkxpxr");
    			add_location(span, file$2, 27, 10, 712);
    			attr_dev(div, "class", "proj__wrapper svelte-1bkxpxr");
    			add_location(div, file$2, 24, 8, 612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t0);
    			append_dev(div, t1);
    			append_dev(div, br);
    			append_dev(div, t2);
    			append_dev(div, span);
    			append_dev(span, t3);
    			append_dev(div, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(24:6) {#each projects as proj}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div5;
    	let div2;
    	let h30;
    	let t1;
    	let div0;
    	let span0;
    	let strong0;
    	let t3;
    	let snap;
    	let t5;
    	let span1;
    	let strong1;
    	let t7;
    	let div1;
    	let raw_value = jobs[0].description + "";
    	let t8;
    	let div4;
    	let h31;
    	let t10;
    	let div3;
    	let each_value = projects;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			h30 = element("h3");
    			h30.textContent = "At the office";
    			t1 = space();
    			div0 = element("div");
    			span0 = element("span");
    			strong0 = element("strong");
    			strong0.textContent = `${jobs[0].title}`;
    			t3 = text(" \n      ");
    			snap = element("snap");
    			snap.textContent = "at";
    			t5 = text(" \n      ");
    			span1 = element("span");
    			strong1 = element("strong");
    			strong1.textContent = `${jobs[0].company}`;
    			t7 = space();
    			div1 = element("div");
    			t8 = space();
    			div4 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Outside of work";
    			t10 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h30, file$2, 6, 4, 145);
    			add_location(strong0, file$2, 9, 8, 226);
    			add_location(span0, file$2, 8, 6, 211);
    			add_location(snap, file$2, 11, 6, 285);
    			add_location(strong1, file$2, 13, 8, 328);
    			add_location(span1, file$2, 12, 6, 313);
    			attr_dev(div0, "class", "job-title__wrapper svelte-1bkxpxr");
    			add_location(div0, file$2, 7, 4, 172);
    			attr_dev(div1, "class", "job-desc__wrapper svelte-1bkxpxr");
    			add_location(div1, file$2, 16, 4, 392);
    			attr_dev(div2, "class", "job__container svelte-1bkxpxr");
    			add_location(div2, file$2, 5, 2, 112);
    			add_location(h31, file$2, 21, 4, 514);
    			attr_dev(div3, "class", "proj__container svelte-1bkxpxr");
    			add_location(div3, file$2, 22, 4, 543);
    			attr_dev(div4, "class", "code__container svelte-1bkxpxr");
    			add_location(div4, file$2, 20, 2, 480);
    			attr_dev(div5, "class", "container svelte-1bkxpxr");
    			add_location(div5, file$2, 4, 0, 86);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, h30);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(span0, strong0);
    			append_dev(div0, t3);
    			append_dev(div0, snap);
    			append_dev(div0, t5);
    			append_dev(div0, span1);
    			append_dev(span1, strong1);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			div1.innerHTML = raw_value;
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, h31);
    			append_dev(div4, t10);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 0) {
    				each_value = projects;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Work', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Work> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ projects, jobs, buildTime });
    	return [];
    }

    class Work extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Work",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/mobile/contact.svelte generated by Svelte v3.42.6 */
    const file$1 = "src/components/mobile/contact.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div0;
    	let a0;
    	let github;
    	let t0;
    	let html_tag;
    	let raw0_value = fancyWords[0] + "";
    	let t1;
    	let div1;
    	let a1;
    	let mail;
    	let t2;
    	let html_tag_1;
    	let raw1_value = fancyWords[1] + "";
    	let t3;
    	let div2;
    	let a2;
    	let resume;
    	let t4;
    	let html_tag_2;
    	let raw2_value = fancyWords[2] + "";
    	let t5;
    	let div3;
    	let a3;
    	let linkedin;
    	let t6;
    	let html_tag_3;
    	let raw3_value = fancyWords[3] + "";
    	let current;
    	github = new Github({ $$inline: true });
    	mail = new Mail({ $$inline: true });
    	resume = new Resume({ $$inline: true });
    	linkedin = new Linkedin({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			create_component(github.$$.fragment);
    			t0 = space();
    			html_tag = new HtmlTag();
    			t1 = space();
    			div1 = element("div");
    			a1 = element("a");
    			create_component(mail.$$.fragment);
    			t2 = space();
    			html_tag_1 = new HtmlTag();
    			t3 = space();
    			div2 = element("div");
    			a2 = element("a");
    			create_component(resume.$$.fragment);
    			t4 = space();
    			html_tag_2 = new HtmlTag();
    			t5 = space();
    			div3 = element("div");
    			a3 = element("a");
    			create_component(linkedin.$$.fragment);
    			t6 = space();
    			html_tag_3 = new HtmlTag();
    			attr_dev(a0, "href", hyperlinks[0]);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noreferer");
    			attr_dev(a0, "class", "svelte-kqgfla");
    			add_location(a0, file$1, 10, 4, 338);
    			html_tag.a = null;
    			attr_dev(div0, "class", "icon__wrapper svelte-kqgfla");
    			add_location(div0, file$1, 9, 2, 306);
    			attr_dev(a1, "href", hyperlinks[1]);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noreferer");
    			attr_dev(a1, "class", "svelte-kqgfla");
    			add_location(a1, file$1, 16, 4, 490);
    			html_tag_1.a = null;
    			attr_dev(div1, "class", "icon__wrapper svelte-kqgfla");
    			add_location(div1, file$1, 15, 2, 458);
    			attr_dev(a2, "href", hyperlinks[2]);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noreferer");
    			attr_dev(a2, "class", "svelte-kqgfla");
    			add_location(a2, file$1, 22, 4, 640);
    			html_tag_2.a = null;
    			attr_dev(div2, "class", "icon__wrapper svelte-kqgfla");
    			add_location(div2, file$1, 21, 2, 608);
    			attr_dev(a3, "href", hyperlinks[3]);
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noreferer");
    			attr_dev(a3, "class", "svelte-kqgfla");
    			add_location(a3, file$1, 28, 4, 792);
    			html_tag_3.a = null;
    			attr_dev(div3, "class", "icon__wrapper svelte-kqgfla");
    			add_location(div3, file$1, 27, 2, 760);
    			attr_dev(div4, "class", "contact__container svelte-kqgfla");
    			add_location(div4, file$1, 8, 0, 271);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, a0);
    			mount_component(github, a0, null);
    			append_dev(div0, t0);
    			html_tag.m(raw0_value, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div1, a1);
    			mount_component(mail, a1, null);
    			append_dev(div1, t2);
    			html_tag_1.m(raw1_value, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div2);
    			append_dev(div2, a2);
    			mount_component(resume, a2, null);
    			append_dev(div2, t4);
    			html_tag_2.m(raw2_value, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, a3);
    			mount_component(linkedin, a3, null);
    			append_dev(div3, t6);
    			html_tag_3.m(raw3_value, div3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(github.$$.fragment, local);
    			transition_in(mail.$$.fragment, local);
    			transition_in(resume.$$.fragment, local);
    			transition_in(linkedin.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(github.$$.fragment, local);
    			transition_out(mail.$$.fragment, local);
    			transition_out(resume.$$.fragment, local);
    			transition_out(linkedin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(github);
    			destroy_component(mail);
    			destroy_component(resume);
    			destroy_component(linkedin);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fancyWords,
    		hyperlinks,
    		Github,
    		Mail,
    		Resume,
    		Linkedin
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.6 */
    const file = "src/App.svelte";

    // (42:0) {:else}
    function create_else_block_1(ctx) {
    	let div1;
    	let div0;
    	let mobilecontent;
    	let t;
    	let mobilemenu;
    	let updating_state;
    	let current;

    	mobilecontent = new Content({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function mobilemenu_state_binding(value) {
    		/*mobilemenu_state_binding*/ ctx[4](value);
    	}

    	let mobilemenu_props = {};

    	if (/*navState*/ ctx[0] !== void 0) {
    		mobilemenu_props.state = /*navState*/ ctx[0];
    	}

    	mobilemenu = new Nav({ props: mobilemenu_props, $$inline: true });
    	binding_callbacks.push(() => bind(mobilemenu, 'state', mobilemenu_state_binding));

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(mobilecontent.$$.fragment);
    			t = space();
    			create_component(mobilemenu.$$.fragment);
    			attr_dev(div0, "class", "svelte-1oodhpo");
    			add_location(div0, file, 44, 4, 1240);
    			attr_dev(div1, "class", "container svelte-1oodhpo");
    			add_location(div1, file, 42, 2, 1178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(mobilecontent, div0, null);
    			append_dev(div0, t);
    			mount_component(mobilemenu, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mobilecontent_changes = {};

    			if (dirty & /*$$scope, navState*/ 33) {
    				mobilecontent_changes.$$scope = { dirty, ctx };
    			}

    			mobilecontent.$set(mobilecontent_changes);
    			const mobilemenu_changes = {};

    			if (!updating_state && dirty & /*navState*/ 1) {
    				updating_state = true;
    				mobilemenu_changes.state = /*navState*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			mobilemenu.$set(mobilemenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobilecontent.$$.fragment, local);
    			transition_in(mobilemenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobilecontent.$$.fragment, local);
    			transition_out(mobilemenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(mobilecontent);
    			destroy_component(mobilemenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(42:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if innerWidth > 1200}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let nav;
    	let updating_state;
    	let t;
    	let content;
    	let current;

    	function nav_state_binding(value) {
    		/*nav_state_binding*/ ctx[3](value);
    	}

    	let nav_props = {};

    	if (/*navState*/ ctx[0] !== void 0) {
    		nav_props.state = /*navState*/ ctx[0];
    	}

    	nav = new Nav$1({ props: nav_props, $$inline: true });
    	binding_callbacks.push(() => bind(nav, 'state', nav_state_binding));

    	content = new Content$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "navbar-container svelte-1oodhpo");
    			add_location(div0, file, 25, 4, 800);
    			attr_dev(div1, "class", "svelte-1oodhpo");
    			add_location(div1, file, 24, 2, 790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(nav, div0, null);
    			append_dev(div1, t);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (!updating_state && dirty & /*navState*/ 1) {
    				updating_state = true;
    				nav_changes.state = /*navState*/ ctx[0];
    				add_flush_callback(() => updating_state = false);
    			}

    			nav.$set(nav_changes);
    			const content_changes = {};

    			if (dirty & /*$$scope, navState*/ 33) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(nav);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(23:0) {#if innerWidth > 1200}",
    		ctx
    	});

    	return block;
    }

    // (53:6) {:else}
    function create_else_block_2(ctx) {
    	let mobileintro;
    	let current;
    	mobileintro = new Intro({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mobileintro.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mobileintro, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobileintro.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobileintro.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mobileintro, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(53:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:47) 
    function create_if_block_4(ctx) {
    	let mobilecontact;
    	let current;
    	mobilecontact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mobilecontact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mobilecontact, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobilecontact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobilecontact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mobilecontact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(50:47) ",
    		ctx
    	});

    	return block;
    }

    // (47:8) {#if navState === "What I do"}
    function create_if_block_3(ctx) {
    	let mobilework;
    	let current;
    	mobilework = new Work({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mobilework.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mobilework, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobilework.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobilework.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mobilework, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(47:8) {#if navState === \\\"What I do\\\"}",
    		ctx
    	});

    	return block;
    }

    // (46:6) <MobileContent>
    function create_default_slot_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3, create_if_block_4, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*navState*/ ctx[0] === "What I do") return 0;
    		if (/*navState*/ ctx[0] === "How to reach me") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(46:6) <MobileContent>",
    		ctx
    	});

    	return block;
    }

    // (36:6) {:else}
    function create_else_block(ctx) {
    	let intro;
    	let current;
    	intro = new Intro$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(intro.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(intro, target, anchor);
    			current = true;
    		},
    		i: function intro$1(local) {
    			if (current) return;
    			transition_in(intro.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intro.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(intro, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(36:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:47) 
    function create_if_block_2(ctx) {
    	let contact;
    	let current;
    	contact = new Contact$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(33:47) ",
    		ctx
    	});

    	return block;
    }

    // (30:6) {#if navState === "What I do"}
    function create_if_block_1(ctx) {
    	let work;
    	let current;
    	work = new Work$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(work.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(work, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(work.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(work.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(work, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(30:6) {#if navState === \\\"What I do\\\"}",
    		ctx
    	});

    	return block;
    }

    // (29:4) <Content>
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*navState*/ ctx[0] === "What I do") return 0;
    		if (/*navState*/ ctx[0] === "How to reach me") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(29:4) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[2]);
    	const if_block_creators = [create_if_block, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*innerWidth*/ ctx[1] > 1200) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let innerWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let navState;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerWidth = window.innerWidth);
    	}

    	function nav_state_binding(value) {
    		navState = value;
    		$$invalidate(0, navState);
    	}

    	function mobilemenu_state_binding(value) {
    		navState = value;
    		$$invalidate(0, navState);
    	}

    	$$self.$capture_state = () => ({
    		Work: Work$1,
    		Contact: Contact$1,
    		Intro: Intro$1,
    		Nav: Nav$1,
    		Content: Content$1,
    		MobileMenu: Nav,
    		MobileContent: Content,
    		MobileIntro: Intro,
    		MobileWork: Work,
    		MobileContact: Contact,
    		navState,
    		innerWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('navState' in $$props) $$invalidate(0, navState = $$props.navState);
    		if ('innerWidth' in $$props) $$invalidate(1, innerWidth = $$props.innerWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, innerWidth = 0);

    	return [
    		navState,
    		innerWidth,
    		onwindowresize,
    		nav_state_binding,
    		mobilemenu_state_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var index = new App({
      target: document.body
    });

    return index;

})();
//# sourceMappingURL=bundle.js.map
