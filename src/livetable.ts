
declare var d3: any;

interface TableColumnConfig {
    name : string,
    value?(x) : any,
    filter?(x) : string,
    update?:any,
    tag? :string,
    attrs? : any
};

function f(key:string) : (row) => any {
    return (row) => row[key];
}

function filterDefault(text) {
    return text;
}

let opFechaCol = TableColumn({name : 'opFecha'});
let sucNombre = TableColumn({name : 'sucNombre'});
let opTitulo = TableColumn({
    name:'opTitulo',
    tag:'a',
    attrs : {
        href : '/asf'
    }

});
let tsColumns = [
    opFechaCol,
    sucNombre,
    opTitulo
]

/**
 *
 */
function TableColumn(config:TableColumnConfig) {
    var col:any = {};

    col.name = config.name;
    col.value  = 'value' in config  ? config.value : f(config.name);
    col.filter = 'filter' in config ? config.filter : filterDefault;
    col.text = ColumnText(col);
    col.tag  = 'tag' in config ? config.tag : 'div';

    if(config.update) {
        col.update = config.update;
    }

    if(config.attrs) {
        col.attrs = config.attrs;
    }

    return col;
}

function ColumnText (column) {
    return (row) => column.filter(column.value(row));
}

function buildColumns (columns) {
    return function (row) {
        return columns.map((col) => {
            return {column:col, row:row, name:col.name};
        });
    }
}

function updateTable (selection) {
    let data  = selection.datum();
    let tbody = selection.select('tbody');
    let rows = tbody.selectAll('tr').data(data.rows);

    rows.enter().append('tr');
    rows.exit().remove();

    let cells = rows.selectAll('td').data(buildColumns(data.columns), d => d.name);

    cells.enter().append('td')
        .attr('x-colname', (d) => d.column.name)
        .each(function (d) { d3.select(this).append(d.column.tag) });

    cells.exit().remove();

    data.columns.forEach((column) => {
        var cell = rows.select('[x-colname=' + column.name + ']');
        if(column.tag) cell = cell.select(column.tag);

        if(column.html) {
            cell.html(column.html);
        } else {
            cell.text(column.text);
        }

        if(column.attrs) {
            cell.attr(column.attrs);
        }

        if(column.classed) {
            cell.attr(column.classed);
        }

        if(column.update) {
            cell.call(column.update, column);
        }
    });
}



export {updateTable};
