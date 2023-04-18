// Mostly copied from https://github.com/w3c/IntersectionObserver/blob/main/polyfill/intersection-observer.js
// Modified to work as a `ponyfill` for testing b/c linkedom does not seem to supply an IntersectionObserver implementation

/* eslint-disable */
var registry = [],
  crossOriginUpdater = null,
  crossOriginRect = null;
function getFrameElement(t) {
  try {
    return (t.defaultView && t.defaultView.frameElement) || null;
  } catch (t) {
    return null;
  }
}
function IntersectionObserverEntry(t) {
  (this.time = t.time),
    (this.target = t.target),
    (this.rootBounds = ensureDOMRect(t.rootBounds)),
    (this.boundingClientRect = ensureDOMRect(t.boundingClientRect)),
    (this.intersectionRect = ensureDOMRect(
      t.intersectionRect || getEmptyRect()
    )),
    (this.isIntersecting = !!t.intersectionRect);
  var e = this.boundingClientRect,
    n = e.width * e.height,
    r = this.intersectionRect,
    o = r.width * r.height;
  this.intersectionRatio = n
    ? Number((o / n).toFixed(4))
    : this.isIntersecting
    ? 1
    : 0;
}
function IntersectionObserver(t, e) {
  var n = e || {};
  if ("function" != typeof t) throw new Error("callback must be a function");
  if (n.root && 1 != n.root.nodeType && 9 != n.root.nodeType)
    throw new Error("root must be a Document or Element");
  (this._checkForIntersections = throttle(
    this._checkForIntersections.bind(this),
    this.THROTTLE_TIMEOUT
  )),
    (this._callback = t),
    (this._observationTargets = []),
    (this._queuedEntries = []),
    (this._rootMarginValues = this._parseRootMargin(n.rootMargin)),
    (this.thresholds = this._initThresholds(n.threshold)),
    (this.root = n.root || null),
    (this.rootMargin = this._rootMarginValues
      .map(function (t) {
        return t.value + t.unit;
      })
      .join(" ")),
    (this._monitoringDocuments = []),
    (this._monitoringUnsubscribes = []);
}
function now() {
  return window.performance && performance.now && performance.now();
}
function throttle(t, e) {
  var n = null;
  return function () {
    n ||
      (n = setTimeout(function () {
        t(), (n = null);
      }, e));
  };
}
function addEvent(t, e, n, r) {
  "function" == typeof t.addEventListener
    ? t.addEventListener(e, n, r || !1)
    : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n);
}
function removeEvent(t, e, n, r) {
  "function" == typeof t.removeEventListener
    ? t.removeEventListener(e, n, r || !1)
    : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, n);
}
function computeRectIntersection(t, e) {
  var n = Math.max(t.top, e.top),
    r = Math.min(t.bottom, e.bottom),
    o = Math.max(t.left, e.left),
    i = Math.min(t.right, e.right),
    s = i - o,
    c = r - n;
  return (
    (s >= 0 &&
      c >= 0 && {
        top: n,
        bottom: r,
        left: o,
        right: i,
        width: s,
        height: c,
      }) ||
    null
  );
}
function getBoundingClientRect(t) {
  var e;
  try {
    e = t.getBoundingClientRect();
  } catch (t) {}
  return e
    ? ((e.width && e.height) ||
        (e = {
          top: e.top,
          right: e.right,
          bottom: e.bottom,
          left: e.left,
          width: e.right - e.left,
          height: e.bottom - e.top,
        }),
      e)
    : getEmptyRect();
}
function getEmptyRect() {
  return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
}
function ensureDOMRect(t) {
  return !t || "x" in t
    ? t
    : {
        top: t.top,
        y: t.top,
        bottom: t.bottom,
        left: t.left,
        x: t.left,
        right: t.right,
        width: t.width,
        height: t.height,
      };
}
function convertFromParentRect(t, e) {
  var n = e.top - t.top,
    r = e.left - t.left;
  return {
    top: n,
    left: r,
    height: e.height,
    width: e.width,
    bottom: n + e.height,
    right: r + e.width,
  };
}
function containsDeep(t, e) {
  for (var n = e; n; ) {
    if (n == t) return !0;
    n = getParentNode(n);
  }
  return !1;
}
function getParentNode(t) {
  var e = t.parentNode;
  return 9 == t.nodeType && t != document
    ? getFrameElement(t)
    : (e && e.assignedSlot && (e = e.assignedSlot.parentNode),
      e && 11 == e.nodeType && e.host ? e.host : e);
}
function isDoc(t) {
  return t && 9 === t.nodeType;
}
(IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100),
  (IntersectionObserver.prototype.POLL_INTERVAL = null),
  (IntersectionObserver.prototype.USE_MUTATION_OBSERVER = !0),
  (IntersectionObserver._setupCrossOriginUpdater = function () {
    return (
      crossOriginUpdater ||
        (crossOriginUpdater = function (t, e) {
          (crossOriginRect =
            t && e ? convertFromParentRect(t, e) : getEmptyRect()),
            registry.forEach(function (t) {
              t._checkForIntersections();
            });
        }),
      crossOriginUpdater
    );
  }),
  (IntersectionObserver._resetCrossOriginUpdater = function () {
    (crossOriginUpdater = null), (crossOriginRect = null);
  }),
  (IntersectionObserver.prototype.observe = function (t) {
    if (
      !this._observationTargets.some(function (e) {
        return e.element == t;
      })
    ) {
      if (!t || 1 != t.nodeType) throw new Error("target must be an Element");
      this._registerInstance(),
        this._observationTargets.push({ element: t, entry: null }),
        this._monitorIntersections(t.ownerDocument),
        this._checkForIntersections();
    }
  }),
  (IntersectionObserver.prototype.unobserve = function (t) {
    (this._observationTargets = this._observationTargets.filter(function (e) {
      return e.element != t;
    })),
      this._unmonitorIntersections(t.ownerDocument),
      0 == this._observationTargets.length && this._unregisterInstance();
  }),
  (IntersectionObserver.prototype.disconnect = function () {
    (this._observationTargets = []),
      this._unmonitorAllIntersections(),
      this._unregisterInstance();
  }),
  (IntersectionObserver.prototype.takeRecords = function () {
    var t = this._queuedEntries.slice();
    return (this._queuedEntries = []), t;
  }),
  (IntersectionObserver.prototype._initThresholds = function (t) {
    var e = t || [0];
    return (
      Array.isArray(e) || (e = [e]),
      e.sort().filter(function (t, e, n) {
        if ("number" != typeof t || isNaN(t) || t < 0 || t > 1)
          throw new Error(
            "threshold must be a number between 0 and 1 inclusively"
          );
        return t !== n[e - 1];
      })
    );
  }),
  (IntersectionObserver.prototype._parseRootMargin = function (t) {
    var e = (t || "0px").split(/\s+/).map(function (t) {
      var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
      if (!e)
        throw new Error("rootMargin must be specified in pixels or percent");
      return { value: parseFloat(e[1]), unit: e[2] };
    });
    return (
      (e[1] = e[1] || e[0]), (e[2] = e[2] || e[0]), (e[3] = e[3] || e[1]), e
    );
  }),
  (IntersectionObserver.prototype._monitorIntersections = function (t) {
    var e = t.defaultView;
    if (e && -1 == this._monitoringDocuments.indexOf(t)) {
      var n = this._checkForIntersections,
        r = null,
        o = null;
      this.POLL_INTERVAL
        ? (r = e.setInterval(n, this.POLL_INTERVAL))
        : (addEvent(e, "resize", n, !0),
          addEvent(t, "scroll", n, !0),
          this.USE_MUTATION_OBSERVER &&
            "MutationObserver" in e &&
            (o = new e.MutationObserver(n)).observe(t, {
              attributes: !0,
              childList: !0,
              characterData: !0,
              subtree: !0,
            })),
        this._monitoringDocuments.push(t),
        this._monitoringUnsubscribes.push(function () {
          var e = t.defaultView;
          e && (r && e.clearInterval(r), removeEvent(e, "resize", n, !0)),
            removeEvent(t, "scroll", n, !0),
            o && o.disconnect();
        });
      var i = (this.root && (this.root.ownerDocument || this.root)) || document;
      if (t != i) {
        var s = getFrameElement(t);
        s && this._monitorIntersections(s.ownerDocument);
      }
    }
  }),
  (IntersectionObserver.prototype._unmonitorIntersections = function (t) {
    var e = this._monitoringDocuments.indexOf(t);
    if (-1 != e) {
      var n = (this.root && (this.root.ownerDocument || this.root)) || document;
      if (
        !this._observationTargets.some(function (e) {
          var r = e.element.ownerDocument;
          if (r == t) return !0;
          for (; r && r != n; ) {
            var o = getFrameElement(r);
            if ((r = o && o.ownerDocument) == t) return !0;
          }
          return !1;
        })
      ) {
        var r = this._monitoringUnsubscribes[e];
        if (
          (this._monitoringDocuments.splice(e, 1),
          this._monitoringUnsubscribes.splice(e, 1),
          r(),
          t != n)
        ) {
          var o = getFrameElement(t);
          o && this._unmonitorIntersections(o.ownerDocument);
        }
      }
    }
  }),
  (IntersectionObserver.prototype._unmonitorAllIntersections = function () {
    var t = this._monitoringUnsubscribes.slice(0);
    (this._monitoringDocuments.length = 0),
      (this._monitoringUnsubscribes.length = 0);
    for (var e = 0; e < t.length; e++) t[e]();
  }),
  (IntersectionObserver.prototype._checkForIntersections = function () {
    if (this.root || !crossOriginUpdater || crossOriginRect) {
      var t = this._rootIsInDom(),
        e = t ? this._getRootRect() : getEmptyRect();
      this._observationTargets.forEach(function (n) {
        var r = n.element,
          o = getBoundingClientRect(r),
          i = this._rootContainsTarget(r),
          s = n.entry,
          c = t && i && this._computeTargetAndRootIntersection(r, o, e),
          h = null;
        this._rootContainsTarget(r)
          ? (crossOriginUpdater && !this.root) || (h = e)
          : (h = getEmptyRect());
        var u = (n.entry = new IntersectionObserverEntry({
          time: now(),
          target: r,
          boundingClientRect: o,
          rootBounds: h,
          intersectionRect: c,
        }));
        s
          ? t && i
            ? this._hasCrossedThreshold(s, u) && this._queuedEntries.push(u)
            : s && s.isIntersecting && this._queuedEntries.push(u)
          : this._queuedEntries.push(u);
      }, this),
        this._queuedEntries.length && this._callback(this.takeRecords(), this);
    }
  }),
  (IntersectionObserver.prototype._computeTargetAndRootIntersection = function (
    t,
    e,
    n
  ) {
    if ("none" != window.getComputedStyle(t).display) {
      for (var r = e, o = getParentNode(t), i = !1; !i && o; ) {
        var s = null,
          c = 1 == o.nodeType ? window.getComputedStyle(o) : {};
        if ("none" == c.display) return null;
        if (o == this.root || 9 == o.nodeType)
          if (((i = !0), o == this.root || o == document))
            crossOriginUpdater && !this.root
              ? !crossOriginRect ||
                (0 == crossOriginRect.width && 0 == crossOriginRect.height)
                ? ((o = null), (s = null), (r = null))
                : (s = crossOriginRect)
              : (s = n);
          else {
            var h = getParentNode(o),
              u = h && getBoundingClientRect(h),
              a = h && this._computeTargetAndRootIntersection(h, u, n);
            u && a
              ? ((o = h), (s = convertFromParentRect(u, a)))
              : ((o = null), (r = null));
          }
        else {
          var l = o.ownerDocument;
          o != l.body &&
            o != l.documentElement &&
            "visible" != c.overflow &&
            (s = getBoundingClientRect(o));
        }
        if ((s && (r = computeRectIntersection(s, r)), !r)) break;
        o = o && getParentNode(o);
      }
      return r;
    }
  }),
  (IntersectionObserver.prototype._getRootRect = function () {
    var t;
    if (this.root && !isDoc(this.root)) t = getBoundingClientRect(this.root);
    else {
      var e = isDoc(this.root) ? this.root : document,
        n = e.documentElement,
        r = e.body;
      t = {
        top: 0,
        left: 0,
        right: n.clientWidth || r.clientWidth,
        width: n.clientWidth || r.clientWidth,
        bottom: n.clientHeight || r.clientHeight,
        height: n.clientHeight || r.clientHeight,
      };
    }
    return this._expandRectByRootMargin(t);
  }),
  (IntersectionObserver.prototype._expandRectByRootMargin = function (t) {
    var e = this._rootMarginValues.map(function (e, n) {
        return "px" == e.unit
          ? e.value
          : (e.value * (n % 2 ? t.width : t.height)) / 100;
      }),
      n = {
        top: t.top - e[0],
        right: t.right + e[1],
        bottom: t.bottom + e[2],
        left: t.left - e[3],
      };
    return (n.width = n.right - n.left), (n.height = n.bottom - n.top), n;
  }),
  (IntersectionObserver.prototype._hasCrossedThreshold = function (t, e) {
    var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
      r = e.isIntersecting ? e.intersectionRatio || 0 : -1;
    if (n !== r)
      for (var o = 0; o < this.thresholds.length; o++) {
        var i = this.thresholds[o];
        if (i == n || i == r || i < n != i < r) return !0;
      }
  }),
  (IntersectionObserver.prototype._rootIsInDom = function () {
    return !this.root || containsDeep(document, this.root);
  }),
  (IntersectionObserver.prototype._rootContainsTarget = function (t) {
    var e = (this.root && (this.root.ownerDocument || this.root)) || document;
    return containsDeep(e, t) && (!this.root || e == t.ownerDocument);
  }),
  (IntersectionObserver.prototype._registerInstance = function () {
    registry.indexOf(this) < 0 && registry.push(this);
  }),
  (IntersectionObserver.prototype._unregisterInstance = function () {
    var t = registry.indexOf(this);
    -1 != t && registry.splice(t, 1);
  });
export { IntersectionObserver, IntersectionObserverEntry };
