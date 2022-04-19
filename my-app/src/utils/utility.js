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
            excludeFilter !== "type" &&
            isFiltered &&
            d.hasOwnProperty("type") &&
            filter.type.size !== 0 &&
            !filter.type.has(d.type)
        ) {
            isFiltered = false;
        }

        if (
            excludeFilter !== "purpose" &&
            isFiltered &&
            d.hasOwnProperty("purpose") &&
            filter.purpose.size !== 0 &&
            !filter.purpose.has(d.purpose)
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


        if (
            isFiltered &&
            d.hasOwnProperty("magnitude_body") &&
            filter.magnitude_body.length === 2 &&
            !(d.magnitude_body >= filter.magnitude_body[0] && d.magnitude_body <= filter.magnitude_body[1])
        ) {
            isFiltered = false;
        }

        if (
            isFiltered &&
            d.hasOwnProperty("magnitude_surface") &&
            filter.magnitude_surface.length === 2 &&
            !(d.magnitude_surface >= filter.magnitude_surface[0] && d.magnitude_surface <= filter.magnitude_surface[1])
        ) {
            isFiltered = false;
        }

        if (
            isFiltered &&
            d.hasOwnProperty("depth") &&
            filter.depth.length === 2 &&
            !(d.depth >= filter.depth[0] && d.depth <= filter.depth[1])
        ) {
            isFiltered = false;
        }

        if (
            isFiltered &&
            d.hasOwnProperty("yield_lower") &&
            filter.yield_lower.length === 2 &&
            !(d.yield_lower >= filter.yield_lower[0] && d.yield_lower <= filter.yield_lower[1])
        ) {
            isFiltered = false;
        }

        if (
            isFiltered &&
            d.hasOwnProperty("yield_upper") &&
            filter.yield_upper.length === 2 &&
            !(d.yield_upper >= filter.yield_upper[0] && d.yield_upper <= filter.yield_upper[1])
        ) {
            isFiltered = false;
        }

        return isFiltered;
    })
}
