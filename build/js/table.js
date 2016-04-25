function table() {
    'use strict';
    return (function () {
        /**
          Create a header for the given table, using the data
          @param object   tbl  The target table object
          @param array    data The values for the header row
        **/
        var create_header = function (tbl, data) {
                var header = tbl.createTHead(),
                    row = header.insertRow();
                data.forEach(function (heading, index) {
                    var cell = row.insertCell(index);
                    heading = heading.charAt(0).toUpperCase() + heading.slice(1);
                    cell.outerHTML = '<th>' + heading + '</th>';
                });
            },
            /**
              Populate a given table with rows of data from the row index
              @param object   tbl  The target table object
              @param array    data An array of objects that make up each row

              @return object
            **/
            populate = function (tbl, data, r_idx) {
                if (typeof r_idx === 'undefined') {
                    r_idx = 1;
                }
                // if data is an array recursively call with each element
                if (Array.isArray(data)) {
                    data.forEach(function (item, index) {
                        populate(tbl, item, r_idx);
                    });
                } else {
                    var row = tbl.insertRow(r_idx);
                    Object.keys(data).forEach(function (key, index) {
                        var k_cell = row.insertCell(index);
                        k_cell.innerHTML = data[key];
                    });
                }
                return tbl;
            },
            /**
             * Searches for a row with the id key, and calls a custom callback Function
            **/
            search = function (tbl, search_term, data, func) {
                var i = 0,
                    j = 0;
                for (i = 0; i < tbl.rows.length; i += 1) {
                    for (j = 0; j < tbl.rows[i].cells.length; j += 1) {
                        if (tbl.rows[i].cells[j].innerHTML === search_term) {
                            return func(tbl, tbl.rows[i], data, i);
                        }
                    }
                }
            };
        return {
            /**
             * Creates a table and adds it to a parent element
            **/
            create_table: function (parent_id, data, classes) {
                var tbl = document.createElement('table'),
                    headers = (Array.isArray(data)) ? Object.keys(data[0]) : Object.keys(data);
                tbl.setAttribute('id', parent_id + '-table');
                tbl.setAttribute('class', classes);
                create_header(tbl, headers);
                return populate(tbl, data);
            },
            /**
             * Adds a row to the end of the table
            **/
            add_row: function (tbl, data) {
                populate(tbl, data, tbl.rows.length);
            },
            /**
             * Replaces an existing row with data
            **/
            edit_row: function (tbl, key, data) {
                var func = function (tbl, row, data, r_idx) {
                    tbl.deleteRow(r_idx);
                    populate(tbl, data, r_idx);
                };
                search(tbl, key, data, func);
            },
            /**
             * Remove an existing row from the table
            **/
            remove_row: function (tbl, key) {
                var func = function (tbl, row, data, r_idx) {
                    tbl.deleteRow(r_idx);
                };
                search(tbl, key, {}, func)
            },
            /**
             * Highlights an existing row in the table
             **/
            highlight_row: function (tbl, key) {
                var func = function (tbl, row, data, r_idx) {
                    row.style.background = '#3e2723';
                    row.style.color = '#fff';
                };
                search(tbl, key, {}, func);
            }
        };
    })();
}