/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
this._arrays_diff = (a, b) => b.filter(i => !(a.indexOf(i) > -1));

this.expandable_tree_hashchange = function(hash_event) {
  if (window.skip_expandable_tree_hashchange) {
    window.skip_expandable_tree_hashchange = false;
    return true;
  }

  hash_and_cookie_accordance();
  
  const oEvent  = hash_event.originalEvent;
  const new_url = oEvent.newURL;
  const old_url = oEvent.oldURL;

  const new_hash = new_url.split('#')[1];
  const old_hash = old_url.split('#')[1];

  if (!(`#${new_hash}`).match(TSTconst.re()) && !(`#${old_hash}`).match(TSTconst.re())) { return false; }

  const new_arr = _nested_set_hash_arr(new_hash);
  const old_arr = _nested_set_hash_arr(old_hash);
  
  const diff_ids = new_arr.length >= old_arr.length ?
    _arrays_diff(old_arr, new_arr)
  :
    _arrays_diff(new_arr, old_arr);

  return (() => {
    const result = [];
    for (let id of Array.from(diff_ids)) {
      const btn = $(`[data-node-id=${id}] > .item .expand`);
      btn.click();
      result.push(setTimeout(() => window.skip_expandable_tree_hashchange = false));
    }
    return result;
  })();
};

$(window).bind('hashchange', hash_event => expandable_tree_hashchange(hash_event));