# ru-declensions-geo
Library to decline russian geographical names.

Based on [Morphos](https://raw.githubusercontent.com/wapmorgan/Morphos/) (PHP solution).

## Installation
npm install ru-declensions-geo --save

## Usage
```javascript
const decl = require('ru-declensions-geo').GeoNamesDeclensions;
console.log(decl.getCases('Санкт-Петербург'));
```
Result is:
```javascript
[ 'Санкт-Петербург',
  'Санкт-Петербурга',
  'Санкт-Петербургу',
  'Санкт-Петербург',
  'Санкт-Петербургом',
  'Санкт-Петербурге' ]
```

## API
### getCases(name)
Get cases for a given geographical name.

Returns array with cases:
```
[
  nominative(именительный),
  genitive(родительный),
  dative(дательный),
  accusative(винительный),
  instrumental(творительный),
  prepositional(предложный)
] 
```

In case of empty string, returns null. If name is immutable, all cases will be filled with the same name.
 
## Tests
There are some tests in test folder. You can run it with:
```bash
npm test
```
