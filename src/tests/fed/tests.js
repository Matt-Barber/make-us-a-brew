/**
 * Picker Tests
**/
QUnit.test('Test Add Drinker', function( assert ) {
    var l_picker = new picker();
    l_picker.addDrinker({'name' : 'Foo', 'val' : 'Bar'});
    assert.ok(l_picker.getDrinkers().hasOwnProperty('Foo'));
});

QUnit.test('Test Remove Drinker', function ( assert ) {
    var l_picker = new picker();
    l_picker.addDrinker({'name' : 'Foo'});
    l_picker.addDrinker({'name' : 'Bar'});
    l_picker.removeDrinker('Foo');
    assert.notOk(l_picker.getRemainingDrinkers().indexOf('Foo') > -1);
    assert.ok(l_picker.getRemainingDrinkers().indexOf('Bar') > -1);
    assert.equal(l_picker.getRemainingDrinkers().length, 1);
});

QUnit.test('Test Drinker Has Made (Remove)', function ( assert ) {
    var l_picker = new picker();
    l_picker.addDrinker({'name' : 'Foo'});
    l_picker.addDrinker({'name' : 'Bar'});
    l_picker.drinkerCan('Bar');
    assert.notOk(l_picker.getRemainingDrinkers().indexOf('Bar') > -1);
    assert.ok(l_picker.getRemainingDrinkers().indexOf('Foo') > -1);
});

QUnit.test('Test Get Maker', function ( assert ) {
    var l_picker = new picker();
    l_picker.addDrinker({'name' : 'Foo'});
    l_picker.addDrinker({'name' : 'Bar'});
    var maker = l_picker.getMaker();
    assert.ok(maker === 'Foo' || maker === 'Bar');
});

QUnit.test('Test No Makers Left', function ( assert ) {
    var l_picker = new picker();
    assert.equal(l_picker.getMaker(), "No makers left");
});

/**
 * Table Tests
**/
QUnit.test('Test Creating a Table', function ( assert ) {
      var l_table = new table();
      var result = l_table.create_table('test', {'name' : 'Foo'});
      assert.equal(result.id, 'test-table');
});

QUnit.test('Test Adding a Row', function ( assert ) {
    var l_table = new table();
    var result = l_table.create_table('test', {'name' : 'Foo'});
    l_table.add_row(result, {'name' : 'Bar'});
    assert.equal(result.rows.length, 3); //header, row 1, row 2
});

QUnit.test('Editing a Row', function ( assert ){
    var l_table = new table();
    var result = l_table.create_table('test', {'name': 'Foo'});
    l_table.add_row(result, {'name' : 'Bar'});
    l_table.edit_row(result, 'Foo', {'name' : 'Woo'});
    assert.equal(result.rows[1].cells[0].innerHTML, 'Woo');
});

QUnit.test('Removing a Row', function ( assert ) {
    var l_table = new table();
    var result = l_table.create_table('test', {'name' : 'Foo'});
    l_table.add_row(result, {'name' : 'Bar'});
    l_table.remove_row(result, 'Foo');
    assert.equal(result.rows.length, 2);
    assert.notEqual(result.rows[1].cells[0].innerHTML, 'Foo');
});

QUnit.test('Highlighting a Row', function (assert) {
    var l_table = new table();
    var result = l_table.create_table('test', {'name' : 'Foo'});
    l_table.add_row(result, {'name' : 'Bar'});
    l_table.highlight_row(result, 'Foo');
    assert.equal(result.rows[1].style.background, 'rgb(62, 39, 35)');
});
