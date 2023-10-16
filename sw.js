! function(e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function(t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 34)
}([function(e, t, n) {
    "use strict";
    var r = n(3),
        o = n(4),
        i = n(1),
        a = n(16),
        c = n(21);
    i.debug("Service Worker Toolbox is loading"), self.addEventListener("install", c.installListener), self.addEventListener("activate", c.activateListener), self.addEventListener("fetch", c.fetchListener), e.exports = {
        networkOnly: a.networkOnly,
        networkFirst: a.networkFirst,
        cacheOnly: a.cacheOnly,
        cacheFirst: a.cacheFirst,
        fastest: a.fastest,
        router: o,
        options: r,
        cache: i.cache,
        uncache: i.uncache,
        precache: i.precache
    }
}, function(e, t, n) {
    "use strict";
    var r, o = n(3),
        i = n(15);

    function a(e, t) {
        ((t = t || {}).debug || o.debug) && console.log("[sw-toolbox] " + e)
    }

    function c(e) {
        var t;
        return e && e.cache && (t = e.cache.name), t = t || o.cache.name, caches.open(t)
    }

    function u(e, t, n) {
        var r = e.url,
            o = n.maxAgeSeconds,
            c = n.maxEntries,
            u = n.name,
            s = Date.now();
        return a("Updating LRU order for " + r + ". Max entries is " + c + ", max age is " + o), i.getDb(u).then((function(e) {
            return i.setTimestampForUrl(e, r, s)
        })).then((function(e) {
            return i.expireEntries(e, c, o, s)
        })).then((function(e) {
            a("Successfully updated IDB.");
            var n = e.map((function(e) {
                return t.delete(e)
            }));
            return Promise.all(n).then((function() {
                a("Done with cache cleanup.")
            }))
        })).catch((function(e) {
            a(e)
        }))
    }

    function s(e) {
        var t = Array.isArray(e);
        if (t && e.forEach((function(e) {
                "string" == typeof e || e instanceof Request || (t = !1)
            })), !t) throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");
        return e
    }
    e.exports = {
        debug: a,
        fetchAndCache: function(e, t) {
            var n = (t = t || {}).successResponses || o.successResponses;
            return fetch(e.clone()).then((function(i) {
                return "GET" === e.method && n.test(i.status) && c(t).then((function(n) {
                    n.put(e, i).then((function() {
                        var i = t.cache || o.cache;
                        (i.maxEntries || i.maxAgeSeconds) && i.name && function(e, t, n) {
                            var o = u.bind(null, e, t, n);
                            r = r ? r.then(o) : o()
                        }(e, n, i)
                    }))
                })), i.clone()
            }))
        },
        openCache: c,
        renameCache: function(e, t, n) {
            return a("Renaming cache: [" + e + "] to [" + t + "]", n), caches.delete(t).then((function() {
                return Promise.all([caches.open(e), caches.open(t)]).then((function(t) {
                    var n = t[0],
                        r = t[1];
                    return n.keys().then((function(e) {
                        return Promise.all(e.map((function(e) {
                            return n.match(e).then((function(t) {
                                return r.put(e, t)
                            }))
                        })))
                    })).then((function() {
                        return caches.delete(e)
                    }))
                }))
            }))
        },
        cache: function(e, t) {
            return c(t).then((function(t) {
                return t.add(e)
            }))
        },
        uncache: function(e, t) {
            return c(t).then((function(t) {
                return t.delete(e)
            }))
        },
        precache: function(e) {
            e instanceof Promise || s(e), o.preCacheItems = o.preCacheItems.concat(e)
        },
        validatePrecacheInput: s
    }
}, function(e, t, n) {
    var r = n(25);
    e.exports = function(e, t, n) {
        var o = null == e ? void 0 : r(e, t);
        return void 0 === o ? n : o
    }
}, function(e, t, n) {
    "use strict";
    var r;
    r = self.registration ? self.registration.scope : self.scope || new URL("./", self.location).href, e.exports = {
        cache: {
            name: "$$$toolbox-cache$$$" + r + "$$$",
            maxAgeSeconds: null,
            maxEntries: null
        },
        debug: !1,
        networkTimeoutSeconds: null,
        preCacheItems: [],
        successResponses: /^0|([123]\d\d)|(40[14567])|410$/
    }
}, function(e, t, n) {
    "use strict";
    var r = n(12),
        o = n(1);
    var i = function(e, t) {
            for (var n = e.entries(), r = n.next(), o = []; !r.done;) {
                new RegExp(r.value[0]).test(t) && o.push(r.value[1]), r = n.next()
            }
            return o
        },
        a = function() {
            this.routes = new Map, this.routes.set(RegExp, new Map), this.default = null
        };
    ["get", "post", "put", "delete", "head", "any"].forEach((function(e) {
        a.prototype[e] = function(t, n, r) {
            return this.add(e, t, n, r)
        }
    })), a.prototype.add = function(e, t, n, i) {
        var a;
        i = i || {}, a = t instanceof RegExp ? RegExp : (a = i.origin || self.location.origin) instanceof RegExp ? a.source : a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), e = e.toLowerCase();
        var c = new r(e, t, n, i);
        this.routes.has(a) || this.routes.set(a, new Map);
        var u = this.routes.get(a);
        u.has(e) || u.set(e, new Map);
        var s = u.get(e),
            f = c.regexp || c.fullUrlRegExp;
        s.has(f.source) && o.debug('"' + t + '" resolves to same regex as existing route.'), s.set(f.source, c)
    }, a.prototype.matchMethod = function(e, t) {
        var n = new URL(t),
            r = n.origin,
            o = n.pathname;
        return this._match(e, i(this.routes, r), o) || this._match(e, [this.routes.get(RegExp)], t)
    }, a.prototype._match = function(e, t, n) {
        if (0 === t.length) return null;
        for (var r = 0; r < t.length; r++) {
            var o = t[r],
                a = o && o.get(e.toLowerCase());
            if (a) {
                var c = i(a, n);
                if (c.length > 0) return c[0].makeHandler(n)
            }
        }
        return null
    }, a.prototype.match = function(e) {
        return this.matchMethod(e.method, e.url) || this.matchMethod("any", e.url)
    }, e.exports = new a
}, function(e, t, n) {
    "use strict";
    var r = n(1);
    e.exports = function(e, t, n) {
        return r.debug("Strategy: cache only [" + e.url + "]", n), r.openCache(n).then((function(t) {
            return t.match(e)
        }))
    }
}, function(e, t) {
    var n = Array.isArray;
    e.exports = n
}, function(e, t, n) {
    "use strict";
    var r = !("undefined" == typeof window || !window.document || !window.document.createElement),
        o = {
            canUseDOM: r,
            canUseWorkers: "undefined" != typeof Worker,
            canUseEventListeners: r && !(!window.addEventListener && !window.attachEvent),
            canUseViewport: r && !!window.screen,
            isInWorker: !r
        };
    e.exports = o
}, function(e, t, n) {
    "use strict";
    n.d(t, "a", (function() {
        return o
    }));
    var r, o = "FKUA/website/42/website/Desktop";
    ! function(e) {
        e.HORIZONTAL = "HORIZONTAL", e.VERTICAL = "VERTICAL"
    }(r || (r = {}))
}, function(e, t, n) {
    e.exports = n(33)
}, function(e, t) {
    function n(e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
        }
    }
    var r = new(function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.isH2Enabled = !1, this.isBrotliEnabled = false
        }
        var t, r, o;
        return t = e, (r = [{
            key: "domain",
            get: function() {
                return this.isH2Enabled ? "static-assets-web.flixcart.com" : this.isBrotliEnabled ? "sa-web-h1a.flixcart.com" : "img1a.flixcart.com"
            }
        }, {
            key: "urlPath",
            get: function() {
                return "".concat(this.domain, "/fk-p-linchpin-web")
            }
        }, {
            key: "s3Bucket",
            get: function() {
                return "fk-p-linchpin-web"
            }
        }, {
            key: "s3PrivateBucket",
            get: function() {
                return "linchpin"
            }
        }, {
            key: "H2",
            set: function(e) {
                "on" === e || !0 === e ? this.isH2Enabled = !0 : "off" !== e && !1 !== e || (this.isH2Enabled = !1)
            }
        }]) && n(t.prototype, r), o && n(t, o), e
    }());
    r.H2 = !0, e.exports = r
}, function(e, t, n) {
    "use strict";
    var r, o, i, a, c, u, s;

    function f(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
    n.d(t, "a", (function() {
            return B
        })),
        function(e) {
            e.NETBANKING = "NET_OPTIONS", e.CREDIT_CARD = "CREDIT", e.CASH_DELIVERY = "COD", e.CARD_ON_DELIVERY = "DOD", e.PHONEPE_WALLET_2 = "PHONEPE_WALLET", e.UPI = "UPI", e.UPI_COLLECT = "UPI_COLLECT", e.PHONEPE_UPI = "PHONEPE", e.GIFT_CARD_WALLET = "QC_SCLP", e.EGV = "EGV", e.SAVED_CARD = "SAVED_CARD", e.EMI = "EMI_OPTIONS", e.BNPL = "FLIPKART_CREDIT", e.ADVANZ = "FLIPKART_FINANCE", e.EMI_CREDIT_CARD = "EMI_CREDIT", e.PREFERRED_NET = "PREFERRED_NET", e.WALLET = "WALLET", e.SC_PAY = "SC_PAY", e.RTGS = "RTGS"
        }(o || (o = {})),
        function(e) {
            e.WALLET = "WALLET", e.CARD = "CARD", e.GIFT_CARD = "GIFT_CARD", e.COD = "COD", e.NETBANKING = "NET_BANKING", e.UPI = "UPI", e.RTGS = "RTGS"
        }(i || (i = {})),
        function(e) {
            e[e.PAYMENT_SUCCESS = 1] = "PAYMENT_SUCCESS", e[e.APP_REDIRECTION = 2] = "APP_REDIRECTION", e[e.PAYMENT_FAILURE = 3] = "PAYMENT_FAILURE", e[e.OTP_MANUALLY_ENTERED = 4] = "OTP_MANUALLY_ENTERED", e[e.PAY_NOW_CLICK = 5] = "PAY_NOW_CLICK", e[e.PAYMENT_INSTRUMENT_INIT = 7] = "PAYMENT_INSTRUMENT_INIT"
        }(a || (a = {})),
        function(e) {
            e.LINKED_VOUCHERS = "LINKED_VOUCHERS", e.PREFERRED = "PREFERRED", e.OTHERS = "OTHERS", e.NEW_VOUCHERS = "NEW_VOUCHERS"
        }(c || (c = {})),
        function(e) {
            e.CORPORATE = "Corporate", e.RETAIL = "Retail"
        }(u || (u = {})),
        function(e) {
            e.PRE_APPROVED = "preapproved", e.NO_COST = "no_cost", e.INTEREST = "interest", e.DEBIT_CARD = "debit-card", e.CREDIT_CARD = "credit-card", e.CONSUMER_LOAN = "consumer-loan", e.NET_DEBIT = "net-debit", e.CONSUMER_DURABLE_LOAN = "consumer-durable-loan"
        }(s || (s = {}));
    var p, E, l;
    ! function(e) {
        e.NO_STATUS_CODE = "NO_STATUS_CODE", e.KNOWN_PAYMENT_ERROR = "KNOWN_PAYMENT_ERROR", e.JSON_PARSING_ERROR = "JSON_PARSING_ERROR", e.NON_200_SUCCESS_RESPONSE = "NON_200_SUCCESS_RESPONSE", e.PAYMENT_OPTIONS_LOAD_ERROR = "PAYMENT_OPTIONS_LOAD_ERROR"
    }(p || (p = {})),
    function(e) {
        e.STATUS_POLL_ERROR = "STATUS_POLL_ERROR", e.POLL_TIMEOUT_ERROR = "POLL_TIMEOUT_ERROR"
    }(E || (E = {})),
    function(e) {
        e.RTGS_POLL_ERROR = "RTGS_POLL_ERROR", e.POLL_TIMEOUT_ERROR = "POLL_TIMEOUT_ERROR"
    }(l || (l = {}));
    var h;
    new RegExp("\\d{".concat(16, "}")), new RegExp("\\d{".concat(6, "}"));
    ! function(e) {
        e.PAYMENT_OPTIONS = "PAYMENT_OPTIONS", e.WALLET_SELECT = "WALLET_SELECT", e.WALLET_UNSELECT = "WALLET_UNSELECT", e.SUBMIT_PAY = "SUBMIT_PAY", e.PAY_WITH_DETAILS = "PAY_WITH_DETAILS", e.PROCESS_FULL_PAYMENT = "PROCESS_FULL_PAYMENT", e.INSTRUMENT_CHECK = "INSTRUMENT_CHECK", e.NET_BANK_LIST = "NET_BANK_LIST", e.UPI_OPTIONS_LIST = "UPI_OPTIONS_LIST", e.UPI_POLL_INFO = "UPI_POLL_INFO", e.EMI_OPTIONS_LIST = "EMI_OPTIONS_LIST", e.EMI_FAQ_TERMS = "EMI_FAQ_TERMS", e.EMI_TENURES = "EMI_TENURES", e.EMI_CARDS = "EMI_CARDS", e.ADD_EGV = "ADD_EGV", e.PAYZIPPY_TERMS = "PAYZIPPY_TERMS", e.PHONE_PE_STATUS = "PHONE_PE_STATUS", e.CAPTCHA = "CAPTCHA", e.OTP = "OTP", e.OTP_AUTH = "OTP_AUTH", e.RESEND_OTP = "RESEND_OTP", e.OTP_FALLBACK_MODE = "OTP_FALLBACK_MODE", e.ITEM_LEVEL_BREAK_UP = "ITEM_LEVEL_BREAK_UP", e.ADVANCE_PAYMENT_BREAKUP = "ADVANCE_PAYMENT_BREAKUP", e.SELECT_INSTRUMENT = "SELECT_INSTRUMENT", e.UPI_STATUS_POLL = "UPI_STATUS_POLL", e.EMI_2FA_MODES = "EMI_2FA_MODES", e.WALLET_OPTIONS = "WALLET_OPTIONS", e.GENERATE_WALLET_OTP = "GENERATE_WALLET_OTP", e.VALIDATE_WALLET_OTP = "VALIDATE_WALLET_OTP", e.WALLET_BALANCE = "WALLET_BALANCE", e.SUPERCOIN_PAY_SELECT = "SUPERCOIN_PAY_SELECT", e.SUPERCOIN_PAY_DECLINE = "SUPERCOIN_PAY_DECLINE", e.RTGS_INFO = "RTGS_INFO"
    }(h || (h = {}));
    var T, d, _, m, A, v, I = [h.PAYMENT_OPTIONS, h.WALLET_SELECT, h.WALLET_UNSELECT, h.SUBMIT_PAY, h.PROCESS_FULL_PAYMENT, h.ADD_EGV, h.CAPTCHA, h.ADVANCE_PAYMENT_BREAKUP, h.SELECT_INSTRUMENT, h.WALLET_OPTIONS, h.WALLET_BALANCE, h.GENERATE_WALLET_OTP, h.VALIDATE_WALLET_OTP];
    f(r = {}, h.PAYMENT_OPTIONS, "/fkpay/api/v3/payments/options?token={token_id}"), f(r, h.WALLET_SELECT, "/fkpay/api/v3/payments/select"), f(r, h.WALLET_UNSELECT, "/fkpay/api/v3/payments/decline"), f(r, h.SUBMIT_PAY, "/fkpay/api/v3/payments/pay?token={token_id}&instrument={instrument}"), f(r, h.PAY_WITH_DETAILS, "/fkpay/api/v3/payments/paywithdetails?token={token_id}"), f(r, h.PROCESS_FULL_PAYMENT, "/fkpay/api/v3/payments/complete"), f(r, h.INSTRUMENT_CHECK, "/fkpay/api/v3/payments/instrumentcheck?token={token_id}"), f(r, h.NET_BANK_LIST, "/fkpay/api/v2/payments/net/options?token={token_id}"), f(r, h.UPI_OPTIONS_LIST, "/fkpay/api/v3/payments/upi/options?token={token_id}"), f(r, h.UPI_POLL_INFO, "/fkpay/api/v1/info/{upi_id_suffix}"), f(r, h.UPI_STATUS_POLL, "/fkpay/api/v3/payments/upi/poll"), f(r, h.EMI_OPTIONS_LIST, "/fkpay/api/v1/payments/emi/banks?token={token_id}"), f(r, h.EMI_FAQ_TERMS, "/fkpay/api/v1/emi/terms?token={token_id}"), f(r, h.EMI_TENURES, "/fkpay/api/v2/payments/emi/tenures?token={token_id}"), f(r, h.EMI_CARDS, "/fkpay/api/v1/payments/emi/cards"), f(r, h.ADD_EGV, "/fkpay/api/v3/payments/egv?token={token_id}"), f(r, h.PAYZIPPY_TERMS, "/fkpay/api/v1/terms"), f(r, h.PHONE_PE_STATUS, "/fkpay/api/v1/payments/pgresponse"), f(r, h.CAPTCHA, "/fkpay/api/v3/payments/captcha/{token_id}?token={token_id}"), f(r, h.OTP, "/fkpay/api/v1/payments/otp/modes/{token_id}"), f(r, h.OTP_AUTH, "/fkpay/api/v1/payments/pg/complete"), f(r, h.RESEND_OTP, "/fkpay/api/v1/payments/otp/resend/{token_id}"), f(r, h.OTP_FALLBACK_MODE, "/fkpay/api/v1/payments/otp/fallback/{token_id}"), f(r, h.ITEM_LEVEL_BREAK_UP, "/fkpay/api/v1/payments/emi/itemview"), f(r, h.ADVANCE_PAYMENT_BREAKUP, "/fkpay/api/v3/payments/itemview/advancepayment"), f(r, h.SELECT_INSTRUMENT, "/fkpay/api/v3/payments/select/instrument?instrument={instrument}"), f(r, h.EMI_2FA_MODES, "/fkpay/api/v1/payments/2FA/modes/{token_id}"), f(r, h.WALLET_OPTIONS, "/fkpay/api/v4/payments/instrument/options"), f(r, h.GENERATE_WALLET_OTP, "/fkpay/api/v4/payments/otp/generate"), f(r, h.VALIDATE_WALLET_OTP, "/fkpay/api/v4/payments/otp/validate"), f(r, h.WALLET_BALANCE, "/fkpay/api/v4/payments/instrument/balance"), f(r, h.SUPERCOIN_PAY_SELECT, "/fkpay/api/v3/payments/select/instrument"), f(r, h.SUPERCOIN_PAY_DECLINE, "/fkpay/api/v3/payments/decline/instrument"), f(r, h.RTGS_INFO, "/fkpay/api/v3/payments/instrument/info");
    ! function(e) {
        e.CASHBACK_ON_CARD = "CASHBACK_ON_CARD", e.CASHBACK_IN_WALLET = "CASHBACK_IN_WALLET", e.CASHBACK_IN_BANK = "CASHBACK_IN_BANK", e.INSTANT_DISCOUNT = "INSTANT_DISCOUNT"
    }(T || (T = {})),
    function(e) {
        e.EMI_FULL_INTEREST_WAIVER = "EMI_FULL_INTEREST_WAIVER", e.NBFC_ZERO_INTEREST = "NBFC_ZERO_INTEREST", e.PBO = "PBO", e.SUPERCOIN_PAY = "SUPERCOIN_PAY"
    }(d || (d = {})),
    function(e) {
        e.APPLICABLE = "APPLICABLE", e.EXHAUSTED = "EXHAUSTED", e.PARTLY_EXHAUSTED = "PARTLY_EXHAUSTED", e.FAILED = "FAILED"
    }(_ || (_ = {})),
    function(e) {
        e.EMI_PAYMENT = "EMI_PAYMENT", e.FULL_PAYMENT = "FULL_PAYMENT"
    }(m || (m = {})),
    function(e) {
        e.BAJAJFINSERV = "BAJAJFINSERV", e.LAZYPAY = "LAZYPAY", e.ZESTMONEY = "ZESTMONEY", e.IDFC = "IDFC", e.HDFC = "HDFC", e.KOTAK = "KOTAK", e.FEDERALBANK = "FEDERALBANK", e.HOMECREDIT = "HOMECREDIT", e.ICICI = "ICICI", e.SBI = "SBI", e.CASHE = "CASHE", e.TVS_CREDIT = "TVS", e.KREDITBEE = "KREDITBEE"
    }(A || (A = {})),
    function(e) {
        e.FLIPKART = "FLIPKART", e.PHONEPE = "PHONEPE"
    }(v || (v = {}));
    var O, L, R;
    A.KREDITBEE, A.CASHE, A.TVS_CREDIT;
    ! function(e) {
        e.BNPL = "pay_later", e.DEFAULT = "default"
    }(O || (O = {})),
    function(e) {
        e.UPI_COLLECT = "collect_flow"
    }(L || (L = {})),
    function(e) {
        e.COLLAPSIBLE = "collapsable", e.NON_COLLAPSIBLE = "non_collapsable"
    }(R || (R = {}));
    var N;
    ! function(e) {
        e[e.CONTROLLED = 1] = "CONTROLLED", e[e.TREATMENT_1 = 2] = "TREATMENT_1"
    }(N || (N = {}));
    var P, S;
    ! function(e) {
        e.V3 = "v3"
    }(P || (P = {})),
    function(e) {
        e.UNKNOWN_DC = "", e.ONE = "1", e.TWO = "2"
    }(S || (S = {}));
    var g, C, y, w, k, U, D, b, x;
    ! function(e) {
        e.DEFAULT = "DEFAULT", e.HIGHLIGHT = "HIGHLIGHT", e.INFO = "INFO", e.WARNING = "WARNING"
    }(g || (g = {})),
    function(e) {
        e.TEXT = "TEXT", e.BOTTOM_SHEET_LINK = "BOTTOM_SHEET_LINK", e.POPUP = "POPUP"
    }(C || (C = {})),
    function(e) {
        e.RTGS_INFO = "RTGS_INFO", e.UPI_ON_DELIVERY_INFO = "UPI_ON_DELIVERY_INFO", e.HTML_BLOB = "HTML_BLOB"
    }(y || (y = {})),
    function(e) {
        e.LINKED = "LINKED", e.LINK_EXPIRED = "LINK_EXPIRED", e.NOT_LINKED = "NOT_LINKED"
    }(w || (w = {})),
    function(e) {
        e.INFO = "INFO", e.ERROR = "ERROR", e.OFFER = "OFFER"
    }(k || (k = {})),
    function(e) {
        e.STEPS = "STEPS"
    }(U || (U = {})),
    function(e) {
        e.HIGHLIGHT = "HIGHLIGHT", e.HIGHLIGHT_WITH_CAPTION = "HIGHLIGHT_WITH_CAPTION"
    }(D || (D = {})),
    function(e) {
        e.section_with_title = "section_with_title", e.section_with_footer = "section_with_footer", e.timer_title = "timer_title"
    }(b || (b = {})),
    function(e) {
        e.BLOCKS = "BLOCKS", e.WIDGETS = "WIDGETS", e.SEQUENCE = "SEQUENCE", e.STEPS = "STEPS"
    }(x || (x = {}));
    var M = [{
            pattern: /(^2gud.com$)|(\.2gud.com$)/i,
            domainName: "2gud.com"
        }],
        F = function(e) {
            return e === S.ONE || e === S.TWO
        },
        H = function() {
            var e = M.find((function(e) {
                var t = window ? window.location.host : "";
                return e.pattern.test(t)
            }));
            return e ? e.domainName : "flipkart.com"
        },
        B = function(e, t) {
            return t && I.find((function(e) {
                return t === e
            })) ? function(e) {
                if (!F(e)) return "payments.flipkart.com";
                var t = H();
                return "".concat(e, ".payments.").concat(t)
            }(e) : function(e) {
                return F(e) ? "".concat(e, ".pay.payzippy.com") : "pay.payzippy.com"
            }(e)
        }
}, function(e, t, n) {
    "use strict";
    var r = new URL("./", self.location).pathname,
        o = n(13),
        i = function(e, t, n, i) {
            t instanceof RegExp ? this.fullUrlRegExp = t : (0 !== t.indexOf("/") && (t = r + t), this.keys = [], this.regexp = o(t, this.keys)), this.method = e, this.options = i, this.handler = n
        };
    i.prototype.makeHandler = function(e) {
        var t;
        if (this.regexp) {
            var n = this.regexp.exec(e);
            t = {}, this.keys.forEach((function(e, r) {
                t[e.name] = n[r + 1]
            }))
        }
        return function(e) {
            return this.handler(e, t, this.options)
        }.bind(this)
    }, e.exports = i
}, function(e, t, n) {
    var r = n(14);
    e.exports = l, e.exports.parse = i, e.exports.compile = function(e, t) {
        return c(i(e, t), t)
    }, e.exports.tokensToFunction = c, e.exports.tokensToRegExp = E;
    var o = new RegExp(["(\\\\.)", "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"), "g");

    function i(e, t) {
        for (var n, r = [], i = 0, a = 0, c = "", f = t && t.delimiter || "/"; null != (n = o.exec(e));) {
            var p = n[0],
                E = n[1],
                l = n.index;
            if (c += e.slice(a, l), a = l + p.length, E) c += E[1];
            else {
                var h = e[a],
                    T = n[2],
                    d = n[3],
                    _ = n[4],
                    m = n[5],
                    A = n[6],
                    v = n[7];
                c && (r.push(c), c = "");
                var I = null != T && null != h && h !== T,
                    O = "+" === A || "*" === A,
                    L = "?" === A || "*" === A,
                    R = n[2] || f,
                    N = _ || m;
                r.push({
                    name: d || i++,
                    prefix: T || "",
                    delimiter: R,
                    optional: L,
                    repeat: O,
                    partial: I,
                    asterisk: !!v,
                    pattern: N ? s(N) : v ? ".*" : "[^" + u(R) + "]+?"
                })
            }
        }
        return a < e.length && (c += e.substr(a)), c && r.push(c), r
    }

    function a(e) {
        return encodeURI(e).replace(/[\/?#]/g, (function(e) {
            return "%" + e.charCodeAt(0).toString(16).toUpperCase()
        }))
    }

    function c(e, t) {
        for (var n = new Array(e.length), o = 0; o < e.length; o++) "object" == typeof e[o] && (n[o] = new RegExp("^(?:" + e[o].pattern + ")$", p(t)));
        return function(t, o) {
            for (var i = "", c = t || {}, u = (o || {}).pretty ? a : encodeURIComponent, s = 0; s < e.length; s++) {
                var f = e[s];
                if ("string" != typeof f) {
                    var p, E = c[f.name];
                    if (null == E) {
                        if (f.optional) {
                            f.partial && (i += f.prefix);
                            continue
                        }
                        throw new TypeError('Expected "' + f.name + '" to be defined')
                    }
                    if (r(E)) {
                        if (!f.repeat) throw new TypeError('Expected "' + f.name + '" to not repeat, but received `' + JSON.stringify(E) + "`");
                        if (0 === E.length) {
                            if (f.optional) continue;
                            throw new TypeError('Expected "' + f.name + '" to not be empty')
                        }
                        for (var l = 0; l < E.length; l++) {
                            if (p = u(E[l]), !n[s].test(p)) throw new TypeError('Expected all "' + f.name + '" to match "' + f.pattern + '", but received `' + JSON.stringify(p) + "`");
                            i += (0 === l ? f.prefix : f.delimiter) + p
                        }
                    } else {
                        if (p = f.asterisk ? encodeURI(E).replace(/[?#]/g, (function(e) {
                                return "%" + e.charCodeAt(0).toString(16).toUpperCase()
                            })) : u(E), !n[s].test(p)) throw new TypeError('Expected "' + f.name + '" to match "' + f.pattern + '", but received "' + p + '"');
                        i += f.prefix + p
                    }
                } else i += f
            }
            return i
        }
    }

    function u(e) {
        return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1")
    }

    function s(e) {
        return e.replace(/([=!:$\/()])/g, "\\$1")
    }

    function f(e, t) {
        return e.keys = t, e
    }

    function p(e) {
        return e && e.sensitive ? "" : "i"
    }

    function E(e, t, n) {
        r(t) || (n = t || n, t = []);
        for (var o = (n = n || {}).strict, i = !1 !== n.end, a = "", c = 0; c < e.length; c++) {
            var s = e[c];
            if ("string" == typeof s) a += u(s);
            else {
                var E = u(s.prefix),
                    l = "(?:" + s.pattern + ")";
                t.push(s), s.repeat && (l += "(?:" + E + l + ")*"), a += l = s.optional ? s.partial ? E + "(" + l + ")?" : "(?:" + E + "(" + l + "))?" : E + "(" + l + ")"
            }
        }
        var h = u(n.delimiter || "/"),
            T = a.slice(-h.length) === h;
        return o || (a = (T ? a.slice(0, -h.length) : a) + "(?:" + h + "(?=$))?"), a += i ? "$" : o && T ? "" : "(?=" + h + "|$)", f(new RegExp("^" + a, p(n)), t)
    }

    function l(e, t, n) {
        return r(t) || (n = t || n, t = []), n = n || {}, e instanceof RegExp ? function(e, t) {
            var n = e.source.match(/\((?!\?)/g);
            if (n)
                for (var r = 0; r < n.length; r++) t.push({
                    name: r,
                    prefix: null,
                    delimiter: null,
                    optional: !1,
                    repeat: !1,
                    partial: !1,
                    asterisk: !1,
                    pattern: null
                });
            return f(e, t)
        }(e, t) : r(e) ? function(e, t, n) {
            for (var r = [], o = 0; o < e.length; o++) r.push(l(e[o], t, n).source);
            return f(new RegExp("(?:" + r.join("|") + ")", p(n)), t)
        }(e, t, n) : function(e, t, n) {
            return E(i(e, n), t, n)
        }(e, t, n)
    }
}, function(e, t) {
    e.exports = Array.isArray || function(e) {
        return "[object Array]" == Object.prototype.toString.call(e)
    }
}, function(e, t, n) {
    "use strict";
    var r = "store",
        o = "url",
        i = "timestamp",
        a = {};
    e.exports = {
        getDb: function(e) {
            return e in a || (a[e] = function(e) {
                return new Promise((function(t, n) {
                    var a = indexedDB.open("sw-toolbox-" + e, 1);
                    a.onupgradeneeded = function() {
                        a.result.createObjectStore(r, {
                            keyPath: o
                        }).createIndex(i, i, {
                            unique: !1
                        })
                    }, a.onsuccess = function() {
                        t(a.result)
                    }, a.onerror = function() {
                        n(a.error)
                    }
                }))
            }(e)), a[e]
        },
        setTimestampForUrl: function(e, t, n) {
            return new Promise((function(o, i) {
                var a = e.transaction(r, "readwrite");
                a.objectStore(r).put({
                    url: t,
                    timestamp: n
                }), a.oncomplete = function() {
                    o(e)
                }, a.onabort = function() {
                    i(a.error)
                }
            }))
        },
        expireEntries: function(e, t, n, o) {
            return function(e, t, n) {
                return t ? new Promise((function(o, a) {
                    var c = 1e3 * t,
                        u = [],
                        s = e.transaction(r, "readwrite"),
                        f = s.objectStore(r);
                    f.index(i).openCursor().onsuccess = function(e) {
                        var t = e.target.result;
                        if (t && n - c > t.value.timestamp) {
                            var r = t.value.url;
                            u.push(r), f.delete(r), t.continue()
                        }
                    }, s.oncomplete = function() {
                        o(u)
                    }, s.onabort = a
                })) : Promise.resolve([])
            }(e, n, o).then((function(n) {
                return function(e, t) {
                    return t ? new Promise((function(n, o) {
                        var a = [],
                            c = e.transaction(r, "readwrite"),
                            u = c.objectStore(r),
                            s = u.index(i),
                            f = s.count();
                        s.count().onsuccess = function() {
                            var e = f.result;
                            e > t && (s.openCursor().onsuccess = function(n) {
                                var r = n.target.result;
                                if (r) {
                                    var o = r.value.url;
                                    a.push(o), u.delete(o), e - a.length > t && r.continue()
                                }
                            })
                        }, c.oncomplete = function() {
                            n(a)
                        }, c.onabort = o
                    })) : Promise.resolve([])
                }(e, t).then((function(e) {
                    return n.concat(e)
                }))
            }))
        }
    }
}, function(e, t, n) {
    e.exports = {
        networkOnly: n(17),
        networkFirst: n(18),
        cacheOnly: n(5),
        cacheFirst: n(19),
        fastest: n(20)
    }
}, function(e, t, n) {
    "use strict";
    var r = n(1);
    e.exports = function(e, t, n) {
        return r.debug("Strategy: network only [" + e.url + "]", n), fetch(e)
    }
}, function(e, t, n) {
    "use strict";
    var r = n(3),
        o = n(1);
    e.exports = function(e, t, n) {
        var i = (n = n || {}).successResponses || r.successResponses,
            a = n.networkTimeoutSeconds || r.networkTimeoutSeconds;
        return o.debug("Strategy: network first [" + e.url + "]", n), o.openCache(n).then((function(t) {
            var r, c, u = [];
            if (a) {
                var s = new Promise((function(n) {
                    r = setTimeout((function() {
                        t.match(e).then((function(e) {
                            e && n(e)
                        }))
                    }), 1e3 * a)
                }));
                u.push(s)
            }
            var f = o.fetchAndCache(e, n).then((function(e) {
                if (r && clearTimeout(r), i.test(e.status)) return e;
                throw o.debug("Response was an HTTP error: " + e.statusText, n), c = e, new Error("Bad response")
            })).catch((function(r) {
                return o.debug("Network or response error, fallback to cache [" + e.url + "]", n), t.match(e).then((function(e) {
                    if (e) return e;
                    if (c) return c;
                    throw r
                }))
            }));
            return u.push(f), Promise.race(u)
        }))
    }
}, function(e, t, n) {
    "use strict";
    var r = n(1);
    e.exports = function(e, t, n) {
        return r.debug("Strategy: cache first [" + e.url + "]", n), r.openCache(n).then((function(t) {
            return t.match(e).then((function(t) {
                return t || r.fetchAndCache(e, n)
            }))
        }))
    }
}, function(e, t, n) {
    "use strict";
    var r = n(1),
        o = n(5);
    e.exports = function(e, t, n) {
        return r.debug("Strategy: fastest [" + e.url + "]", n), new Promise((function(i, a) {
            var c = !1,
                u = [],
                s = function(e) {
                    u.push(e.toString()), c ? a(new Error('Both cache and network failed: "' + u.join('", "') + '"')) : c = !0
                },
                f = function(e) {
                    e instanceof Response ? i(e) : s("No result returned")
                };
            r.fetchAndCache(e.clone(), n).then(f, s), o(e, t, n).then(f, s)
        }))
    }
}, function(e, t, n) {
    "use strict";
    n(22);
    var r = n(1),
        o = n(4),
        i = n(3);

    function a(e) {
        return e.reduce((function(e, t) {
            return e.concat(t)
        }), [])
    }
    e.exports = {
        fetchListener: function(e) {
            var t = o.match(e.request);
            t ? e.respondWith(t(e.request)) : o.default && "GET" === e.request.method && 0 === e.request.url.indexOf("http") && e.respondWith(o.default(e.request))
        },
        activateListener: function(e) {
            r.debug("activate event fired");
            var t = i.cache.name + "$$$inactive$$$";
            e.waitUntil(r.renameCache(t, i.cache.name))
        },
        installListener: function(e) {
            var t = i.cache.name + "$$$inactive$$$";
            r.debug("install event fired"), r.debug("creating cache [" + t + "]"), e.waitUntil(r.openCache({
                cache: {
                    name: t
                }
            }).then((function(e) {
                return Promise.all(i.preCacheItems).then(a).then(r.validatePrecacheInput).then((function(t) {
                    return r.debug("preCache list: " + (t.join(", ") || "(none)")), e.addAll(t)
                }))
            })))
        }
    }
}, function(e, t) {
    ! function() {
        var e = Cache.prototype.addAll,
            t = navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);
        if (t) var n = t[1],
            r = parseInt(t[2]);
        e && (!t || "Firefox" === n && r >= 46 || "Chrome" === n && r >= 50) || (Cache.prototype.addAll = function(e) {
            var t = this;

            function n(e) {
                this.name = "NetworkError", this.code = 19, this.message = e
            }
            return n.prototype = Object.create(Error.prototype), Promise.resolve().then((function() {
                if (arguments.length < 1) throw new TypeError;
                return e = e.map((function(e) {
                    return e instanceof Request ? e : String(e)
                })), Promise.all(e.map((function(e) {
                    "string" == typeof e && (e = new Request(e));
                    var t = new URL(e.url).protocol;
                    if ("http:" !== t && "https:" !== t) throw new n("Invalid scheme");
                    return fetch(e.clone())
                })))
            })).then((function(r) {
                if (r.some((function(e) {
                        return !e.ok
                    }))) throw new n("Incorrect response status");
                return Promise.all(r.map((function(n, r) {
                    return t.put(e[r], n)
                })))
            })).then((function() {}))
        }, Cache.prototype.add = function(e) {
            return this.addAll([e])
        })
    }()
}, function(e, t, n) {
    "use strict";
    (function(e) {
        var t, r = n(7),
            o = n.n(r),
            i = n(8),
            a = n(11),
            c = o.a.canUseDOM,
            u = "undefined" != typeof navigator ? navigator.userAgent : "StandardUA",
            s = {
                "X-User-Agent": "".concat(u, " ").concat(i.a),
                "Content-Type": "application/json"
            };
        c || Object.assign(s, {
            compress: !0,
            Connection: "keep-alive",
            "Keep-Alive": "timeout=600"
        });
        var f, p = c ? "https" : "http";
        if (!c) {
            var E = null === (t = null == e ? void 0 : e.env) || void 0 === t ? void 0 : t.API_TIMEOUT;
            E && !isNaN(parseInt(E, 10)) && (f = parseInt(E, 10))
        }
        var l = Object.assign({}, {
                headers: s
            }, {
                protocol: p,
                credentials: "include",
                fk_api_timeout: c ? 3e4 : f || 4e3
            }),
            h = Object.assign({}, s, {
                "x-device-source": "web"
            }),
            T = Object.assign({}, l, {
                headers: h,
                hostname: Object(a.a)()
            });
        Object.assign({}, T, {
            hostname: "payments.flipkart.com"
        })
    }).call(this, n(24))
}, function(e, t) {
    var n, r, o = e.exports = {};

    function i() {
        throw new Error("setTimeout has not been defined")
    }

    function a() {
        throw new Error("clearTimeout has not been defined")
    }

    function c(e) {
        if (n === setTimeout) return setTimeout(e, 0);
        if ((n === i || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
        try {
            return n(e, 0)
        } catch (t) {
            try {
                return n.call(null, e, 0)
            } catch (t) {
                return n.call(this, e, 0)
            }
        }
    }! function() {
        try {
            n = "function" == typeof setTimeout ? setTimeout : i
        } catch (e) {
            n = i
        }
        try {
            r = "function" == typeof clearTimeout ? clearTimeout : a
        } catch (e) {
            r = a
        }
    }();
    var u, s = [],
        f = !1,
        p = -1;

    function E() {
        f && u && (f = !1, u.length ? s = u.concat(s) : p = -1, s.length && l())
    }

    function l() {
        if (!f) {
            var e = c(E);
            f = !0;
            for (var t = s.length; t;) {
                for (u = s, s = []; ++p < t;) u && u[p].run();
                p = -1, t = s.length
            }
            u = null, f = !1,
                function(e) {
                    if (r === clearTimeout) return clearTimeout(e);
                    if ((r === a || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
                    try {
                        r(e)
                    } catch (t) {
                        try {
                            return r.call(null, e)
                        } catch (t) {
                            return r.call(this, e)
                        }
                    }
                }(e)
        }
    }

    function h(e, t) {
        this.fun = e, this.array = t
    }

    function T() {}
    o.nextTick = function(e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
            for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
        s.push(new h(e, t)), 1 !== s.length || f || c(l)
    }, h.prototype.run = function() {
        this.fun.apply(null, this.array)
    }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = T, o.addListener = T, o.once = T, o.off = T, o.removeListener = T, o.removeAllListeners = T, o.emit = T, o.prependListener = T, o.prependOnceListener = T, o.listeners = function(e) {
        return []
    }, o.binding = function(e) {
        throw new Error("process.binding is not supported")
    }, o.cwd = function() {
        return "/"
    }, o.chdir = function(e) {
        throw new Error("process.chdir is not supported")
    }, o.umask = function() {
        return 0
    }
}, function(e, t, n) {
    var r = n(26),
        o = n(32);
    e.exports = function(e, t) {
        for (var n = 0, i = (t = r(t, e)).length; null != e && n < i;) e = e[o(t[n++])];
        return n && n == i ? e : void 0
    }
}, function(e, t, n) {
    var r = n(6),
        o = n(27),
        i = n(29),
        a = n(31);
    e.exports = function(e, t) {
        return r(e) ? e : o(e, t) ? [e] : i(a(e))
    }
}, function(e, t, n) {
    var r = n(6),
        o = n(28),
        i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        a = /^\w*$/;
    e.exports = function(e, t) {
        if (r(e)) return !1;
        var n = typeof e;
        return !("number" != n && "symbol" != n && "boolean" != n && null != e && !o(e)) || (a.test(e) || !i.test(e) || null != t && e in Object(t))
    }
}, function(e, t) {
    e.exports = function() {
        return !1
    }
}, function(e, t, n) {
    var r = n(30),
        o = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        i = /\\(\\)?/g,
        a = r((function(e) {
            var t = [];
            return 46 === e.charCodeAt(0) && t.push(""), e.replace(o, (function(e, n, r, o) {
                t.push(r ? o.replace(i, "$1") : n || e)
            })), t
        }));
    e.exports = a
}, function(e, t) {
    e.exports = function(e) {
        return e
    }
}, function(e, t) {
    e.exports = function(e) {
        return e
    }
}, function(e, t) {
    e.exports = function(e) {
        return e
    }
}, function(e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var r = function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
            }
        }
        return function(t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t
        }
    }();
    var o = function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.currentNetInfo = null, this.isEnvWindow = "undefined" != typeof window, this.isEnvSW = "undefined" != typeof ServiceWorkerGlobalScope, this.hasNetInfoSupported = "undefined" != typeof navigator && "connection" in navigator && void 0 !== navigator.connection.downlink, this.hasResourceTimingSupported = "undefined" != typeof performance && performance.getEntriesByName, this.downlinkRoundUpFactor = 25, this.computeMethods = {
                NETINFO: "NETINFO",
                RTAPI: "RTAPI",
                FDW: "FDW"
            }
        }
        return r(e, [{
            key: "loadCache",
            value: function() {
                return caches.open(e.bandwidthCache).then((function(e) {
                    var t = new Request("https://www.flipkart.com/netinfo");
                    return e.match(t)
                })).then((function(e) {
                    return e.json()
                })).then((function(e) {
                    return e
                })).catch((function() {
                    return null
                }))
            }
        }, {
            key: "writeToCache",
            value: function(t) {
                return caches.open(e.bandwidthCache).then((function(e) {
                    var n = new Request("https://www.flipkart.com/netinfo"),
                        r = new Response(JSON.stringify(t));
                    return e.put(n, r)
                })).catch((function() {
                    return null
                }))
            }
        }, {
            key: "clearCache",
            value: function() {
                return caches.delete(e.bandwidthCache)
            }
        }, {
            key: "initializeNetInfo",
            value: function() {
                return {
                    downlink: 0,
                    downlinkMax: 1 / 0,
                    effectiveType: null,
                    rtt: 1 / 0,
                    type: null,
                    sessionCount: 0
                }
            }
        }, {
            key: "getCurrentNetInfo",
            value: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    t = navigator.connection,
                    n = this.initializeNetInfo();
                for (var r in this.currentNetInfo = n, n) n.hasOwnProperty(r) && void 0 !== t[r] && (n[r] = t[r]);
                return n.downlink *= 1e3, n.computeMethod = this.computeMethods.NETINFO, e.onChange && ("function" != typeof e.onChange ? console.warn('"onChange" property on config object should be a function !') : this.currentNetInfo.onChange = e.onChange), n
            }
        }, {
            key: "getResouceTimingInformation",
            value: function() {
                var t = performance.getEntries().filter((function(t) {
                    return t.name.includes(e.imageURL)
                }))[0];
                if (t) {
                    var n = t.domainLookupEnd - t.domainLookupStart + (t.connectEnd - t.connectStart) + (t.responseStart - t.requestStart) + (t.responseEnd - t.responseStart);
                    t.networkDuration = n
                }
                return t
            }
        }, {
            key: "fetchTestFile",
            value: function() {
                var t = this;
                return new Promise((function(n) {
                    var r = Date.now();
                    fetch(e.imageURL).then((function(e) {
                        var o = Date.now(),
                            i = null;
                        t.hasResourceTimingSupported || ((i = {}).transferSize = 8 * e.headers.get("content-length") / 1e3, i.duration = (o - r) / 1e3), n(i)
                    }))
                }))
            }
        }, {
            key: "roundOffToClosestMultipleof25",
            value: function(e) {
                if (e < 0) return 0;
                var t = e % 25;
                return t > 12 ? e + (25 - t) : e - t
            }
        }, {
            key: "compute",
            value: function(e) {
                var t = this;
                return new Promise((function(n) {
                    var r = void 0;
                    t.isEnvSW ? t.hasNetInfoSupported ? n(t.getCurrentNetInfo(e)) : t.fetchTestFile().then((function(e) {
                        return r = t.initializeNetInfo(), t.loadCache().then((function(n) {
                            n && (r = n);
                            var o = r.downlink,
                                i = r.sessionCount;
                            if (o *= i, r.sessionCount++, t.hasResourceTimingSupported) {
                                r.computeMethod = t.computeMethods.RTAPI;
                                var a = t.getResouceTimingInformation();
                                o += 8 * a.transferSize / 1e3 / (a.networkDuration / 1e3)
                            } else r.computeMethod = t.computeMethods.FDW, o += e.transferSize / e.duration;
                            return o = t.roundOffToClosestMultipleof25(Math.round(o)), r.downlink = o / (i + 1), t.currentNetInfo = r, r
                        })).then((function(e) {
                            return t.writeToCache(e)
                        })).then((function() {
                            n(r)
                        })).catch((function() {
                            n(null)
                        }))
                    })) : n(null)
                }))
            }
        }]), e
    }();
    o.bandwidthCache = "BandwidthCache", o.imageURL = "https://rukminim1.flixcart.com/image/275/275/j7qi9ow0/bedsheet/w/e/y/ivyrose-8901633329624-flat-bombay-dyeing-original-imaexwy3ncqh663q.jpeg?q=80", t.default = new o
}, function(e, t, n) {
    "use strict";
    n.r(t);
    var r = n(0),
        o = n.n(r),
        i = (n(23), n(1)),
        a = n.n(i);
    ! function() {
        for (var e = [], t = 0; t < 64;) e[t] = 0 | 4294967296 * Math.abs(Math.sin(++t))
    }();
    var c, u;

    function s(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }! function(e) {
        e.GROCERY_STORE_LINK = "/grocery-supermart-store?marketplace=GROCERY", e.CONTINUE_SHOPPING_LINK = "/?otracker=Cart_Continue%20shopping", e.CHECKOUT_URL = "/checkout/init", e.CONNEKT_BASE_URL = "connekt.flipkart.net", e.CONNEKT_STAGE_PATHNAME_PREFIX = "/connekt", e.VIP_LANDING_URL = "/plus", e.NOTIFICATION_PREF_URL = "/communication-preferences/push", e.CART_PAGE_URI = "/viewcart", e.BASKET_PAGE_URI = "/viewcart?marketplace=GROCERY", e.EXPLORE_MODE_BASKET_PAGE_URI = "/viewcart?exploreMode=true&marketplace=GROCERY", e.EXPLORE_MODE_FLIPKART_PAGE_URI = "/viewcart?exploreMode=true&marketplace=FLIPKART"
    }(c || (c = {})),
    function(e) {
        e.SFL = "SFL", e.CHECKOUT = "CHECKOUT"
    }(u || (u = {}));
    var f = {
        cacheFirst: function(e, t, n) {
            var r = e.url.replace(/sqid=([^&]*)/, "").replace(/ssid=([^&]*)/, "");
            return a.a.openCache(n).then((function(t) {
                return l(r, t, n, "get", e)
            })).catch((function(e) {
                throw new Error(e)
            }))
        },
        cachePost: function(e, t, n) {
            return E(e.clone()).then((function(t) {
                return a.a.openCache(n).then((function(r) {
                    return l(t, r, n, "post", e)
                }))
            })).catch((function(e) {
                throw new Error(e)
            }))
        },
        webpushCallBack: function(e, t, n) {
            var r = {
                    type: "PN",
                    eventType: e,
                    timestamp: (new Date).getTime(),
                    messageId: t.messageId,
                    contextId: t.contextId,
                    cargo: n
                },
                o = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "KrWcJnCSZFBLFR39DtHYySjcDCHg2LeC3sxdx7646n7iy7oy"
                    },
                    body: JSON.stringify(r)
                },
                i = "https://".concat(c.CONNEKT_BASE_URL, "/v1/push/callback/openweb/fkwebsite/").concat(t.deviceId);
            return fetch(i, o)
        },
        uncache: function(e, t) {
            return function() {
                a.a.uncache(e, t)
            }
        }
    };

    function p(e) {
        return E(e.clone()).then((function(t) {
            return fetch(e).then((function(e) {
                return {
                    url: t,
                    response: e.clone()
                }
            }))
        }))
    }

    function E(e) {
        return e.json().then((function(t) {
            var n = JSON.stringify(t).replace(/"(ssid|sqid)":".*?"/g, ""),
                r = function(e) {
                    var t = 0;
                    if (0 === e.length) return t;
                    for (var n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t &= t;
                    return t
                }(e.url + n);
            return "".concat(e.url, "?payload=").concat(r)
        }))
    }

    function l(e, t, n) {
        var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "get",
            o = arguments.length > 4 ? arguments[4] : void 0,
            i = 1e3 * n.cache.maxAgeSeconds,
            a = "created-time",
            c = new Request("".concat(e + (e.indexOf("?") > -1 ? "&" : "?"), "$cached$timestamp$"));
        return Promise.all([t.match(e), t.match(c)]).then((function(n) {
            var u = n[0],
                f = n[1];
            return u && f && Date.now() < parseInt(f.headers.get(a), 10) + i ? u : "get" === r ? fetch(o).then((function(n) {
                return 200 === n.status && (t.put(e, n.clone()), t.put(c, new Response(null, {
                    headers: s({}, a, Date.now())
                }))), n
            })) : p(o).then((function(n) {
                return n.response.ok && (t.put(c, new Response(null, {
                    headers: s({}, a, Date.now())
                })), t.put(e, n.response.clone())), n.response
            }))
        }))
    }
    var h = n(2),
        T = n.n(h),
        d = n(9),
        _ = n.n(d),
        m = n(10),
        A = n.n(m),
        v = {};
    ["static", "mainBundles", "layouts", "pincodes", "fonts", "widgets", "sherlock", "facets", "summary", "swatches", "autosuggest", "searchSummary", "product", "reco", "lc", "self-serve", "reviews"].forEach((function(e) {
        v[e] = e + 10
    }));
    self.addEventListener("message", (function(e) {
        "BANDWIDTH_COMPUTE" === e.data && O()
    }));
    var I = 0;

    function O() {
        return _.a.compute().then((function(e) {
            if (I++, e && e.downlink > 0 || I > 3) return I = 0, L({
                type: "BANDWIDTH",
                data: e
            });
            setTimeout(O, 5e3)
        })).catch((function(e) {
            ++I < 3 ? setTimeout(O, 5e3) : I = 0
        }))
    }
    var L = function(e) {
            return self.clients.matchAll().then((function(t) {
                return Promise.all(t.map((function(t) {
                    return t.postMessage(JSON.stringify(e))
                })))
            })).catch(R)
        },
        R = function(e) {
            throw e
        };
    self.addEventListener("install", (function(e) {
        e.waitUntil(self.skipWaiting())
    })), self.addEventListener("activate", (function(e) {
        e.waitUntil(self.clients.claim()), e.waitUntil(caches.keys().then((function(e) {
            var t = Object.keys(v).map((function(e) {
                return v[e]
            }));
            return Promise.all(e.map((function(e) {
                return -1 === t.indexOf(e) && -1 === e.indexOf("$$$inactive$$$") ? caches.delete(e) : Promise.resolve()
            })))
        })))
    })), self.addEventListener("push", (function(e) {
        if (e.data) try {
            var t = e.data.json(),
                n = t.payload;
            if (n) {
                var r = T()(n, ["title"]),
                    o = {
                        body: n.body,
                        icon: n.icon,
                        image: n.image,
                        data: t,
                        requireInteraction: !0
                    };
                n.actions && n.actions.length > 0 && (o.actions = [], n.actions.forEach((function(e) {
                    o.actions.push({
                        icon: e.icon,
                        title: e.title,
                        action: e.action
                    })
                }))), e.waitUntil(Promise.all([self.registration.showNotification(r, o), f.webpushCallBack("RECEIVED", t)]))
            }
        } catch (e) {
            R(e)
        }
    })), self.addEventListener("notificationclick", (function(e) {
        var t;
        if (e.notification.close(), e.action) {
            var n = T()(e, ["notification", "data", "payload", "actions"]);
            if (n && Array.isArray(n)) {
                var r = n.filter((function(t) {
                    return e.action === t.action
                }));
                1 === r.length && (t = T()(r, [0, "landingUrl"]))
            }
        } else t = T()(e, ["notification", "data", "payload", "landingUrl"]);
        t ? e.waitUntil(Promise.all([clients.openWindow(t), f.webpushCallBack("READ", e.notification.data)])) : e.waitUntil(self.skipWaiting())
    })), self.addEventListener("notificationclose", (function(e) {
        e.waitUntil(f.webpushCallBack("DISMISS", e.notification.data))
    })), navigator.userAgent.indexOf("Firefox/44.0") > -1 && self.addEventListener("fetch", (function(e) {
        e.respondWith(fetch(e.request))
    }));
    var N = {
        cache: {
            maxEntries: 15
        },
        origin: "https://".concat("www.flipkart.com")
    };
    o.a.router.get("/lc/getData*", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v.lc,
            maxAgeSeconds: 1800
        }
    })), o.a.router.post("/api/1/product/smart-browse", f.cachePost, Object.assign({}, N, {
        cache: {
            name: v.sherlock,
            maxAgeSeconds: 45
        }
    })), o.a.router.get("/api/1/product/smart-browse/facets*", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v.facets,
            maxAgeSeconds: 45
        }
    })), o.a.router.get("/api/4/product/swatch", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v.swatches,
            maxAgeSeconds: 120
        }
    })), o.a.router.post("/api/3/page/dynamic/product-reviews", f.cachePost, Object.assign({}, N, {
        cache: {
            name: v.reviews,
            maxAgeSeconds: 120
        }
    })), o.a.router.get("/api/3/product/reviews", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v.reviews,
            maxAgeSeconds: 120
        }
    })), o.a.router.get("/api/3/product/aspect-reviews", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v.reviews,
            maxAgeSeconds: 120
        }
    })), o.a.router.post("/api/3/product/summary", f.cachePost, Object.assign({}, N, {
        cache: {
            name: v.summary,
            maxAgeSeconds: 45
        }
    })), o.a.router.get("/api/3/user/autosuggest/pincodes", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v.pincodes,
            maxAgeSeconds: 86400
        }
    })), o.a.router.get("/api/1/self-serve/return/tnc/*", f.cacheFirst, Object.assign({}, N, {
        cache: {
            name: v["self-serve"],
            maxAgeSeconds: 86400
        }
    })), o.a.router.get("/fk-cp-zion/fonts/(.*)", o.a.fastest, {
        origin: "https://".concat(A.a.domain),
        cache: {
            name: v.fonts,
            maxEntries: 5
        }
    })
}]);