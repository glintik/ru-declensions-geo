# ru-declensions-geo
Library to decline russian geographical names.

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

Returns an array with declined name with proper case endings:
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

### inLocation(name)
Returns string "в/на [name]" for a given toponym.

Examples:
```javascript
inLocation('Санкт-Петербург')
```
Returns: "в Санкт-Петербурге"

```javascript
inLocation('Куба')
```

Returns: "на Кубе"

```javascript
inLocation('Франция')
```
Returns: "во Франции"
 
## Tests
There are many tests in test folder. You can run it with:
```bash
npm test
```
