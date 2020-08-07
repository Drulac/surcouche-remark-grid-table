# surcouche-remark-grid-table

convert quick-writing table syntax to markdown table syntax

## syntax

- lines don't need to have the same length
- cell must have more than 3 chars
- use `#` to increase the number of columns taken by the cell, not required for the last cell of a row
- use `|` as cell separator
- use `----` as line separator
- use `====` to separate header from body of table

tables are extracted from markdown by the plugin

## code sample

```js
const convert = require('surcouche-remark-grid-table')

const markdown = `
# test

you can pass your entire markdown, tables are extracted from markdown by the plugin

-------------------------
 Table Headings  #| Here 
-------------------------
 Sub   | Headings |  Too  
=========================
 cell  | column spanning 
 spans |-----------------
 rows  | normal   | cell 
-------------------------
 rows  | lonnggggggggg   | cell 
-------|----------| end
 rows    normal  #| cell 
------------------------
 rows  | normal   | cell 
-------------------------
 multi | cells can be    
 multi | *formatted*     
 line  | *formatted*     
       | **paragraphs**  
 cells |                 
 too   |  $(a+b)^2 = a^2 + b^2 + 2*a*b$              
-------------------------

`

console.log(convert(markdown))
```

output the markdown with well formated tables :

``` markdown
# test

you can pass your entire markdown, tables are extracted from markdown by the plugin

+-------+---------------+---------------+
|     Table Headings    |      Here     |
+-------+---------------+---------------+
|  Sub  |    Headings   |      Too      |
+=======+===============+===============+
|  cell |        column spanning        |
| spans +---------------+---------------+
|  rows |     normal    |      cell     |
+-------+---------------+---------------+
|  rows | lonnggggggggg |      cell     |
+-------+---------------+      end      |
|     rows    normal    |      cell     |
+-------+---------------+---------------+
|  rows |     normal    |      cell     |
+-------+---------------+---------------+
| multi |          cells can be         |
| multi |          *formatted*          |
|  line |          *formatted*          |
|       |         **paragraphs**        |
| cells |                               |
|  too  | $(a+b)^2 = a^2 + b^2 + 2*a*b$ |
+-------+---------------+---------------+
```


