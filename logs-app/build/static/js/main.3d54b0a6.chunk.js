(window["webpackJsonplogs-app"] = window["webpackJsonplogs-app"] || []).push([
  [0],
  {
    15: function(e, t, a) {
      e.exports = a(40);
    },
    20: function(e, t, a) {},
    21: function(e, t, a) {},
    40: function(e, t, a) {
      "use strict";
      a.r(t);
      var n = a(0),
        r = a.n(n),
        c = a(12),
        l = a.n(c),
        o = (a(20), a(21), a(14)),
        m = a(13),
        s = a.n(m),
        u = a(2),
        i = a.n(u);
      i.a.locale();
      var d = function(e) {
          var t = e.date,
            a = e.method,
            n = e.path,
            c = e.code,
            l = e.time;
          return (
            (t = i()(t).format("L LTS")),
            r.a.createElement(
              r.a.Fragment,
              null,
              r.a.createElement(
                "span",
                { className: "term-content-arrow" },
                "\u279c"
              ),
              " ",
              r.a.createElement(
                "span",
                { className: "term-content-tilde" },
                "~"
              ),
              r.a.createElement(
                "span",
                {
                  className:
                    200 === c || 201 === c
                      ? "text-green-600"
                      : 404 === c || 400 === c
                      ? "text-red-600"
                      : "text-gray-100"
                },
                "[Date: ",
                t,
                "] : ",
                a,
                " ",
                n,
                " ",
                c,
                " ",
                l,
                "ms"
              ),
              r.a.createElement("br", null)
            )
          );
        },
        E = function() {
          var e = r.a.useState([]),
            t = Object(o.a)(e, 2),
            a = t[0],
            n = t[1];
          return (
            r.a.useEffect(function() {
              s.a
                .get("/logs")
                .then(function(e) {
                  var t = e.data;
                  return n(t);
                })
                .catch(function(e) {
                  throw (console.log(e), e);
                });
            }, []),
            r.a.createElement(
              "div",
              { className: "term" },
              r.a.createElement(
                "div",
                { className: "term-header" },
                r.a.createElement("button", {
                  class: "term-header-button term-header-button-close"
                }),
                r.a.createElement("button", {
                  class: "term-header-button term-header-button-minimize"
                }),
                r.a.createElement("button", {
                  class: "term-header-button term-header-button-expand"
                }),
                r.a.createElement(
                  "div",
                  { class: "term-header-title" },
                  r.a.createElement("span", null, "Cookie Clicker - Logs")
                )
              ),
              r.a.createElement(
                "div",
                { className: "term-content" },
                a.map(function(e, t) {
                  return r.a.createElement(d, Object.assign({}, e, { key: t }));
                }),
                r.a.createElement(
                  "span",
                  { class: "term-content-arrow" },
                  "\u279c"
                ),
                " ",
                r.a.createElement("span", { class: "term-content-tilde" }, "~"),
                r.a.createElement("span", { class: "term-content-caret" })
              )
            )
          );
        };
      var p = function() {
        return r.a.createElement(E, null);
      };
      l.a.render(r.a.createElement(p, null), document.getElementById("root"));
    }
  },
  [[15, 1, 2]]
]);
//# sourceMappingURL=main.3d54b0a6.chunk.js.map
