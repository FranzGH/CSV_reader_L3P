const csv = require('csv-parser')
const fs = require('fs')
const results = [];


fs.createReadStream('./files/84189774_DP_Lane_change.csv') // comma for the other
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        var stream = fs.createWriteStream("84189774_DP_Lane_change.json");
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