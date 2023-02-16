const config = require('./config')

function transformData(pcibex_array = [], urlvars = {}) {
    // takes a PCIbex array and a set of urlvariables and turns it into a format postgres/our database likes
    const columns = pcibex_array[2] || undefined; // PCIBex passes the column names of the data 
    const rows = pcibex_array[3] || undefined; // PCIbex passes the rows (trials) of the data 
    const uniqueid = pcibex_array[4] || undefined; // PCIbex passes an md5 hash which (I assume) is unique to the run

    // if any of these are undefined, leave the object undefined; we can't pass the data anyway
    // this should have already happened in the validation; so this is just in case!
    if([columns, rows, uniqueid].includes(undefined)) return undefined

    // remove whitespace from PCIbex column names
    const modifiedColumns =  columns.map(name => name.replace(/ /g, "_"));

    // map rows to the column names; note we might have to change this to value[0] instead of index
    // i'm not sure if PCIbex is ever NOT sending some rows
    const json_data = rows.map((row) => 
        row.reduce((json_data, value, index) => ({
                ...json_data, [modifiedColumns[value[0]]]: value[1]}), {})
        );
    
    // stringify the data to pass to database 
    const data = JSON.stringify(json_data);
    
    // return the transformed data as an object
    return {
        ...urlvars,
        //[config.database.id_colname] : uniqueid,
        [config.database.data_colname] : data
    }
}

module.exports = transformData