const csv = require('csv-parser')
const fs = require('fs')
const results = [];

//const input_file = './files_Nis/84189774_DP_Uninfluenced_driving.csv';
const input_file = './files_Nis/84189774_Trip_PI.csv';

//fs.createReadStream('./files/84189774_DP_Lane_change.csv') // comma for the other
fs.createReadStream(input_file)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        const path = require('path');

        const dir_name = path.dirname(input_file);
        const file_name = path.basename(input_file, '.csv');

        var json_file = path.join(dir_name, file_name + '.json');
        if (!path.isAbsolute(input_file)) {
            json_file = path.join(__dirname, json_file);
        }

        var stream = fs.createWriteStream(json_file);
        stream.once('open', function (fd) {
            stream.write('[\n');
            results.forEach((row, index) => {
                var newObject = {};
                newObject.thing = "84189774";
                newObject.feature = "Uninfluenced_driving";
                newObject.device = "Matlab";

                var target = { values: [], tags: [] };
                var aggregated = Object.keys(row).reduce(function (filtered, key) {
                    if (!['scenario', 'condition', 'road_type', 'driver_type_tag'].includes(key)) {

                        var str_val = row[key];
                        var num_val;
                        if (str_val == 'NaN') {
                            num_val = NaN;
                            filtered.values.push(num_val);
                        } else {
                            if (isNaN(str_val)) {
                                if (str_val.startsWith('[') && str_val.endsWith(']')) {
                                    const arr = str_val.split(/[[\], ]/);
                                    const number_str = arr.filter(function (el) {
                                        return el != '';
                                    });
                                    var aggr = number_str.reduce(function (filt, val) {
                                        const v = Number(val);
                                        filt.push(v);
                                        return filt;
                                    }, []);
                                    filtered.values.push(aggr);
                                } else {
                                    console.log('Format not recognized: ' + str_val);
                                    return;
                                }
                            } else {
                                num_val = Number(str_val);
                                filtered.values.push(num_val);
                            }
                        }
                    } else {
                        var val = row[key];
                        n_val = Number
                        filtered.tags.push(row[key]);
                    }
                    return filtered;
                }, target);

                newObject.samples = { values: aggregated.values };
                newObject.tags = aggregated.tags;



                if (index > 0) {
                    stream.write(',\n');
                }
                stream.write(JSON.stringify(newObject));

               /* Object.keys(row).forEach(key => {
                    newObject[key] = row[key];
                });
                newObjects.push([newObject]);
                */
            });
            //stream.write(JSON.stringify(newObjects));
            stream.write('\n]');
            stream.end();
        });
    });


function versionFromXls() {

    fs.createReadStream('./files_Nis/84189774_DP_Uninfluenced_driving.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            var stream = fs.createWriteStream("./files_Nis/84189774_DP_Uninfluenced_driving.json");
            stream.once('open', function (fd) {
                stream.write('[\n');
                results.forEach((row, index) => {
                    var newObject = {};
                    newObject.thing = "84189774";
                    newObject.feature = "Lane_change";
                    newObject.device = "Matlab";
                    var target = { values: [], tags: [] };
                    var aggregated = Object.keys(row).reduce(function (filtered, key) {
                        if (!['scenario', 'condition', 'road_type', 'driver_type_tag'].includes(key)) {

                            var str_val = row[key];
                            var num_val;
                            if (str_val == 'NaN') {
                                num_val = NaN;
                                filtered.values.push(num_val);
                            } else {
                                if (isNaN(str_val)) {
                                    if (str_val.startsWith('[') && str_val.endsWith(']')) {
                                        const arr = str_val.split(/[[\];]/);
                                        const number_str = arr.filter(function (el) {
                                            return el != '';
                                        });
                                        var aggr = number_str.reduce(function (filt, val) {
                                            const v = Number(val);
                                            filt.push(v);
                                            return filt;
                                        }, []);
                                        filtered.values.push(aggr);
                                    } else {
                                        console.log('Format not recognized: ' + str_val);
                                        return;
                                    }
                                } else {
                                    num_val = Number(str_val);
                                    filtered.values.push(num_val);
                                }
                            }
                        } else {
                            var val = row[key];
                            n_val = Number
                            filtered.tags.push(row[key]);
                        }
                        return filtered;
                    }, target);

                    newObject.samples = { values: aggregated.values };
                    newObject.tags = aggregated.tags;

                    if (index > 0) {
                        stream.write(',\n');
                    }
                    stream.write(JSON.stringify(newObject));
                });
                stream.write('\n]');
                stream.end();
            });
        });

}