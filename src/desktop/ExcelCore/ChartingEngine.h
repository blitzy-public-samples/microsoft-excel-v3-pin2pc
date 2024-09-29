#pragma once

#include <memory>
#include <vector>

// Forward declarations
class Worksheet;
class CellAddress;

// Enum for chart types
enum class ChartType {
    Bar,
    Line,
    Pie,
    // Add more chart types as needed
};

// Enum for render formats
enum class RenderFormat {
    PNG,
    SVG,
    // Add more render formats as needed
};

// Abstract base class for charts
class Chart {
public:
    Chart(ChartType type, const std::string& title);
    virtual ~Chart() = default;

    void setData(const std::vector<double>& newData);
    virtual std::vector<uint8_t> render() = 0;

protected:
    ChartType type;
    std::string title;
    std::vector<double> data;
};

// ChartingEngine class
class ChartingEngine {
public:
    ChartingEngine();

    std::unique_ptr<Chart> createChart(const Worksheet& worksheet,
                                       const CellAddress& startCell,
                                       const CellAddress& endCell,
                                       ChartType type);

    bool updateChart(Chart& chart,
                     const Worksheet& worksheet,
                     const CellAddress& startCell,
                     const CellAddress& endCell);

    bool deleteChart(const Chart& chart);

    std::vector<uint8_t> renderChart(const Chart& chart, RenderFormat format);

private:
    std::vector<std::unique_ptr<Chart>> charts;
};

// TODO: Implement specific chart types (e.g., BarChart, LineChart, PieChart) derived from the Chart base class
// TODO: Add support for more complex chart customization options (e.g., colors, fonts, legends)
// TODO: Implement error handling for invalid chart data or rendering failures
// TODO: Optimize chart rendering for large datasets