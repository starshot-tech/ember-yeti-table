import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { click } from '@ember/test-helpers';
import { A } from '@ember/array';

module('Integration | Component | yeti-table (general)', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.data = A([{
      firstName: 'Miguel',
      lastName: 'Andrade',
      points: 1
    }, {
      firstName: 'José',
      lastName: 'Baderous',
      points: 2
    }, {
      firstName: 'Maria',
      lastName: 'Silva',
      points: 3
    }, {
      firstName: 'Tom',
      lastName: 'Dale',
      points: 4
    }, {
      firstName: 'Yehuda',
      lastName: 'Katz',
      points: 5
    }]);
  });

  test('body blockless form renders table', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data columns="firstName lastName points" as |yeti|}}

        {{#yeti.table as |table|}}
          {{#table.header as |header|}}
            {{#header.column}}
              First name
            {{/header.column}}
            {{#header.column}}
              Last name
            {{/header.column}}
            {{#header.column}}
              Points
            {{/header.column}}
          {{/table.header}}

          {{table.body}}
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.equal(this.element.querySelectorAll('table').length, 1);
    assert.equal(this.element.querySelectorAll('thead').length, 1);
    assert.equal(this.element.querySelectorAll('tbody').length, 1);
    assert.equal(this.element.querySelectorAll('tr').length, 6);
    assert.equal(this.element.querySelectorAll('th').length, 3);
    assert.equal(this.element.querySelectorAll('td').length, 5 * 3);
  });

  test('body block form renders table', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
          {{#table.header as |header|}}
            {{#header.column}}
              First name
            {{/header.column}}
            {{#header.column}}
              Last name
            {{/header.column}}
            {{#header.column}}
              Points
            {{/header.column}}
          {{/table.header}}

          {{#table.body as |body person|}}
            {{#body.row as |row|}}
              {{#row.cell}}
                Custom {{person.firstName}}
              {{/row.cell}}
              {{#row.cell}}
                {{person.lastName}}
              {{/row.cell}}
              {{#row.cell}}
                {{person.points}}
              {{/row.cell}}
            {{/body.row}}
          {{/table.body}}
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    assert.dom('tbody tr:nth-child(1) td:nth-child(1)').hasText('Custom Miguel');
    assert.dom('tbody tr:nth-child(2) td:nth-child(1)').hasText('Custom José');
    assert.dom('tbody tr:nth-child(3) td:nth-child(1)').hasText('Custom Maria');
    assert.dom('tbody tr:nth-child(4) td:nth-child(1)').hasText('Custom Tom');
    assert.dom('tbody tr:nth-child(5) td:nth-child(1)').hasText('Custom Yehuda');
  });

  test('rowClass applies a class to each row', async function(assert) {
    await render(hbs`
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
          {{#table.header as |header|}}
            {{#header.column prop="firstName"}}
              First name
            {{/header.column}}
            {{#header.column prop="lastName"}}
              Last name
            {{/header.column}}
            {{#header.column prop="points"}}
              Points
            {{/header.column}}
          {{/table.header}}

          {{table.body rowClass="custom-row-class"}}
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    let rows = this.element.querySelectorAll('tbody tr');
    rows.forEach((r) => {
      assert.dom(r).hasClass('custom-row-class');
    });
  });

  test('onRowClick action is triggered', async function(assert) {
    assert.expect(2);

    this.rowClicked = (p) => {
      assert.equal(p.firstName, 'Miguel');
    };

    await render(hbs`
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
          {{#table.header as |header|}}
            {{#header.column prop="firstName"}}
              First name
            {{/header.column}}
            {{#header.column prop="lastName"}}
              Last name
            {{/header.column}}
            {{#header.column prop="points"}}
              Points
            {{/header.column}}
          {{/table.header}}

          {{table.body onRowClick=(action rowClicked)}}
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    await click('tbody tr:nth-child(1)');

    this.set('rowClicked', (p) => {
      assert.equal(p.firstName, 'Tom');
    });

    await click('tbody tr:nth-child(4)');
  });

  test('onClick action is triggered on row component', async function(assert) {
    assert.expect(2);

    this.rowClicked = (p) => {
      assert.equal(p.firstName, 'Miguel');
    };

    await render(hbs`
      {{#yeti-table data=data as |yeti|}}

        {{#yeti.table as |table|}}
          {{#table.header as |header|}}
            {{#header.column}}
              First name
            {{/header.column}}
            {{#header.column}}
              Last name
            {{/header.column}}
            {{#header.column}}
              Points
            {{/header.column}}
          {{/table.header}}

          {{#table.body as |body person|}}
            {{#body.row onClick=(action rowClicked person) as |row|}}
              {{#row.cell}}
                Custom {{person.firstName}}
              {{/row.cell}}
              {{#row.cell}}
                {{person.lastName}}
              {{/row.cell}}
              {{#row.cell}}
                {{person.points}}
              {{/row.cell}}
            {{/body.row}}
          {{/table.body}}
        {{/yeti.table}}

      {{/yeti-table}}
    `);

    await click('tbody tr:nth-child(1)');

    this.set('rowClicked', (p) => {
      assert.equal(p.firstName, 'Tom');
    });

    await click('tbody tr:nth-child(4)');
  });
});
