/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
window.is_restorable_tree = true;

const Cls = (this.TSTconst = class TSTconst {
  static initClass() {
    this._name        = 'TST';
    this.delimiter    = ';';
    this.separator    = '|';
  }
  static re() { return new RegExp(this.cookie_name() + '\\' + this.separator); }
  static hash_prefix() { return this.cookie_name() + this.separator; }
  static cookie_scope() { return $('.sortable_tree').data('cookie_scope') || $('.sortable_tree').data('cookie-scope'); }
  static cookie_name() {
    if (!this.cookie_scope()) { return this._name; }
    return this._name + '_' + this.cookie_scope();
  }
});
Cls.initClass();

// ====================================
// Helpers
// ====================================
this._get_hash = () => document.location.hash;
this._set_hash = function(str) {
  window.skip_expandable_tree_hashchange = true;
  return document.location.hash = str;
};

this._uniqueArray = function(arr) {
  if (arr == null) { arr = []; }
  const output = {};
  for (let item of Array.from(arr)) { output[item] = item; }
  return (() => {
    const result = [];
    for (let key in output) {
      const val = output[key];
      result.push(val);
    }
    return result;
  })();
};

this._compactArray = array => array.filter(e => e);

this._nested_set_hash_arr = function(hash) {
    if (!hash) { return []; }
    const [prefix, arr] = Array.from(hash.split(TSTconst.separator));
    return _compactArray(_uniqueArray(arr.split(TSTconst.delimiter)));
  };

// ====================================
// Helpers Fn
// ====================================
this.nested_tree_get_path = function() {
  const hash = _get_hash();
  if (!hash.match(TSTconst.re())) { return false; }
  return _nested_set_hash_arr(hash);
};

this.hash_and_cookie_accordance = function() {
  if (window.is_cookie_restoreable_tree) {
    const hash = _get_hash();
    if (hash.length === 0) {
      $.removeCookie( TSTconst.cookie_name() );
    } else {
      if (!hash.match(TSTconst.re())) { return false; }
      const str = hash.split(TSTconst.separator)[1];
      $.cookie(TSTconst.cookie_name(), str, { expires: 14 });
    }
  }

  return false;
};

this.nested_tree_path_remove = function(id) {
  const hash  = _get_hash();
  if (!hash.match(TSTconst.re())) { return false; }

  const arr   = _nested_set_hash_arr(hash);
  const index = arr.indexOf(id+'');
  if (index === -1) { return hash_and_cookie_accordance(); }

  arr.splice(index, 1);
  const str = _uniqueArray(arr).join(TSTconst.delimiter);

  if (str.length === 0) {
    _set_hash('');
  } else {
    _set_hash(TSTconst.hash_prefix() + str);
  }
  
  hash_and_cookie_accordance();

  return true;
};

this.nested_tree_path_add = function(id) {
  let str  = id;
  const hash = _get_hash();

  if (hash.match(TSTconst.re())) {
    let arr = _nested_set_hash_arr(hash);
    arr.push(id);
    arr = _uniqueArray(arr);
    str = arr.join(TSTconst.delimiter);
  }

  _set_hash(TSTconst.hash_prefix() + str);
  return hash_and_cookie_accordance();
};

// ====================================
// Restore Fn
// ====================================
this.load_nested_nodes = function(arr, expand_node_url) {
  if (arr.length === 0) {
    window.skip_expandable_tree_hashchange = false;
    return false;
  }

  const id         = arr.shift();
  const tree       = $('.sortable_tree');
  const node       = $(`[data-node-id=${id}]`);
  const ctrl_items = $('i.handle, b.expand', tree);

  if (node.length === 0) {
    return load_nested_nodes(arr, expand_node_url);
  } else {
    return $.ajax({
      type:     'POST',
      dataType: 'html',
      data:     { id },
      url:      expand_node_url,

      beforeSend(xhr) {
        ctrl_items.hide();
        return window.skip_expandable_tree_hashchange = true;
      },

      success(data, status, xhr) {
        ctrl_items.show();
        append_children_to_node(node, data);
        return load_nested_nodes(arr, expand_node_url);
      },

      error(xhr, status, error) {
        try {
          return console.log(error);
        } catch (error1) {}
      }
    });
  }
};

this.restore_nested_tree = function(sortable_tree, expand_node_url) {
  const arr  = nested_tree_get_path();
  if (!arr) { return false; }
  return load_nested_nodes(arr, expand_node_url);
};