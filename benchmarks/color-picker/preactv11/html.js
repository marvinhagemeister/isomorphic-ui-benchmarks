const { build, treeify } = require("./htm/build");

const toFunc = (template, ...args) => {
  const { output, slots } = quasiCompile(template, args);
  return (args) => {
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      output[slot.output] = slot.func("" + args[slot.input]);
    }
    return output.join("");
  };
};

const toEval = (template, ...args) => {
  const code = toCode(template, ...args);
  const x = eval(`
    const x = function(escapeTag, escapeAttrName, escapeAttrValue, escapeChild, spreadProps) {
      return function(args) {
        return ${code};
      };
    };
    x;
  `);
  return x(
    escapeTag,
    escapeAttrName,
    escapeAttrValue,
    escapeChild,
    spreadProps
  );
};

const toCode = (template, args) => {
  const { output, slots } = quasiCompile(template, args);
  slots.forEach((slot) => {
    output[slot.output] = slot;
  });
  const strings = output.map((x) => {
    if (typeof x === "string") {
      return JSON.stringify(x);
    } else {
      return `${x.func.name}(args[${x.input}])`;
    }
  });
  return `${strings.join("+")}`;
};

const quasiCompile = (template, args) => {
  const built = build(template);

  const tree = treeify(built, args.map((_, i) => i));
  const output = [];
  const slots = [];
  traverse(tree, output, slots);
  return { output, slots };
};

function escapeTag(string) {
  return string;
}
function escapeChild(string) {
  return string;
}
function escapeAttrName(string) {
  return string;
}
function escapeAttrValue(string) {
  return string;
}
function spreadProps(props) {
  let out = "";
  for (let key in props) {
    const value = props[key];
    if (value === true) {
      out += ` ${escapeAttrName(key)}`;
    } else {
      out += ` ${escapeAttrName(key)}='${escapeAttrValue(value)}'`;
    }
  }
  return out;
}

const push = (into, string) => {
  if (typeof into[into.length - 1] === "string") {
    into[into.length - 1] += string;
  } else {
    into.push(string);
  }
};

const traverse = (tree, output, slots) => {
  if (tree == null || typeof tree === "boolean") {
    return;
  } else if (typeof tree === "string") {
    push(output, escapeChild(tree));
    return;
  } else if (typeof tree === "number") {
    slots.push({
      input: tree,
      output: output.push(null) - 1,
      func: escapeChild,
    });
    return;
  } else if (Array.isArray(tree)) {
    tree.forEach((t) => traverse(t, output, slots));
    return;
  } else if (typeof tree === "string") {
    push(output, "" + tree);
    return;
  }

  const { tag, props, children } = tree;

  push(output, `<${escapeTag(tag)}`);

  props.forEach((p) => {
    if (typeof p === "number") {
      slots.push({
        input: p,
        output: output.push(null) - 1,
        func: spreadProps,
      });
      return;
    }

    Object.keys(p).forEach((key) => {
      const values = p[key];
      if (values.length === 1 && values[0] === true) {
        push(output, escapeAttrName(key));
        return;
      }

      push(output, ` ${escapeAttrName(key)}='`);
      values.forEach((value, i) => {
        if (typeof value === "string") {
          push(output, escapeAttrValue(value));
        } else if (typeof value === "number") {
          slots.push({
            input: value,
            output: output.push(null) - 1,
            func: escapeAttrValue,
          });
        }
      });

      push(output, "'");
    });
  });
  if (children.length === 0) {
    push(output, "/>");
  } else {
    push(output, ">");
    children.forEach((c) => traverse(c, output, slots));
    push(output, `</${escapeTag(tag)}>`);
  }
};

const cached = (compile) => {
  const cache = new Map();
  return (template, ...args) => {
    let func = cache.get(template);
    if (!func) {
      func = compile(template, args);
      cache.set(template, func);
    }
    return func(args);
  };
};

const htmlFunc = cached(toFunc);
const htmlEval = cached(toEval);
const htmlAuto = () => {
  try {
    eval("1");
  } catch (err) {
    return htmlFunc;
  }
  return htmlEval;
};

module.exports = {
  htmlFunc,
  htmlEval,
  htmlAuto,
  html: htmlFunc,
};
