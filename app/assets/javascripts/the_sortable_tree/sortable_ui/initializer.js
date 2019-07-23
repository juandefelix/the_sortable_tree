/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
this.rebuild_sortable_tree = (rebuild_url, item_id, parent_id, prev_id, next_id) =>
  $.ajax({
    type:     'POST',
    dataType: 'script',
    url:      rebuild_url,
    data: {
      id:        item_id,
      parent_id,
      prev_id,
      next_id
    },

    beforeSend(xhr) {
      return $('.the_sortable_tree-handler').hide();
    },

    success(data, status, xhr) {
      return $('.the_sortable_tree-handler').show();
    },

    error(xhr, status, error) {
      return console.log(error);
    }
  })
;

this.init_sortable_tree = function() {
  const sortable_tree = $('.the_sortable_tree');
  if (sortable_tree.length === 0) { return false; }

  const rebuild_url = sortable_tree.data('rebuild_url') || sortable_tree.data('rebuild-url');
  const max_levels  = sortable_tree.data('max_levels')  || sortable_tree.data('max-levels');

  //###########################################
  // Initialize Sortable Tree
  //###########################################
  sortable_tree.nestedSortable({
    items:       '.the_sortable_tree-item',
    handle:      '.the_sortable_tree-handler',
    placeholder: 'the_sortable_tree-placeholder',
    listClass:   'the_sortable_tree-nested_set',

    tolerance:        'pointer',
    helper:           'clone',
    maxLevels:        max_levels,
    revert:           250,
    tabSize:          25,
    opacity:          0.6,
    disableNesting:   'no-nest',
    toleranceElement: '> div',
    forcePlaceholderSize: true
  });

  //###########################################
  // Sortable Update Event
  //###########################################
  sortable_tree.on("sortupdate", (event, ui) => {
    const { item } = ui;
    const attr_name = 'node-id';

    const item_id   = item.data(attr_name);
    const prev_id   = item.prev().data(attr_name);
    const next_id   = item.next().data(attr_name);
    const parent_id = item.parent().parent().data(attr_name);

    return rebuild_sortable_tree(rebuild_url, item_id, parent_id, prev_id, next_id);
  });

  return true;
};

$(() => init_sortable_tree());
