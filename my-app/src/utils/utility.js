import * as d3 from 'd3';

export const getFilteredData = (data, filter, excludeFilter) => {
    return data.filter(d => {
        let isFiltered = true;
        if (
            excludeFilter !== "country" &&
            isFiltered &&
            d.hasOwnProperty("country") &&
            filter.country.size !== 0 &&
            !filter.country.has(d.country)
        ) {
            isFiltered = false;
        }

        if (
            isFiltered &&
            d.hasOwnProperty("year") &&
            filter.yearRange.length === 2 &&
            !(d.year >= filter.yearRange[0] && d.year <= filter.yearRange[1])
        ) {
            isFiltered = false;
        }

        return isFiltered;
    })
}

export const scaleBandInvert = (scale) => {
    var domain = scale.domain()
    var range = scale.range()
    var invScale = d3.scaleQuantize().domain(range).range(domain)

    return function(val){
        return invScale(val)
    }
}
