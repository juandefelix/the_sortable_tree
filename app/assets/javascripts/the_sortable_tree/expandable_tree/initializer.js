/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// ----------------------------------------
// Restorable Helpers
// ----------------------------------------
this.add_to_restorable_path = function(node) {
  if (window.is_restorable_tree) {
    const id = node.data('node-id');
    nested_tree_path_add(id);
    return true;
  }
  return false;
};

this.remove_from_restorable_path = function(node) {
  if (window.is_restorable_tree) {
    const id = node.data('node-id');
    nested_tree_path_remove(id);
    return true;
  }
  return false;
};

// ----------------------------------------
// Main Helpers
// ----------------------------------------
this.nested_tree_toggle = function(button) {
  if (button.hasClass('minus')) {
    return button.removeClass('minus').addClass('plus').html('+');
  } else {
    return button.removeClass('plus').addClass('minus').html('&ndash;');
  }
};

this.append_children_to_node = function(node, html) {
  html = html.trim();
  const item = node.children('.item');

  const button = node.children('.item').children('.expand');

  if (html.length === 0) {
    button.addClass('empty');
  }

  if (html.length > 0) {
    item.after(html);
    nested_tree_toggle(button);
    return add_to_restorable_path(node);
  }
};

this.upload_nodes_children = function(node, expand_node_url) {
  const node_id    = node.data('node-id');
  const tree       = $('.sortable_tree');
  const ctrl_items = $('i.handle, b.expand', tree);

  return $.ajax({
    type:     'POST',
    dataType: 'html',
    data:     { id: node_id },
    url:      expand_node_url,

    beforeSend(xhr) {
      ctrl_items.hide();
      return window.skip_expandable_tree_hashchange = true;
    },

    success(data, status, xhr) {
      ctrl_items.show();
      return append_children_to_node(node, data);
    },

    error(xhr, status, error) {
      try {
        return console.log(error);
      } catch (error1) {}
    }
  });
};

this.init_expandable_tree = function() {
  const sortable_tree = $('ol.sortable_tree');
  if (sortable_tree.length === 0) { return false; }

  if (!window.is_restorable_tree) { window.is_restorable_tree = false; }
  window.is_cookie_restoreable_tree   = sortable_tree.data('cookie_store') || sortable_tree.data('cookie-store');

  if (window.is_cookie_restoreable_tree) {
    const steps = $.cookie(TSTconst.cookie_name());
    if (steps) { _set_hash(TSTconst.hash_prefix() + steps); }
  }

  const expand_node_url = sortable_tree.data('expand_node_url') || sortable_tree.data('expand-node-url');

  // Now it's designed only for one tree
  if (window.is_restorable_tree) { restore_nested_tree(sortable_tree, expand_node_url); }

  sortable_tree.on('click', '.expand.minus', function(e) {
    const button = $(this);
    const node   = button.parent().parent();
    nested_tree_toggle(button);
    remove_from_restorable_path(node);
    node.children('.nested_set').hide();
    return false;
  });

  sortable_tree.on('click', '.expand.plus', function(e) {
    const button     = $(this);
    const node       = button.parent().parent();
    const nested_set = node.children('.nested_set');
    
    if (nested_set.length === 0) {
      upload_nodes_children(node, expand_node_url);
    } else {
      nested_set.show();
      nested_tree_toggle(button);
      add_to_restorable_path(node);
    }

    return false;
  });

  return true;
};

$(() => init_expandable_tree());