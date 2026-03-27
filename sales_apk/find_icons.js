const fs = require('fs');
const path = require('path');
const dir = 'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps';

function search(regex) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (!f.endsWith('.json')) continue;
        const o = require('./' + path.join(dir, f).replace(/\\/g, '/'));
        for (const k in o) {
            if (regex.test(k)) {
                console.log(f.replace('.json', ''), k);
            }
        }
    }
}
search(/drop|water|roller|spark|wrench/i);
