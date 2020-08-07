const convert = require('./script.js')

module.exports = (src) => {
	let isInTable = false

	return src
		.split('\n')
		.reduce(
			(sum, line) => {
				//console.log(JSON.stringify(line))

				if (
					line.length > 0 &&
					line === '-'.repeat(line.length)
				) {
					if (isInTable) {
						//console.log('on continue de parcourir le tableau')
						sum[sum.length - 1].push(line)
					} else {
						//console.log('on commence un tableau')
						isInTable = true
						sum.push([line])
					}
				} else if (
					line.length > 0 &&
					line === '='.repeat(line.length)
				) {
					//console.log("qu'on soit dans un tableau ou pas")
					sum[sum.length - 1].push(line)
				} else if (isInTable) {
					if (line.length === 0 || line.trim() === '') {
						//console.log('saut de ligne, on sort du tableau')
						isInTable = false
						sum.push([])
					} else {
						//console.log('on continue de parcourir le tableau')
						sum[sum.length - 1].push(line)
					}
				} else {
					//console.log('on continue de parcourir le texte')
					sum[sum.length - 1].push(line)
				}

				//console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
				return sum
			},
			[[]]
		)
		.map((e, id) => {
			e = e.join('\n')

			if (id % 2) {
				return convert(e)
			} else {
				return e
			}
		})
		.join('\n')
}
