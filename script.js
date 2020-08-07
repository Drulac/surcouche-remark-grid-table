const stringWidth = require('string-width')

function findIndexOrLast(
	str,
	conditionFunction,
	modifier = 0
) {
	const i = str.indexOf(conditionFunction)

	return i < 0 ? str.length + modifier : i
}

function isOnlyOneChar(str, char) {
	return str.length > 0 && char.repeat(str.length) === str
}

function getCell(row, columnIndex) {
	let index = 0

	const cell = row
		//.filter((e) => typeof e.cellWidth !== 'undefined')
		.reduce((searchedCell, cell, value) => {
			//si on a déjà trouvé la bonne cellule on skip les suivantes
			if (typeof searchedCell === 'undefined') {
				if (index + cell.cellWidth - 1 === columnIndex)
					return cell
				else index += cell.cellWidth
			}

			return searchedCell
		}, undefined)

	//console.log(cell, columnIndex)

	return cell
}

function getColumnWidth(grid, columnIndex, columnsWidth) {
	const cells = grid
		.map((row) => getCell(row, columnIndex))
		.filter((e) => typeof e !== 'undefined')

	const cellsWidth = cells
		.map((cell) => {
			cell.col = columnIndex

			if (cell.cellWidth > 1) {
				// il faut soustraire la largeur des colonnes précédentes

				const previousColumnsWidth = columnsWidth
					.filter(
						(width, columnId) =>
							columnId < columnIndex &&
							columnId > columnIndex - cell.cellWidth
					)
					.reduce((sum, width) => sum + width + 1, 0) // +1 à cause du | entre les deux colonnes

				cell.inPreviousColumnsWidth = previousColumnsWidth
				cell.inThisColumnWidth =
					cell.contentWidth - previousColumnsWidth

				return cell.contentWidth - previousColumnsWidth
			}

			return cell.contentWidth
		})
		.map((w) => (isNaN(w) ? 0 : w))

	let width = Math.max(...cellsWidth)

	//console.log(columnIndex, cellsWidth, width)

	// une cellule doit faire au moins 3 caractères de large
	// on ajoute 2 de large : un espace de chaque côté du contenu
	width = width > 0 ? width + 2 : 3

	cells.forEach((cell) => {
		cell.renderWidth =
			width + (cell.inPreviousColumnsWidth | 0) // ajouter la largeur des colonnes précédentes
	})

	return width
}

function joinFunc(arr, cb) {
	//function cb(a, b)
	return arr
		.map((e, id) => {
			if (id !== arr.length - 1) {
				return e + cb(e, arr[id + 1])
			} else {
				return e
			}
		})
		.join('')
}

function convert(str) {
	//const rows = str.split(/^[-=]*$/gm)
	const grid = str
		.split('\n')
		.filter((line) => line !== '')
		.map((line) => {
			const row = line.split('|').map((cellContent) => {
				const content = cellContent.split('#')
				const str = content.join('').trim()

				if (
					isOnlyOneChar(str, '-') ||
					isOnlyOneChar(str, '=')
				) {
					const delimiter = {
						type: str.charAt(0),
						cellWidth: 1,
					}

					return delimiter
				} else {
					const cell = {
						content: str,
						cellWidth: content.length,
						contentWidth: stringWidth(str),
					}

					return cell
				}
			})

			return row
		})

	const numberOfColumns = Math.max(
		...grid.map((row) => {
			return (
				row
					//.filter((e) => typeof e.cellWidth !== 'undefined')
					.reduce((sum, cell) => sum + cell.cellWidth, 0)
			)
		})
	)

	grid.map((row) => {
		const rowWidth = row
			//.filter((e) => typeof e.cellWidth !== 'undefined')
			.reduce((sum, cell) => sum + cell.cellWidth, 0)

		/*console.log(
			rowWidth,
			numberOfColumns,
			row[row.length - 1].cellWidth
		)*/

		if (rowWidth !== numberOfColumns) {
			row[row.length - 1].cellWidth +=
				numberOfColumns - rowWidth
		}
		//console.log(row[row.length - 1].cellWidth)
	})

	const columnsWidth = Array(numberOfColumns).fill(0)

	Array(numberOfColumns)
		.fill(0)
		.map((_, columnId) => {
			columnsWidth[columnId] = getColumnWidth(
				grid,
				columnId,
				columnsWidth
			)
			//console.log(columnId, columnsWidth[columnId])
			//console.log('-'.repeat(10))
		})

	//console.log(grid)

	//console.log('|'.repeat(20))
	//console.log(columnsWidth)
	//console.log('|'.repeat(20))

	// to use with joinFunc
	const joinWithAngles = function (a, b) {
		const lastA = a.charAt(a.length - 1)
		const firstB = b.charAt(0)

		/*console.log(
			JSON.stringify(lastA),
			JSON.stringify(firstB)
		)*/

		if (
			['-', '='].includes(lastA) ||
			['-', '='].includes(firstB)
		) {
			return '+'
		} else {
			return '|'
		}
	}

	const output = grid
		.map((row) => {
			return joinFunc(
				[].concat(
					'',
					row.map((cell) => {
						if (typeof cell.content !== 'undefined') {
							const spaceLength =
								cell.renderWidth - cell.content.length

							const halfLen = Math.round(spaceLength / 2)

							const spaceBefore = halfLen < 1 ? 1 : halfLen
							const spaceAfter =
								spaceLength - halfLen < 1
									? 1
									: spaceLength - halfLen
							return (
								' '.repeat(spaceBefore) +
								cell.content +
								' '.repeat(spaceAfter)
							)
						} else {
							//console.log(cell.col, cell.cellWidth)

							let start = cell.col - cell.cellWidth + 1
							if (start < 0) start = 0

							const stop = start + cell.cellWidth

							//console.log(start, stop)

							const sizes = columnsWidth.slice(start, stop)
							//console.log(sizes)
							/*sizes.push(
								cell.renderWidth -
									sizes.reduce((sum, s) => sum + s, 0) -
									sizes.length
							)*/
							//console.log(sizes)
							//console.log('~'.repeat(20))

							return joinFunc(
								sizes.map((s) => cell.type.repeat(s)),
								joinWithAngles
							)
						}
					}),
					''
				),
				joinWithAngles
			)
		})
		.join('\n')

	return output
}

module.exports = convert
