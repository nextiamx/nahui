"use strict";
;
function f(key) {
    return function (row) { return row[key]; };
}
function filterDefault(text) {
    return text;
}
var opFechaCol = TableColumn({ name: 'opFecha' });
var sucNombre = TableColumn({ name: 'sucNombre' });
var opTitulo = TableColumn({
    name: 'opTitulo',
    tag: 'a',
    attrs: {
        href: '/asf'
    }
});
var tsColumns = [
    opFechaCol,
    sucNombre,
    opTitulo
];
/**
 *
 */
function TableColumn(config) {
    var col = {};
    col.name = config.name;
    col.value = 'value' in config ? config.value : f(config.name);
    col.filter = 'filter' in config ? config.filter : filterDefault;
    col.text = ColumnText(col);
    col.tag = 'tag' in config ? config.tag : 'div';
    if (config.update) {
        col.update = config.update;
    }
    if (config.attrs) {
        col.attrs = config.attrs;
    }
    return col;
}
function ColumnText(column) {
    return function (row) { return column.filter(column.value(row)); };
}
function buildColumns(columns) {
    return function (row) {
        return columns.map(function (col) {
            return { column: col, row: row, name: col.name };
        });
    };
}
function updateTable(selection) {
    var data = selection.datum();
    var tbody = selection.select('tbody');
    var rows = tbody.selectAll('tr').data(data.rows);
    rows.enter().append('tr');
    rows.exit().remove();
    var cells = rows.selectAll('td').data(buildColumns(data.columns), function (d) { return d.name; });
    cells.enter().append('td')
        .attr('x-colname', function (d) { return d.column.name; })
        .each(function (d) { d3.select(this).append(d.column.tag); });
    cells.exit().remove();
    data.columns.forEach(function (column) {
        var cell = rows.select('[x-colname=' + column.name + ']');
        if (column.tag)
            cell = cell.select(column.tag);
        if (column.html) {
            cell.html(column.html);
        }
        else {
            cell.text(column.text);
        }
        if (column.attrs) {
            cell.attr(column.attrs);
        }
        if (column.classed) {
            cell.attr(column.classed);
        }
        if (column.update) {
            cell.call(column.update, column);
        }
    });
}
exports.updateTable = updateTable;
