/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
this._escape = str =>
  str
  .replace(/&/g, '&amp;')
  .replace(/>/g, '&gt;')
  .replace(/</g, '&lt;')
  .replace(/"/g, '&quot;')
;

this._unescape = str =>
  str
  .replace(/&amp;/g, '&')
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/&quot;/g, '"')
;

this.render_tree = function(tree, options) {
  let boost, children_html, node;
  if (options == null) { options = {}; }
  let html = '';

  const opts = {
    id:    'id',
    node:  null,
    root:  false,
    level: 0,
    boost: []
  };

  // JQuery hash merge
  $.extend(opts, options);

  // Define Boost Only Once
  if (opts['boost'].length !== 0) {
    boost = [];
    for (node of Array.from(tree)) {
      const num  = node.parent_id || 0;
      const item = boost[num];
      if (!(item instanceof Array)) { boost[num] = []; }
      boost[num].push(node);
    }

    opts['boost'] = boost;
  }

  if (!opts.node) {
    // render root nodes
    const roots = opts['boost'][0];

    // select roots
    // for node in tree
    //   roots.push node if node.parent_id is null

    // roots is empty, but tree is not empty
    // I should select nodes with minimal parent_id
    // they will be roots
    // order by lft, should be made at server side
    let min_elem = tree[0];
    if ((roots.length === 0) && (tree.length !== 0)) {
      let elem;
      for (elem of Array.from(tree)) {
        if (elem.parent_id < min_elem.parent_id) { min_elem = elem; }
      }
      // select roots witn min parent_id
      for (elem of Array.from(tree)) {
        if (elem.parent_id === min_elem.parent_id) {
          roots.push(elem);
        }
      }
    }

    // render tree
    for (node of Array.from(roots)) {
      $.extend(opts, { node, root: false, level: opts.level + 1 });
      children_html = render_tree(tree, opts);
      html += opts.render_node(node, children_html, opts);
    }
  } else {
    // render children nodes
    let children      = [];
    children_html = '';
    children      = boost[opts.node.id];

    // select children
    // for elem in tree
    //   children.push elem if elem.parent_id is opts.node.id

    // render children nodes
    for (node of Array.from(children)) {
      $.extend(opts, { node, root: false, level: opts.level + 1 });
      children_html = render_tree(tree, opts);
      html += opts.render_node(node, children_html, opts);
    }
  }
  
  // result html
  return html;
};